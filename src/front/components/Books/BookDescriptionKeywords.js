import React, { Component } from 'react'

export default class BookDescriptionKeywords extends Component {
    render() {
        return (
            <div className="flex flex-wrap my-1">
                {this.props.keywords !== undefined ?
                    this.props.keywords.split(',').map((item, index) => {
                        return (
                            <div key={index} className="bg-green-400 text-white font-semibold rounded-lg shadow-md px-2 py-1 mr-2 my-2">
                                {item}
                            </div>
                        )
                    })
                :   <>
                        
                    </>
                }
            </div>
        )
    }
}
