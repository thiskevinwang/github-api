import React, { useState, useEffect } from "react"
import logo from "./logo.svg"
import "./App.css"

import { Query } from "react-apollo"
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
    __typename: string
  }
}

const QUERY = gql`
  {
    viewer {
      login
    }
  }
`

// If you don't add <TData> after <Query, TypeScript returns the error:
// Binding element 'loading' implicitly has an 'any' type.TS7031
const Github = () => (
  <Query<TData>
    query={QUERY}
    displayName="GithubQuery"
    onCompleted={data => {
      console.log(data)
    }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return (
        <div>
          <p>
            {data.viewer.__typename}: {data.viewer.login}
          </p>
        </div>
      )
    }}
  </Query>
)

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
