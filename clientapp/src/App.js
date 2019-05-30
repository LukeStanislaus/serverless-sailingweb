import React from 'react';
import './App.css';
import { Link, Router } from '@reach/router'
import { ApolloProvider } from 'react-apollo'
import { client } from './apolloClient'
import SignOn from './signOn'
import ManageRace from './manageRace/manageRace'
import { } from 'react-bootstrap'



function App() {
  return (<>
    <ApolloProvider client={client}>
      <nav className={"navbar navbar-light bg-light"}>
        <Link to="/">Home</Link>
        <Link to="/SignOn">Sign On</Link>
        <Link to="/ManageRace">Manage Race</Link>
      </nav>
      <Router>
        <Home path="/" />
        <SignOn path="/SignOn" />
        <ManageRace path="/ManageRace" />
      </Router>
    </ApolloProvider>
  </>);
}
const Home = () => {
  return <h2>Welcome to Whitefriars Sailing Club</h2>
}

export default App;
