import React from 'react';
import '../App.css';
import axios from 'axios';
import { Input, Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import logo from '../images/Ultimate_Software_logo.svg.png';
import Chart from '../components/Chart.js';
import decode from 'jwt-decode';
import {
  HomeOutlined,
  PullRequestOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined, LogoutOutlined
} from '@ant-design/icons';
import { Modal, Button } from 'react-bootstrap';
// import Form from 'react-jsonschema-form';
import {Theme as AntDTheme} from '@rjsf/antd';
import {withTheme} from '@rjsf/core';

const Form = withTheme(AntDTheme);
const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      email: "",
      isManager: true,
      companyId: "",
      companyName: "",
      managerId:"",
      showHireModalPupup: false,
    };
    this.onHirePopup = this.onHirePopup.bind(this);
    this.sendHireData = this.sendHireData.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    this.setState({ email: decoded.identity })
    axios.get('/employees')
      .then(
        (result) => {
          const nodes = result.data;
          this.setState({ nodes: nodes });
          //store CompanyID
          this.setState({ companyId: result.data[0].companyId })
          //store CompanyName
          this.setState({ companyName: result.data[0].companyName })
        }
      )
  }

  sendHireData = ((data) => {
    // axios.post('/hire', data)
    //   .then((result) => {
    //       console.log(result);
    //     })
    console.log(JSON.stringify(data));
  })

  onHirePopup() {
    this.setState({ showHireModalPupup: true });
    axios.get('/details/' + this.state.email)
      .then((response) => {
        //check the user is a manager or not
        if (response.data.directReports.length === 0) {
          this.setState({ isManager: !this.state.isManager });
        }
        this.setState({ managerId : response.data.currentEmployee[0].employeeId});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  

  render() {
    const schema = {
      type: 'object',
      required: ['firstName','lastName','companyId','password',
                 'positionTitle','companyName','employeeId',
                 'managerId','email','startDate','isManager'
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
          enum:[this.state.companyId]
        },
        password: {
          title: 'password',
          type: 'string'
        },
        positionTitle: {
          title: 'position title',
          type: 'string',
          enum:["Engineering Manager","Senior Software Engineer","Software Engineer I","Software Architect",
                "Software Engineer II","Tech Lead",],
        },
        companyName: {
          title: 'company name',
          type: 'string',
          enum: [this.state.companyName]
        },
        isManager: {
          title: 'isManager',
          type: 'string',
          enum:["true","false"],
        },
        employeeId: {
          title: 'employeeId',
          type: 'integer',
          enum: [this.state.nodes.length + 1]
        },
        managerId: {
          title: 'managerId',
          type: 'integer',
          enum:[this.state.managerId]
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
    const uiSchema = {
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
        "ui:widget":"alt-date",
        "ui:options": {
          yearsRange:[1990,2020],
          hideNowButton:true,
          hideClearButton:true,
        }
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
            >
              Remove Employee
        </Menu.Item>
            <Menu.Item
              style={{ marginTop: 50 }}
              key="5"
              icon={<LogoutOutlined />}>
              <a href="/login"></a>
              Logout
        </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header >
            <Search
              placeholder="Search by name"
              onSearch={onSearch}
              enterButton
              size="large"
              allowClear
              style={{
                width: 500,
                position: 'absolute', left: '55%', top: '4%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </Header>
          <Content style={{ margin: '50px 20px 50px', overflow: 'initial' }}>
            <div className="site-layout-background" style={{ padding: 10, textAlign: 'center', minHeight: 500 }}>
              <Chart />
              {/* hire employee */}
              <Modal
                show={this.state.showHireModalPupup}
                onHide={()=>this.setState({showHireModalPupup:false})}
                centered>
                <Modal.Header closeButton>
                  <Modal.Title>Hire Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    onSubmit={({ formData }) => {this.sendHireData(formData);this.setState({showHireModalPupup:false})}}
                  /></Modal.Body>
                {/* <Modal.Footer>
                  <Button onClick={()=>this.setState({showHireModalPupup:false})}>close</Button>
                </Modal.Footer> */}
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