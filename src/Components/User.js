import React, { Component } from 'react';
import EditableInput from './editableInput';
import EditableTextArea from './editableTextArea';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import zuck from '../zuck.jpg';
import logo from '../logo.svg';

class User extends Component {

  state = { email: null, username: null, description: null, pictureUrl: null, id: null, editingName: false, editingDescription: false, redirectToUsers: false };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const userId = this.props.location.pathname.split('users/').pop();
    axios({
      method: 'get',
      url: `/users/${userId}`
    }).then(res => {
      console.log('ressponse on get id from front', res);
      const { email, username, pictureUrl, description, _id } = res.data.user;
      this.setState({ email, pictureUrl, username, description, id: _id });
    }).catch(err => {
      console.log('err', err);
    });
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  updateUser = () => {
    const { id, username, pictureUrl, description, email } = this.state;

    console.log('pictureUrl', pictureUrl);
    const userModel = { username, description, pictureUrl, email };
    console.log('userModel', userModel);
    axios({
      method: 'put',
      url: `/users/${id}`,
      data: userModel
    }).catch(err => {
      console.log('err', err);
      //error notification
    });
  }

  navigateToUsers = () => {
    this.setState({redirectToUsers: true});
  }

  editName = () => {
    this.setState({editingName: true});
  }

  editDescription = () => {
    this.setState({editingDescription: true});
  }

  closeEdit = () => {
    this.setState({editingName: false});
  }

  handleChange = (e) => {
    this.setState({username: e.target.value});
  }

  handleDescriptionChange = (e) => {
    this.setState({description: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({editingName: false});
    this.updateUser();
  }

  handleDescriptionSubmit = (e) => {
    e.preventDefault();
    this.setState({editingDescription: false});
    this.updateUser();
  }

  onImageSelect = (fileList) => {
    const img = fileList[0];
    const userId = this.state.id;
    console.log('id', userId);
    const s3SignedUrlRoute = `/users/${userId}/image`;
    axios({
      method: 'get',
      url: `${s3SignedUrlRoute}?file_name=${img.name}&file_type=${img.type}`,
      data: 'json'
    }).then(res => {
      console.log('resPONSE', res);
      this.uploadToS3(img, res.data.signed_request, res.data.url);
      //error notification
    }).catch(err => {
      console.log('error retrieving signed_request', err);
    });
  }

  uploadToS3 = (img, signed_request, url) => {
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.send(img);
    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('url', url);
        this.setState({pictureUrl: url});
        this.updateUser();
      }
    };
    xhr.onerror = (err) => {
      console.log('err uploading to S3', err);
    };
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const pictureUrl = this.state.pictureUrl;

    if (this.state.redirectToUsers) {
      return <Redirect to='/'/>
    } else {
      return (
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"></img>
            <nav>
              <button className="btn btn-primary mr-3" onClick={() => this.navigateToUsers() }>Browse Users</button>
              <button className="btn btn-primary" onClick={ () => this.logout() }>Log Out</button>
            </nav>
          </header>
          <div className="row text-center main-section align-items-center">
            <div className="col-md-6 col-sm-12 text-center d-flex flex-column justify-content-between">
              {
                this.state.pictureUrl ? (
                  <div className="mb-5">
                    <img src={pictureUrl}></img>
                  </div>
                ) : (
                  <div className="mb-5 file-input-container">
                    <img src={zuck}></img>
                    <h1>Upload a Photo</h1>
                    <input type="file" className="d-inline-block text-right" accept="image/*" onChange={(e) => this.onImageSelect(e.target.files)} />
                  </div>
                )
              }

              {
                this.state.username ? (
                  <h1 className="d-inline-block mr-3 mt-5">{this.state.username}</h1>
                ) : (
                  <div className="mt-5">
                    <h1>Enter a Username</h1>
                      <EditableInput
                        editing={this.state.editingName}
                        value={this.state.username}
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                      />
                  </div>
                )
              }

              {
                this.state.editingName ?
                  ( <div>
                      <EditableInput
                        editing={this.state.editingName}
                        value={this.state.username}
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                      />
                    </div>
                  ) : this.state.username && (
                    ( <p className="d-inline-block pointer" onClick={() => this.editName() }><i className="fa fa-pencil fa-lg"></i></p> )
                  )
              }

            </div>

            <div className="col-md-6 col-sm-12 text-center d-flex flex-column justify-content-betwen about-section">

              {
                this.state.editingDescription ? (
                  <div>
                      <EditableTextArea
                        editing={this.state.editingDescription}
                        description={this.state.description}
                        handleSubmit={this.handleDescriptionSubmit}
                        handleChange={this.handleDescriptionChange}
                      />
                    </div>
                ) : (
                  this.state.description ? (
                    <div>
                      <h2>About Me</h2>
                      <h1 className="d-inline-block mr-3">{this.state.description}</h1>
                      <p className="d-inline-block pointer" onClick={() => this.editDescription() }><i className="fa fa-pencil fa-lg"></i></p>
                    </div>
                  ) : (
                    <div>
                      <h1>Tell us about yourself</h1>
                      <EditableTextArea
                        editing={this.state.editingDescription}
                        description={this.state.description}
                        handleSubmit={this.handleDescriptionSubmit}
                        handleChange={this.handleDescriptionChange}
                      />
                    </div>
                  )

                )
              }
            </div>
          </div>

          <footer className="text-center w-100">Use the <i className="fa fa-pencil"></i> to edit your profile</footer>

        </div>
      )
    }

  }
}

export default User;
