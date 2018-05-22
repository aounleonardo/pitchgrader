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
            chosenSport: "football",
            chosenId: "-",
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
                <Row>
                    <h1><Label bsStyle="success">Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={8}>
                        <Map ref={this.map} featureClick={this.featureClick}/>
                    </Col>
                    <Col xs={4}>
                        <Row><Controller map={this.map} checked={true} scale={100}/></Row>
                        <Row><Inspector sport={this.state.chosenSport}
                                        field={this.state.chosenId}
                                        height={300}
                                        handleClick={this.imageClick}/>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Belt sport={this.state.chosenSport} center={this.state.chosenCoordinates}
                          similar={this.state.similar} count={6} imageClick={this.imageClick} maxDistance={5}/>
                </Row>
            </Grid>
        );
    }

    featureClick(field, inFields) {
        this.showField(field);
        this.findSimilar(field.sport, field.id, inFields);
    }

    showField(field) {
        this.setState({
            chosenSport: field.sport,
            chosenId: field.id,
            chosenCoordinates: {
                latitude: field.latitude,
                longitude: field.longitude
            },
        });
    }

    imageClick(field) {
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
                    similar: fields.filter(f => {
                        return inFields.find(feature => feature.id === f.id)
                    }).map(f => {
                        const feature = inFields.find(feature => feature.id === f.id);
                        return {
                            id: f.id,
                            grades: f.grades,
                            longitude: feature.longitude,
                            latitude: feature.latitude
                        }
                    }),
                });
            })
            .catch(err => {
                console.log(err);
            });

    }
}

export default App;
