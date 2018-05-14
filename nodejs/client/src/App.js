import React, {Component} from 'react';

import './App.css';

import {Grid, Row, Col, Label} from 'react-bootstrap';

import Map from './components/Map'
import Controller from "./components/Controller";


class App extends Component {

    constructor(props){
        super(props);

        this.map = React.createRef();
    }

    render() {
        return (
            <Grid>
                <Row bsClass='my-row'>
                    <h1><Label bsStyle="success">Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Map ref={this.map}/>
                    </Col>
                    <Col xs={4}>
                        <Controller map={this.map} checked={true}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;
