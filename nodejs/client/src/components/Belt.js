import React, {Component} from 'react';
import Inspector from "./Inspector";

import {Row, Col, Label} from 'react-bootstrap';
import BeltController from "./BeltController";

import './components.css'

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const waiting = <div>Waiting...</div>;
export default class Belt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // maxDistance: props.maxDistance,
            minDistance: 0,
            maxDistance: props.maxDistance,
            similar: props.similar,
            filtered: props.similar,
            center: props.center,
            sliderValue: [0, props.maxDistance],
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.similar !== prevState.similar) {
            return {
                similar: nextProps.similar,
                maxDistance: nextProps.maxDistance,
                minDistance: 0,
                center: nextProps.center,
                filtered: nextProps.similar
            }
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filtered !== this.state.filtered) {
            const length = Math.min(this.state.filtered.length - 1, this.props.count);
            const selected = this.state.filtered.slice(0, length + 1);
            this.props.map.current.setSelectedFeatures(selected);
        }
        if (this.state.maxDistance !== prevState.maxDistance || this.state.minDistance !== prevState.minDistance) {
            this.setState({
                filtered: this.keepCloseNeighbours()
            });
        }
    }

    render() {
        if (!this.state.filtered) {
            return waiting;
        }
        const length = Math.min(this.state.filtered.length - 1, this.props.count);
        const labelClass = (this.props.sport === "tennis") ? "label tennis-label" : "label football-label";
        return (
        <Col>
                <Col md={9}>
                    <Row><h2><Label bsClass={labelClass}>Similar Fields:</Label></h2></Row>
                    {this.state.filtered.slice(1, length + 1).map((neighbour) =>
                        <Col md={2} xs={6} key={"belt-" + neighbour.id}>
                            <Inspector sport={this.props.sport} field={neighbour.id}
                                       height={150} handleClick={this.props.imageClick}/>
                        </Col>
                    )}
                </Col>
                <Col md={3}>
                    <Row>
                        <Label>Distance</Label>
                    </Row>
                    <Row>
                        <Range min={0} max={this.props.maxDistance} value={this.state.sliderValue}
                               defaultValue={[0, this.props.maxDistance]} step={0.1}
                               onChange={(value) => this.setState({sliderValue: value})}
                               onAfterChange={(value) => this.setState({
                                   minDistance: value[0],
                                   maxDistance: value[1]
                               })}
                        />
                    </Row>
                    <Row>
                        <BeltController onCoefficientsChange={this.props.onCoefficientsChange} sport={this.props.sport}
                                        full={1} frame={0}
                                        center={0} top={0} bot={0} hue={0}/>
                    </Row>
                </Col>
            </Col>
        );
    }

    keepCloseNeighbours = () => {
        return this.state.similar.filter(neighbour => {
            const distance = haversineDistance(this.state.center, neighbour);
            return this.state.minDistance <= distance && distance <= this.state.maxDistance
        });
    }
}


function haversineDistance(locationA, locationB) {
    const earthRadius = 6369; // in km
    const dLatitude = Math.radians(locationB.latitude - locationA.latitude);
    const dLongitude = Math.radians(locationB.longitude - locationA.longitude);

    const a = Math.pow(Math.sin(dLatitude / 2), 2) +
        Math.cos(Math.radians(locationA.latitude)) * Math.cos(Math.radians(locationB.latitude)) *
        Math.pow(Math.sin(dLongitude / 2), 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c; // in km
}

// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};