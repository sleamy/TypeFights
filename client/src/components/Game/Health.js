import React from 'react'

function Health(props) {

    if (props.playerNumber === 0) {
        return (
            <div key="health" id="health" className="col-md-8">
                <div id="enemyHealth" ></div>
                <div id="playerHealth" style={{ width: `${props.health + 50}%` }}></div>
            </div>)
    } else {
        return (
            <div key="health" id="health" className="col-md-8">
                <div id="enemyHealth" ></div>
                <div id="playerHealth" style={{ width: `${-props.health + 50}%` }}></div>
            </div>
        )
    }
}

export default Health;