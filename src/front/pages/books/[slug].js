import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BookDescriptionKeywords from '../../components/Books/BookDescriptionKeywords';
import Bookimage from '../../components/Books/Bookimage';
import axios from 'axios';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import SearchFTS from '../../components/Search/SearchFTS';

export default function Book() {
    var router = useRouter();
    var { slug } = router.query;

    const [appState, setAppState] = useState({
        loading: true,
        book: undefined,
    });

    const [errorState, setErrorState] = useState({
        error: false,
        errorMessage: "",
    });

    useEffect(() => {
        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/get/' + window.location.pathname.split('/')[2];
        console.log(URL);
    
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

    return(
        <>
        <Header></Header>

        {!appState.loading || appState.books ?
            <div className="">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col w-1/2">
                        <div className="mb-4 flex justify-center">
                            <div className="block text-gray-700 text-sm font-bold mb-2">
                                <Bookimage image={appState.book.image}></Bookimage>
                            </div>
                        </div>

                        <div className="mb-1">
                            <div className="block text-gray-700 text-2xl mb-2">
                                <span className="font-bold">{appState.book.title}</span> by {appState.book.author}
                            </div>
                        </div>

                        <div className="mb-1">
                            <div className="block text-gray-700 text-sm font-bold mb-2">
                                <BookDescriptionKeywords keywords={appState.book.keywords}></BookDescriptionKeywords>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="block text-gray-700 text-lg mb-2">
                                {appState.book.description}
                            </p>
                        </div>

                        <div className="mb-4">
                            <div className="block text-gray-700 text-lg mb-2">
                                <SearchFTS path="one" bookid={window.location.pathname.split('/')[2]}></SearchFTS>
                            </div>
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <a href={'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + appState.book.filepath} className="block bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Download
                            </a>
                        </div>

                        <div className="flex items-center justify-between">
                            <form id="form" action={'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/remove/' + slug} method="POST">
                                <input onClick={onSubmit} defaultValue="Delete" className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit"/>
                            </form>
                            
                            <a className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800" href={"/edit/" + slug}>
                                Edit
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        :
            <div className="min-h-full">
                <>
                    {errorState.error ?
                        <div className="flex justify-center mt-8">
                            <div className="border-red-600 rounded-lg border-2 w-80 border-dashed">
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