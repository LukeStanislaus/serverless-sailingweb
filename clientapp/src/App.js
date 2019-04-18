import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
//
import { Link, Router } from 'components/Router'
import Dynamic from 'containers/Dynamic'
import {ApolloProvider } from 'react-apollo'
import client from './client'
import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
	<ApolloProvider client={client}>
	  <Root>
      <nav>
	<Link to="/">Whitefriars Sailing Club</Link>  
        <Link to="/">Home</Link>
	<Link to="/signon">Sign On</Link>  
        <Link to="/managerace">Manage Race</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/dynamic">Dynamic</Link>
      </nav>
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Router>
            <Dynamic path="dynamic" />
            <Routes path="*" />
          </Router>
        </React.Suspense>
      </div>
    </Root>
  </ApolloProvider>
  )
}

export default App
