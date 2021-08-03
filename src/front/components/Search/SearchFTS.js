import React, { Component, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
    },
});

export default function FreeSolo() {
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

        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/search/books/all/' + searchQueryState.searchQuery;
    
        axios.get(URL).then(res => {
            setAppState({ searchResults: res.data.results.slice(0,100) });
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="flex">
            <form className="flex" onSubmit={searchOnSubmit}>
                <div style={{ width: 300 }} className="flex flex-grow mr-3">
                    <ThemeProvider theme={theme}>
                        <Autocomplete
                            freeSolo
                            options={appState.searchResults.map((option) => { 
                                if(searchQueryState.searchQuery != "") {
                                    return '"' + option.periText + '"' + ' in the book ' + option.bookName + ' with id: ' + option.bookId;
                                } else {
                                    return option.bookName;
                                }
                            })}
                            className="flex-grow"
                            renderInput={(params) => (
                                <TextField {...params} label="freeSolo" margin="normal" variant="standard"
                                    label="Search book content"
                                    onChange={handleChange}
                                    className="flex-grow"
                                />
                            )}
                        />
                    </ThemeProvider>
                </div>
            </form>
        </div>
    );
}
  
