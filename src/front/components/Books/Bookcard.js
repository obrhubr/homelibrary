import React, { Component } from 'react';
import Bookdescription from './Bookdescription';
import Bookimage from './Bookimage';

export default class Bookcard extends Component {
    render() {
        return (
            <div className="m-2 min-w-full">
                <div className="hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col">
                        <div className="my-1">
                            <div className="sr-only">Title</div>
                            <div className="text-gray-700 text-5xl font-medium">
                                <a href={'/books/' + this.props.id}>
                                    {this.props.title}
                                </a>
                            </div>
                        </div>
                        <div className="my-1">
                            <div className="sr-only">Description</div>
                            <div className="text-lg sm:mb-4 lg:mb-0 xl:mb-4 font-normal text-gray-700">
                                <Bookdescription
                                    author={this.props.author}
                                    time={this.props.time}
                                    keywords={this.props.keywords}
                                    description={this.props.description}
                                    filepath={this.props.filepath}
                                ></Bookdescription>
                            </div>
                        </div>
                        <div className="my-1 flex justify-center">
                            <div className="sr-only">Image</div>
                            <div className="flex justify-center sm:justify-start lg:justify-end xl:justify-start -space-x-2">
                                <a href={'/books/' + this.props.id}>
                                    <Bookimage image={this.props.image}></Bookimage>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}