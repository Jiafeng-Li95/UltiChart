import React from 'react';
import { Form, FormControl, Button, Modal } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import axios from 'axios';
import decode from 'jwt-decode'
//import Dropdown from 'react-bootstrap/Dropdown'
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  PullRequestOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined, LogoutOutlined, EditOutlined
} from '@ant-design/icons';
import '../App.css';
import logo from '../images/Ultimate_Software_logo.svg.png';
import { Theme as AntDTheme } from '@rjsf/antd';
import { withTheme } from '@rjsf/core';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import RequestsSearchForm from '../components/Chart/RequestsSearchForm.js';


const Forms = withTheme(AntDTheme);
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
    <h2 className="request-text">Manage Incoming Requests</h2>
  </OverlayTrigger>
);

let namesList = [];

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
      userEmail: "",
      requests: [],
      nodes: [],
      //store user info variable name
      firstName: "",
      lastName: "",
      email: "",
      employeeId: "",
      companyId: "",
      companyName: "",
      managerId: "",
      isManager: false,
      //remove variable name
      removeEmail: "",
      showRemoveModalPopup: false,
      showNotManagerPopup: false,
      //hire variable name
      showHireModalPopup: false,
      //update variable name
      updateEmail: "",
      showUpdateModalPopup: false,
      showUpdateSelectErrorPopup: false,
      showUpdateFormPopup: false,
    };
    //hire handler 
    this.onHirePopup = this.onHirePopup.bind(this);
    this.sendHireData = this.sendHireData.bind(this);
    //remove handler
    this.onRemovePopup = this.onRemovePopup.bind(this);
    this.sendRemoveData = this.sendRemoveData.bind(this);
    //update handler
    this.onUpdatePopup = this.onUpdatePopup.bind(this);
    this.onSubmitUpdateSelect = this.onSubmitUpdateSelect.bind(this);
    this.sendUpdateData = this.sendUpdateData.bind(this);
  }
  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    axios.get('/viewReceivedRequests/' + decoded.identity)
    .then(function (response) {
      console.log(response)
      this.setState({requests: response.data.ViewRecievedRequests})
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    });
    this.setState({ userEmail: decoded.identity })
    let id = 1
    axios.get('/employees')
      .then(
        (result) => {
          const nodes = result.data;
          this.setState({ nodes: nodes });
          //store CompanyID
          this.setState({ companyId: result.data[0].companyId });
          //store CompanyName
          this.setState({ companyName: result.data[0].companyName });
        })
      .catch(function (error) {
        console.log(error);
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userEmail !== this.state.userEmail) {
      axios.get('/details/' + this.state.userEmail)
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

  //hire route handler: send data 
  sendHireData = ((data) => {
    axios.post('/hire', data)
      .then((result) => { })
  })
  //hire route handler: show popup
  onHirePopup() {
    this.setState({ showHireModalPopup: true });
    axios.get('/details/' + this.state.userEmail)
      .then((response) => {
        //check the user is a manager or not
        if (response.data.directReports.length === 0) {
          this.setState({ isManager: false });
        }
        this.setState({ managerId: response.data.currentEmployee[0].employeeId });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //remove route handler: send email
  sendRemoveData = ((email) => {
    console.log(email);
    axios.delete('/remove/' + email)
      .then((result) => {
        //console.log(result);
      })
  })
  //remove route handler: show popup
  onRemovePopup() {
    axios.get('/details/' + this.state.userEmail)
      .then((response) => {
        //check the user is a manager or not
        if (response.data.directReports.length === 0) {
          this.setState({ isManager: false });
          this.setState({ showRemoveModalPopup: false });
          this.setState({ showNotManagerPopup: true });
        }
        else {
          this.setState({ showRemoveModalPopup: true });
          //make the direct report list to nodes
          this.setState({ nodes: [] });
          let chartData = [];
          response.data.directReports.forEach(object => chartData.push({ value: object.email, label: object.email }))
          this.setState({ nodes: chartData });
        }
        this.setState({ managerId: response.data.currentEmployee[0].employeeId });
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  //update route handler: show popup
  onUpdatePopup() {
    //this.setState({ showUpdateModalPopup: true });
    axios.get('/details/' + this.state.userEmail)
      .then((response) => {
        this.setState({ showUpdateModalPopup: true });
        //make the direct report list to nodes
        this.setState({ nodes: [] });
        let chartData = [];
        response.data.currentEmployee.forEach(object => chartData.push({ value: object.email, label: object.email }));
        response.data.directReports.forEach(object => chartData.push({ value: object.email, label: object.email }));
        this.setState({ nodes: chartData });

      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //update route handler: using search function and store employee info
  onSubmitUpdateSelect = ((updateEmail) => {
    console.log(updateEmail);
    if (updateEmail === "") {
      this.setState({ showUpdateSelectErrorPopup: true });
    }
    else {
      axios.get('/search/' + updateEmail.value)
        .then(function (response) {
          this.setState({ email: response.data.matched_employees[0].email })
          this.setState({ employeeId: response.data.matched_employees[0].employeeID })
          this.setState({ managerId: response.data.matched_employees[0].managerID })
          this.setState({ firstName: response.data.matched_employees[0].firstName })
          this.setState({ lastName: response.data.matched_employees[0].lastName })
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
      this.setState({ showUpdateFormPopup: true });
      this.setState({ showUpdateModalPopup: false });
    }
  });
  //update route handler: send data
  sendUpdateData = ((data) => {
    axios.put('/update', data)
      .then((result) => {
        //console.log(result);
      })
  })

  render() {
    const schemaHire = {
      type: 'object',
      required: ['firstName', 'lastName', 'companyId', 'password',
        'positionTitle', 'companyName', 'employeeId',
        'managerId', 'email', 'startDate', 'isManager'
      ],
      properties: {
        firstName: {
          title: 'First Name',
          type: 'string',
        },
        lastName: {
          title: 'Last Name',
          type: 'string'
        },
        companyId: {
          title: 'company Id',
          type: 'integer',
          enum: [this.state.companyId]
        },
        password: {
          title: 'password',
          type: 'string'
        },
        positionTitle: {
          title: 'position title',
          type: 'string',
          enum: ["Engineering Manager", "Senior Software Engineer", "Software Engineer I", "Software Architect",
            "Software Engineer II", "Tech Lead",],
        },
        companyName: {
          title: 'company name',
          type: 'string',
          enum: [this.state.companyName]
        },
        isManager: {
          title: 'isManager',
          type: 'string',
          enum: ["true", "false"],
        },
        employeeId: {
          title: 'employeeId',
          type: 'integer',
          enum: [this.state.nodes.length + 1]
        },
        managerId: {
          title: 'managerId',
          type: 'integer',
          enum: [this.state.managerId]
        },
        email: {
          title: 'email',
          type: 'string'
        },
        startDate: {
          title: 'startDate',
          type: 'string'
        },
      }
    }
    const uiSchemaHire = {
      email: {
        "ui:options": {
          inputType: 'email',
        },
        "ui:placeholder": "example@tigermicrosystems.com"
      },
      password: {
        "ui:options": {
          inputType: 'password',
        }
      },
      startDate: {
        "ui:widget": "alt-date",
        "ui:options": {
          yearsRange: [1990, 2020],
          hideNowButton: true,
          hideClearButton: true,
        }
      }
    }

    const schemaUpdate = {
      type: 'object',
      required: ['employeeId',
      ],
      properties: {
        employeeId: {
          title: 'employeeId',
          type: 'integer',
          enum: [this.state.employeeId]
        },
        firstName: {
          title: 'First Name',
          type: 'string',
        },
        lastName: {
          title: 'Last Name',
          type: 'string',
        },
        companyId: {
          title: 'company Id',
          type: 'integer',
          enum: [this.state.companyId]
        },
        positionTitle: {
          title: 'position title',
          type: 'string',
          enum: ["Engineering Manager", "Senior Software Engineer", "Software Engineer I", "Software Architect",
            "Software Engineer II", "Tech Lead",],
        },
        companyName: {
          title: 'company name',
          type: 'string',
          enum: [this.state.companyName]
        },
        isManager: {
          title: 'isManager',
          type: 'string',
          enum: ["true", "false"],
        },
        managerId: {
          title: 'managerId',
          type: 'integer',
        },
        email: {
          title: 'email',
          type: 'string'
        },
        startDate: {
          title: 'startDate',
          type: 'string'
        },
      }
    }
    const uiSchemaUpdate = {
      firstName: {
        "ui:placeholder": this.state.firstName,
      },
      lastName: {
        "ui:placeholder": this.state.lastName,
      },
      companyId: {
        "ui:placeholder": this.state.companyId,
      },
      // positionTitle:{
      //   "ui:placeholder": this.state.positionTitle,
      // },
      companyName: {
        "ui:placeholder": this.state.companyName,
      },
      // isManager:{
      //   "ui:placeholder": this.state.isManager,
      // },
      managerId: {
        "ui:placeholder": this.state.managerId,
      },
      email: {
        "ui:options": {
          inputType: 'email',
        },
        "ui:placeholder": this.state.email
      },
      startDate: {
        "ui:widget": "alt-date",
        "ui:options": {
          yearsRange: [2000, 2020],
          hideNowButton: true,
          hideClearButton: true,
        },
      }
    }

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
              key="3"
              icon={<PlusCircleOutlined />}
              onClick={this.onHirePopup}
            >
              Hire Employee
        </Menu.Item>
            <Menu.Item
              key="4"
              icon={<MinusCircleOutlined />}
              onClick={this.onRemovePopup}
            >
              Remove Employee
        </Menu.Item>
            <Menu.Item
              key="5"
              icon={<EditOutlined />}
              onClick={this.onUpdatePopup}
            >
              Update Employee
        </Menu.Item>
            <Menu.Item
              style={{ marginTop: 50 }}
              key="6"
              icon={<LogoutOutlined />}
              onClick={() => {
                localStorage.removeItem("atoken")
                window.location.replace("/login");
              }}>
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

              {/* <Dropdown>
                        <Dropdown.Toggle style={{ width: '19rem' }} variant="secondary" id="dropdown-custom-components">
                          Select an Employee
                </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomMenu}>
                          <Options options={namesList} />
                        </Dropdown.Menu>
                      </Dropdown> 
                      <Dropdown
                        options={namesList}
                        // onChange={(value) => this.setState({ removeEmail: value })}
                        placeholder="Select an email from your direct reports" />*/}

                      <br></br>
                      <Form>
                        <Form.Label>Search for an Employee to Request</Form.Label>
                        <Row>
                          <Col>
                            <RequestsSearchForm />
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
                      
                      {this.state.requests.map(obj=>(
                        <Card style={{ width: '18rem' }}>
                          <Card.Body>
                          <Card.Title>Transfer Request</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{obj.Status}</Card.Subtitle>
                          <Card.Text>
                            {obj.NewManagerEmail} has requested employee ID {obj.EmployeeID} to be transferred to their team.
                          </Card.Text>
                          <Card.Link href="#">Accept</Card.Link>
                          <Card.Link href="#">Decline</Card.Link>
                        </Card.Body>
                      </Card>
                      ))}
                        
                    </CardDeck>
                  </Col>
                </Row>
              </Container>

              {/* hire employee */}
              <Modal
                show={this.state.showHireModalPopup}
                onHide={() => { this.setState({ showHireModalPopup: false }); window.location.reload(false); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Hire Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Forms
                    schema={schemaHire}
                    uiSchema={uiSchemaHire}
                    onSubmit={({ formData }) => {
                      this.sendHireData(formData);
                      this.setState({ showHireModalPopup: false });
                      window.location.reload(false);
                    }}
                  /></Modal.Body>
              </Modal>

              {/* Remove employee Modal*/}
              <Modal
                show={this.state.showRemoveModalPopup}
                onHide={() => { this.setState({ showRemoveModalPopup: false }); window.location.reload(false); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Remove Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <br />
                  <Row justify="space-around" align="middle">
                    <Col span="100">
                      <Dropdown
                        options={this.state.nodes}
                        onChange={(value) => this.setState({ removeEmail: value })}
                        placeholder="Select an email from your direct reports" /></Col>
                  </Row>
                  <br />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => {
                      this.sendRemoveData(this.state.removeEmail.value);
                      this.setState({ showRemoveModalPopup: false });
                      window.location.reload(false);
                    }}
                  >Submit</Button>
                  <Button onClick={() => {
                    this.setState({ showRemoveModalPopup: false })
                  }}>close</Button>

                </Modal.Footer>
              </Modal>

              {/* Not Manager Error Modal */}
              <Modal
                show={this.state.showNotManagerPopup}
                onHide={() => { this.setState({ showNotManagerPopup: false }); window.location.reload(false); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Not a manager</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>You're not a manager, you can not modify the information of your directReports</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => { this.setState({ showNotManagerPopup: false }); window.location.reload(false); }}>close</Button>
                </Modal.Footer>
              </Modal>

              {/* Update employee */}
              <Modal
                show={this.state.showUpdateModalPopup}
                onHide={() => {
                  this.setState({ showUpdateModalPopup: false });
                  window.location.reload(false);
                }}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <br />
                  <Row justify="space-around" align="middle">
                    <Col span="100"><Dropdown
                      options={this.state.nodes}
                      onChange={(value) => this.setState({ updateEmail: value })}
                      placeholder="Select an email from your direct reports" /></Col>
                  </Row>
                  <br />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => {this.onSubmitUpdateSelect(this.state.updateEmail)}}
                  >Submit</Button>

                  <Button onClick={() => {
                    this.setState({ showUpdateModalPopup: false });
                    window.location.reload(false);
                  }}>close</Button>
                </Modal.Footer>
              </Modal>

              {/* update select Error */}
              <Modal
                show={this.state.showUpdateSelectErrorPopup}
                onHide={() => { this.setState({ showUpdateSelectErrorPopup: false }); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Update Select Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <br />
                  <p>Plese select an email in order to update the employee infomation</p>
                  <br />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => { this.setState({ showUpdateSelectErrorPopup: false }); }}>close</Button>
                </Modal.Footer>
              </Modal>

              {/* Update Form */}
              <Modal
                show={this.state.showUpdateFormPopup}
                onHide={() => { this.setState({ showUpdateFormPopup: false }); window.location.reload(false); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Forms
                    schema={schemaUpdate}
                    uiSchema={uiSchemaUpdate}
                    onSubmit={({ formData }) => {
                      this.sendUpdateData(formData);
                      this.setState({ showUpdateFormPopup: false });
                      window.location.reload(false);
                    }}
                  /></Modal.Body>
              </Modal>



              {/*------- this field above is for content *-------*/}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Organization Chart ©2020 Created by Covid Coder Team</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Requests;


