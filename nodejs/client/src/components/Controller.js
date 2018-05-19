import React, {Component} from 'react';
import Switch from "react-switch";
import {Grid, Row, Label} from 'react-bootstrap';

import 'rc-slider/assets/index.css';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

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
        if (prevState.sport !== this.state.sport) {
            this.map.current.getSport(this.state.sport);
        } else if (prevState.scoreValue !== this.scoreValue) {
            this.map.current.getSportInRange(this.state.sport, {
                min: this.state.scoreValue[0],
                max: this.state.scoreValue[1],
            }, this.scale)
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <h3><Label bsStyle="warning">Tennis</Label>
                        <Switch onChange={this.handleSportChange}
                                checked={this.state.checked}
                                id="sport-switch"
                                checkedIcon={false}
                                uncheckedIcon={false}
                                offColor={"#e1ab25"}/>
                        <Label bsStyle="success">Football</Label>
                    </h3>
                </Row>
                <Row style={{width: 300, paddingTop: 50}}>
                    <Range min={0} max={this.scale} value={this.state.sliderValue} defaultValue={[0, this.scale]}
                           onChange={(value) => this.setState({sliderValue: value})}
                           onAfterChange={(value) => this.setState({scoreValue: value, sliderValue: value})}
                           trackStyle={this.trackStyle()} handleStyle={this.handleStyle()}/>
                </Row>
            </Grid>
        );
    }


    trackStyle() {
        return (this.state.sport === "football") ? [{backgroundColor: '#3adf5a'}] : [{backgroundColor: '#e1ab25'}]
    }

    handleStyle() {
        return (this.state.sport === "football") ? [{backgroundColor: '#2e7a3d'}] : [{backgroundColor: '#7d5c20'}]
    }

    handleSportChange(checked) {
        const sport = chooseSport(checked);
        this.setState({checked: checked, sport: sport, sliderValue: [0, this.scale]});
    }

}

function chooseSport(checked) {
    return (checked) ? "football" : "tennis";
}
