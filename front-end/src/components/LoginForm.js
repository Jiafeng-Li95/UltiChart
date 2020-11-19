import React from 'react';
import '../App.css';
import {Form, Button} from 'react-bootstrap'
import axios from 'axios';

class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value });
    }



    handleSubmit(event){
        localStorage.setItem("curRoot", this.state.email)
        axios.post('/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then(function(response){
            localStorage.setItem("atoken", response.data.access_token)
            window.location.replace("/");
            window.location.replace("/");
        })
         .catch(function(error){
            alert("Incorrect email or password.")
        })
     
        event.preventDefault();
    }

render(){

    return (
        <div align = "center">
            <Form className="mx-5 p-3 login-form" style={{border:"1px solid #C0C0C0"}} >
                <Form.Group align = "left" controlId="formID">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name = "email" type="text" placeholder="Enter email" value={this.state.email} onChange = {this.handleChange}></Form.Control>
                </Form.Group>
                <Form.Group align = "left" controlId="formPass">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name = "password" type="password" placeholder="Enter password" value = {this.state.password} onChange = {this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" onClick = {this.handleSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    );
}

}

export default LoginForm; 