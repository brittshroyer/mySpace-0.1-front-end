import React, { Component } from 'react';

import logo from '../zuck.jpg';

class Home extends Component {

  state = { profile: {} };

  componentDidMount() {

    const emailPromise = new Promise((resolve, reject) => {
      const { userProfile, getProfile } = this.props.auth;

      if (!userProfile) {
        getProfile((err, profile) => {
          const email = profile.email;
          resolve(email);
        });
      } else {
        const email = userProfile.email;
        resolve(email);
      }
    });

    emailPromise
      .then(email => {
        console.log('email here', email);
        fetch(`/getUserProfile/${email}`)
          .then(res => res.json())
          .then(userModel => {
            const profile = userModel.user;
            this.setState({profile});
          });
      })
      .catch(err => {
        console.log('err retrieving user', err);
      });

  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"></img>
          <nav>
            <button className="btn btn-primary mr-3">Show Users</button>
            <button className="btn btn-primary" onClick={ () => this.logout() }>Log Out</button>
          </nav>
        </header>
        <div className="row">
          <div className="col-md-6 col-sm-12 text-center">
            <div>
              <p>Pic Here</p>
            </div>
            <h1>{this.state.profile.username}</h1>
          </div>
          <div className="col-md-6 col-sm-12 text-center">
            <p>{this.state.profile.description}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;
