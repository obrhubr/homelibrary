import React, { Component } from 'react';
import BookFileUpload from './BookFileUpload';
import BookDescriptionFields from './BookDescriptionFields';

export default class BookAdd extends Component {
    render() {
        return (
            <>
                <BookFileUpload></BookFileUpload>
                
                <BookDescriptionFields title={this.props.title} author={this.props.author} description={this.props.description} keywords={this.props.keywords}></BookDescriptionFields>
            </>
        )
    }
}
