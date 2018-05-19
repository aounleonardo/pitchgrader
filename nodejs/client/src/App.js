import React, {Component} from 'react';

import './App.css';

import {Grid, Row, Col, Label} from 'react-bootstrap';

import Map from './components/Map'
import Controller from "./components/Controller";
import Inspector from "./components/Inspector";
import Belt from "./components/Belt";

import withQuery from 'with-query';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inspectorSport: "football",
            inspectorField: "5aea19c87441f44e24e27a8e",
        };

        this.map = React.createRef();

        this.featureClick = this.featureClick.bind(this);
        this.showField = this.showField.bind(this);
        this.findSimilar = this.findSimilar.bind(this);
    }

    render() {
        return (
            <Grid>
                <Row bsClass='my-row'>
                    <h1><Label bsStyle="success">Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Map ref={this.map} featureClick={this.featureClick}/>
                    </Col>
                    <Col xs={4}>
                        <Row><Controller map={this.map} checked={true} scale={100}/></Row>
                        <Row><Inspector sport={this.state.inspectorSport}
                                        field={this.state.inspectorField}
                                        height={400}/></Row>
                    </Col>
                </Row>
                <Row>
                    <Belt sport={this.state.inspectorSport} similar={this.state.similar} count={6}/>
                </Row>
            </Grid>
        );
    }

    featureClick(sport, field) {
        this.showField(sport, field);
        this.findSimilar(sport, field);
    }

    showField(sport, field) {
        this.setState({
            inspectorSport: sport,
            inspectorField: field
        });
    }

    findSimilar(sport, field) {
        fetch(withQuery(`/db/similar/${sport}/${field}`, {
            "full": 1.0
        }))
            .then(res => {
                return res.json();
            })
            .then(json => {
                console.log(json);
                this.setState({
                    similar: json,
                });
            })
            .catch(err => {
                console.log(err);
            });

    }
}

export default App;
