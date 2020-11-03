import React from 'react';
import './App.css';
import LeftSidebar from './components/Sidebar';
import axios from 'axios';
import { Input, Layout } from 'antd';
import 'antd/dist/antd.css';
import logo from './Ultimate_Software_logo.svg.png'

const { Search } = Input;
const { Header, Content, Footer } = Layout;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      modalVisble: true,
    };
    this.onClickhandle = this.onClickhandle.bind(this);
    this.onChangeVisible = this.onChangeVisible.bind(this);
  }

  componentDidMount() {
    axios.get('/employees')
      .then(
        (result) => {
          const nodes = result.data;
          this.setState({ nodes });
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
        <LeftSidebar />
        <Content style={{ marginRight: "auto", marginLeft: "auto" }} >
          <br />
          <img
            src={logo}
            alt="Logo"
            width={430}
            height={180}
          />
          <br />
          <Search
            placeholder="Search by name"
            onSearch={onSearch} 
            enterButton
            size="large"
            allowClear
            style={{ width: 450 }} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
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