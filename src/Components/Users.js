import React, { Component } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import TableRow from './TableRow';

class Users extends Component {

  state = { users: [], redirectLocation: '', userId: '', email: '', profileCreated: false };

  componentWillMount() {
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
        console.log('email', email);
        axios({
          method: 'get',
          url: `/getUserProfile/${email}`,
        }).then(res => {
          console.log('res', res);
          if (res.data.user.email) {
            const { _id, email } = res.data.user;
            console.log('id', _id);
            this.setState({
              userId: _id,
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

  componentDidMount() {
    axios({
      method: 'get',
      url: `/users`,
    })
    .then(users => {
      users = users.data.users;
      console.log('usrs', users);
      this.setState({ users });
    });
  }

  logout() {
    this.props.auth.logout();
  }

  createProfile = () => {
    axios({
      method: 'post',
      url: '/users',
      data: { email: this.state.email }
    }).then(res => {
      const redirectLocation = res.data.user._id;
      this.setState({redirectLocation});
    }).catch(err => {
      console.log('err', err);
    });
  }

  viewMyProfile = () => {
    const userId = this.props.userId;
    this.setState({redirectLocation: userId});
  }

  render() {
    const { redirectLocation } = this.state;
    const users = this.state.users;
    const pees = users.map((user, i) => {
      return <TableRow key={i} username={user.username} description={user.description} pictureUrl={user.pictureUrl} />;
    });
    let userId;
    if (redirectLocation) {
      userId = redirectLocation;
      return <Redirect to={`/users/${userId}`} />;
    }
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"></img>
          <nav>
            {
              this.state.profileCreated ? (
                <button className="btn btn-primary mr-3" onClick={() => this.viewMyProfile() }>My Profile</button>
              ) :
              (
                <button className="btn btn-primary mr-3" onClick={() => this.createProfile() }>Create Profile</button>
              )
            }
            <button className="btn btn-primary" onClick={ () => this.logout() }>Log Out</button>
          </nav>
        </header>

        <div className="row">
          <div className="col-sm-8 offset-sm-2 text-center">
            <h1 className="users-title">Users</h1>
            <table>
              <thead>
                <tr>
                  <td>Username</td>
                  <td>Description</td>
                  <td>Photo</td>
                </tr>
              </thead>
              <tbody>
                {pees}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Users;
