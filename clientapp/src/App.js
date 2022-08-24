import React from 'react';
import { Routes, Route} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
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
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {

  return <div style={{ paddingLeft: "3%", paddingRight: "3%" }}>
    <ApolloProvider client={client}>

      <Navbar bg="info"  expand="lg" className="navbar navbar-expand-lg navbar-light">
      <LinkContainer style={{paddingLeft: "1.5%"}} to="/"><Navbar.Brand >Whitefriars
      </Navbar.Brand></LinkContainer>
  <Navbar.Toggle />
  <Navbar.Collapse id="navbarNav">
    <Nav>
      <Nav.Item>
      <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/ViewRace"><Nav.Link>View Race</Nav.Link></LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/SignOn"><Nav.Link>Sign On</Nav.Link></LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/ManageRace"><Nav.Link>Manage Race</Nav.Link></LinkContainer>
      </Nav.Item>
    </Nav>
  </Navbar.Collapse>
</Navbar>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/ViewRace" element={<ViewRace />} />
        <Route path="/SignOn" element={<SignOn />} />
        <Route path="/ManageRace" element={<ManageRace />} />
        <Route path="/NewPerson" element={<NewPerson />} />
        <Route path="/ManageData" element={<ManageData />} />
      </Routes>
      
      <WebSocket /> 
    </ApolloProvider>
    <footer style={{ paddingTop: "40px" }}><p style={{ borderTopStyle: "solid", borderTopWidth: "1px" }}>By Luke Stanislaus</p></footer>
  </div>;
}


export default App;
