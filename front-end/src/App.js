import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './Home'
import Login from './Login'
import Requests from './Requests'
import NavigationBar from './NavigationBar'
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
    return(
    <div>
    <Router>
      <ProtectedRoute component = {NavigationBar}/>
      <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute exact={true} path="/" component={Home} />
        <ProtectedRoute path="/requests" component={Requests} />
        <ProtectedRoute component={Home} />
      </Switch>
    </Router>
  </div>
  );}

export default App;