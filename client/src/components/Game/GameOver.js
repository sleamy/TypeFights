import React from 'react';

function GameOver(props) {

    return (
        <div>
            <div>{props.players[props.winner].user.username} wins</div>
            <div>{props.rematch && "Your opponent wants a rematch"}</div>
            <button onClick={props.handleRematch}>Rematch</button>
        </div>
    )
}

export default GameOver;