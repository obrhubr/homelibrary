import React, { Component } from 'react';
import BookdescriptionKeywords from './BookDescriptionKeywords';

export default class Bookdescription extends Component {
    render() {
        return (
            <div>
                <p className="my-1">by {this.props.author}, </p>
                <p className="my-1">uploaded
                        {" " + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(this.props.time)) +
                        " - " + new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(this.props.time)) +
                        " - " + new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(this.props.time))}
                </p>
                <div className="my-1">
                    <p>
                        {this.props.description}
                    </p>
                </div>
                <BookdescriptionKeywords keywords={this.props.keywords}></BookdescriptionKeywords>
                <p className="my-1 flex justify-center">
                    <a className="bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-1" href={"http://localhost:4000/" + this.props.filepath}>
                        Download
                    </a>
                </p>
            </div>
        )
    }
}
