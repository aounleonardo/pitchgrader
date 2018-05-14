const mongoose = require('mongoose');
const assert = require('assert');
const router = require('express').Router({});

const dbUrl = "mongodb://localhost:27017/";
const dbName = "pitchgrader";


mongoose.connect(dbUrl + dbName).then(() => {
    console.log("Connected to db");
});


const Football = mongoose.model("Football", new mongoose.Schema(), 'vd_football');
const Tennis = mongoose.model("Tennis", new mongoose.Schema(), 'vd_tennis');

const sports = {
    "football": Football,
    "tennis": Tennis,
    "soccer": Football
};

const getName = (doc) => doc["_doc"]["id"];

function getLocations(sport, callback, filters = {}) {
    sport.find(filters, (err, result) => {
        if (err) throw err;
        const locations = [];
        let minScore = Number.MAX_VALUE;
        let maxScore = Number.MIN_VALUE;
        for (let field of result) {
            // Get Locations
            const vertices = field.get("vertices");
            const id = field.get("_id");
            const nbPoints = vertices.length;
            const center = vertices.reduce((total, coordinate) => {
                const lon = (total.lon + coordinate[0]);
                const lat = (total.lat + coordinate[1]);
                return {lat: lat, lon: lon};
            }, {lat: 0, lon: 0});
            locations.push({
                id: id,
                lat: center.lat / nbPoints,
                lon: center.lon / nbPoints
            });

            // Get Score
            const score = field.get("score");
            minScore = Math.min(minScore, score);
            maxScore = Math.max(maxScore, score);
        }
        const ret = {
            locations: locations,
            minScore: minScore,
            maxScore: maxScore
        };
        callback(ret);
    });
}

function gradesForId(sport, id, callback) {
    fieldById(sport, id, (err, field) => {
        const ret = (err || !field) ? {} : field.get("grades");
        callback(ret);
    });
}

function fieldById(sport, id, callback) {
    sport.findById(id, (err, doc) => {
        const ret = (err || !doc) ? null : doc;
        callback(err, ret);
    });
}

module.exports = {
    football: Football,
    tennis: Tennis,
    router: router,
};

router.get('/', (req, res) => {
    res.send('Welcome to the database');
});

router.get('/locations/:sport', (req, res) => {
    const sport = sports[req.params["sport"]];
    getLocations(sport, (points) => {
        res.send(points);
    })
});

router.get('/locations/:sport/range/:from/:to', (req, res) => {
    const sport = sports[req.params.sport];
    const from = parseFloat(req.params.from);
    const to = parseFloat(req.params.to);

    if (sport == null || from == null || isNaN(from) || to == null || isNaN(to)) {
        res.send("err");
    }

    const filters = {
        "score": {
            "$gte": from,
            "$lte": to
        }
    };
    getLocations(sport, (points) => {
        res.send(points);
    }, filters)
});
