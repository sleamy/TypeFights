import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import trophy from '../images/trophy.png'
import './Game.css'

class Game extends Component {

    constructor(props) {
        super(props)

        this.state = {
            words: ['Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing', 'Sean', 'Leamy', 'is', 'typing',],
            wordsCorrect: [],
            currentWord: 'Sean',
            wordsTyped: 0,
            input: '',
            socket: null
        }
    }

    componentDidMount() {

        this.setState({socket: io('http://localhost:5000')})
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

        if (word === this.state.currentWord) {
            this.setState({ wordsCorrect: [...this.state.wordsCorrect, 'correct'] })
        } else {
            this.setState({ wordsCorrect: [...this.state.wordsCorrect, 'incorrect'] })
        }

        this.setState((state, props) => ({
            input: '',
            wordsTyped: state.wordsTyped + 1,
            currentWord: state.words[state.wordsTyped + 1]
        }))
    }

    render() {

        const { isAuthenticated, user } = this.props.auth;

        const wordEls = []

        for (let i = 0; i < this.state.words.length; i++) {
            if (i === this.state.wordsTyped) {
                wordEls.push(
                    <div key={"word_" + i} id={"word_" + i} className="word currentWord">
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

        return (
            <div className="container">
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
                                <h5 id="playerTwoName">Opponent</h5>
                            </div>
                            <div className="row justify-content-end">
                                <h6 id="playerTwoRating">0</h6>
                                <img className="icon" alt="trophy" src={trophy} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div id="health" className="col-md-8">
                        <div id="playerHealth"></div>
                        <div id="enemyHealth"></div>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div id="wordsToType" className="col-md-8">
                        {wordEls}</div>
                </div>
                <div className="row justify-content-md-center">
                    <input id="wordInput" className="col-md-8" type="text" name="input" onChange={this.onChange} value={this.state.input} />
                </div>
            </div>
        )
    }
}


Game.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(Game)
