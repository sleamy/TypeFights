import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import FindingOpponent from './Game/FindingOpponent'
import Health from './Game/Health'
import GameOver from './Game/GameOver'
import './Game.css'

class Game extends Component {

    constructor(props) {
        super(props)

        this.selector = React.createRef() // ref for current word element
        this.input = React.createRef() // ref for input

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
            player: {},
            opponent: null,
            searching: true,
            countdown: 0,
            opponentRematch: false,
            ranked: false
        }
    }

    componentDidMount() {

        // Socket.io
        this.setState({ socket: io('http://localhost:5000') }, () => {
            if(this.props.auth.isAuthenticated) {
                this.state.socket.emit('playerConnected', this.props.auth.user)
            } else {
                this.state.socket.emit('playerConnected', 'Guest')
            }
            

            this.state.socket.on('allConnected', (data) => {
                this.setState({
                    room: data.room,
                    words: data.room.words,
                    currentWord: data.room.words[0],
                    searching: false,
                }, () => {
                    if (this.state.socket.id === data.room.players[0].id) {
                        this.setState({ playerNumber: 0, oppNum: 1, opponent: data.room.players[1].user, player: data.room.players[0].user })
                    } else if (this.state.socket.id === data.room.players[1].id) {
                        this.setState({ playerNumber: 1, oppNum: 0, opponent: data.room.players[0].user, player: data.room.players[1].user })
                    }

                    this.timer = setInterval(
                        () => this.tick(),
                        1000
                    );

                })
            })

            this.state.socket.on('updateRoom', data => {
                this.setState({ room: data.room }, () => {
                })
            })

            this.state.socket.on('opponentRematch', data => {
                this.setState({ opponentRematch: true })
            })

            this.state.socket.on('rematch', room => {
                let playerNum, oppNum;
                if (this.state.playerNumber === 0) {
                    playerNum = 0; oppNum = 1;
                } else {
                    playerNum = 1; oppNum = 0;
                }
                this.setState({
                    room: room,
                    words: room.words,
                    currentWord: room.words[0],
                    searching: false,
                    wordsTyped: 0,
                    wordsCorrect: [],
                    wordsHidden: 0,
                    input: '',
                    countdown: 1,
                    opponentRematch: false,
                    player: room.players[playerNum].user,
                    opponent: room.players[oppNum].user
                })

                this.timer = setInterval(
                    () => this.tick(),
                    1000
                );
            })
        })

    }

    tick() {
        this.setState({ countdown: this.state.countdown - 1 }, () => {
            if (this.state.countdown < 0) {
                clearInterval(this.timer)
                this.input.current.focus()
            }
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

    handleRematch(e) {
        e.preventDefault();
        this.state.socket.emit('rematch', { room: this.state.room, playerNumber: this.state.playerNumber })
    }

    handleNewMatch(e) {
        e.preventDefault();
        console.log('new match')
        this.props.history.push('/redirect');
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
            return (<GameOver players={this.state.room.players}
                winner={this.state.room.winner}
                playerNum={this.state.playerNumber}
                oppNum={this.state.oppNum}
                rematch={this.state.opponentRematch}
                ranked={this.state.ranked}
                handleRematch={this.handleRematch.bind(this)}
                handleNewMatch={this.handleNewMatch.bind(this)} />)
        } else {
            return (
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div id="playerInfo" className="col-md-8">
                            <div id="playerOne">
                                <div className="row justify-content-start">
                                    <h5 id="playerOneName" className="capitalize">{this.state.player.username}</h5>
                                </div>
                            </div>
                            <div id="playerTwo">
                                <div className="row justify-content-end">
                                    <h5 id="playerTwoName" className="capitalize">{this.state.opponent ? this.state.opponent.username : 'Opponent'}</h5>
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
                        <input id="wordInput" className="col-md-8" type="text" name="input" ref={this.input} onChange={this.onChange} value={this.state.input} disabled={this.state.room.ended || this.state.countdown >= 0} />
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
