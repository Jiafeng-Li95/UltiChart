import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Requests from './pages/Requests';
import ProtectedRoute from './components/protections/ProtectedRoute';
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
        <ProtectedRoute path="/requests" component={Requests} />
        <ProtectedRoute component={Home} />
      </Switch>
    </Router>
  </div>
);
}

export default App;

