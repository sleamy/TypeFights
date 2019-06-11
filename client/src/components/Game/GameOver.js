import React from 'react'

function GameOver(props) {

    return (
        <div>
            {props.players[props.winner].user.username} wins
        </div>
    )
}

export default GameOver;