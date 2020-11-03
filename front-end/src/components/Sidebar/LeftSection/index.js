/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from 'react';
import BurgerButton from '../BurgerButton';
import { LeftSideBarContext } from '../index';
import './style.scss';
import { Modal, Form, Input} from 'antd';
import 'antd/dist/antd.css';

const LeftSection = (props) => {
  const { isShowSidebar, setIsShowSidebar } = useContext(LeftSideBarContext);
  const [isShowHirePopUp, setIsShowHirePopUp] = useState(false);
  const [isShowRemovePopUp, setIsShowRemovePopUp] = useState(false);
  const [isShowChangeManagerPopUp, setIsShowChangeManagerPopUp] = useState(false);

  function onHandleHire() {
    setIsShowHirePopUp(true);
  }
  function onHandleRemove() {
    setIsShowRemovePopUp(true);
  }
  function onHandleChangeManager() {
    setIsShowChangeManagerPopUp(true);
  }


  return (
    <div className={`LeftSideBar__LeftSection LeftSideBar__LeftSection--${isShowSidebar ? 'show' : 'hide'}`}>
      <div className="LeftSideBar__LeftSection__topWrapper">
        <BurgerButton
          onClick={() => setIsShowSidebar(false)}
        />
      </div>
      <ul className="LeftSideBar__LeftSection__menuWrapper">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/requests" >Request</a>
        </li>
        <li>
          <a onClick={onHandleHire}>Hire Employee</a>
        </li>
        <li>
          <a onClick={onHandleRemove}>Remove Employee</a>
        </li>
        <li>
          <a onClick={onHandleChangeManager}>Change Manager</a>
        </li>
      </ul>
      <Modal
        title="Hire Employee"
        centered
        visible={isShowHirePopUp}
        onOk={() => setIsShowHirePopUp(false)}
        onCancel={() => setIsShowHirePopUp(false)}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            label="Username"
            name="username"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="First Name">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Remove Employee"
        centered
        visible={isShowRemovePopUp}
        onOk={() => setIsShowRemovePopUp(false)}
        onCancel={() => setIsShowRemovePopUp(false)}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            label="Username"
            name="username"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="First Name">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Change Manager"
        centered
        visible={isShowChangeManagerPopUp}
        onOk={() => setIsShowChangeManagerPopUp(false)}
        onCancel={() => setIsShowChangeManagerPopUp(false)}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            label="Username"
            name="username"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="First Name">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeftSection;