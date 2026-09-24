---
title: How to set up Sign in with Apple
date: 2022-02-20
excerpt: A full walkthrough of wiring next-auth's Apple provider into a Next.js app — registering IDs with Apple, generating the JWT client secret, and running a local nginx proxy over HTTPS for testing.
tags: Next.js, Apple, OAuth
---

I configured Sign in with Apple for a side project recently, and this is the record of how — like most of what I write here, mainly so I can find it again. There are a lot of links below; I've tried to cite where each piece came from, since none of this was familiar to me going in.

## Front-end setup

Install next-auth:

```zsh
npm install next-auth
```

Pulling in a dependency isn't usually my first instinct for something like this, but it automates enough of the OAuth 2.0 / OIDC handshake to be worth it. There's still plenty left to wire up by hand.

Session data gets used on the front end early — partly to confirm the setup works, partly because it needs to happen eventually anyway. Exposing session and auth data to the front end starts with `_app.tsx`:

```typescript title="pages/_app.tsx"
import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}
```

The back end needs a route to respond to sign in, sign out, and the OAuth callback:

```typescript title="pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import AppleProvider from "next-auth/providers/apple"

export default NextAuth({
	providers: [
		AppleProvider({
			clientId: process.env.APPLE_CLIENT_ID!,
			clientSecret: process.env.APPLE_CLIENT_SECRET!,
		}),
	],
})
```

Then add `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET` to `.env.local`:

```text title=".env.local"
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

## Getting the client ID and secret

This is the first real hurdle: getting a client ID and secret from Apple, which means signing up for an Apple Developer account — currently $99 a year — to use their APIs. [Instructions for enrolling are here](https://developer.apple.com/programs/enroll/); do that, then come back.

### After you've signed up

Apple's naming is confusing in a specific way worth flagging up front: what next-auth calls the "client ID" is what Apple calls the services ID. To create a services ID, Apple requires it to belong to an application, so the first step is registering an app ID — not a full iOS or macOS app, just a placeholder for one.

### Register an app ID

- Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources)
- Go to Identifiers
- Confirm you're on App IDs
- Add a new one
- Set the type to App
- Register it:
  - Description: whatever describes the app
  - App ID: reverse-domain style, e.g. `com.example`
  - Check "Sign in with Apple"
  - Edit:
    - Enable as the primary app ID
    - Add a notification endpoint: `https://www.example.com/api/auth/apple/`

### Register a services ID (the client ID)

Still under Certificates, Identifiers & Profiles, go to Identifiers, switch the dropdown to Services IDs, and make a new identifier.

- Description: whatever describes it
- Identifier: reverse-domain style, e.g. `com.example.client`

Enable Sign in with Apple, then click Configure. The part that isn't obvious here: the Domains field takes only the bare domain — `example.com`, not `https://www.example.com`. The return URL for next-auth is `https://www.example.com/api/auth/callback/apple`.

That identifier is the client ID. Add it to `.env.local`:

```text
APPLE_CLIENT_ID=com.example.client
```

### Verify your domain with Apple

This step may not be necessary for every setup — I hit it during trial and error, so I'm leaving it in in case it applies to you too.

From the Identifiers screen, switch from App IDs to Merchant IDs and add a new one, following the same reverse-domain pattern (it needs to be unique, e.g. `com.example.merchant`). Follow Apple's instructions to verify it, which requires the Next.js project to already be live on the web.

### Get a key from Apple

Under Certificates, Identifiers & Profiles, go to Keys, add a new key, give it a description, associate it with the app, check "Sign in with Apple," and download the key.

Treat this file carefully, and don't commit it to git — it gets used in the next step.

### Generate the Apple client secret

Apple requires the client secret to be a JWT — [their docs say so directly](https://next-auth.js.org/providers/apple). A [JSON Web Token](https://jwt.io/) is an open standard for representing claims between two parties. Worth noting: "secure" here is relative — a JWT isn't inherently more trustworthy than any other bearer token, and sensitive data shouldn't be stored in one.

[Apple documents how to build the client secret here](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens#3262048). Since JWTs expire, generating one is worth scripting rather than doing by hand every few months:

```javascript title="apple-gen-secret.js"
const nJwt = require("njwt")
const dotenv = require("dotenv")
const { createPrivateKey } = require("crypto")

dotenv.config({ path: ".env.local" })

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

const privateKey = createPrivateKey(``) // paste the key downloaded from Apple
const now = Math.ceil(Date.now() / 1000)
const expires = now + MONTH * 3
const kid = process.env.APPLE_KEY_ID

const claims = {
	iss: process.env.APPLE_TEAM_ID,
	iat: now,
	exp: expires,
	aud: "https://appleid.apple.com",
	sub: process.env.APPLE_CLIENT_ID,
}

const jwt = nJwt.create(claims, privateKey, "ES256")
jwt.header.kid = kid

console.log(jwt.compact())
```

This is adapted from [a gist by Balázs Orbán](https://gist.github.com/balazsorban44/09613175e7b37ec03f676dcefb7be5eb) and [an Okta blog post on creating and verifying JWTs with Node](https://developer.okta.com/blog/2018/11/13/create-and-verify-jwts-with-node) — Okta does authentication for a living, so their choice of `njwt` was good enough for me.

To finish the script, paste in the key downloaded from Apple. On macOS, this copies it to the clipboard:

```zsh
pbcopy < ~/Downloads/AuthKey_THESE-CHARACTERS-ARE-IMPORTANT.p8
```

`pbcopy` stands for pasteboard copy — macOS calls the clipboard the pasteboard. Paste the result into the `createPrivateKey()` call. Don't commit the key; it only needs to sit there long enough to run the script once.

Two more values come from Apple: the key ID, used above as `APPLE_KEY_ID`, and the team ID. Both get added to `.env.local`:

```text
APPLE_KEY_ID=THE-KEY-ID-FROM-YOUR-KEY-FILENAME
APPLE_TEAM_ID=THE-10-CHARACTERS-NEXT-TO-YOUR-NAME
```

Run the script with `node apple-gen-secret.js` — or add it to `package.json`'s scripts for later — then copy its output into `.env.local` as `APPLE_CLIENT_SECRET`.

#### JWT, claim by claim

Working through what the script actually sets, in order. First, the claims — the JWT's body:

1. `iss` (issuer) — the 10 characters next to your name on [the certificates page](https://developer.apple.com/account/resources/certificates/list). You're the one issuing the JWT.
2. `iat` (issued at) — when the client secret was generated, in seconds since the Unix epoch, in UTC. JavaScript timestamps are in milliseconds, hence dividing by 1000 and rounding.
3. `exp` (expires) — the current timestamp plus three months, in seconds.
4. `aud` (audience) — who the JWT is for: `https://appleid.apple.com`.
5. `sub` (subject) — what it's about: the client ID, i.e. the services ID (`com.example.client`).

One more value goes in the header rather than the claims:

6. `kid` (key ID) — which key signed the JWT. This is the 10 characters at the end of the filename of the key downloaded from Apple, and it's how Apple knows which key to verify the signature against.

[JWT.io](https://jwt.io) is a good general reference for JWTs.

### Last Next.js steps

Next.js needs a couple more environment variables:

```text
NEXTAUTH_URL=https://www.example.com
NEXTAUTH_SECRET=
```

Generate `NEXTAUTH_SECRET` with:

```zsh
openssl rand -base64 32
```

Copy the output in as the value. By this point, `.env.local` should have:

```text
APPLE_CLIENT_ID=com.example.client
APPLE_CLIENT_SECRET=THE-BIG-JWT-STRING
APPLE_KEY_ID=THE-KEY-ID-FROM-YOUR-KEY-FILENAME
APPLE_TEAM_ID=THE-10-CHARACTERS-NEXT-TO-YOUR-NAME
NEXTAUTH_URL=https://www.example.com
NEXTAUTH_SECRET=WHAT-YOU-JUST-PASTED
```

## Server setup

Per the [next-auth docs](https://next-auth.js.org/providers/apple), Apple requires an HTTPS connection, so plain `localhost` or `0.0.0.0` won't work. The fix is editing the hosts file so a real-looking domain resolves to localhost.

These are Mac/Linux instructions, since that's what I develop on.

This is a two-part process — pointing a domain at localhost, then serving it over HTTPS — and could honestly be its own post.

```zsh
sudo vi /etc/hosts
```

The file probably looks something like this, unless it's already been edited:

```text
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
```

Add two lines — one for IPv4, one for IPv6. Safari and Firefox both need the IPv6 entry to work correctly:

```text
127.0.0.1                example.com www.example.com
0:0:0:0:0:FFFF:0A00:0117 example.com www.example.com
```

Visiting `example.com` still won't do anything yet, for a specific reason: the browser looks up `example.com` in the hosts file, finds an IP address, and requests it over the default port for the scheme — 443 for HTTPS, 80 for HTTP. So `https://www.example.com` becomes equivalent to `https://127.0.0.1:443` — and `https://127.0.0.1:443` is never valid, because a browser won't trust a TLS certificate for `localhost` as secure. Editing the hosts file to use a real-looking domain is what makes the `s` in `https` possible at all.

The app itself is still only running at `http://localhost:3000` (`http://127.0.0.1:3000`). What's missing is a local server listening on ports 80 and 443 that reverse-proxies to port 3000.

### Set up nginx as a local reverse proxy

[This post on running a simple reverse proxy on Mac with nginx](https://kirillplatonov.com/posts/simple-reverse-proxy-on-mac-with-nginx/) covers the steps that worked for me.

```zsh
brew install nginx
```

Once that finishes, start the service:

```zsh
brew services start nginx
```

With nginx installed and running, the next step is pointing it at localhost — which means editing `nginx.conf`. First, find where it actually lives:

```zsh
nginx -t
```

```text
nginx: the configuration file /opt/homebrew/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /opt/homebrew/etc/nginx/nginx.conf test is successful
```

The path in the post above didn't match my install, and neither did several other guides — better to just ask nginx directly. Duplicate the file first, in case anything needs to be reset:

```zsh
cp /opt/homebrew/etc/nginx/nginx.conf /opt/homebrew/etc/nginx/nginx.backup.conf
```

[This gist](https://gist.github.com/unixcharles/949271) was useful for the config itself. Rather than copy a full file wholesale, here's the version I ended up with, comments stripped for brevity:

```nginx title="nginx.conf"
worker_processes  1;

events {
	worker_connections  1024;
}

http {
	include       mime.types;
	default_type  application/octet-stream;

	sendfile        on;

	keepalive_timeout  65;

	server {
		listen       80;
		server_name  localhost;

		location / {
			proxy_pass          http://localhost:3000;
			proxy_set_header    Host              $host;
			proxy_set_header    X-Real-IP         $remote_addr;
			proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
			proxy_set_header    X-Client-Verify   SUCCESS;
			proxy_set_header    X-Client-DN       $ssl_client_s_dn;
			proxy_set_header    X-SSL-Subject     $ssl_client_s_dn;
			proxy_set_header    X-SSL-Issuer      $ssl_client_i_dn;
			proxy_set_header    X-Forwarded-Proto http;
			proxy_read_timeout 1800;
			proxy_connect_timeout 1800;
		}

		error_page   500 502 503 504  /50x.html;
		location = /50x.html {
			root   html;
		}
	}

	server {
		listen       443 ssl;
		server_name  localhost;

		ssl_certificate      server.crt;
		ssl_certificate_key  server.key;
		ssl_dhparam          server.pem;

		ssl_session_timeout  5m;

		ssl_protocols  SSLv2 SSLv3 TLSv1;
		ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
		ssl_prefer_server_ciphers  on;

		location / {
			proxy_pass          http://localhost:3000;
			proxy_set_header    Host              $host;
			proxy_set_header    X-Real-IP         $remote_addr;
			proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
			proxy_set_header    X-Client-Verify   SUCCESS;
			proxy_set_header    X-Client-DN       $ssl_client_s_dn;
			proxy_set_header    X-SSL-Subject     $ssl_client_s_dn;
			proxy_set_header    X-SSL-Issuer      $ssl_client_i_dn;
			proxy_set_header    X-Forwarded-Proto http;
			proxy_read_timeout 1800;
			proxy_connect_timeout 1800;
		}
	}
	include servers/*;
}
```

That config alone won't work yet — it still needs real SSL certificates. [These commands, from a DigitalOcean tutorial on self-signed certificates](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-debian-10), generate the certificate and its private key:

```zsh
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /opt/homebrew/etc/nginx/server.key \
-out /opt/homebrew/etc/nginx/server.crt
```

The config also references a `.pem` file for Diffie-Hellman parameters, generated with:

```zsh
sudo openssl dhparam -out /opt/homebrew/etc/nginx/server.pem 4096
```

Test the config:

```zsh
nginx -t
```

If that comes back clean, restart nginx to pick up the changes:

```zsh
nginx -s reload
```

From there, Sign in with Apple should work end to end against the local domain.
