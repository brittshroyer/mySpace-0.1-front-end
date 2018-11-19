import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from './history';
import App from './App';
import Auth from './Services/Auth';
import Loading from './Components/Loading';
import User from './Components/User';
import Error from './Components/Error';
import Login from './Components/Login';
import Users from './Components/Users';

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact render={(props) => <App auth={auth} {...props} />} />
      <Route path="/login" render={(props) => <Login auth={auth} {...props} /> } />
      <Route path="/users" exact render={(props) => <Users auth={auth} {...props} /> } />
      <Route path="/users/:id" render={(props) => <User auth={auth} {...props} /> } />
      <Route path="/loading" render={(props) => {
        handleAuthentication(props);
        return <Loading {...props} />
      }}/>
      <Route render={() => <Error /> }/>
    </Switch>
  </Router>
);
