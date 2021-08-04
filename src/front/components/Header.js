import React, { Component } from 'react';
import Search from './Search/Search';

export default class Header extends Component {
    render() {
        return (
            <div>
                <nav className="flex items-center justify-between flex-wrap bg-gray-600 p-6 shadow-2xl mb-8">
                    <a href="/">
                        <div className="flex items-center flex-no-shrink text-white mr-6">
                            <svg className="h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
                            <span className="font-semibold text-xl tracking-tight">Home Library</span>
                        </div>
                    </a>
                    <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                        <div className="text-sm lg:flex-grow mr-4">
                            <Search></Search>
                        </div>
                        <div>
                            <a href="/searchfts" className="mx-2 inline-block text-sm px-4 py-2 leading-none border rounded text-green-400 border-green-400 hover:border-transparent hover:text-teal hover:bg-green-800 mt-4 lg:mt-0">Search Book Content</a>
                        </div>
                        <div>
                            <a href="/add" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0">Add Book</a>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
