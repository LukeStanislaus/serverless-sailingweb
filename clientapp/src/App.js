import React from 'react';
import { Link, Router } from '@reach/router'
import { ApolloProvider } from '@apollo/react-hooks'
import { client } from './apolloClient'
import SignOn from './signOn'
import ViewRace from './viewRace'
import ManageRace from './manageRace/manageRace'
import { } from 'react-bootstrap'
import Home from './home'
import NewPerson from './newPerson'
import './app.css'
import WebSocket from './WebSocket'

function App() {
  return (<>
    <ApolloProvider client={client}>
      <nav className={"navbar navbar-dark bg-dark"}>
        <Link className={"navbar-item"} to="/">Home</Link>
        <Link className={"navbar-text"} to="/ViewRace">View Race</Link>
        <Link className={"navbar-text"} to="/SignOn">Sign On</Link>
        <Link className={"navbar-text"} to="/ManageRace">Manage Race</Link>
      </nav>
      <Router style={{paddingLeft: "10%", paddingRight: "10%"}}>
        <Home path="/" />
        <ViewRace path="ViewRace"/>
        <SignOn path="/SignOn" />
        <ManageRace path="/ManageRace" />
        <NewPerson path="/NewPerson"/>
      </Router>
      <WebSocket/>
    </ApolloProvider>
    <footer style={{paddingLeft:"3%", paddingTop: "40px"}}><p style={{ borderTopStyle: "solid", borderTopWidth:"1px"}}>By Luke Stanislaus</p></footer>
  </>);
}


export default App;
