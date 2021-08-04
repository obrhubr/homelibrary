import React from 'react';

export default function FTSResults(props) {
    const handleClick = (e) => {
        window.location.replace('/books/' + e.target.id);
    }

    return (
        <div>
            {props.results !== undefined || props.results.length == 0 ?
                props.results.map((item, index) => {
                    return (
                        <div className="hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200 my-2" key={index}>
                            <div className="flex flex-row">
                                <div>
                                    <span className="text-gray-600">In </span>
                                    <button className="cursor-pointer" id={item.bookId} onClick={handleClick}>{item.bookName}</button>
                                </div>
                            </div>
                            <div className="flex text-gray-600 italic">
                                {item.periText}
                            </div>
                        </div>
                    )
                })
            :   <>
                    No Results
                </>
            }
        </div>
    )
}
