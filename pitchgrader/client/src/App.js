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
    render() {
        return (
            <Grid>
                <Row bsClass='my-row'>
                    <h1><Label bsStyle="success">Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Mapbox style="mapbox://styles/mapbox/outdoors-v9"
                                center={[6.5668, 46.5191]}
                                zoom={[15]}
                            // longitude, latitude
                                maxBounds={[[5.75, 46], [7.5, 47]]}
                                containerStyle={{
                                    height: "40vh",
                                    width: "40vw"
                                }}>
                            <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15"}}>
                                <Feature coordinates={[6.5668, 46.5191]}/>
                            </Layer>
                        </Mapbox>
                    </Col>
                    <Col xs={4}>
                        <p>Hello Leonardo</p>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;
