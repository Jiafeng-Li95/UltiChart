import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Requests from './Requests';
import './App.css';


function App() {
  return (
    <div>
    <Router>
      <Switch>
        <Route exact path = "/" component={Home}><Home/></Route>
        <Route path = "/login" component={Login}><Login/></Route>
        <Route path = "/requests" component={Requests}><Requests/></Route>
      </Switch>
    </Router>
  </div>
);
}

export default App;

