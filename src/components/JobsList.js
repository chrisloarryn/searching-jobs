import React from 'react';
import NoResults from "./NoResults";
import styles from './jobsStyles.module.css';

const JobsList = ({data: {jobs}, handleFavorites}) => {
    console.log('jobs', jobs)

    const mark = job => {
        handleFavorites(job)
    }

    if (!jobs) return <NoResults/>
    return (
        <ol>
            {
                jobs.map((job, index) => {
                    return <>
                        <li key={`${index+1}-${job.title}`}> {`${job.title} by ${job.company.name}`} <button className={job.isFavorite ? styles.fav : styles.nofav } type="button" onClick={() => mark(job)}>fav</button> </li>
                    </>
                })
            }
        </ol>
    )
}

export default JobsList;