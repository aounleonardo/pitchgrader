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
        this.state = {
            checked: props.checked,
            sport: chooseSport(props.checked),
            minScore: 0,
            maxScore: 20,
            value: [0, 20]
        };
        this.handleSportChange = this.handleSportChange.bind(this);
        this.handleScoreChange = this.handleScoreChange.bind(this);
    }

    componentDidUpdate() {
        this.map.current.getSport(this.state.sport);
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
                <Row style={{ width: 300, paddingTop: 50 }}>
                    <Range min={this.state.minScore} max={this.state.maxScore} defaultValue={[0, 20]} onAfterChange={this.handleScoreChange}/>
                </Row>
            </Grid>
        );
    }

    handleSportChange(checked) {
        const sport = chooseSport(checked);
        this.setState({checked: checked, sport: sport});
    }


    handleScoreChange(value) {
        this.setState({value: value});
    }
}

function chooseSport(checked) {
    return (checked) ? "football" : "tennis";
}
