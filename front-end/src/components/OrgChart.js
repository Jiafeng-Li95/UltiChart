import React, { Component } from 'react';
import axios from 'axios'

export default class extends Component {

     constructor(props) {
        super(props);
        this.state = {
            nodeBinding: {
                field_0: "firstName",
                field_1: "positionTitle"
            },
            nodes: []
        }
     }

     componentDidMount() {
     }

    renameKey(obj, oldKey, newKey) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }

   componentDidUpdate(prev) {
       if (prev.user !== this.props.user) {
        axios.all([
            axios.get('/details/'.concat(this.props.user.email)),
            axios.get('/employees')
        ])
        .then(axios.spread((det, emp) => {
            det.data.directReports.forEach(obj =>this.renameKey(obj, 'employeeID', 'id'));
            det.data.directReports.forEach(obj =>this.renameKey(obj, 'managerID', 'pid'));
            let manager = emp.data.filter(manager => manager.employeeId === det.data.employeeId)[0];
            this.renameKey(manager, 'employeeId', 'id');
            this.setState({nodes: det.data.directReports})
            this.setState({nodes: [...this.state.nodes, manager]})
        }));

        }
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true; 
        s.innerHTML = "var chart = new OrgChart(document.getElementById(\"tree\")," + JSON.stringify(this.state) + ");";
        this.instance.appendChild(s);

    }

   render() {
       console.log(this.state.nodes)
       return (
            <div id="tree" ref={el => (this.instance = el)} />
       );
   }
}