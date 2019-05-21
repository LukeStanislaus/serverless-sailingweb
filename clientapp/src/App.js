import React from 'react';
import './App.css';
import {Link, Router} from '@reach/router'
import {ApolloProvider} from 'react-apollo'
import {client} from './apolloClient'
import SignOn from './signOn'

function App() {
  return (<>
  <ApolloProvider client={client}>
<nav> 
  <Link to="/">Home</Link>
  <Link to="/SignOn">Sign On</Link>
</nav>
<Router>
  <Home path="/" />
  <SignOn path="/SignOn" /> 
  </Router>
  </ApolloProvider>
  </>);
}
const Home = () => {
  return <h2>Welcome to Whitefriars Sailing Club</h2>
}

export default App;
