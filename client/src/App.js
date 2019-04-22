import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import {Provider} from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import store from './store';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { setCurrentUser } from './actions/authAction';

//check is jwtToken exists in localstorage
if(localStorage.jwtToken){
  //if yes, then set current token in httpheader
  setAuthToken(localStorage.jwtToken);
  //decode and dispatch to redux login
  const decoded = jwt_decode(localStorage.jwtToken)

  store.dispatch(setCurrentUser(decoded));

}



class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
        
        <div className="App">
          <Navbar/>
          <Route exact path="/" component={Landing}/>
            <div className="container">
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
            </div>
          <Footer/>
        </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
