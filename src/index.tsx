import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

/**
 * # [apollo-boost](https://www.apollographql.com/docs/react/essentials/get-started/#apollo-boost)
 * In our example app, we used Apollo Boost in order to quickly set up Apollo Client.
 * While your GraphQL server endpoint is the only configuration option you need to get started,
 * there are some other options we've included so you can quickly implement features like local state management,
 * authentication, and error handling.
 *
 * # What's included
 * Apollo Boost includes some packages that we think are essential to developing with Apollo Client. Here's what's included:
 * - [apollo-client]: Where all the magic happens
 * - [apollo-cache-inmemory]: Our recommended cache
 * - [apollo-link-http:] An Apollo Link for remote data fetching
 * - [apollo-link-error]: An Apollo Link for error handling
 * - [apollo-link-state]: An Apollo Link for local state management
 *
 * The awesome thing about Apollo Boost is that you don't have to set any of this up yourself!
 * Just specify a few options if you'd like to use these features and we'll take care of the rest.
 */
import ApolloClient, { gql } from "apollo-boost"

/**
 * ApolloProvider
 * View layer integration for React
 */
import { ApolloProvider } from "react-apollo"

// Following this guide:
// https://www.apollographql.com/docs/react/essentials/get-started/

/**
 * # token
 * An authorization token needed in the headers of mutations/queries
 * @see https://github.com/settings/tokens
 */
const token = process.env.REACT_APP_GITHUB_TOKEN

/**
 * # client
 * Initialize the client
 */
const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: token ? `Bearer ${token}` : "",
  },
})

console.log("client", client)

// TODO: extract this into a .graphql file
const QUERY = gql`
  {
    viewer {
      login
    }
  }
`

/**
 * Make a basic query
 *
 * @note This is the cURL equivalent
 * ```bash
 * curl -H "Authorization: bearer token" -X POST -d " \
 * { \
 *   \"query\": \"query { viewer { login }}\" \
 * } \
 * " https://api.github.com/graphql
 * ```
 */
// const basicQuery = () => {
//   client
//     .query({
//       query: QUERY,
//     })
//     .then(result => {
//       return result
//     })
// }

const AppWithProvider = () => {
  // State
  const [foo, setFoo] = useState({})
  // Mount

  const _handleQuery = () => {
    client
      .query({
        query: QUERY,
      })
      .then(result => {
        setFoo(result)
      })
  }

  useEffect(() => {
    console.log("foo effect:", foo)
  }, [foo])

  return (
    <ApolloProvider client={client}>
      {/* This client.query call is possible because the apollo client is in-scope. */}
      <pre>{JSON.stringify(foo, null, 2)}</pre>
      <button onClick={_handleQuery}>Query</button>
      <App />
    </ApolloProvider>
  )
}

ReactDOM.render(<AppWithProvider />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
