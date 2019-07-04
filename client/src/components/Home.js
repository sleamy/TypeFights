import React, { Component } from 'react'
import LeaderBoard from './LeaderBoard'
import axios from 'axios'

class Home extends Component {

    render() {
        return (
            <div className="container">
                Start a fight
                <button>Fight!</button>
                <LeaderBoard />
            </div>
        )
    }
}

export default Home;
