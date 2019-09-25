import React, { Component } from 'react'
import LeaderBoard from './LeaderBoard'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

class Home extends Component {

    componentDidMount() {
    }

    render() {

        if (this.props.auth.isAuthenticated) {
            return (
                <div className="container">
                    <div className="row justify-content-md-center">
                        {/* <button className="home-button-disabled" disabled>Quick Fight <Icon icon={faLock}></Icon></button> */}
                        <Link className="home-button quick" to="/fight">Quick Fight</Link>
                    </div>
                    <div className="row justify-content-md-center">
                        <Link className="home-button quick" to="/ranked">Ranked Fight</Link>
                    </div>
                    <div className="row justify-content-md-center">
                        <button className="home-button-disabled" disabled>Fight a Friend <Icon icon={faLock}></Icon></button>
                    </div>
                    <div className="row justify-content-md-center">
                        <button className="home-button-disabled" disabled>Practice <Icon icon={faLock}></Icon></button>
                    </div>
                    <LeaderBoard />
                </div>
            )
        } else {
            return (
                <div className="container">
                    <div className="row justify-content-md-center">
                        {/* <button className="home-button-disabled" disabled>Quick Fight <Icon icon={faLock}></Icon></button> */}
                        <Link className="home-button quick" to="/fight">Quick Fight</Link>
                    </div>
                    <div className="row justify-content-md-center">
                    <button className="home-button-disabled" disabled>Ranked Fight <Icon icon={faLock}></Icon></button>
                    </div>
                    <div className="row justify-content-md-center">
                        <button className="home-button-disabled" disabled>Fight a Friend <Icon icon={faLock}></Icon></button>
                    </div>
                    <div className="row justify-content-md-center">
                        <button className="home-button-disabled" disabled>Practice <Icon icon={faLock}></Icon></button>
                    </div>
                    <LeaderBoard />
                </div>
            )
        }
    }
}


Home.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(Home)

