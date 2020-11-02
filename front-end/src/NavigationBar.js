import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class NavigationBar extends React.Component{
    render(){
        return(
            <Navbar className ="navbar"  variant = "dark">
            <Navbar.Brand href="/" >UltiChart</Navbar.Brand>
            <Nav className = "navbar-main">
              <Nav.Link href = "/">Home</Nav.Link>
              <Nav.Link href = "/requests">Requests</Nav.Link>
              <Nav.Link onClick = {()=>{localStorage.removeItem("atoken")
                        window.location.replace("/login");}}>Logout</Nav.Link>
            </Nav>
          </Navbar>
        )
    }
}

export default NavigationBar; 