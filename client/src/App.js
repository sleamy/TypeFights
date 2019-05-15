import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'

import { Provider } from 'react-redux'
import store from './store'
import './App.css';

import Navbar from './components/Navbar'
import Home from './components/Home'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Game from './components/Game'

// Check for token
if(localStorage.fighterToken) {
    // Set auth token header auth
    setAuthToken(localStorage.fighterToken)
    // Decode token and get user info and exp
    const decoded = jwt_decode(localStorage.fighterToken)
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded))

    // TODO: change to refresh token
    // Check for expired token
    const currentTime = Date.now() / 1000
    if(decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser())
        // redirect to login
        window.location.href = '/login'
    }
}

class App extends Component {
    
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Route exact path="/" component={Home} />
                        <div className="container">
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/fight" component={Game}/>
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
