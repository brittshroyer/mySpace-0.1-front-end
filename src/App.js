import React, { Component } from 'react';
import Home from './Components/Home';
import { Redirect } from 'react-router-dom';
import Auth from './Services/Auth';
import './App.css';

class App extends Component {

  render() {
    const { isAuthenticated } = this.props.auth;
    const auth = new Auth();
    return (
      <div>
        {
          isAuthenticated() ? (
            <Home auth={auth} />
          ) : (
            <Redirect to={{pathname:'/login'}} />
          )
        }
      </div>
    );
  }
}

export default App;
