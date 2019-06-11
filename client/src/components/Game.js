import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import trophy from '../images/trophy.png'
import FindingOpponent from './Game/FindingOpponent'
import Health from './Game/Health'
import GameOver from './Game/GameOver'
import './Game.css'

class Game extends Component {

    constructor(props) {
        super(props)

        this.selector = React.createRef() // ref for current word element

        this.state = {
            words: [],
            wordsCorrect: [],
            currentWord: '',
            wordsTyped: 0,
            topHeight: 0,
            wordsHidden: 0,
            input: '',
            socket: null,
            roomName: '',
            room: {},
            playerNumber: 0,
            outcome: null,
            opponent: null,
            searching: true
        }
    }

    componentDidMount() {

        // Socket.io
        this.setState({ socket: io('http://localhost:5000') }, () => {
            this.state.socket.emit('playerConnected', this.props.auth.user)

            this.state.socket.on('allConnected', (data) => {
                console.log('All players connected to room')
                console.log(data.room)
                this.setState({ room: data.room, words: data.room.words, currentWord: data.room.words[0], searching: false }, () => {
                    if (this.state.socket.id === data.room.players[0].id) {
                        console.log(data.room.players)
                        this.setState({ playerNumber: 0, opponent: data.room.players[1].user })
                    } else {
                        this.setState({ playerNumber: 1, opponent: data.room.players[0].user })
                    }
                })
            })

            this.state.socket.on('updateRoom', data => {
                this.setState({ room: data.room }, () => {
                })
            })
        })

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => {
            let lastTyped = this.state.input.charAt(this.state.input.length - 1)
            if (lastTyped === ' ') {
                this.submitTyped(this.state.input.trim())
            }
        })
    }

    submitTyped(word) {

        // Check if word typed is the same as the current word
        if (word === this.state.currentWord) {
            // Correct
            this.setState({
                wordsCorrect: [...this.state.wordsCorrect, 'correct'],
                health: this.state.health + word.length > 100 ? 100 : this.state.health + word.length
            })
        } else {
            // Incorrect
            this.setState({ wordsCorrect: [...this.state.wordsCorrect, 'incorrect'] })
        }

        this.state.socket.emit('wordTyped', ({ playerId: this.state.socket.id, roomName: this.state.room.id, typed: word, wordToType: this.state.currentWord }))

        this.setState((state, props) => ({
            input: '',
            wordsTyped: state.wordsTyped + 1,
            currentWord: state.words[state.wordsTyped + 1],
        }), () => {
            let rect = this.selector.current.getBoundingClientRect()
            if (rect.y !== this.state.topHeight) {
                if (this.state.wordsTyped === 1) {
                    this.setState({ topHeight: rect.y })
                } else {
                    this.setState({ wordsHidden: this.state.wordsTyped })
                }

            }
        })

    }

    render() {

        const { user } = this.props.auth;


        // TODO: Create word elements
        const wordEls = []

        for (let i = 0; i < this.state.words.length; i++) {
            if (i === this.state.wordsTyped) {
                wordEls.push(
                    <div key={"word_" + i} id={"word_" + i} ref={this.selector} className="word currentWord">
                        {this.state.words[i]}
                    </div>
                )
            } else {
                if (i < this.state.wordsHidden) {
                    wordEls.push(
                        <div key={"word_" + i} id={"word_" + i} className={"word " + this.state.wordsCorrect[i]} hidden>
                            {this.state.words[i]}
                        </div>
                    )
                } else {
                    wordEls.push(
                        <div key={"word_" + i} id={"word_" + i} className={"word " + this.state.wordsCorrect[i]}>
                            {this.state.words[i]}
                        </div>
                    )
                }
            }
        }

        if (this.state.searching) {
            return (<FindingOpponent searching={this.state.searching} />)
        } else if (this.state.room.ended) {
            return (<GameOver players={this.state.room.players} winner={this.state.room.winner} />)
        } else {

            return (
                <div className="container">
                    <span>{this.state.playerNumber}</span>
                    <div className="row justify-content-md-center">
                        <div id="playerInfo" className="col-md-8">
                            <div id="playerOne">
                                <div className="row justify-content-start">
                                    <h5 id="playerOneName">{user.username}</h5>
                                </div>
                                <div className="row justify-content-start">
                                    <img className="icon" alt="trophy" src={trophy} />
                                    <h6 id="playerOneRating">{user.rating}</h6>
                                </div>
                            </div>
                            <div id="playerTwo">
                                <div className="row justify-content-end">
                                    <h5 id="playerTwoName">{this.state.opponent ? this.state.opponent.username : 'Opponent'}</h5>
                                </div>
                                <div className="row justify-content-end">
                                    <h6 id="playerTwoRating">{this.state.opponent ? this.state.opponent.rating : 1000}</h6>
                                    <img className="icon" alt="trophy" src={trophy} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <Health health={this.state.room.health} playerNumber={this.state.playerNumber} />
                    </div>
                    <div className="row justify-content-md-center">
                        <div id="wordsToType" className="col-md-8">
                            {wordEls}</div>
                    </div>
                    <div className="row justify-content-md-center">
                        <input id="wordInput" className="col-md-8" type="text" name="input" onChange={this.onChange} value={this.state.input} disabled={this.state.room.ended} />
                    </div>
                </div>
            )
        }
    }
}


Game.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(Game)
