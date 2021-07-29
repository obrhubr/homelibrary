import React, { Component, useEffect, useState } from 'react';
import Bookcardlist from '../../components/Books/Bookcardlist';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import axios from 'axios';
import Loading from '../../components/Loading';

export default function Home() {
    const [appState, setAppState] = useState({
        loading: true,
        books: undefined,
    });
    
    useEffect(() => {
        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/search/search-as-you-type/' + window.location.pathname.split('/')[2];
        const URLgetSingle = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/get/';

        axios.get(URL).then(async (res) => {
            var booksData = [];

            for(var i = 0; i < res.data.values.length; i++) {
                await axios.get(URLgetSingle + res.data.values[i].book_id).then((resultSingle) => {
                    booksData.push(resultSingle.data);
                })
                .catch(error => {
                    console.log(error);
                });
            }

            setAppState({ books: booksData, loading: false });
        })
        .catch(error => {
            console.log(error);
        });
    }, [setAppState]);

    return (
        <>
        <Header></Header>

        {!appState.loading || appState.books ?
            <div className="min-h-full flex justify-center">
                <Bookcardlist data={appState.books}></Bookcardlist>
            </div>
        :
            <div className="min-h-full">
                <Loading></Loading>
            </div>
        }

        <Footer></Footer>
        </>
    )
}