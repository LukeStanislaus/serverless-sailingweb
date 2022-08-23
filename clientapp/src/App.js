import React from 'react';
import { Link, Router } from '@reach/router'
import { ApolloProvider} from '@apollo/react-hooks'
import SignOn from './signOn'
import ViewRace from './viewRace'
import ManageRace from './manageRace/manageRace'
import ManageData from './manageData'
import Home from './home' 
import NewPerson from './newPerson'
import './app.css'
import WebSocket from './WebSocket'
import {client} from './apolloClient'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>
    <ApolloProvider client={client}>
      
      <nav className="navbar navbar-expand-lg navbar-light bg-info">
      <Link style={{paddingLeft: "1.5%"}} className={"navbar-brand"} to="#">Whitefriars</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item active">
      <Link className={"nav-link"} to="#">Home</Link>
      </li>
      <li className="nav-item">
        <Link className={"nav-link"} to="/ViewRace">View Race</Link>
      </li>
      <li className="nav-item">
        <Link className={"nav-link"} to="/SignOn">Sign On</Link>
      </li>
      <li className="nav-item">
        <Link className={"nav-link"} to="/ManageRace">Manage Race</Link>
      </li>
    </ul>
  </div>
</nav>
      <Router >
        <Home path="/" />
        <ViewRace path="ViewRace" />
        <SignOn path="/SignOn" />
        <ManageRace path="/ManageRace" />
        <NewPerson path="/NewPerson" />
        <ManageData path="/ManageData" />
      </Router>
      <WebSocket /> 
    </ApolloProvider>
    <footer style={{ paddingTop: "40px" }}><p style={{ borderTopStyle: "solid", borderTopWidth: "1px" }}>By Luke Stanislaus</p></footer>
  </div>;
}


export default App;
