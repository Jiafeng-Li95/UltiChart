import React from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode'
import axios from 'axios';

class ManagerRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const token = localStorage.getItem('atoken')
        let decoded = decode(token)
        let email = decoded.identity
        let isManager = true;
        
        axios.get('/isManager/' + email)
        .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
       
        return isManager ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/' }} />
        );
    }
}

export default ManagerRoute;