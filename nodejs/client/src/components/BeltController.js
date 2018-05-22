import React, {Component} from 'react';
import {Row, Col, Label} from 'react-bootstrap';

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';

export default class BeltController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            full: props.full,
            frame: props.frame,
            center: props.center,
            bot: props.bot,
            top: props.top,
        };

        this.sliderChanged = (name, value) => {
            let obj = {};
            obj[name] = value;
            this.setState(obj);
        }
    }

    componentDidUpdate() {
        this.props.onCoefficientsChange({
            full: this.state.full,
            frame: this.state.frame,
            center: this.state.center,
            top: this.state.top,
            bot: this.state.bot,
        });
    }

    render() {
        return (<Col md={10}>
            <Row>
                <Label>Full</Label>
                <GradeSlider name={"full"} defaultValue={this.state.full} onAfterChange={this.sliderChanged} color="#0f0"/>
            </Row>
            <Row>
                <Label>Frame</Label>
                <GradeSlider name={"frame"} defaultValue={this.state.frame} onAfterChange={this.sliderChanged} color="#00f"/>
            </Row>
            <Row>
                <Label>Center</Label>
                <GradeSlider name={"center"} defaultValue={this.state.center} onAfterChange={this.sliderChanged} color="#f00"/>
            </Row>
            <Row>
                <Label>Top</Label>
                <GradeSlider name={"top"} defaultValue={this.state.top} onAfterChange={this.sliderChanged} color="#ff0"/>
            </Row>
            <Row>
                <Label>Bot</Label>
                <GradeSlider name={"bot"} defaultValue={this.state.bot} onAfterChange={this.sliderChanged} color="#f0f"/>
            </Row>
        </Col>);
    }
}

class GradeSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderValue: props.defaultValue,
            value: props.defaultValue
        }
    }

    render() {
        return (
            <Slider min={0} max={1} step={0.01} defaultValue={this.props.defaultValue} value={this.state.sliderValue}
                    onChange={(value) => this.setState({sliderValue: value})}
                    onAfterChange={(value) => this.props.onAfterChange(this.props.name, value)}
                    trackStyle={{backgroundColor: this.props.color}} handleStyle={{backgroundColor: this.props.color}}/>);
    }
}