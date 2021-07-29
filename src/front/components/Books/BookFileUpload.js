import React, { Component } from 'react'

export default class BookFileUpload extends Component {
    render() {
        return (
            <div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Ebook
                    </label>  
                    <input type="file" id="file" name="file" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
            </div>
        )
    }
}
