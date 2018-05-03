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
const getName = (doc) => doc["_doc"]["id"];


function getLocations(sport, callback) {
    sport.find({}, (err, result) => {
        if (err) throw err;
        let len = result.length;
        // for(field of result){
        const ret = [];
        for (let field of result) {
            const vertices = field.get("vertices");
            const id = field.get("_id");
            const nbPoints = vertices.length;
            const center = vertices.reduce((total, coordinate) => {
                const lon = (total.lon + coordinate[0]);
                const lat = (total.lat + coordinate[1]);
                return {lat: lat, lon: lon};
            }, {lat: 0, lon: 0});
            ret.push({
                id: id,
                lat: center.lat / nbPoints,
                lon: center.lon / nbPoints
            });
        }
        callback(ret[0]);
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
    getLocations: getLocations,
};

router.get('/', (req, res) => {
    res.send('Welcome to the database');
});