import React, { Component } from 'react'
import LeaderBoard from './LeaderBoard'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

class Home extends Component {

    render() {
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <button className="home-button" disabled>Quick Fight <Icon icon={faLock}></Icon></button>
                </div>
                <div className="row justify-content-md-center">
                    <Link className="home-button quick" to="/fight">Ranked Fight</Link>
                </div>
                <div className="row justify-content-md-center">
                    <button className="home-button" disabled>Fight a Friend <Icon icon={faLock}></Icon></button>
                </div>
                <div className="row justify-content-md-center">
                    <button className="home-button" disabled>Practice <Icon icon={faLock}></Icon></button>
                </div>
                <LeaderBoard />
            </div>
        )
    }
}

export default Home;
