import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

import { Query, ApolloConsumer } from "react-apollo"
import { gql } from "apollo-boost"

// Figuring out render props for once.
const FunctionAsChildrenProps = ({ children }: { children: Function }) => {
  const [name, setName] = useState("FunctionAs...")
  useEffect(() => {
    setTimeout(() => {
      setName("FunctionAsChildrenProps")
    }, 1000)
  }, [])
  return children(name)
}
const RenderProps = ({ render }: { render: Function }) => {
  const [name, setName] = useState("FunctionAs...")
  useEffect(() => {
    setTimeout(() => {
      setName("FunctionAsRenderProps")
    }, 1500)
  }, [])
  return render(name)
}

interface TData {
  viewer: {
    login: string
    companyHTML: string
    bioHTML: string
    __typename: string
  }
}

//https://developer.github.com/v4/explorer/
const QUERY = gql`
  {
    viewer {
      login
      companyHTML
      bioHTML
    }
  }
`

// If you don't add <TData> after <Query, TypeScript returns the error:
// Binding element 'loading' implicitly has an 'any' type.TS7031

/**
 * Github
 * When React mounts a <Query> component, Apollo Client automatically fires off your query.
 */
const Github = () => (
  <Query<TData>
    query={QUERY}
    displayName="GithubQuery"
    onCompleted={data => {
      console.log(data)
    }}
    notifyOnNetworkStatusChange
  >
    {({ loading, error, data, refetch, networkStatus }) => {
      if (networkStatus === 4) return <p>Refetching!</p>
      if (loading) return <p>Loading...</p>
      if (error) return <p>{`Error! ${error.message}`}</p>

      console.log("github component will render")
      return (
        <div>
          <p>{data.viewer.login}</p>
          <div dangerouslySetInnerHTML={{ __html: data.viewer.companyHTML }} />
          <div dangerouslySetInnerHTML={{ __html: data.viewer.bioHTML }} />
          <button onClick={() => refetch()}>Refetch!</button>
        </div>
      )
    }}
  </Query>
)

const ManualGithub = () => {
  const [data, setData]: [TData, Function] = useState(null)
  return (
    <ApolloConsumer>
      {client => (
        <div>
          {data && (
            <div>
              <p>{data.viewer.login}</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.viewer.companyHTML,
                }}
              />
              <div dangerouslySetInnerHTML={{ __html: data.viewer.bioHTML }} />
            </div>
          )}
          <button
            onClick={async () => {
              await client
                .query({
                  query: QUERY,
                })
                .then(data => {
                  console.log("data", data.data)
                  setData(data.data)
                })
            }}
          >
            Click me!
          </button>
        </div>
      )}
    </ApolloConsumer>
  )
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FunctionAsChildrenProps>
          {(value: string) => {
            return <div>{value}</div>
          }}
        </FunctionAsChildrenProps>
        <RenderProps
          render={(value: string) => {
            return <div>{value}</div>
          }}
        />
        <Github />
        <ManualGithub />
        <a
          className="App-link"
          href="https://github.com/thiskevinwang/github-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </header>
    </div>
  )
}

export default App
