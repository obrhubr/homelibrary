import React, { Component } from 'react'

export default class Bookimage extends Component {
    render() {
        return (
            <div className="">
                <img className="rounded-lg max-h-sm max-w-lg" src={"http://localhost:4000/" + this.props.image}/>
            </div>
        )
    }
}
