import React, { Component } from 'react';
import OrgChart from '@balkangraph/orgchart.js';

export default class extends Component {

     constructor(props) {
       super(props);
       this.data = [
           {id: 1,
            name: "Adrienne Hawkins",
            positionTitle: "CEO",
            email: "Adrienne_Hawkins@nightwellenterprise.com",
            startDate: "1995-11-06"
        },
        {
            id: 2,
            pid: 1,
            name: "Bernadine Richard",
            positionTitle: "Engineering Manager",
            email: "Bernadine_Richard@nightwellenterprise.com",
            startDate: "2016-07-22"
        },
        {
            id: 3,
            pid: 2,
            name: "Cleveland Jensen",
            positionTitle: "Engineering Manager",
            email: "Cleveland_Jensen@nightwellenterprise.com",
            startDate: "2006-01-26"
        },
        {
            id: 4,
            pid: 2,
            name: "Janelle Melendez",
            positionTitle: "Engineering Manager",
            email: "Janelle_Melendez@nightwellenterprise.com",
            startDate: "2005-05-01"
        },
        {
            id: 5,
            pid: 4,
            name: "Allen Black",
            positionTitle: "Engineering Manager",
            email: "Allen_Black@nightwellenterprise.com",
            startDate: "2010-07-06"
        },]
       this.divRef = React.createRef();
     }

   shouldComponentUpdate() {
       return false;
   }

   componentDidMount() {
       this.chart = new OrgChart(this.divRef.current , {
           nodes: this.data,

           nodeBinding: {
               field_0: "name",
               field_1: "positionTitle",
               field_2: "email",
               field_3: "startDate"
           },
       });

   }

   render() {
       return (
            <div id="tree" ref={this.divRef}></div>
       );
   }
}