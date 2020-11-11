import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Requests from './pages/Requests';
import ProtectedRoute from './components/protections/ProtectedRoute';
import ManagerRoute from './components/protections/ManagerRoute';
import LeftSidebar from './components/Sidebar';
import './App.css';


function App() {
  return (
    <div>
    <Router>
      <ProtectedRoute component={LeftSidebar}/>
      <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute exact={true} path="/" component={Home} />
        <ManagerRoute path="/requests" component={Requests} />
        <ProtectedRoute component={Home} />
      </Switch>
    </Router>
  </div>
);
}

export default App;

