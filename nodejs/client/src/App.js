import React, {Component} from 'react';

import './App.css';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";
import {Grid, Row, Col, Label} from 'react-bootstrap';


const Mapbox = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    minZoom: 10,
    maxZoom: 20
});

class App extends Component {

    constructor(props) {
        super(props);

        this.handleClick = () => console.log("hello");
        this.state = {
            person: "Leonardo",
            features: []
        };
    }


    componentDidMount() {
        console.log("mounted");
        this.getPoints()
            .then(res => {
                console.log(res.length);
                this.setState({features: res});
            })
            .catch(err => console.log(err));
    }

    getPoints = async () => {
        const response = await fetch('/db/locations/football');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <Grid>
                <Row bsClass='my-row'>
                    <h1><Label bsStyle="success">{this.state.person}</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Mapbox style="mapbox://styles/mapbox/outdoors-v9"
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
                        </Mapbox>
                    </Col>
                    <Col xs={4}>
                        <p>{this.state.person}</p>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;
