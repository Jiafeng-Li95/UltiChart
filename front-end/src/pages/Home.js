import React from 'react';
import '../App.css';
import axios from 'axios';
import { Input, Layout } from 'antd';
import 'antd/dist/antd.css';
import logo from '../images/Ultimate_Software_logo.svg.png';
import OrgChart from '../components/OrgChart.js'
import decode from 'jwt-decode'

const { Search } = Input;
const { Content, Footer } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      modalVisble: true,
      email: ""
    };
    this.onClickhandle = this.onClickhandle.bind(this);
    this.onChangeVisible = this.onChangeVisible.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    this.setState({email: decoded.identity})
    axios.get('/employees')
      .then(
        (result) => {
          const nodes = result.data;
          this.setState({nodes: nodes });
          console.log(this.state.nodes);
        }
      )
  }

  onChangeVisible(e) {
    this.setState({ modalVisble: e.target.modalVisble })
  }

  handleOnClick() {
    alert();
  }

  onClickhandle() {
    console.log(this.state.nodes);
  }
  onFinish = (values) => {
    console.log('Success:', values);
  }
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  render() {

    const onSearch = value => console.log(value);

    return (
      <Layout >
        <Content >
          <br />
          <img
            className="logo-design"
            src={logo}
            alt="Logo"
          />
          <br />
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Search
              placeholder="Search by name"
              onSearch={onSearch}
              enterButton
              size="large"
              allowClear
              style={{ width: 500 }}
            />
          </div>

          <div>
            <OrgChart />
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Org Chart Created by Covid Coders</Footer>
      </Layout>
    );
  }
}

export default Home;