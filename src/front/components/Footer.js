import React, { Component } from 'react';

export default class Footer extends Component {
    render() {
        return (
            <div>
                <footer className="footer bg-white relative pt-1 border-b-2 border-gray-600">
                    <div className="container mx-auto px-6">
                    </div>
                    <div className="container mx-auto px-6">
                        <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
                            <div className="sm:w-2/3 text-center py-6">
                                <p className="text-sm text-gray-600 font-bold mb-2">
                                    © 2021 Niklas Oberhuber
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}
