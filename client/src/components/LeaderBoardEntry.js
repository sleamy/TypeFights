import React from 'react'

export default function LeaderBoardEntry(props) {

    return (
        <tr>
            <td>{props.rank}</td>
            <td>{props.user.username}</td>
            <td>{props.user.fights}</td>
            <td>{props.user.wins}</td>
            <td>{Math.round(props.user.wins / props.user.fights * 100)}</td>
            <td>{props.user.rating}</td>
        </tr>
    )
}
