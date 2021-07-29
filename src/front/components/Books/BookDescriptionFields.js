import React, { Component } from 'react'

export default class BookDescriptionField extends Component {
    render() {
        return (
            <div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input defaultValue={this.props.title} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Title..." name="title" id="title"/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                        Author
                    </label>
                    <input defaultValue={this.props.author} placeholder="Author..." name="author" id="author" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keywords">
                        Keywords
                    </label>
                    <input defaultValue={this.props.keywords} placeholder="Keywords(seperated by ',' , no spaces before)..." name="keywords" id="keywords" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea defaultValue={this.props.description} name="description" id="description" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
            </div>
        )
    }
}
