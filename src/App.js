import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Users from './Components/Users';
import axios from 'axios';
import './App.css';

class App extends Component {

  state = { existingUser: false, id: '', email: '' };

  componentDidMount() {
    const emailPromise = new Promise((resolve, reject) => {
      const { userProfile, getProfile } = this.props.auth;

      if (!userProfile) {
        getProfile((err, profile) => {
          const email = profile.email;
          this.setState({email});
          resolve(email);
        });
      } else {
        const email = userProfile.email;
        this.setState({email});
        resolve(email);
      }
    });

    emailPromise
      .then(email => {
        axios({
          method: 'get',
          url: `/getUserProfile/${email}`,
          data: 'json'
        }).then(res => {
          console.log('res', res);
          if (res.data.user.email) {
            const { _id, email } = res.data.user;
            console.log('id', _id);
            this.setState({
              id: _id,
              email,
              existingUser: true
            });
          }
          // this.setState({redirectLocation});
        }).catch(err => {
          console.log('err', err);
        });
      });
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {
          isAuthenticated() ? (
            <Redirect to={{pathname:'/Users'}} />
          ) : (
            <Redirect to={{pathname:'/login'}} />
          )
        }
      </div>
    );
  }
}

export default App;
