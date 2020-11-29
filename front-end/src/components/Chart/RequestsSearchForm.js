import React from 'react';
import axios from 'axios';
import {Form, ListGroup, InputGroup} from 'react-bootstrap'
import onClickOutside from 'react-onclickoutside'
import decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../../App.css'; 

class SearchForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            input: "",
            data: [],
            curEmail: "",
            curID: "",
            oldManager: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        this.setState({
            input: value });
        if(value.length ===0){
            this.setState({data: []})
        }
        else{
            axios.get('/search/' + value)
            .then(function (response) {
                this.setState({data: response.data.matched_employees})
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
        }
    }

    //This still needs to be adjusted to create a request instead of update the org chart
    handleClickOutside = () => {
        this.setState({data: []})
      }

      componentDidMount(){
        const token = localStorage.getItem('atoken')
        let decoded = decode(token)
        this.setState({ curEmail: decoded.identity })
        axios.get('/details/' + decoded.identity)
        .then(function (response) {
          let managerId = response.data.currentEmployee[0].employeeId
          this.setState({curID: managerId})
          }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
      }



      async getEmail(newEmail, id, newManagerId, employeeId){
        let request = () => {console.log("error")}
        await axios.get('/employees')
        .then(function (result) {
            let employees = result.data
            employees.forEach(emp => {
              if(id === emp.employeeId){
                request = () => this.makeRequest(emp.email, newEmail, id, newManagerId, employeeId)
              } 
            })
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
        return request
    }

      async clickItem(employeeInfo){
        let oldManagerId = employeeInfo.managerID 
        let employeeId = employeeInfo.employeeID
        let newManagerId = this.state.curID
        let newEmail = this.state.curEmail
        let request = await this.getEmail(newEmail, oldManagerId, newManagerId, employeeId)  
        request()
        }

    async makeRequest(oldEmail, newEmail, oldManagerId, newManagerId, employeeId){
        axios.post('/createRequest', {
            oldManagerEmail: oldEmail,
            newManagerEmail: newEmail,
            oldManagerID: oldManagerId,
            newManagerID: newManagerId,
            employeeID: employeeId
        })
        .then(function (response) {
            alert("Successfully made request!")
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    

    render(){
        return(
            <div>
                <Form className = "search">
                    <InputGroup>
                        <InputGroup.Prepend>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                    <Form.Control type="text" placeholder="Search for employee" onChange = {this.handleChange}/>
                    </InputGroup>
                </Form>
                <ListGroup className = "list">
                    {this.state.data.map(obj=>(
                        <ListGroup.Item type = "button" action onClick = {() =>  this.clickItem(obj)} className = "listitem py-0">{obj.firstName + " " + obj.lastName}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        )
    }
}

export default onClickOutside(SearchForm); 