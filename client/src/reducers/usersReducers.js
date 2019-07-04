import { GET_LEADERBOARD } from '../actions/types'

const initialState = {
    users: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LEADERBOARD:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}