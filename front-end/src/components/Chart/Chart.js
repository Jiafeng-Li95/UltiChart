import React from 'react';
import axios from 'axios';
import Rorgchart from './OrgChart.js';
import decode from 'jwt-decode'
import _ from 'lodash';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
import './style.css';



class Chart extends React.Component {
  //
  static defaultProps = {
    readonly: false,
    disableRootEdit: false,
    data: [{id: 1, title: 'Root', ParentId: null}],
    addNewChild: undefined,
    deleteNode: undefined,
    editNode: undefined,
    animation: true,
    nodeStyle: null,
    nodeClassName: '',
    btnsStyle: null,
    btnsClassName: '',
    lineColor: 'darkGreen'
}

  constructor(props) {
    super(props);
    const data = props.data;
    this.state = {
      user: "",
      data: data,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: nextProps.data });
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('atoken')
    let decoded = decode(token)
    this.setState({ user: decoded.identity })
  }

  compareState(prev) {
    if (prev.user !== this.state.user) {
      return false
    }
    if (prev.data.length !== this.state.data.length) {
      return false
    }
    for (let i = 0; i < this.state.data.length; i++) {
      if (prev.data[i].id !== this.state.data[i].id) {
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
          chartData.push({ id: manager.employeeId, title: manager.firstName + " " + manager.lastName, ParentId: null, 
          email: manager.email, Position: manager.positionTitle
        })
          response.data.directReports.forEach(obj => chartData.push({
            id: obj.employeeID, title: obj.firstName +
              " " + obj.lastName, ParentId: obj.managerID, email: obj.email, Position: obj.positionTitle
          }))
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({ data: chartData })
    }
    console.log(this.state.data);
  }

  render() {
    const {
      readonly,
      disableRootEdit,
      addNewChild,
      deleteNode,
      editNode,
      animation,
      nodeStyle,
      nodeClassName,
      btnsStyle,
      btnsClassName,
      lineColor
    } = this.props;

    const { data } = this.state;


    return (
      <Rorgchart
        data={data}
        editable={!readonly}
        rootEditable={!disableRootEdit}
        data={data}
        addNewChild={addNewChild ? addNewChild : this.add}
        deleteNode={deleteNode ? deleteNode : this.delete}
        editNode={editNode ? editNode : this.edit}
        animation={animation}
        nodeStyle={nodeStyle}
        nodeClassName={nodeClassName}
        btnsStyle={btnsStyle}
        btnsClassName={btnsClassName}
        lineColor={lineColor}
      />
    )
  }
}
Chart.propTypes = {
  readonly: PropTypes.bool,
  disableRootEdit: PropTypes.bool,
  data: PropTypes.array,
  addNewChild: PropTypes.func,
  deleteNode: PropTypes.func,
  editNode: PropTypes.func,
  animation: PropTypes.bool,
  nodeStyle: PropTypes.object,
  nodeClassName: PropTypes.string,
  btnsStyle: PropTypes.object,
  btnsClassName: PropTypes.string,
  lineColor: PropTypes.string
}

export default Chart; 