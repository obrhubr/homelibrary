import React, { Component, useEffect, useState } from 'react';
import Bookcardlist from '../components/Books/Bookcardlist';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Home() {
    const [appState, setAppState] = useState({
        loading: true,
        books: undefined,
    });

    const [errorState, setErrorState] = useState({
        error: false,
        errorMessage: "",
    });
    
    useEffect(() => {
        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/all';
    
        axios.get(URL).then(res => {
            setAppState({ books: res.data, loading: false });
        })
        .catch(error => {
            if(error.response) {
                if(error.response.status == 500) {
                    setErrorState({ error: true, errorMessage: error.response.data.error });
                }
            }
            console.log(error);
        });
    }, [setAppState]);

    return (
        <>
        <Header></Header>

        <div className="min-h-full">
            {!appState.loading || appState.books ?
                <div className="min-h-full flex justify-center">
                    <Bookcardlist data={appState.books}></Bookcardlist>
                </div>
            :   
                <>
                    <div className="min-h-full flex justify-center flex-col">
                        {errorState.error ?
                            <div className="flex justify-center mt-8">
                                <div className="border border-red-600 rounded-lg border-2 w-80 border-dashed">
                                    <div className="min-w-full flex justify-center text-red-600">
                                        <Error message={errorState.errorMessage}></Error>
                                    </div>
                                </div>
                            </div>
                        :
                            <Loading></Loading>
                        }
                    </div>
                </>
            }
        </div>

        <Footer></Footer>
        </>
    )
}