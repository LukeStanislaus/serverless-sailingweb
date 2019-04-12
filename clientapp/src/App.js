import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import home from './home/home';
import managerace from './managerace/managerace';
import signon from './signon/signon';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

function AppRouter() {
  return (
    <Router>
      <div>
<Navbar bg="dark" variant="dark"  expand="lg">

<Link to="/"> <Navbar.Brand>Whitefriars Sailing Club</Navbar.Brand></Link>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    <LinkContainer exact to="/">
    <Nav.Link >Home</Nav.Link>
</LinkContainer>
<LinkContainer to="/signon/">
    <Nav.Link >Sign On</Nav.Link>
</LinkContainer>
<LinkContainer to="/racemanagement/">
    <Nav.Link >Race Management</Nav.Link>
</LinkContainer>
    </Nav>
  </Navbar.Collapse>
</Navbar>
        <Route path="/" exact component={home} />
        <Route path="/signon/" component={signon} />
        <Route path="/racemanagement/" component={managerace} />
      </div>
    </Router>
  );
}

export default AppRouter;
