import React from 'react'

function GameOver(props) {

    return (
        <div>
            {props.players[props.winner].user.username} wins
            <button onClick={props.handleRematch}>Rematch</button>
        </div>
    )
}

export default GameOver;