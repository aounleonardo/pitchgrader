import React, {Component} from "react";

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';

export default class GradeSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderValue: props.defaultValue,
            value: props.defaultValue
        }
    }

    render() {
        const onBeforeChange = ((this.props.fixed) ? (() => {}) : (() => this.props.onBeforeChange(this.props.name)));
        const onAfterChange = ((this.props.fixed) ? (() => {}) : ((value) => this.props.onAfterChange(this.props.name, value)));
        const slider =
            <Slider min={0} max={1} step={0.01} defaultValue={this.props.defaultValue}
                    value={(this.props.fixed) ? this.props.defaultValue : this.state.sliderValue}
                    onChange={(value) => this.setState({sliderValue: value})}
                    onBeforeChange={onBeforeChange}
                    onAfterChange={onAfterChange}
                    trackStyle={{backgroundColor: this.props.color}} handleStyle={{backgroundColor: this.props.color}}/>;
        return (slider);
    }
}