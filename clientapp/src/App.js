import React from 'react';
import { Link, Router } from '@reach/router'
import { ApolloProvider} from '@apollo/react-hooks'
import SignOn from './signOn'
import ViewRace from './viewRace'
import ManageRace from './manageRace/manageRace'
import { } from 'react-bootstrap'
import ManageData from './manageData'
import Home from './home'
import NewPerson from './newPerson'
import './app.css'
import WebSocket from './WebSocket'
import {client} from './apolloClient'

function App() {

  return (<>
    <ApolloProvider client={client}>
      <nav style={{ paddingLeft: "13%", paddingRight: "13%" }} className={"navbar navbar-dark bg-dark"}>
        <Link className={"navbar-item"} to="/">Home</Link>
        <Link className={"navbar-text"} to="/ViewRace">View Race</Link>
        <Link className={"navbar-text"} to="/SignOn">Sign On</Link>
        <Link className={"navbar-text"} to="/ManageRace">Manage Race</Link>
      </nav>
      <Router style={{ paddingLeft: "3%", paddingRight: "3%" }}>
        <Home path="/" />
        <ViewRace path="ViewRace" />
        <SignOn path="/SignOn" />
        <ManageRace path="/ManageRace" />
        <NewPerson path="/NewPerson" />
        <ManageData path="/ManageData" />
      </Router>
      <WebSocket /> 
    </ApolloProvider>
    <footer style={{ paddingLeft: "3%", paddingTop: "40px" }}><p style={{ borderTopStyle: "solid", borderTopWidth: "1px" }}>By Luke Stanislaus</p></footer>
  </>);
}


export default App;
