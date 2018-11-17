import React, { Component } from 'react';

class Login extends Component {

  login() {
    this.props.auth.login();
  }

  render() {
    return (
      <div>
        <h4>You are logged out</h4>
        <button className="btn btn-primary" onClick={() => this.login()}>Log In</button>
      </div>
    )
  }

}


export default Login;
