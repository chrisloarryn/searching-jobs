const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const GobClient = require("./GoBClient");
const cors = require('cors')

// PORT
const IPort = 3005;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(pino);

let gobClient;

// TODO: *** inialize gobClient here ***
// hint: use a middleware
app.use((req, res, next) => {
    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    gobClient = new GobClient();
    console.log(ip);
    next();
})
// GobClient uses an unique identifier (i.e: the request ip)

// *** Endpoints ***
// GET /api/search
app.get("/api/search", async (req, res) => {
    let {q} = req.query;
    if (!q) return;
    let response;
    try {
        response = await gobClient.accumulateSearch(q);
    } catch (error) {
        return 'error getting response from function.'
    }
    res.json({
        message: 'success',
        results: response.jobs.length,
        ...response
    });
});

// TODO: *** Add **
// POST /api/clear
app.post('/api/clear', (req, res) => {
    const dbCleaned = gobClient.cleanDatabase();
    return res.status(200).json({
        message: 'success',
        results: dbCleaned.jobs ? dbCleaned.jobs.length : 0,
        ...dbCleaned
    });
})
// POST /api/fav
app.patch('/api/fav/:id', async (req, res) => {
    const {id} = req.params;
    const favorites = await gobClient.mark(id, req.body.isFavorite);
    res.status(200).json({
        message: 'success',
        results: favorites.jobs.length,
        ...favorites
    });
})

app.listen(IPort, () =>
    console.log(`Express server is running on localhost:${IPort}`)
);
