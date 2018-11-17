import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from './history';
import App from './App';
import Auth from './Services/Auth';
import Callback from './Components/Callback';
// import Home from './Components/Home';
import Error from './Components/Error';
import Login from './Components/Login';
import Users from './Components/Users';

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};


// const index = () => <h2>Home</h2>;
// const create = () => <h2>Create Profile</h2>;
// const myProfile = () => <h2>My Profile</h2>;
// const users = () => <h2>Users</h2>;
// const logout = () => <h2>Logout</h2>;

export const AppRouter = () => (
  <Router history={history}>
    <Switch>

      <Route path="/" exact render={(props) => <App auth={auth} {...props} />} />
      <Route path="/login" render={(props) => <Login auth={auth} {...props} /> } />
      <Route path="/users" render={(props) => <Users auth={auth} {...props} /> } />
      <Route path="/callback" render={(props) => {
        handleAuthentication(props);
        return <Callback {...props} />
      }}/>
      <Route render={() => <Error /> }/>
    </Switch>
  </Router>
);
