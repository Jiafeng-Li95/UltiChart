import React from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import './App.css';
import OrgChart from './components/OrgChart';

class Home extends React.Component {
  
  handleOnClick() {
    alert();
  }

  render() {
    return (
      <div className="home">
        <div>
          <h1 className="home-text">Home</h1>
          <Form>
            <Form.Row style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
              <Col xs="auto" ><Form.Control placeholder="First name" /></Col>
              <Col xs="auto" ><Form.Control placeholder="Last name" /></Col>
              <Col xs="auto" ><Button variant="outline-info" onClick={this.handleOnClick}>Search</Button></Col>
            </Form.Row>
          </Form>
        </div>
        <OrgChart/>
      </div>
    );
  }
}

export default Home;