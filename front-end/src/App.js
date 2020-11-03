import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Requests from './Requests';
import './App.css';


function App() {
  return (
    <div>
    <Router>
      <Switch>
        <Route exact path = "/" component={Home}><Home/></Route>
        <Route path = "/login" component={Login}><Login/></Route>
        <Route path = "/requests" component={Requests}><Requests/></Route>
      </Switch>
    </Router>
  </div>
);
}

export default App;


{/* <Navbar className ="navbar"  variant = "dark">
        <Navbar.Brand href="/" >UltiChart</Navbar.Brand>
        <Nav className = "navbar-main">
          <Nav.Link href = "/">Home</Nav.Link>
          <Nav.Link href = "/login">Login</Nav.Link>
          <Nav.Link href = "/requests">Requests</Nav.Link>
        </Nav>
      </Navbar> */}