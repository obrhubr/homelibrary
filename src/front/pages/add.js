import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import BookAdd from '../components/Books/BookAdd';
import Error from '../components/Error';

export default function Post() {
    const router = useRouter();

    const [appState, setAppState] = useState({
        error: false,
        errorMessage: ""
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
                return {'error': null}
            };
            return res.json();
        }).then(data => {
            if(data.error != null) {
                setAppState({ error: true, errorMessage: data.error })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    return(
        <>
        <Header></Header>

        <div className="flex flex-col items-center justify-center">
            <div>
                <form id="form" encType="multipart/form-data" method="POST" action={'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/add'}>
                    <BookAdd image="" title="" author="" time="" description="" keywords={[]}></BookAdd>

                    <div className="flex items-center justify-between">
                        <input onClick={onSubmit} defaultValue="Add" className="bg-green-400 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit"/>
                        <a className="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800" href="/">
                            Cancel
                        </a>
                    </div>
                </form>
            </div>

            <div className="mt-8">
                {appState.error ?
                    <div className="border-red-600 rounded-lg border-2 w-80 border-dashed">
                        <div className="min-w-full flex justify-center text-red-600">
                            <Error message={appState.errorMessage}></Error>
                        </div>
                    </div>
                :
                    <></>
                }
            </div>
        </div>

        <Footer></Footer>
        </>
    )
}