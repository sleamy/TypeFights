import React, { Component } from 'react';
import trophy from '../../images/trophy.png'
import './GameOver.css'

class GameOver extends Component {

    render() {

        const { players, playerNum, oppNum, winner, rematch, ranked } = this.props;

        let playerRatingGainEl, opponentRatingGainEl;

        if (winner === playerNum) {
            playerRatingGainEl = (<h6 className="green rating-gain">(+{players[playerNum].recentElo})</h6>)
            opponentRatingGainEl = (<h6 className="red rating-gain">({players[oppNum].recentElo})</h6>)
        } else {
            playerRatingGainEl = (<h6 className="red rating-gain">({players[playerNum].recentElo})</h6>)
            opponentRatingGainEl = (<h6 className="green rating-gain">(+{players[oppNum].recentElo})</h6>)
        }

        let playerInfoEl;

        if (ranked) {
            playerInfoEl = (<div className="player-info-container">

                <div id="player-one-info">
                    <h5 className="capitalize">{players[playerNum].user.username}</h5>
                    <div className="player-rating-flexbox">
                        <img className="icon" alt="trophy" src={trophy} />
                        <h6>{players[playerNum].user.rating}</h6>
                        {playerRatingGainEl}
                    </div>

                </div>
                <div id="player-two-info">
                    <h5 className="capitalize">{players[oppNum].user.username}</h5>
                    <div className="player-rating-flexbox">
                        {opponentRatingGainEl}
                        <h6>{players[oppNum].user.rating}</h6>
                        <img className="icon" alt="trophy" src={trophy} />
                    </div>
                </div>
            </div>)
        }

        return (
            <div className="game-over-container">
                <div className="winner capitalize">{players[winner].user.username} wins</div>
                {playerInfoEl}
                <div className="rematch-message">{rematch && "Your opponent wants a rematch"}</div>
                <div className="buttons">
                    <button onClick={this.props.handleRematch}>Rematch</button>
                    <button onClick={this.props.handleNewMatch}>New Match</button>
                </div>

            </div>
        )
    }


}

export default GameOver;