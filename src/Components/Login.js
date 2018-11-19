import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {

  login() {
    this.props.auth.login();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {
          isAuthenticated() ? (
            <Redirect to={{pathname:'/users'}} />
          ) : (
            <div>
              <h4>You are logged out</h4>
              <button className="btn btn-primary" onClick={() => this.login()}>Log In</button>
            </div>
          )
        }
      </div>
    )
  }

}


export default Login;
