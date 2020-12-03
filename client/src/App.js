import React, { Fragment , useEffect} from 'react';   // these are hooks
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import ProfileForm from './components/profile-forms/ProfileForm';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import PrivateRoute from './components/routing/PrivateRoute';
//Redux:redux and react are both different things so we use provider which use react-redux module which combins both

import { Provider } from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//react class mai life cycle methode hota hi like compotnet mount




if(localStorage.token){
  setAuthToken(localStorage.token);      // so header mai dall diya x-auth-token mai bole toh header mai
}


const App = () =>{
  useEffect(() => {
    store.dispatch(loadUser());
  } , []);
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/Register" component={Register} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={ProfileForm} />
            <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <PrivateRoute exact path="/post/:id" component={Post} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
  )};

export default App;
