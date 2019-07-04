import React, { Component } from 'react'
import axios from 'axios'

import LeaderBoardEntry from './LeaderBoardEntry'
import './Leaderboard.css'

class LeaderBoard extends Component {


    constructor(props) {
        super(props)

        this.state = {
            leaderboard: []
        }
    }

    componentDidMount() {
        axios.get('/api/users/leaderboard')
            .then(res => this.setState({ leaderboard: res.data }))
    }

    render() {

        let leaderBoardEntries = []

        this.state.leaderboard.forEach((user, i) => {
            leaderBoardEntries.push(
                <LeaderBoardEntry key={user.id} rank={i+1} user={user} />
            )
        })

        return (
            <div>
                <table id="leaderboard">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Fights</th>
                            <th>Wins</th>
                            <th>Win %</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderBoardEntries}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LeaderBoard