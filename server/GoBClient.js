const fetch = require('node-fetch');
const {uuid} = require('uuidv4')

// memory database
let database = {
    findText: '',
    jobs: []
}

class GoBClient {
    constructor(clientID) {
        this.clientID = clientID
        if (!database[clientID]) database[clientID] = {}
    }

    // TODO: *** instance methods ***

    modifyJson(arr) {
        if (!arr) return
        return arr.map(job => {
            return {clientID: job.id, jobKey: uuid(), isFavorite: false, ...job}
        })
    }

    cleanDatabase () {
        database = {
            findText: '',
            jobs: []
        }
        return database;
    }

    async accumulateSearch(job) {
        // no search return
        if (!job) return

        // comment lines, !text do not delete previous search
        // if (database.findText !== job) {
        //     database = {
        //         findText: '',
        //         jobs: []
        //     }
        // }
        const jobText = job.split('%').join('+');
        // return


        const response = await fetch(`https://www.getonbrd.com/search/jobs?q=${jobText}`)
        const responseData = await response.json()
        let jobFetched = this.modifyJson(responseData.jobs);

        // assign text of the search and jobs founded to the database.
        if (jobFetched) {
            database.findText = job;
            database.jobs = [...jobFetched.map(j => {
                console.log('j', j)
                return database.jobs.map(dbjob => {
                    console.log('dbjob', dbjob)
                    if (dbjob.id === j.id) return dbjob
                    else return j
                })
            })];
        }

        return (database.findText && database.jobs) ? database : jobFetched
    }

    // mark() - marks a particular job as favorite and returns the updated local datasore
    async mark(jobId, favorite) {
        if (!jobId) return;
        console.log(database);
        database.jobs.forEach(job => {
            if (job.id === jobId) job.isFavorite = favorite
        })
        return database;
    }

    // clearSearch() - clears the accumulated searches
}

module.exports = GoBClient
