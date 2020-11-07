import React from 'react';
import '../App.css';
import LoginForm from '../components/LoginForm'
function Login() {
  return (
    <div className="App">
      <div>
        <h1 className = "home-text">Login</h1>
        <LoginForm/>
      </div>
    </div>
  );
}

export default Login;
