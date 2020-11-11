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
        let isManager = false;
        
        axios.get('/isManager/' + email)
        .then(function (response) {
            let string = response.data
            if(string.localeCompare("isManager") === 0){
                isManager = true
            }
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