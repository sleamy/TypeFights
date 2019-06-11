import React from 'react'

function GameOver(props) {

    if((props.ended && props.playerNumber === 0 && props.health >= 50) ||
        (props.ended && props.playerNumber === 1 && props.health <= -50)) {
        return (<div>Winner</div>)
    } else if(props.ended) {
        return (<div>Loser</div>)
    } else {
        return null
    }
}

export default GameOver;