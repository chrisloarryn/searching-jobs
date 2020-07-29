import React, {useState, useEffect} from "react";
import "./App.css";
import JobsList from "./components/JobsList";

import {useHttpClient} from './shared/helpers/useJobsFetcher'

const App = () => {
    const [searching, setSearching] = useState(false);
    const [jobs, setJobs] = useState({})
    const [term, setTerm] = useState('')
    // eslint-disable-next-line
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    const apiURL = 'http://localhost:3005/api';

    // TODO: *** hook that brings the last accumulative search (stored jobs)
    useEffect(() => {
        if (isLoading) setSearching(true)
        else setSearching(false)
    }, [isLoading, setSearching])
    // TODO: helper functions for:
    // 1. Searching jobs
    // 2. Marking a job as favorite
    // 3. Cleaning the accumulated searches
    const clearSearch = async () => {
        const responseData = await sendRequest(
            `${apiURL}/clear`,
            'POST'
        )
        setJobs(responseData)
    }

    const handleFavorites = async job => {
        console.log(job)
        const responseData = await sendRequest(
            `${apiURL}/fav/${job.id}`,
            'PATCH',
            JSON.stringify({
                isFavorite: !job.isFavorite
            }),
            {
                'Content-Type': 'application/json'
            }
        )
        console.log(responseData)
        setJobs(responseData)
    }

    const search = async () => {
        const responseData = await sendRequest(`${apiURL}/search?q=${term}`)
        console.log(responseData)
        setJobs(responseData)
    }
    return (
        <div className="App">
            <pre>{term}</pre>
            <h1>Search jobs ({jobs && jobs.jobs && jobs.jobs.length > 0 ? `${jobs.results} results` : '0 results'})</h1>
            <label htmlFor="term">Term: </label>
            <input
                id="term"
                type="text"
                value={term}
                onChange={({target: {value}}) => setTerm(value)}
            />
            <button type="button" onClick={search}>
                Search
            </button>
            <button type="button" onClick={clearSearch}>
                Clear
            </button>
            {searching && <div>...searching</div>}
            {!searching && <JobsList data={jobs} handleFavorites={(id) => handleFavorites(id)}/>}

            {/**
             * TODO: Block of code to list the jobs with a button to mark them as favorite
             * Hint: It would be nice if it is a separate component
             */}
        </div>
    );
}

export default App;
