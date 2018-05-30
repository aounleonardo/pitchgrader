import React, {Component} from 'react';

import './App.css';
import './components/components.css';

import {Grid, Row, Col, Label} from 'react-bootstrap';

import Map from './components/Map'
import Controller from "./components/Controller";
import Inspector from "./components/Inspector";
import Belt from "./components/Belt";
import GradeViewer from "./components/GradeViewer";

import withQuery from 'with-query';

const sports = {
    "football": "football",
    "soccer": "football",
    "tennis": "tennis",
};


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chosenSport: "football",
            chosenId:  "-",// "5aea19c87441f44e24e27a72",
            similar: [],
        };

        this.sortingCoefficients = {
            full: 1,
            frame: 0,
            center: 0,
            bot: 0,
            top: 0,
            hue: 0,
        };

        this.map = React.createRef();

        this.featureClick = this.featureClick.bind(this);
        this.showField = this.showField.bind(this);
        this.findSimilar = this.findSimilar.bind(this);
        this.imageClick = this.imageClick.bind(this);
        this.onCoefficientsChange = this.onCoefficientsChange.bind(this);
        this.sportChange = this.sportChange.bind(this);
    }

    render() {
        const labelClass = (this.state.chosenSport === "tennis") ? "label tennis-label" : "label football-label";
        return (
            <Grid bsClass={"container pitchgrader"}>
                <Row>
                    <h1><Label bsClass={labelClass}>Pitchgrader</Label></h1>
                </Row>
                <Row>
                    <Col xs={12} md={9}>
                        <Map ref={this.map} featureClick={this.featureClick} sport={this.state.chosenSport} markerSize={20} initialZoom={13}/>
                    </Col>
                    <Col xs={3}>
                        <Row><Controller map={this.map} checked={true} scale={100} sport={this.state.chosenSport} sportChange={this.sportChange}/></Row>
                        <Row><Inspector sport={this.state.chosenSport}
                                        field={this.state.chosenId}
                                        height={300}
                                        handleClick={this.imageClick}/>
                        </Row>
                        <Row>
                            <GradeViewer grades={this.state.chosenGrades}/>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Belt map={this.map} sport={this.state.chosenSport} center={this.state.chosenCoordinates}
                          similar={this.state.similar} count={6} imageClick={this.imageClick} maxDistance={5}
                          onCoefficientsChange={this.onCoefficientsChange}
                    />
                </Row>
            </Grid>
        );
    }

    onCoefficientsChange(coefficients) {
        this.sortingCoefficients = coefficients;

    }

    featureClick(field, inFields) {
        this.showField(field);
        this.findSimilar(field.sport, field.id, inFields);
    }

    sportChange(sport) {
        this.setState({
            chosenSport: sport,
        });
    };

    showField(field) {
        this.setState({
            chosenSport: sports[field.sport],
            chosenId: field.id,
            chosenCoordinates: {
                latitude: field.latitude,
                longitude: field.longitude
            },
            chosenGrades: {
                full: field.grades["_full"],
                frame: field.grades["_frame"],
                center: field.grades["_center"],
                top: field.grades["_top"],
                bot: field.grades["_bot"],
                std: field.grades["_std"],
            },
        });
    }

    imageClick(field) {
        this.map.current.flyToField(field);
    }

    findSimilar(sport, field, inFields) {
        fetch(withQuery(`/db/similar/${sport}/${field}`, {
            "full": this.sortingCoefficients.full,
            "frame": this.sortingCoefficients.frame,
            "center": this.sortingCoefficients.center,
            "top": this.sortingCoefficients.top,
            "bot": this.sortingCoefficients.bot,
            "hue": this.sortingCoefficients.hue,
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
                            sport: feature.sport,
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
