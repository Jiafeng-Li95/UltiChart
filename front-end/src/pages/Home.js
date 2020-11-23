import React from 'react';
import '../App.css';
import axios from 'axios';
import { Input, Layout, Menu, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import logo from '../images/Ultimate_Software_logo.svg.png';
import Chart from '../components/Chart/Chart.js';
import SearchForm from '../components/Chart/SearchForm.js';
import decode from 'jwt-decode';
import {
  HomeOutlined,
  PullRequestOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined, LogoutOutlined, EditOutlined
} from '@ant-design/icons';
import { Modal, Button } from 'react-bootstrap';
import { Theme as AntDTheme } from '@rjsf/antd';
import { withTheme } from '@rjsf/core';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Alert } from 'antd';

const Form = withTheme(AntDTheme);
const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      firstName:"",
      lastName:"",
      email:"",
      employeeId:"",
      userEmail: "",
      isManager: true,
      companyId: "",
      companyName: "",
      managerId: "",
      removeEmail: "",
      updateEmail: "",
      showHireModalPopup: false,
      showRemoveModalPopup: false,
      showNotManagerPopup: false,
      showUpdateModalPopup: false,
      showUpdateSelectErrorPopup: false,
      showUpdateFormPopup: false,
      searchBarValue: "",
      isManager: false,
    };
    this.onHirePopup = this.onHirePopup.bind(this);
    this.sendHireData = this.sendHireData.bind(this);
    this.onRemovePopup = this.onRemovePopup.bind(this);
    this.sendRemoveData = this.sendRemoveData.bind(this);
    this.onUpdatePopup = this.onUpdatePopup.bind(this);
    this.onSubmitUpdateSelect = this.onSubmitUpdateSelect.bind(this);
    this.sendUpdateData = this.sendUpdateData.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    this.setState({ userEmail: decoded.identity })
    axios.get('/employees')
      .then(
        (result) => {
          const nodes = result.data;
          this.setState({ nodes: nodes });
          //store CompanyID
          this.setState({ companyId: result.data[0].companyId });
          //store CompanyName
          this.setState({ companyName: result.data[0].companyName });
          //store the name list for the search bar
          let chartData = [];
          nodes.forEach(object => chartData.push({ value: object.firstName + " " + object.lastName }));
          this.setState({ nameList: chartData });
          //console.log(this.state.nameList);*/
        })
      .catch(function (error) {
        console.log(error);
      })
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state.searchBarValue)
  // }

  sendHireData = ((data) => {
    axios.post('/hire', data)
      .then((result) => {
        //console.log(result);
      })
  })

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

  sendRemoveData = ((email) => {
    axios.delete('/remove/' + email)
      .then((result) => {
        //console.log(result);
      })
  })

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

  onSubmitUpdateSelect=((updateEmail)=>{
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
      firstName:{
        "ui:placeholder": this.state.firstName,
      },
      lastName:{
        "ui:placeholder": this.state.lastName,
      },
      companyId:{
        "ui:placeholder": this.state.companyId,
      },
      // positionTitle:{
      //   "ui:placeholder": this.state.positionTitle,
      // },
      companyName:{
        "ui:placeholder": this.state.companyName,
      },
      // isManager:{
      //   "ui:placeholder": this.state.isManager,
      // },
      managerId:{
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

    const onSearch = value => console.log(value);

    return (
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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
              icon={<PullRequestOutlined />}
              onClick={() => {
                axios.get('/isManager/' + this.state.userEmail)
                  .then((response) => {
                    if (response.data === "isManager") {
                      this.setState({ isManager: true });
                      console.log("isManager");
                      console.log(this.state.isManager);
                      window.location.replace("/requests");
                    }
                    else {
                      this.setState({ isManager: false });
                      console.log("isNotManager");
                      console.log(this.state.isManager);
                      window.location.reload("/");
                      alert("you're not a manager");
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });

                // if (this.state.isManager) {
                //   window.location.replace("/requests");
                // }
                // else {
                //   window.location.reload("/");
                // }
              }}>
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
              }}
            >

              Logout
        </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header >
            <SearchForm />
            {/* <AutoComplete
              options={this.state.nameList}
              onSelect={(value) => this.setState({ searchBarValue: value })}

              style={{
                width: 500,
                position: 'absolute', left: '55%', top: '4%',
                transform: 'translate(-50%, -50%)',
              }}>
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            
              <Input.Search size="small" enterButton placeholder="Search by Name"
                onSearch={() => {
                  if (this.state.searchBarValue === "") {
                    console.log("empty string");
                  }
                  else {

                    //add search handling even(api calls)

                    (console.log(this.state.searchBarValue));
                  }
                }}
              />

              </AutoComplete> */}

          </Header>
          <Content style={{ margin: '50px 20px 50px', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 10, textAlign: 'center', minHeight: 500 }}>

              {/* org Chart */}
              <Chart />

              {/* hire employee */}
              <Modal
                show={this.state.showHireModalPopup}
                onHide={() => { this.setState({ showHireModalPopup: false }); window.location.reload(false); }}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Hire Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
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
                    <Col span="100"><Dropdown
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
                    <Dropdown
                      options={this.state.nodes}
                      onChange={(value) => this.setState({ updateEmail: value })}
                      placeholder="Select an email from direct reports" />
                  </Row>
                  <br />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={()=>this.onSubmitUpdateSelect(this.state.updateEmail)}
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
                  <Form
                    schema={schemaUpdate}
                    uiSchema={uiSchemaUpdate}
                    onSubmit={({ formData }) => {
                      this.sendUpdateData(formData);
                      this.setState({ showUpdateFormPopup: false });
                      window.location.reload(false);
                    }}
                  /></Modal.Body>
              </Modal>


            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Organization Chart ©2020 Created by Covid Coder Team</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Home;