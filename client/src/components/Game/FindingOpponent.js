import React from 'react'
import loading from '../../images/loading.gif'

function FindingOpponent(props) {
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <img alt="loading spinner" src={loading}></img>
            </div>
            <div className="row justify-content-md-center">
                <h1>Finding Opponent</h1>
            </div>
        </div>
    )
}

export default FindingOpponent;