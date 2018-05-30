import React, {Component} from 'react';
import {Row, Col, Label} from 'react-bootstrap';

import Switch from "react-switch";

import 'rc-slider/assets/index.css';
import './components.css';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


// Be sure to include styles at some point, probably during your bootstrapping

export default class Controller extends Component {
    constructor(props) {
        super(props);
        this.map = props.map;
        this.scale = props.scale;
        this.state = {
            checked: props.checked,
            sport: chooseSport(props.checked),
            sliderValue: [0, props.scale],
            scoreValue: [0, props.scale],
        };
        this.handleSportChange = this.handleSportChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.scoreValue !== this.state.scoreValue) {
            this.map.current.getSportInRange(this.state.sport, {
                min: this.state.scoreValue[0],
                max: this.state.scoreValue[1],
            }, this.scale)
        }
    }

    render() {
        const isTennis = this.state.sport === "tennis";
        const labelTennis = (isTennis) ? "label tennis-label" : "label";
        const labelFootball = (!isTennis) ? "label football-label" : "label";
        const labelClass = (isTennis) ? "label tennis-label" : "label football-label";
        return (
            <Col >
                <Row>
                    <Col md={4}><h3><Label bsClass={labelTennis}>Tennis</Label></h3></Col>
                    <Col md={4}>
                        <div><Switch onChange={this.handleSportChange}
                                     checked={this.state.checked}
                                     id="sport-switch"
                                     checkedIcon={false}
                                     uncheckedIcon={false}
                                     onColor={"#61b530"}
                                     className="tare2a-switch"
                                     offColor={"#ed511d"}
                        /></div>
                    </Col>
                    <Col md={4}><h3><Label bsClass={labelFootball}>Football</Label></h3></Col>
                </Row>
                <Row style={{width: 300, paddingLeft: 20}}>
                    <h3><Label bsClass={labelClass}>Score Interval</Label></h3>
                    <Range min={0} max={this.scale} value={this.state.sliderValue} defaultValue={[0, this.scale]}
                           onChange={(value) => this.setState({sliderValue: value})}
                           onAfterChange={(value) => this.setState({scoreValue: value, sliderValue: value})}
                           trackStyle={this.trackStyle()} handleStyle={this.handleStyle()}/>
                </Row>
            </Col>
        );
    }


    trackStyle() {
        return (this.state.sport === "football") ? [{backgroundColor: "#61b530"}] : [{backgroundColor: "#ed511d"}]
    }

    handleStyle() {
        return (this.state.sport === "football") ? [{backgroundColor: "#3a751f"}] : [{backgroundColor: "#863317"}]
    }

    handleSportChange(checked) {
        const sport = chooseSport(checked);
        this.setState({checked: checked, sport: sport, sliderValue: [0, this.scale]});
        this.props.sportChange(sport);
    }

}

function chooseSport(checked) {
    return (checked) ? "football" : "tennis";
}
