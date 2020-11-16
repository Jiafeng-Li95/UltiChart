import React from 'react';
import { Form, FormControl, Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import axios from 'axios';
import decode from 'jwt-decode'
import Dropdown from 'react-bootstrap/Dropdown'
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PullRequestOutlined, LogoutOutlined
} from '@ant-design/icons';
import '../App.css';
import logo from '../images/Ultimate_Software_logo.svg.png';

const { Header, Sider, Content, Footer } = Layout;

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Requesting an Employee</Popover.Title>
    <Popover.Content>
      When you request a transfer of an employee, you, as their new manager, as well as their existing manager must both approve.
  </Popover.Content>
  </Popover>
);
const popoverManage = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Managing Requests</Popover.Title>
    <Popover.Content>
      Here you can see any pending employee requests.
  </Popover.Content>
  </Popover>
);
const NewRequest = () => (
  <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
    <h2 className="request-text">Create a new Request</h2>
  </OverlayTrigger>
);
const ManageRequests = () => (
  <OverlayTrigger trigger="hover" placement="left" overlay={popoverManage}>
    <h2 className="request-text">Manage Existing Requests</h2>
  </OverlayTrigger>
);

let namesList = [
];

// generage select dropdown option list dynamically
function Options({ options }) {
  return (
    options.map(option =>
      <Dropdown.Item eventKey={option.id}>{option.value}</Dropdown.Item>)
  );
}



// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(


  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = React.useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

class Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }
  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    this.setState({ email: decoded.identity })
    let id = 1

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.email !== this.state.email) {
      axios.get('/details/' + this.state.email)
      .then(function (response) {
        response.data.directReports.forEach(obj => namesList.push({
          id: obj.employeeID, value: obj.firstName +
            " " + obj.lastName
        }))
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    return (
      /* Careful : */
      /* navigation bar with the content field (make changes in the content field)*/

      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']}>
            <img
              className="logo-design"
              src={logo}
              alt="Logo"
            />
            <Menu.Item
              key="1"
              icon={<HomeOutlined />}>
              Home
              <a href="/"></a>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<PullRequestOutlined />}>
              <a href="/requests"></a>
              Requests
        </Menu.Item>
            <Menu.Item
              style={{ marginTop: 50 }}
              key="3"
              icon={<LogoutOutlined />}>
              <a href="/login"></a>
              Logout
        </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header >
          </Header>
          <Content style={{ margin: '50px 20px 50px', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 10, textAlign: 'center', minHeight: 500 }}>
              
            {/*------- this field is for content *-------*/}

              <h1 className="home-text">
                Requests
              </h1>
              <Container>
                <Row>
                  <Col xs={10} md={7}>
                    <br></br>
                    <br></br>
                    <div>
                      <NewRequest />
                      <br></br>
              Select an Employee
              <Dropdown>
                        <Dropdown.Toggle style={{ width: '19rem' }} variant="secondary" id="dropdown-custom-components">
                          Select an Employee
                </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomMenu}>
                          <Options options={namesList} />
                        </Dropdown.Menu>
                      </Dropdown>
                      <br></br>
                      <Form>
                        <Form.Label>Or Enter Employee Name</Form.Label>
                        <Row>
                          <Col>
                            <Form.Control placeholder="Name" />
                          </Col>
                        </Row>
                      </Form>
                      <br></br>
                      <Form>
                        <br></br>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Place any comments for this employees current manager here</Form.Label>
                          <Form.Control as="textarea" rows="3" placeholder="additional comments" />
                        </Form.Group>
                      </Form>
                    </div>
                    <br></br>
                    <Button variant="outline-secondary" size="lg" block>
                      Submit
            </Button>
                  </Col>
                  <Col xs={6} md={5}>
                    <br></br>
                    <br></br>
                    <ManageRequests />
                    <br></br>
                    <CardDeck>
                      <Card style={{ width: '18rem' }}>
                        <Card.Body>
                          <Card.Title>Transfer Request</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">Employee Name</Card.Subtitle>
                          <Card.Text>
                            (Manager Name) has requested your employee, (Employee Name), be transfered to his team.
                </Card.Text>
                          <Card.Link href="#">Accept</Card.Link>
                          <Card.Link href="#">Decline</Card.Link>
                        </Card.Body>
                      </Card>
                    </CardDeck>
                  </Col>
                </Row>
              </Container>

            {/*------- this field is for content *-------*/}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Organization Chart ©2020 Created by Covid Coder Team</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Requests;


