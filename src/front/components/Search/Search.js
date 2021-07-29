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

    useEffect(() => {
        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/books/all';
    
        axios.get(URL).then(res => {
            setAppState({ searchResults: res.data.slice(0,100) });
        })
        .catch(error => {
            console.log(error);
        });
    }, [setAppState]);

    function handleChange(e) {
        setsearchQueryState({ searchQuery: e.target.value });

        const URL = 'http://' + process.env.NEXT_PUBLIC_HOST + ':' + process.env.NEXT_PUBLIC_APIPORT + '/search/search-as-you-type/' + e.target.value;
    
        axios.get(URL).then(res => {
            setAppState({ searchResults: res.data.values.slice(0,100) });
        })
        .catch(error => {
            console.log(error);
        });
    }

    function searchOnSubmit(event) {
        event.preventDefault();
        window.location.replace("/search/" + searchQueryState.searchQuery);
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
                                    return '"' + searchQueryState.searchQuery + '"' + ' in the book ' + option.title;
                                } else {
                                    return option.title;
                                }
                            })}
                            className="flex-grow"
                            renderInput={(params) => (
                                <TextField {...params} label="freeSolo" margin="normal" variant="standard"
                                    label="Search input"
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
  
