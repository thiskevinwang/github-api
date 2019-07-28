import React, { useState, useEffect, useCallback } from "react"
import logo from "./logo.svg"
import "./App.css"

import { Query, ApolloConsumer } from "react-apollo"
import { gql, ApolloClient } from "apollo-boost"
import _ from "lodash"
import moment from "moment"

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

const QUERY2 = gql`
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      url
      description
      createdAt
      updatedAt
      diskUsage
      forkCount
      primaryLanguage {
        color
        id
        name
      }
      languages(orderBy: { field: SIZE, direction: DESC }, first: 10) {
        edges {
          node {
            color
            name
          }
          size
        }
      }
      stargazers(orderBy: { field: STARRED_AT, direction: DESC }, first: 50) {
        totalCount
        edges {
          node {
            name
          }
        }
      }
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
  const [data, setData]: [any, Function] = useState(null)
  const [totalLanguageBytes, setTotalLanguageBytes] = useState(null)

  const [repoOwner, setRepoOwner] = useState("thiskevinwang")
  const [repoName, setRepoName] = useState("github-api")
  console.log("totalLanguageBytes", totalLanguageBytes)

  const fetchWithClient = useCallback(
    ({
      client,
      owner,
      name,
    }: {
      client: ApolloClient<any>
      owner: string
      name: string
    }) =>
      _.throttle(async () => {
        await client
          .query({
            query: QUERY2,
            variables: {
              owner: owner,
              name: name,
            },
          })
          .then((data: any) => {
            console.log("data", data.data)
            setData(data.data)
            setTotalLanguageBytes(
              data.data.repository.languages.edges.reduce(
                (acc: number, { size }: { size: number }) => {
                  console.log("acc", acc)
                  console.log("size", size)
                  return acc + size
                },
                0
              )
            )
          })
      }, 5000),
    []
  )
  return (
    <>
      <input
        value={repoOwner}
        onChange={e => {
          setRepoOwner(e.target.value)
        }}
      ></input>
      <input
        value={repoName}
        onChange={e => {
          setRepoName(e.target.value)
        }}
      ></input>
      <ApolloConsumer>
        {client => (
          <div>
            {data ? (
              <div>
                <a href={data.repository.url}>
                  {data.repository.nameWithOwner}
                </a>
                <div style={{ color: "#dddd00" }}>
                  {data.repository.stargazers.totalCount} {STAR}
                </div>
                <div>Disk size: {data.repository.diskUsage}KB</div>
                <div>
                  Created on:{" "}
                  {moment(data.repository.createdAt).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </div>
                <div>
                  Last updated:{" "}
                  {moment(data.repository.updatedAt).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </div>
                {data.repository.languages.edges.map(
                  (
                    { node, size }: { node: any; size: number },
                    index: number
                  ) => (
                    <div style={{ background: node.color }} key={index}>
                      {node.name}{" "}
                      {Number((size / totalLanguageBytes) * 100).toFixed(1)}%
                    </div>
                  )
                )}
              </div>
            ) : (
              <>no data</>
            )}
            <div>
              <button
                onClick={fetchWithClient({
                  client: client,
                  owner: repoOwner,
                  name: repoName,
                })}
              >
                Click me!
              </button>
            </div>
          </div>
        )}
      </ApolloConsumer>
    </>
  )
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/*<Github />*/}
        <ManualGithub />
      </header>
    </div>
  )
}

export default App

const STAR = (
  <svg
    // class="octicon octicon-star v-align-text-bottom"
    viewBox="0 0 14 16"
    version="1.1"
    width="14"
    height="16"
    aria-hidden="true"
  >
    <path
      fill="white"
      fill-rule="evenodd"
      d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
    ></path>
  </svg>
)
