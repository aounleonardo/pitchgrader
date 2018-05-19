const mongoose = require('mongoose');
const assert = require('assert');
const router = require('express').Router({});

const dbUrl = "mongodb://localhost:27017/";
const dbName = "pitchgrader";

const fs = require('fs');

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

const criteria = ["_full", "_frame", "_center", "_top", "_bot", "_hue", "_std"];

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
                sport: field.get("facility"),
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

function similarFields(sport, id, coefficients, callback) {
    gradesForId(sport, id, (grades) => {
        sport.find({}, (err, result) => {
            if (err) throw err;
            const gradedFields = result.map((field) => {
                return {
                    id: field.get("_id"),
                    grades: field.get("grades")
                }
            });
            const sorted = gradedFields.sort((fieldA, fieldB) => {
                const similitudeA = similitude(grades, fieldA.grades);
                const similitudeB = similitude(grades, fieldB.grades);
                const gradeA = gradeField(similitudeA, coefficients);
                const gradeB = gradeField(similitudeB, coefficients);

                return gradeA - gradeB;
            });

            callback(sorted);
        });
    });
}

function similitude(gradesA, gradesB) {
    return Object.keys(gradesA).reduce((ret, grade) => {
        ret[grade] = Math.abs(gradesA[grade] - gradesB[grade]);
        return ret
    }, {});
}

function gradeField(field, coefficients) {
    return Object.keys(field).reduce((ret, grade) => {
        return ret + (field[grade] * coefficients[grade]);
    }, 0.0);
}

function gradesForId(sport, id, callback) {
    fieldById(sport, id, (err, field) => {
        const ret = (err || !field) ? {} : field.get("grades");
        callback(ret);
    });
}

function filenameForId(sport, id, callback) {
    fieldById(sport, id, (err, field) => {
        const filename = (err || !field) ? null : getName(field);
        callback(filename);
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

router.get('/images/:filename', (req, res) => {
    const path = `res/fields/${req.params.filename}.png`;
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        res.contentType('png');
        res.end(data, 'binary');
    });
});

router.get('/similar/:sport/:id', (req, res) => {
    const sport = sports[req.params.sport];
    const id = req.params.id;
    const coefficients = buildCoefficients(req.query);
    similarFields(sport, id, coefficients, (ret) => {
        res.send(ret);
    })
});

function buildCoefficients(query) {
    return criteria.reduce((ret, criterion) => {
        const grade = parseFloat(query[criterion.substring(1)]);
        ret[criterion] = (grade)? grade : 0.0;
        return ret;
    }, {});
}

router.get('/images/:sport/:id', (req, res) => {
    filenameForId(sports[req.params.sport], req.params.id, (filename) => {
        if(!filename){
            res.send("");
        } else {
            const path = `res/fields/${filename}.png`;
            fs.readFile(path, (err, data) => {
                if (err) throw err;
                res.contentType('png');
                res.end(data, 'binary');
            });
        }
    });
});


