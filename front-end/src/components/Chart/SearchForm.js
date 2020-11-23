import React from 'react';
import axios from 'axios';
import { Form, ListGroup, InputGroup } from 'react-bootstrap'
import onClickOutside from 'react-onclickoutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../../App.css';

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            data: [],
            input: "",
            
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            input: value
        });
        if (value.length === 0) {
            this.setState({ data: [] })
        }
        else {
            axios.get('/search/' + value)
                .then(function (response) {
                    this.setState({ data: response.data.matched_employees })
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    handleClickOutside = () => {
        this.setState({ data: [] })
    }

    clickItem(email) {

        localStorage.setItem("curRoot", email)
        window.location.replace("/");
    }

    render() {
        return (
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
                        <ListGroup.Item action onClick = {() => this.clickItem(obj.email)} className = "listitem py-0">{obj.firstName + " " + obj.lastName}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        )
    }
}

export default onClickOutside(SearchForm); 