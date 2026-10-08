---
title: How to build passkeys with Node and React, no library required
date: 2026-10-08
excerpt: Passkeys are a key pair, a challenge, and one signature check. Here is a full registration and sign-in flow using the browser's WebAuthn API on the front end and node:crypto on the back end, with no passkey library on either side.
tags: Authentication, React, Node, WebAuthn
---

Most passkey tutorials start with `npm install` and spend the rest of the post on that package's API. I wanted to see how much code a passkey flow takes with only what the browser and Node already ship. It turns out to be a few hundred lines, and most of them are checks you should understand anyway. Browsers can now handle all the binary encoding on the client, and `node:crypto` can verify every signature algorithm passkeys use.

This post builds both flows: **registration** (creating a passkey for a signed-in user) and **authentication** (signing in with one, including the autofill prompt). The front end is React. The back end is plain Node with no passkey library.

## What a passkey actually is

A passkey is a public/private key pair. The private key never leaves the user's device or password manager. Your server stores only the public key. Signing in works like this:

1. The server sends a random **challenge**.
2. The browser asks the authenticator (Touch ID, Windows Hello, a phone, a security key) to sign that challenge, along with some data about the request.
3. The server checks the signature against the public key it stored.

Phishing doesn't work against this because the browser, not the user, decides which site the passkey belongs to. A passkey created for `example.com` won't sign anything for `examp1e.com`, and the browser writes the real origin into the signed data, so the server can check it.

The whole process is called a **ceremony**. You have one for registration (`navigator.credentials.create`) and one for authentication (`navigator.credentials.get`). Each needs two endpoints: one that hands out options and a challenge, and one that verifies the response.

```text
POST /api/passkeys/register/options   → creation options + challenge
POST /api/passkeys/register/verify    ← new credential, store the public key
POST /api/passkeys/login/options      → request options + challenge
POST /api/passkeys/login/verify       ← signed assertion, start a session
```

## The browser APIs that make this practical now

WebAuthn has been around since 2019, but early versions forced you to convert every challenge, user ID, and credential ID between `ArrayBuffer` and base64 by hand on the client. Most of the "you need a library" advice came from that. Three additions removed the need:

- `PublicKeyCredential.parseCreationOptionsFromJSON()` and `parseRequestOptionsFromJSON()` take plain JSON from your server, with binary fields as base64url strings, and return the options object `navigator.credentials` expects.
- `PublicKeyCredential.prototype.toJSON()` serializes the browser's response back into JSON with base64url strings, ready to `POST`.
- `AuthenticatorAttestationResponse.getPublicKey()` hands you the new public key as standard SPKI DER bytes, already pulled out of the CBOR-encoded attestation object. `toJSON()` includes it as `response.publicKey`.

That last one matters on the server. The public key arrives in a format `crypto.createPublicKey()` reads directly, so you never have to write a CBOR or COSE parser.

All three have shipped in Chrome, Edge, Firefox, and Safari since Safari 18.4 in early 2025. Feature-detect anyway, since you'll still see older Safari and corporate-managed Chrome:

```ts title="passkeys/supports.ts"
export function supportsPasskeys(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof window.PublicKeyCredential === "function" &&
		typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function"
	)
}
```

> [!NOTE] Secure contexts only
> WebAuthn only works on HTTPS or `http://localhost`. For local development, set the relying party ID to `localhost` and the expected origin to `http://localhost:3000` (or whichever port you use).

## Server: configuration and challenges

The **relying party ID** (`RP_ID`) is the domain passkeys are bound to. It has to be the page's domain or a parent domain of it, so `example.com` covers `login.example.com` too. The expected origin is the full scheme, host, and port your pages are served from.

```ts title="server/passkeys/config.ts"
export const RP_ID = "example.com"
export const RP_NAME = "Example"
export const EXPECTED_ORIGIN = "https://example.com"

// COSE algorithm identifiers: Ed25519, ES256 (P-256), RS256
export const SUPPORTED_ALGORITHMS = [-8, -7, -257]
```

These three algorithms cover essentially every authenticator out there. ES256 is by far the most common, and RS256 is mostly there for Windows Hello.

Challenges must be random, short-lived, and **single-use**. Once one has been checked, whether the check passed or failed, it should be gone. That's what makes a captured response worthless to replay.

```ts title="server/passkeys/challenges.ts"
import { randomBytes } from "node:crypto"

const CHALLENGE_TTL_MS = 5 * 60 * 1000

type PendingChallenge = {
	value: string
	expiresAt: number
}

// Keyed by session ID. Use your session store or Redis in production.
const pendingChallenges = new Map<string, PendingChallenge>()

export function issueChallenge(sessionId: string): string {
	const value = randomBytes(32).toString("base64url")
	pendingChallenges.set(sessionId, { value, expiresAt: Date.now() + CHALLENGE_TTL_MS })
	return value
}

export function consumeChallenge(sessionId: string): string {
	const pending = pendingChallenges.get(sessionId)
	pendingChallenges.delete(sessionId)

	if (!pending || pending.expiresAt < Date.now()) {
		throw new Error("No active challenge for this session")
	}
	return pending.value
}
```

Node's `Buffer` has supported `"base64url"` encoding since v15.7, so that's all the encoding work the server needs.

## Server: the two checks both ceremonies share

Every WebAuthn response contains two structures your server has to check: `clientDataJSON` and `authenticatorData`.

**`clientDataJSON`** is written by the browser. It's UTF-8 JSON that records which ceremony ran, which challenge was signed, and which origin asked for it:

```ts title="server/passkeys/client-data.ts"
import { EXPECTED_ORIGIN } from "./config"

type ClientData = {
	type: string
	challenge: string
	origin: string
	crossOrigin?: boolean
}

type CeremonyType = "webauthn.create" | "webauthn.get"

export function verifyClientData(clientDataJSON: Buffer, expectedType: CeremonyType, expectedChallenge: string): void {
	const clientData: ClientData = JSON.parse(clientDataJSON.toString("utf8"))

	if (clientData.type !== expectedType) {
		throw new Error(`Expected ${expectedType}, got ${clientData.type}`)
	}
	if (clientData.challenge !== expectedChallenge) {
		throw new Error("Challenge mismatch")
	}
	if (clientData.origin !== EXPECTED_ORIGIN) {
		throw new Error(`Unexpected origin ${clientData.origin}`)
	}
	if (clientData.crossOrigin) {
		throw new Error("Cross-origin ceremonies are not allowed")
	}
}
```

The origin check is what blocks phishing on the server side. A lookalike domain can relay your challenge to a real user, but the browser will write the lookalike's origin into `clientDataJSON`, and the request fails here.

**`authenticatorData`** is written by the authenticator. It's a packed binary structure, and the parts we need sit at fixed offsets:

- bytes 0–31: SHA-256 hash of the relying party ID
- byte 32: flags
- bytes 33–36: signature counter, big-endian
- from byte 37, but only during registration: a 16-byte authenticator model ID (AAGUID), a 2-byte credential ID length, the credential ID, then the public key

```ts title="server/passkeys/authenticator-data.ts"
import { createHash } from "node:crypto"
import { RP_ID } from "./config"

export const FLAG_USER_PRESENT = 0x01
export const FLAG_USER_VERIFIED = 0x04
export const FLAG_BACKUP_ELIGIBLE = 0x08
export const FLAG_BACKED_UP = 0x10
export const FLAG_ATTESTED_CREDENTIAL_DATA = 0x40

export type AuthenticatorData = {
	rpIdHash: Buffer
	flags: number
	signCount: number
	credentialId?: Buffer
}

export function parseAuthenticatorData(data: Buffer): AuthenticatorData {
	const rpIdHash = data.subarray(0, 32)
	const flags = data[32]
	const signCount = data.readUInt32BE(33)

	if (!(flags & FLAG_ATTESTED_CREDENTIAL_DATA)) {
		return { rpIdHash, flags, signCount }
	}

	// 16-byte AAGUID at offset 37, then a 2-byte length, then the credential ID
	const credentialIdLength = data.readUInt16BE(53)
	const credentialId = data.subarray(55, 55 + credentialIdLength)
	return { rpIdHash, flags, signCount, credentialId }
}

export function verifyAuthenticatorData(authData: AuthenticatorData): void {
	const expectedRpIdHash = createHash("sha256").update(RP_ID).digest()

	if (!authData.rpIdHash.equals(expectedRpIdHash)) {
		throw new Error("Credential was created for a different relying party")
	}
	if (!(authData.flags & FLAG_USER_PRESENT)) {
		throw new Error("User was not present")
	}
	if (!(authData.flags & FLAG_USER_VERIFIED)) {
		throw new Error("User was not verified")
	}
}
```

**User present** means someone tapped or approved the prompt. **User verified** means the authenticator also checked who they are, with a fingerprint, face, or device PIN. Since a passkey is replacing the password here rather than adding a second factor, I require both.

The two backup flags tell you whether the passkey can sync (**backup eligible**) and whether it has synced (**backed up**). Passkeys in iCloud Keychain or Google Password Manager set both. A hardware security key sets neither. They're worth saving, because they tell you whether a user's only passkey will survive losing the device.

## Server: registration

Registration options tell the browser who the user is, which algorithms you accept, and what kind of credential you want. They're plain JSON because the client will hand them to `parseCreationOptionsFromJSON()`, so every binary field is a base64url string.

```ts title="server/passkeys/registration.ts"
import { createPublicKey } from "node:crypto"
import { consumeChallenge, issueChallenge } from "./challenges"
import { verifyClientData } from "./client-data"
import { FLAG_BACKED_UP, parseAuthenticatorData, verifyAuthenticatorData } from "./authenticator-data"
import { RP_ID, RP_NAME, SUPPORTED_ALGORITHMS } from "./config"

export type User = {
	id: string
	email: string
	name: string
	webauthnUserId: string
}

export type StoredCredential = {
	id: string
	userId: string
	publicKey: string
	algorithm: number
	signCount: number
	transports: string[]
	backedUp: boolean
}

export function createRegistrationOptions(sessionId: string, user: User, existingCredentials: StoredCredential[]) {
	return {
		challenge: issueChallenge(sessionId),
		rp: { id: RP_ID, name: RP_NAME },
		user: { id: user.webauthnUserId, name: user.email, displayName: user.name },
		pubKeyCredParams: SUPPORTED_ALGORITHMS.map((alg) => ({ type: "public-key", alg })),
		authenticatorSelection: { residentKey: "required", userVerification: "required" },
		attestation: "none",
		excludeCredentials: existingCredentials.map((credential) => ({
			type: "public-key",
			id: credential.id,
			transports: credential.transports,
		})),
		timeout: 300_000,
	}
}
```

A few of these fields deserve explanation:

- **`user.id`** is the user handle. The authenticator stores it and returns it at every sign-in. Make it 32 random bytes, base64url-encoded, generated once per user. Don't use an email address or a database ID, since the spec says it shouldn't contain personal information.
- **`residentKey: "required"`** makes this a _discoverable_ credential, meaning the authenticator remembers which account it belongs to. That's what lets users sign in without typing a username first.
- **`attestation: "none"`** says we don't need cryptographic proof of which authenticator model made the key. Unless you're in a regulated setting that only allows certain hardware, you don't. It also means there's no attestation statement to verify.
- **`excludeCredentials`** lists the passkeys this user already has. If the user's current authenticator already holds one of them, the browser refuses to create a duplicate.

Verification checks the browser's response and returns a record to save. Here's the shape of what `credential.toJSON()` sends:

```ts title="server/passkeys/registration.ts"
export type RegistrationResponseJSON = {
	id: string
	rawId: string
	type: "public-key"
	response: {
		clientDataJSON: string
		attestationObject: string
		authenticatorData: string
		publicKey?: string
		publicKeyAlgorithm: number
		transports: string[]
	}
}

export function verifyRegistration(
	sessionId: string,
	user: User,
	credential: RegistrationResponseJSON,
): StoredCredential {
	const expectedChallenge = consumeChallenge(sessionId)
	const { response } = credential

	verifyClientData(Buffer.from(response.clientDataJSON, "base64url"), "webauthn.create", expectedChallenge)

	const authData = parseAuthenticatorData(Buffer.from(response.authenticatorData, "base64url"))
	verifyAuthenticatorData(authData)

	if (!authData.credentialId?.equals(Buffer.from(credential.rawId, "base64url"))) {
		throw new Error("Credential ID does not match authenticator data")
	}
	if (!SUPPORTED_ALGORITHMS.includes(response.publicKeyAlgorithm)) {
		throw new Error(`Unsupported algorithm ${response.publicKeyAlgorithm}`)
	}
	if (!response.publicKey) {
		throw new Error("Browser did not return a public key")
	}

	// Throws if the key is malformed, so a bad key never reaches the database
	createPublicKey({ key: Buffer.from(response.publicKey, "base64url"), format: "der", type: "spki" })

	return {
		id: credential.id,
		userId: user.id,
		publicKey: response.publicKey,
		algorithm: response.publicKeyAlgorithm,
		signCount: authData.signCount,
		transports: response.transports,
		backedUp: Boolean(authData.flags & FLAG_BACKED_UP),
	}
}
```

The challenge is consumed on the first line, before anything can throw, so a failed attempt still uses it up.

> [!CAUTION] Validate the request body first
> These types describe what a well-behaved browser sends, not what will actually reach your endpoint. Parse the body with a schema validator (I use Zod) before calling `verifyRegistration`. Also make sure the credential ID isn't already saved for another account before you store it.

> [!NOTE] Why trust `response.publicKey`?
> The browser pulls this key out of the attestation object, and with `attestation: "none"` there is no attestation signature covering it anyway. The checks that matter happen later: every sign-in has to produce a valid signature from the matching private key, so a wrong public key would just mean that passkey never works. If you ever switch to verified attestation, you'll need to parse the CBOR `attestationObject` yourself, and that's the point where a library starts to earn its place.

## Server: authentication

Authentication options are shorter. Leaving `allowCredentials` empty tells the browser to offer any discoverable passkey it has for this relying party, which is what makes username-less sign-in work.

```ts title="server/passkeys/authentication.ts"
import { createHash, createPublicKey, verify } from "node:crypto"
import { consumeChallenge, issueChallenge } from "./challenges"
import { verifyClientData } from "./client-data"
import { parseAuthenticatorData, verifyAuthenticatorData } from "./authenticator-data"
import { RP_ID } from "./config"
import type { StoredCredential, User } from "./registration"

export type AuthenticationResponseJSON = {
	id: string
	rawId: string
	type: "public-key"
	response: {
		clientDataJSON: string
		authenticatorData: string
		signature: string
		userHandle?: string
	}
}

const ED25519 = -8

export function createAuthenticationOptions(sessionId: string) {
	return {
		challenge: issueChallenge(sessionId),
		rpId: RP_ID,
		userVerification: "required",
		allowCredentials: [],
		timeout: 300_000,
	}
}
```

To verify, look up the stored credential by the response's `id` (and its user) in your route handler, then pass them in. The authenticator signed the raw `authenticatorData` bytes followed by the SHA-256 hash of the raw `clientDataJSON` bytes. Build that same byte sequence and hand it to `crypto.verify`:

```ts title="server/passkeys/authentication.ts"
export function verifyAuthentication(
	sessionId: string,
	credential: AuthenticationResponseJSON,
	stored: StoredCredential,
	user: User,
): number {
	const expectedChallenge = consumeChallenge(sessionId)
	const clientDataJSON = Buffer.from(credential.response.clientDataJSON, "base64url")
	const authenticatorData = Buffer.from(credential.response.authenticatorData, "base64url")

	verifyClientData(clientDataJSON, "webauthn.get", expectedChallenge)

	const authData = parseAuthenticatorData(authenticatorData)
	verifyAuthenticatorData(authData)

	if (credential.response.userHandle && credential.response.userHandle !== user.webauthnUserId) {
		throw new Error("Credential belongs to a different user")
	}

	const clientDataHash = createHash("sha256").update(clientDataJSON).digest()
	const signedData = Buffer.concat([authenticatorData, clientDataHash])
	const publicKey = createPublicKey({ key: Buffer.from(stored.publicKey, "base64url"), format: "der", type: "spki" })
	const digest = stored.algorithm === ED25519 ? null : "sha256"
	const signature = Buffer.from(credential.response.signature, "base64url")

	if (!verify(digest, signedData, publicKey, signature)) {
		throw new Error("Invalid signature")
	}

	const counterInUse = authData.signCount !== 0 || stored.signCount !== 0
	if (counterInUse && authData.signCount <= stored.signCount) {
		throw new Error("Signature counter did not increase; the authenticator may be cloned")
	}

	return authData.signCount
}
```

Because the public key is stored as SPKI, one `crypto.verify` call handles all three algorithms. ES256 signatures from WebAuthn are DER-encoded, which is Node's default for ECDSA. RS256 uses PKCS#1 v1.5, which is Node's default for RSA. Ed25519 hashes internally, so you pass `null` as the digest.

The **signature counter** is meant to catch cloned hardware keys: each sign-in should report a higher number than the last. Synced passkeys always report `0` because several devices share one key, so the check only runs when one side is non-zero. If verification succeeds, save the returned count and start your session.

## Client: creating a passkey

On the client, the round trip is: fetch options, parse them, call the browser API, and send back `toJSON()`. That's all of it.

```ts title="passkeys/passkey-client.ts"
type SignInOptions = {
	mediation?: CredentialMediationRequirement
	signal?: AbortSignal
}

export type SignedInUser = {
	id: string
	name: string
}

async function postJSON<T>(url: string, body?: unknown): Promise<T> {
	const response = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: body === undefined ? undefined : JSON.stringify(body),
	})
	if (!response.ok) {
		throw new Error(`${url} failed with ${response.status}`)
	}
	return response.json()
}

export async function registerPasskey(): Promise<void> {
	const optionsJSON = await postJSON<PublicKeyCredentialCreationOptionsJSON>("/api/passkeys/register/options")
	const credential = await navigator.credentials.create({
		publicKey: PublicKeyCredential.parseCreationOptionsFromJSON(optionsJSON),
	})

	if (!(credential instanceof PublicKeyCredential)) {
		throw new Error("No passkey was created")
	}
	await postJSON("/api/passkeys/register/verify", credential.toJSON())
}

export async function signInWithPasskey(options: SignInOptions = {}): Promise<SignedInUser> {
	const { mediation, signal } = options
	const optionsJSON = await postJSON<PublicKeyCredentialRequestOptionsJSON>("/api/passkeys/login/options")
	const credential = await navigator.credentials.get({
		publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(optionsJSON),
		mediation,
		signal,
	})

	if (!(credential instanceof PublicKeyCredential)) {
		throw new Error("No passkey was selected")
	}
	return postJSON<SignedInUser>("/api/passkeys/login/verify", credential.toJSON())
}
```

TypeScript's DOM library already includes `PublicKeyCredentialCreationOptionsJSON`, `PublicKeyCredentialRequestOptionsJSON`, and the parse methods, so you don't need any extra type packages.

When the user cancels or something goes wrong, WebAuthn rejects with a `DOMException`. The `name` tells you which case you hit, which is useful because the message text is vague and differs between browsers:

```ts title="passkeys/passkey-errors.ts"
export function describePasskeyError(error: unknown): string {
	if (!(error instanceof DOMException)) {
		return error instanceof Error ? error.message : "Something went wrong"
	}

	switch (error.name) {
		case "NotAllowedError":
			return "The passkey prompt was dismissed or timed out."
		case "InvalidStateError":
			return "This device already has a passkey for your account."
		case "SecurityError":
			return "Passkeys aren't available on this domain."
		default:
			return error.message
	}
}
```

`InvalidStateError` is the `excludeCredentials` list doing its job. `SecurityError` usually means your `RP_ID` doesn't match the page's domain.

The registration button belongs on a page the user can only reach while signed in, such as account settings:

```tsx title="passkeys/RegisterPasskeyButton.tsx"
import { useState } from "react"
import { registerPasskey } from "./passkey-client"
import { describePasskeyError } from "./passkey-errors"

type RegisterPasskeyButtonProps = {
	onRegistered: () => void
}

export function RegisterPasskeyButton(props: RegisterPasskeyButtonProps) {
	const { onRegistered } = props
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleClick() {
		setIsPending(true)
		setError(null)
		try {
			await registerPasskey()
			onRegistered()
		} catch (caught) {
			setError(describePasskeyError(caught))
		} finally {
			setIsPending(false)
		}
	}

	return (
		<div>
			<button type='button' onClick={handleClick} disabled={isPending}>
				{isPending ? "Waiting for your device…" : "Create a passkey"}
			</button>
			{error && <p role='alert'>{error}</p>}
		</div>
	)
}
```

Call `navigator.credentials.create()` directly from the click handler. Safari only allows it in response to a user gesture, and a long `await` before it can make Safari decide the gesture has expired. If you see that, fetch the options when the component mounts instead of on click.

## Client: signing in, with autofill

The best passkey sign-in screen looks like a normal username field. When the user focuses it, the browser's autofill menu lists their saved passkeys. WebAuthn calls this **conditional mediation**. It takes two things: `autocomplete="username webauthn"` on the input, and a `navigator.credentials.get()` call with `mediation: "conditional"` that starts when the page loads and waits in the background.

You also want a button for people who'd rather click one, or whose passkey lives on their phone. The button starts a regular modal request, and it has to cancel the waiting autofill request first, because the browser only allows one WebAuthn request at a time.

```tsx title="passkeys/PasskeySignIn.tsx"
import { useEffect, useRef, useState } from "react"
import { signInWithPasskey, type SignedInUser } from "./passkey-client"
import { describePasskeyError } from "./passkey-errors"

type PasskeySignInProps = {
	onSignedIn: (user: SignedInUser) => void
}

export function PasskeySignIn(props: PasskeySignInProps) {
	const { onSignedIn } = props
	const autofillRequest = useRef<AbortController | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()
		autofillRequest.current = controller

		async function startAutofill() {
			const available = await PublicKeyCredential.isConditionalMediationAvailable?.()
			if (!available) {
				return
			}
			try {
				onSignedIn(await signInWithPasskey({ mediation: "conditional", signal: controller.signal }))
			} catch (caught) {
				if (!controller.signal.aborted) {
					setError(describePasskeyError(caught))
				}
			}
		}

		startAutofill()
		return () => controller.abort()
	}, [onSignedIn])

	async function handleClick() {
		autofillRequest.current?.abort()
		setError(null)
		try {
			onSignedIn(await signInWithPasskey())
		} catch (caught) {
			setError(describePasskeyError(caught))
		}
	}

	return (
		<form onSubmit={(event) => event.preventDefault()}>
			<label htmlFor='username'>Email</label>
			<input id='username' name='username' type='email' autoComplete='username webauthn' />
			<button type='button' onClick={handleClick}>
				Sign in with a passkey
			</button>
			{error && <p role='alert'>{error}</p>}
		</form>
	)
}
```

The `AbortController` does a few jobs here:

- The effect's cleanup aborts the request on unmount. That also covers React Strict Mode, which runs effects twice in development. Without the abort, the second autofill request would collide with the first.
- An aborted request rejects with an `AbortError`. Checking `signal.aborted` before setting state means a cancellation the code started itself never shows up as an error.
- Pass `onSignedIn` as a stable reference, using `useCallback` or a function defined outside the parent's render. Otherwise every parent render restarts the autofill request.

The button's request asks the server for a new challenge, which replaces the autofill request's challenge in the session. That's fine because the aborted request will never reach `/login/verify`.

## What I left out

This covers the core of a working passkey flow, but a production setup needs a few more pieces:

- **Account recovery.** Someone who loses their only device-bound passkey loses their account. Encourage a second passkey, record the `backedUp` flag, and keep a recovery path such as email.
- **Session handling.** Once `verifyAuthentication` succeeds, issue your normal session cookie and rotate the session ID. Nothing passkey-specific is involved.
- **Managing passkeys.** Users need a page that lists their passkeys and lets them delete one. The newer Signal API (`PublicKeyCredential.signalUnknownCredential()` and related methods) lets you tell the user's password manager when a passkey has been deleted on the server, so it stops offering it. Browser support is still uneven, so feature-detect it.
- **Verified attestation.** As mentioned above, this is the one place where parsing CBOR yourself gets tedious enough to justify a dependency.

Everything else is about two hundred lines: two JSON endpoints per ceremony, a byte-offset parser, and one `crypto.verify` call. The browser handles the encoding, the authenticator handles the private key, and your server checks the challenge, origin, relying party, flags, and signature.
