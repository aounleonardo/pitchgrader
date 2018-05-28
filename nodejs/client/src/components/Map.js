import React, {Component} from 'react';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";

export default class Map extends Component {

    constructor(props) {
        super(props);

        // this.center = [6.5668, 46.5191];
        this.zoom = [9];

        this.state = {
            features: [],
            center: [6.5668, 46.5191],
        };

        this.featureClick = props.featureClick;

        this.mapbox = ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
            minZoom: 9,
            maxZoom: 20
        });

        this.flyToField = this.flyToField.bind(this);
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

    flyToField(field) {
        const found = this.state.features.find((feature) => {
            return feature.id === field;
        });
        if (found) {
            this.setState({center: [found.longitude, found.latitude]})
        }
    }

    render() {
        return (
            // mapbox://styles/mapbox/streets-v9
            // mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab
            <div>
                <this.mapbox style="mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab"
                             center={this.state.center}
                             zoom={this.zoom}
                    // longitude, latitude
                             maxBounds={[[5.75, 46], [7.5, 47]]}
                             containerStyle={{
                                 height: "60vh",
                                 borderRadius: 10
                             }}>
                    <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15"}}>
                        {this.state.features.map((feature) => <Feature
                            coordinates={[feature.longitude, feature.latitude]}
                            onClick={() => {
                                this.featureClick(feature,
                                    this.state.features)
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

