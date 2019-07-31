import React, { Component } from 'react'

class Redirect extends Component {

    componentDidMount() {
        this.props.history.push('/fight')
    }

    render() {
        return (
            <div>
                Loading...
            </div>
        )
    }
}

export default Redirect