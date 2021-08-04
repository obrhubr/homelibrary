import React, { Component, useEffect, useState, useRef, useCallback } from 'react';
import Bookcardlist from '../components/Books/Bookcardlist';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Error from '../components/Error';
import useFetch from '../hooks/useFetch';

export default function Home() {
    const [page, setPage] = useState(0);
    const { loading, error, list } = useFetch(page);
    var loader = useRef(null);

    const handleObserver = useCallback((entries) => {
        console.log(entries[0]);
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => prev + 1);
        }
    }, []);
    
    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        console.log(loader.current);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    return (
        <>
        <Header></Header>

        <div className="min-h-full">
            <>
                <div className="min-h-full flex justify-center">
                    <Bookcardlist data={list}></Bookcardlist>
                </div>
                <div ref={loader} className="m-4">
                    <Loading></Loading>
                </div>

                <>
                    <div className="min-h-full flex justify-center flex-col">
                        {error ?
                            <div className="flex justify-center mt-8">
                                <div className="border-red-600 rounded-lg border-2 w-80 border-dashed">
                                    <div className="min-w-full flex justify-center text-red-600">
                                        <Error message={"An Error has occured while loading..."}></Error>
                                    </div>
                                </div>
                            </div>
                        :
                            <div>
                            </div>
                        }
                    </div>
                </>
            </>
        </div>

        <Footer></Footer>
        </>
    )
}