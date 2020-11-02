import React from 'react';
import './App.css';
import LoginForm from './LoginForm';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Login() {
  return (
    <div className="App">
      <Navbar className ="navbar"  variant = "dark">
            <Navbar.Brand href="/" >UltiChart</Navbar.Brand>
            <Nav className = "navbar-main">
            </Nav>
          </Navbar>
      <div>
        <h1 className = "home-text">Login</h1>
        <LoginForm/>
      </div>
    </div>
  );
}

export default Login;
