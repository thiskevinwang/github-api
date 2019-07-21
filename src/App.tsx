import React from "react"
import logo from "./logo.svg"
import "./App.css"

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://github.com/thiskevinwang/github-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gitub
        </a>
      </header>
    </div>
  )
}

export default App
