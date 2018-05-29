import React, {Component} from 'react';
import {Row, Col, Label, Image} from 'react-bootstrap';
import GradeSlider from './GradeSlider';


export default class BeltController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            full: props.full,
            frame: props.frame,
            center: props.center,
            bot: props.bot,
            top: props.top,
            sport: props.sport,
            imageName: props.sport
        };


        this.sliderWillChange = (name) => {
            const imageName = `${this.props.sport}_${name}`;
            this.setState({imageName: imageName});
        };

        this.sliderChanged = (name, value) => {
            let obj = {
                imageName: this.props.sport
            };
            obj[name] = value;
            this.setState(obj);
        };
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

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.sport === prevState.sport) {
            return null;
        }
        return {
            sport: nextProps.sport,
            imageName: nextProps.sport
        }
    }

    render() {
        return (<Col>
            <Col md={8}>
                <Image src={`/images/blueprints/${this.state.imageName}.png`} width={"95%"} />
            </Col>
            <Col md={4}>
                <Row>
                    <Label>Full</Label>
                    <GradeSlider name={"full"} defaultValue={this.state.full} onBeforeChange={this.sliderWillChange} onAfterChange={this.sliderChanged} color="#0f0"/>
                </Row>
                <Row>
                    <Label>Frame</Label>
                    <GradeSlider name={"frame"} defaultValue={this.state.frame} onBeforeChange={this.sliderWillChange} onAfterChange={this.sliderChanged} color="#00f"/>
                </Row>
                <Row>
                    <Label>Center</Label>
                    <GradeSlider name={"center"} defaultValue={this.state.center} onBeforeChange={this.sliderWillChange} onAfterChange={this.sliderChanged} color="#f00"/>
                </Row>
                <Row>
                    <Label>Top</Label>
                    <GradeSlider name={"top"} defaultValue={this.state.top} onBeforeChange={this.sliderWillChange} onAfterChange={this.sliderChanged} color="#ff0"/>
                </Row>
                <Row>
                    <Label>Bot</Label>
                    <GradeSlider name={"bot"} defaultValue={this.state.bot} onBeforeChange={this.sliderWillChange} onAfterChange={this.sliderChanged} color="#f0f"/>
                </Row>
            </Col>
        </Col>);
    }
}