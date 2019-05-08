import React from 'react'
import { Root, Routes } from 'react-static'
import {ApolloProvider} from 'react-apollo'
//
import { Link, Router } from 'components/Router'
import client from './apolloClient'
import './app.css'


function App() {
  return (
    <ApolloProvider client={client}>
    <Root>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/SignOn">Sign On</Link>
        <Link to="/ManageRace">Manage Race</Link>
      </nav>
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </div>
    </Root>
    </ApolloProvider>
  )
}

export default App
