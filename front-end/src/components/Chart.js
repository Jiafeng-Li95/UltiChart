import React from 'react';
import '../App.css';
import axios from 'axios';
import Rorgchart from 'r-orgchart';
import decode from 'jwt-decode'


class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            user: ""
        }
     }
     componentDidMount() {
        const token = localStorage.getItem('atoken')
        let decoded = decode(token)
        this.setState({user: decoded.identity})
    }

    compareState(prev){
      if (prev.user !== this.state.user){
        return false
      }
      if(prev.nodes.length !== this.state.nodes.length){
        return false
      }
      for(let i = 0; i<this.state.nodes.length; i++){
        if(prev.nodes[i].id !== this.state.nodes[i].id){
          return false
        }
      }
      return true
    }

  componentDidUpdate(prevProps, prevState) {
    if (this.compareState(prevState) === false) {
        let chartData = []
        axios.get('/details/' + this.state.user)
          .then(function (response) {
            let manager = response.data.currentEmployee[0]
            chartData.push({id: manager.employeeId, title: manager.firstName + " " + manager.lastName, ParentId: null})
            response.data.directReports.forEach(obj => chartData.push({id: obj.employeeID, title: obj.firstName + " " + obj.lastName,  ParentId: obj.managerID}))
          })
          .catch(function (error) {
            console.log(error);
          });
        this.setState({nodes: chartData})
  }
}

     render(){
         return(
             <Rorgchart data = {this.state.nodes} readonly = {true}/>
         )
     }
}

export default Chart; 