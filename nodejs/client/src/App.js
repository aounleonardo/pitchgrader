import React, {Component} from 'react';

import './App.css';

import {Grid, Row, Col, Label} from 'react-bootstrap';

import Map from './components/Map'
import Controller from "./components/Controller";
import Inspector from "./components/Inspector";


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inspectorSport: "football",
            inspectorField: "5aea19c87441f44e24e27a8e",
        };

        this.map = React.createRef();
        this.showField = this.showField.bind(this);
    }

    render() {
        return (
            <Grid>
                <Row bsClass='my-row'>
                    <h1><Label bsStyle="success">Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Map ref={this.map} featureClick={this.showField}/>
                    </Col>
                    <Col xs={4}>
                        <Row><Controller map={this.map} checked={true} scale={100}/></Row>
                        <Row><Inspector sport={this.state.inspectorSport}
                                        field={this.state.inspectorField}/></Row>
                    </Col>
                </Row>
            </Grid>
        );
    }

    showField(sport, field) {
        this.setState({
            inspectorSport: sport,
            inspectorField: field
        });
    }
}

export default App;
