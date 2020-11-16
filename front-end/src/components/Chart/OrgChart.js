import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { Modal, Button, Form } from 'react-bootstrap';

function getTR(
    item,
    allitems,
    addNew,
    deleteNode,
    editNode,
    addSpace,
    animation,
    editingNodeId,
    changeEditingNodeId,
    editable,
    rootEditable,
    nodeStyle,
    nodeClassName,
    btnsStyle,
    btnsClassName,
    lineColor
) {
    const children = allitems[item.id];
    const colspan = (children ? children.length : 1) * 2;

    const lines = _.map(_.range(0, colspan), (l, idx) => {
        if (idx === 0) {
            return <td key={idx} className="right-line" style={{ borderColor: lineColor }} />

        } else if (idx + 1 === colspan) {
            return <td key={idx} className="left-line" style={{ borderColor: lineColor }} />

        } else if (idx % 2 === 0) {
            return <td key={idx} className="right-line top-line" style={{ borderColor: lineColor }} />

        } else {
            return <td key={idx} className="left-line top-line" style={{ borderColor: lineColor }} />
        }
    })

    return (
        <table className={addSpace ? 'add-space' : ''}>
            <tbody>

                <tr className="node">
                    <td colSpan={colspan}>
                        <NodeBox
                            node={item}
                            addNew={addNew}
                            deleteNode={deleteNode}
                            editNode={editNode}
                            animation={animation}
                            editingNodeId={editingNodeId}
                            changeEditingNodeId={changeEditingNodeId}
                            editable={editable}
                            rootEditable={rootEditable}
                            nodeStyle={nodeStyle}
                            nodeClassName={nodeClassName}
                            btnsStyle={btnsStyle}
                            btnsClassName={btnsClassName}
                        />
                    </td>
                </tr>

                {children &&
                    <tr className="lines">
                        <td colSpan={colspan}>
                            <div className="down-line" style={{ borderColor: lineColor }} />
                        </td>
                    </tr>
                }

                {children && children.length > 1 &&
                    <tr className="lines">
                        {lines}
                    </tr>
                }

                {children && children.length === 1 &&
                    <tr className="lines">
                        <td colSpan={colspan}>
                            <div className="down-line" style={{ borderColor: lineColor }} />
                        </td>
                    </tr>
                }

                <tr className="nodes">
                    {
                        _.map(children, i => {
                            return (
                                <td
                                    key={i.id}
                                    colSpan={2}
                                >
                                    {getTR(
                                        i,
                                        allitems,
                                        addNew,
                                        deleteNode,
                                        editNode,
                                        children.length > 1,
                                        false,
                                        editingNodeId,
                                        changeEditingNodeId,
                                        editable,
                                        rootEditable,
                                        nodeStyle,
                                        nodeClassName,
                                        btnsStyle,
                                        btnsClassName,
                                        lineColor
                                    )}
                                </td>
                            );
                        })
                    }
                </tr>

            </tbody>
        </table>
    );
}

class OrgChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingNodeId: -1,
        };
    }

    changeEditingNodeId = (editingNodeId) => {
        if (editingNodeId !== this.state.editingNodeId) {
            this.setState({ editingNodeId: editingNodeId });
        }
    }

    render() {
        const groupedData = _.groupBy(this.props.data, 'ParentId');
        const animate = this.props.animation && this.props.data.length <= 1;

        const tables = _.map(groupedData[null], item => {
            return (
                <div
                    className="root-container"
                    key={item.id}
                >
                    {getTR(
                        item,
                        groupedData,
                        this.props.onShowPopup,
                        this.props.deleteNode,
                        this.props.editNode,
                        true,
                        animate,
                        this.state.editingNodeId,
                        this.changeEditingNodeId,
                        this.props.editable,
                        this.props.rootEditable,
                        this.props.nodeStyle,
                        this.props.nodeClassName,
                        this.props.btnsStyle,
                        this.props.btnsClassName,
                        this.props.lineColor
                    )}
                </div>
            );
        });

        return (
            <div className="org-chart-container">
                {tables}
            </div>
        );
    }
}

OrgChart.propTypes = {
    data: PropTypes.array.isRequired,
    onShowPopup: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    editNode: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired
};

class NodeBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            node: props.node,
            editMode: false,
            showPopup: false,
        };
        this.onShowPopup = this.onShowPopup.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.node !== this.state.node) {
            this.setState({ node: nextProps.node });
        }
        if (nextProps.editingNodeId !== this.state.node.id) {
            this.setState({ editMode: false });
        }
    }

    onShowPopup = () => {
        this.setState({ showPopup: true });
    }

    render() {
        const {
            node,
            editMode
        } = this.state;

        const {
            editingNodeId,
            changeEditingNodeId,
            editable,
            rootEditable,
            nodeStyle,
            nodeClassName,
            btnsStyle,
            btnsClassName
        } = this.props;

        return (
            <ClickOutsideHandler action={editingNodeId !== -1 && editingNodeId === node.id ? changeEditingNodeId : null}>
                {
                    <div className={`node-box ${this.props.animation ? 'node-animation' : ''} ${nodeClassName}`} style={nodeStyle} >
                        {editable &&
                            <div className={`org-node-btns ${btnsClassName}`} style={btnsStyle}>
                                <FontAwesomeIcon icon={faFileAlt} className="icon" onClick={this.onShowPopup} />

                            </div>
                        }
                        <div onClick={(node.ParentId !== null || (node.ParentId === null && rootEditable)) && editable ? this.editNode : undefined} className="node-name-box">
                            <p className="node-name">{_.truncate(node.title, { length: 35, omission: ' ...' })}</p>
                        </div>
                    </div>
                }
                <Modal
                    show={this.state.showPopup}
                    onHide={() => { this.setState({ showPopup: false })}}
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       <Form>
                           <Form.Group><Form.Label>Name : {node.title}</Form.Label></Form.Group>
                           <Form.Group><Form.Label>Employee Id : {node.id}</Form.Label></Form.Group>
                           <Form.Group><Form.Label>Manager Id : {node.ParentId}</Form.Label></Form.Group>
                           {/* <Form.Group><Form.Label>Name : {node.title}</Form.Label></Form.Group> */}
                        
                       </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { this.setState({ showPopup: false })}}>close</Button>
                    </Modal.Footer>
                </Modal>
            </ClickOutsideHandler>
        );
    }
}

NodeBox.propTypes = {
    node: PropTypes.object.isRequired,
    addNew: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    editNode: PropTypes.func.isRequired,
    editingNodeId: PropTypes.number.isRequired,
    changeEditingNodeId: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired
}

class ClickOutsideHandler extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.props.action) {
            this.props.action(-1);
        }
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className="inline-block">
                {this.props.children}
            </div>
        );
    }
}

ClickOutsideHandler.propTypes = {
    children: PropTypes.element.isRequired,
    action: PropTypes.func
}

export default OrgChart;