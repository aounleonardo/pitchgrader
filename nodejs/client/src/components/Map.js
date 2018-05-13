import React, {Component} from 'react';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            features: [],
        };

        this.mapbox = ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
            minZoom: 10,
            maxZoom: 20
        });
    }

    componentDidMount() {
        this.getPoints("football")
            .then(res => {
                console.log(res.length);
                this.setState({features: res});
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            // mapbox://styles/mapbox/streets-v9
            // mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab
            <this.mapbox style="mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab"
                         center={[6.5668, 46.5191]}
                         zoom={[15]}
                // longitude, latitude
                         maxBounds={[[5.75, 46], [7.5, 47]]}
                         containerStyle={{
                             height: "80vh",
                             width: "40vw"
                         }}>
                <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15"}}>
                    {this.state.features.map((feature) => <Feature
                        coordinates={[feature.lon, feature.lat]}
                        key={feature.id}/>)}
                </Layer>
            </this.mapbox>);
    }

    getPoints = async (sport) => {
        const response = await fetch('/db/locations/' + sport);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };
}

