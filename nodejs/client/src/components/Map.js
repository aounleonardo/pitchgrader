import React, {Component} from 'react';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.center = [6.5668, 46.5191];
        this.zoom = [15];

        this.state = {
            features: [],
        };

        this.featureClick = props.featureClick;

        this.mapbox = ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
            minZoom: 10,
            maxZoom: 20
        });
    }

    componentDidMount() {
        this.getSport("football");
    }

    getSport(sport) {
        this.getPoints(sport)
            .then(res => {
                this.setState({
                    features: res.locations,
                    minScore: res.minScore,
                    maxScore: res.maxScore,
                });
            })
            .catch(err => console.log(err));
    }

    getSportInRange(sport, grades, scale) {
        this.getPointsInScoreRange(sport, grades, scale)
            .then(res => {
                this.setState({
                    features: res.locations,
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            // mapbox://styles/mapbox/streets-v9
            // mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab
            <div>
                <this.mapbox style="mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab"
                             center={this.center}
                             zoom={this.zoom}
                    // longitude, latitude
                             maxBounds={[[5.75, 46], [7.5, 47]]}
                             containerStyle={{
                                 height: "60vh"
                             }}>
                    <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15"}}>
                        {this.state.features.map((feature) => <Feature
                            coordinates={[feature.lon, feature.lat]}
                            onClick={() => {
                                this.featureClick(feature.sport, feature.id,
                                    this.state.features.reduce((ret, feature) => {
                                        ret.push(feature.id);
                                        return ret;
                                    }, []))
                            }}
                            onMouseEnter={(mapWithEvt) => {
                            }}
                            onMouseLeave={(mapWithEvt) => {
                            }}
                            key={feature.id}/>)}
                    </Layer>
                </this.mapbox>
            </div>
        );
    }

    getPoints = (sport) => this.contactServerWith('/db/locations/' + sport);

    getPointsInScoreRange = (sport, grades, scale) => {
        const scoreRange = this.state.maxScore - this.state.minScore;
        const minScore = (grades.min / scale) * scoreRange + this.state.minScore;
        const maxScore = (grades.max / scale) * scoreRange + this.state.minScore;
        const request = `/db/locations/${sport}/range/${minScore}/${maxScore}`;
        return this.contactServerWith(request)
    };


    contactServerWith = async (request) => {
        const response = await fetch(request);

        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };
}

