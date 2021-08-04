import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import FTSResults from './FTSResults';
import TextField from '@material-ui/core/TextField';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
        },
    },
});

export default function FreeSolo(props) {
    const [appState, setAppState] = useState({
        searchResults: []
    });

    const [searchQueryState, setsearchQueryState] = useState({
        searchQuery: ""
    });

    function handleChange(e) {
        setsearchQueryState({ searchQuery: e.target.value });
    }

    function searchOnSubmit(e) {
        e.preventDefault();

        const URL = 
        'http://' + 
        process.env.NEXT_PUBLIC_HOST + 
        ':' + 
        process.env.NEXT_PUBLIC_APIPORT + 
        '/search/books/' + 
        props.path + '/' + 
        (props.bookid != undefined ? props.bookid + '/' : '') + 
        searchQueryState.searchQuery;
    
        axios.get(URL).then(res => {
            setAppState({ searchResults: res.data.results });
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="flex justify-center">
            <div className="">
                <div className="">
                    <form className="flex flex-col justify-center" onSubmit={searchOnSubmit}>
                        <ThemeProvider theme={theme}>
                            <TextField onChange={handleChange} className="w-full" id="standard-basic" label="Search book content" />
                        </ThemeProvider>
                        <br/>
                        <div className="flex flex-grow mr-3">
                            <FTSResults results={appState.searchResults}></FTSResults>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
  
