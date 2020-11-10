/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from 'react';
import BurgerButton from '../BurgerButton';
import { LeftSideBarContext } from '../index';
import './style.scss';
import { Modal, Button } from 'react-bootstrap';
import 'antd/dist/antd.css';
import axios from 'axios';
import Form from 'react-jsonschema-form';


const LeftSection = () => {
  const { isShowSidebar, setIsShowSidebar } = useContext(LeftSideBarContext);
  const [ isShowHirePopUp , setIsShowHirePopUp ] = useState(false);
  const [ isShowUpdatePopUp, setIsShowUpdatePopUp ] = useState(false);
  const [ isShowRemovePopUp, setIsShowRemovePopUp ] = useState(false);
  const [ isShowChangeManagerPopUp, setIsShowChangeManagerPopUp ] = useState(false);
  const [ isShowEmailErrorPopUp, setIsShowEmailErrorPopUp ] = useState(false);
  //variable use in the form
  const [ email, setEmail ] = useState('');

  const schema = {
    type: 'object',
    required: ['firstName'],
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
        type: 'integer'
      },
      password: {
        title: 'password',
        type: 'string'
      },
      positionTitle: {
        title: 'position title',
        type: 'string'
      },
      companyName: {
        title: 'company name',
        type: 'string'
      },
      isManager: {
        title: ' isManager',
        type: 'boolean'
      },
      employeeId: {
        title: 'employeeId',
        type: 'integer'
      },
      managerId: {
        title: 'managerId',
        type: 'integer'
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
    companyName: {
      "ui:placeholder": "Tiger Microsystems"
    },
    startDate: {
      "ui:placeholder": "Year-month-day"
    },
    companyId: {
      "ui:placeholder": "2"
    }
  }
  //complement Hire route
  const sendHireData = ((data) => {
    // axios.post('/hire', data)
    //   .then((result) => {
    //       console.log(result);
    //     })
    console.log(JSON.stringify(data));
  })
  //complement update route
  const sendUpdateData = ((data) => {
    // axios.put('/update', data)
    //   .then((result) => {
    //       console.log(result);
    //     })
    console.log(JSON.stringify(data));
  })
  //complement remove route
  const sendRemove = ((email) => {
    axios.delete('/remove/'+email)
      .then((result) => {
          console.log(result);
        })
    console.log(JSON.stringify(email));
  })

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
          <a onClick={() => setIsShowHirePopUp(true)}>Hire Employee</a>
        </li>
        <li>
          <a onClick={() => setIsShowUpdatePopUp(true)}>Update Employee</a>
        </li>
        <li>
          <a onClick={() => setIsShowRemovePopUp(true)}>Remove Employee</a>
        </li>
        <li>
          <a onClick={() => setIsShowChangeManagerPopUp(true)}>Change Manager</a>
        </li>
      </ul>

      {/* Update employee Modal*/}
      <Modal
        show={isShowUpdatePopUp}
        onHide={() => setIsShowUpdatePopUp(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={({ formData }) => sendUpdateData(formData)}
          /></Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowUpdatePopUp(false)}>close</Button>
        </Modal.Footer>
      </Modal>

      {/* Hire employee Modal*/}
      <Modal
        show={isShowHirePopUp}
        onHide={() => setIsShowHirePopUp(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Hire Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={({ formData }) => sendHireData(formData)}
          /></Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowHirePopUp(false)}>close</Button>
        </Modal.Footer>
      </Modal>

      {/* Remove employee Modal*/}
      <Modal
        show={isShowRemovePopUp}
        onHide={() => setIsShowRemovePopUp(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br/>
          <div>
            <label htmlFor="exmapleInputEmail">
              Email Address:
          </label>
          </div>
          <div>
            <input
              type="email"
              onChange={e => setEmail(e.target.value)}
              ></input>
          </div>
          <br/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowRemovePopUp(false)}>close</Button>
          <Button onClick={() => { 
            if(email.includes('@')){
              setIsShowRemovePopUp(false); 
              sendRemove(email);
            }
            else{
              setIsShowEmailErrorPopUp(true);
            }
          }}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Change manager Modal*/}
      <Modal
        show={isShowChangeManagerPopUp}
        onHide={() => setIsShowChangeManagerPopUp(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowChangeManagerPopUp(false)}>close</Button>
          <Button onClick={() => { setIsShowChangeManagerPopUp(false); alert("succeed") }}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Email Error Modal */}
      <Modal
        show={isShowEmailErrorPopUp}
        onHide={() => setIsShowEmailErrorPopUp(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Error Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Email error, may includes @ in the email.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsShowEmailErrorPopUp(false)}>close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeftSection;