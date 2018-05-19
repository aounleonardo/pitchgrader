import React, {Component} from 'react';
import Inspector from "./Inspector";

import {Row, Col} from 'react-bootstrap';

const waiting = <div>Waiting...</div>;
export default class Belt extends Component {

    constructor(props) {
        super(props);

        this.state = {
            similar: props.similar,
            sport: props.sport
        }

    }

    render() {
        if (!this.props.similar || this.props.similar.length < 2) {
            return waiting;
        }
        const length = Math.min(this.props.similar.length - 1, this.props.count);
        return (
            <div style={{display: "inline-block"}}>
                {this.props.similar.slice(1, length + 1).map((neighbour) =>
                    <Inspector sport={this.props.sport} field={neighbour.id} height={200}/>
                )}
            </div>
        );
    }
}