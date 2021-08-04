import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SearchFTS from '../../components/Search/SearchFTS';

export default function Book() {
    var router = useRouter();
    var { slug } = router.query;

    return(
        <>
        <Header></Header>

        <div className="flex justify-center">
            <div className="w-1/2">
                <SearchFTS path="all" bookid={undefined}></SearchFTS>
            </div>
        </div>

        <Footer></Footer>
        </>
    )
}