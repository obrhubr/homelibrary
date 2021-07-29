import React, { Component, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import BookAdd from '../../components/Books/BookAdd';
import axios from 'axios';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

export default function BookEdit() {
    const router = useRouter();
    const { slug } = router.query;

    const [appState, setAppState] = useState({
        loading: true,
        book: undefined,
    });

    const [errorState, setErrorState] = useState({
        error: false,
        errorMessage: "",
    });

    const [editErrorState, setEditErrorState] = useState({
        error: false,
        errorMessage: "",
    });

    async function onSubmit(e) {
        e.preventDefault();

        const form = document.getElementById('form');

        await fetch(form.action, {
            'method': 'POST',
            'body': new FormData(form)
        }).then(res => {
            if(res.status == 200) {
                window.location.replace('/');
            };
            return res.json();
        }).then(data => {
            setEditErrorState({ error: true, errorMessage: data.error })
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/get/' + window.location.pathname.split('/')[2];
    
        axios.get(URL).then(res => {
            setAppState({ book: res.data, loading: false });
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

    return(
        <>
        <Header></Header>

        {!appState.loading || appState.books ?
            <div className="flex flex-col items-center justify-center">
                <div>
                    <form id="form" encType="multipart/form-data" method="POST" action={'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/edit/' + slug}>
                        <BookAdd title={appState.book.title} author={appState.book.author} description={appState.book.description} keywords={appState.book.keywords}></BookAdd>

                        <div className="flex items-center justify-between">
                            <input onClick={onSubmit} defaultValue="Edit" className="bg-green-400 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit"/>
                            <a className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800" href="/">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>

                <div className="mt-8">
                    {appState.error ?
                        <div className="border border-red-600 rounded-lg border-2 w-80 border-dashed">
                            <div className="min-w-full flex justify-center text-red-600">
                                <Error message={editErrorState.errorMessage}></Error>
                            </div>
                        </div>
                    :
                        <></>
                    }
                </div>
            </div>
        :
            <div className="min-h-full">
                <>
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
                </>
            </div>
        }

        <Footer></Footer>
        </>
    )
}