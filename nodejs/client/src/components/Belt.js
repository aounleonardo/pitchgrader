import React, {Component} from 'react';
import Inspector from "./Inspector";

import {Grid, Row} from 'react-bootstrap';

const waiting = <div>Waiting...</div>;
export default class Belt extends Component {

    render() {
        if (!this.props.similar || this.props.similar.length < 2) {
            return waiting;
        }
        const length = Math.min(this.props.similar.length - 1, this.props.count);
        return (
            <Grid>
                <Row>
                    {this.props.similar.slice(1, length + 1).map((neighbour) =>
                        <Inspector key={"belt-" + neighbour.id} sport={this.props.sport} field={neighbour.id}
                                   height={200} handleClick={this.props.imageClick}/>
                    )}
                </Row>
            </Grid>
        );
    }
}