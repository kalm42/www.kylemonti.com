---
title: How to handle authentication in React applications
date: 2019-09-22
excerpt: A token-based auth pattern built from nested context providers, adapted from Kent C. Dodds and wired up to Apollo instead of a plain fetch client.
tags: React, Apollo, Authentication
---

This pattern comes from [Kent C. Dodds' post on the same idea](https://kentcdodds.com/blog/authentication-in-react-applications) — read his version too, and look into the workshops he runs if the pattern interests you.

## The concept

Check whether the current user is authenticated once, then render only the components meant for that state: unauthenticated components for a logged-out user, authenticated components for a logged-in one. Nothing downstream has to ask again.

Wrapping the root component in a stack of providers is what makes that possible. This version wraps in Apollo and GraphQL to fetch the user from the backend — Kent's original doesn't include that layer, so his post is the better reference if you're not on Apollo.

On load, the app checks local storage for a token and tries to fetch the current user from the backend. No token, or no user back in the response, means the user is not authenticated. Otherwise, they are.

```javascript title="src/context/auth-context.js"
import React from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { AUTH_TOKEN } from "../constant"

const ME_QUERY = gql`
	query MeQuery {
		me {
			...UserDetails
		}
	}
`
const LOGIN_USER_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				...UserDetails
			}
		}
	}
`
const SIGNUP_USER_MUTATION = gql`
	mutation SignupMutation($email: String!, $password: String!, $name: String!) {
		signup(email: $email, password: $password, name: $name) {
			token
			user {
				...UserDetails
			}
		}
	}
`

const AuthContext = React.createContext()

function AuthProvider(props) {
	const { loading, data, refetch } = useQuery(ME_QUERY)
	const [login] = useMutation(LOGIN_USER_MUTATION)
	const [signup] = useMutation(SIGNUP_USER_MUTATION)

	const signin = (email, password) => {
		return login({ variables: { email, password } }).then((res) => {
			if (res && res.data && res.data.login && res.data.login.token) {
				const { token } = res.data.login
				localStorage.setItem(AUTH_TOKEN, token)
				refetch()
			} else {
				throw Error("No token returned")
			}
			return res
		})
	}

	const register = (name, email, password) => {
		return signup({ variables: { name, email, password } }).then((res) => {
			if (res && res.data && res.data.signup && res.data.signup.token) {
				const { token } = res.data.signup
				localStorage.setItem(AUTH_TOKEN, token)
				refetch()
			} else {
				throw Error("No token returned")
			}
			return res
		})
	}

	const logout = () => {
		localStorage.removeItem(AUTH_TOKEN)
		refetch()
	}

	if (loading) {
		return <p>Loading</p>
	}

	return <AuthContext.Provider value={{ data, signin, logout, register }} {...props} />
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
```

```javascript title="src/context/user-context.js"
import React from "react"
import { useAuth } from "./auth-context"

const UserContext = React.createContext()

const UserProvider = (props) => {
	const { data } = useAuth()
	return <UserContext.Provider value={data ? data.me : null} {...props} />
}

const useUser = () => React.useContext(UserContext)

export { UserProvider, useUser }
```

```javascript title="src/context/app-context.js"
import React from "react"
import { AuthProvider } from "./auth-context"
import { UserProvider } from "./user-context"
import client from "./apollo-client"
import { ApolloProvider } from "react-apollo"

function AppProvider({ children }) {
	return (
		<ApolloProvider client={client}>
			<AuthProvider>
				<UserProvider>{children}</UserProvider>
			</AuthProvider>
		</ApolloProvider>
	)
}

export default AppProvider
```

```javascript title="src/apollo-client.js"
import { HttpLink, InMemoryCache, ApolloClient } from "apollo-client-preset"
import { WebSocketLink } from "apollo-link-ws"
import { ApolloLink, split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import { AUTH_TOKEN } from "../constant"

const httpLink = new HttpLink({ uri: "http://localhost:4000" })

const middlewareLink = new ApolloLink((operation, forward) => {
	// get the authentication token from local storage if it exists
	const tokenValue = localStorage.getItem(AUTH_TOKEN)
	// return the headers to the context so httpLink can read them
	operation.setContext({
		headers: {
			Authorization: tokenValue ? `Bearer ${tokenValue}` : "",
		},
	})
	return forward(operation)
})

// authenticated httplink
const httpLinkAuth = middlewareLink.concat(httpLink)

const wsLink = new WebSocketLink({
	uri: `ws://localhost:4000`,
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
		},
	},
})

const link = split(
	// split based on operation type
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === "OperationDefinition" && operation === "subscription"
	},
	wsLink,
	httpLinkAuth,
)

// apollo client setup
const client = new ApolloClient({
	link: ApolloLink.from([link]),
	cache: new InMemoryCache(),
	connectToDevTools: true,
})

export default client
```

```javascript title="src/index.js"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import AppProvider from "./context/app-context"

import "./index.css"

ReactDOM.render(
	<AppProvider>
		<App />
	</AppProvider>,
	document.getElementById("root"),
)
```

```javascript title="src/App.js"
import React from "react"
import { useUser } from "./context/user-context"
import UnauthenticatedApp from "./UnauthenticatedApp"
import AuthenticatedApp from "./AuthenticatedApp"

const App = () => {
	const user = useUser()
	return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App
```
