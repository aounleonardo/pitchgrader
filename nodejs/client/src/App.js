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
            inspectorField: "-",
        };

        this.map = React.createRef();

        this.featureClick = this.featureClick.bind(this);
        this.showField = this.showField.bind(this);
        this.findSimilar = this.findSimilar.bind(this);
        this.imageClick = this.imageClick.bind(this);
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
                                        height={400}
                                        handleClick={this.imageClick}/>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Belt sport={this.state.inspectorSport} similar={this.state.similar} count={6} imageClick={this.imageClick}/>
                </Row>
            </Grid>
        );
    }

    featureClick(sport, field, inFields) {
        this.showField(sport, field);
        this.findSimilar(sport, field, inFields);
    }

    showField(sport, field) {
        this.setState({
            inspectorSport: sport,
            inspectorField: field
        });
    }

    imageClick(field) {
        console.log("click", field);
        this.map.current.flyToField(field);
    }

    findSimilar(sport, field, inFields) {
        fetch(withQuery(`/db/similar/${sport}/${field}`, {
            "full": 1.0
        }))
            .then(res => {
                return res.json();
            })
            .then(fields => {
                this.setState({
                    similar: fields.filter(f => inFields.includes(f.id)),
                });
            })
            .catch(err => {
                console.log(err);
            });

    }
}

export default App;
