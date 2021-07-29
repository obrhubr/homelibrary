import React, { Component } from 'react';
import Bookcard from './Bookcard';

export default class Bookcardlist extends Component {
    render() {
        return (
            <div className="flex flex-col items-center justify-center flex-nowrap w-1/2">
                {this.props.data !== undefined ?
                    this.props.data.map((item, index) => {
                        return (
                            <Bookcard 
                                key={index}
                                id={item.id}
                                image={item.image}
                                title={item.title}
                                author={item.author}
                                time={item.time}
                                keywords={item.keywords}
                                filepath={item.filepath}
                                description={item.description}
                            ></Bookcard>
                        )
                    })
                :   <>
                        No Books
                    </>
                }
            </div>
        )
    }
}
