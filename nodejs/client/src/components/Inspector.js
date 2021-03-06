import React, {Component} from 'react';

import {Image, Grid, Row} from 'react-bootstrap';

export default class Inspector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: ""
        };

        this.getImage(this.props.sport, this.props.field)
            .then(res => {
                this.setState({image: res});
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.field !== this.props.field || nextState.image !== this.state.image;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.field !== this.props.field) {
            this.getImage(this.props.sport, this.props.field)
                .then(res => {
                    this.setState({
                        image: res,
                        sport: this.props.sport,
                        field: this.props.field,
                    });
                });
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Image src={this.state.image} height={this.props.height} onClick={this.handleClick} rounded/>
                </Row>
            </Grid>
        );
    }


    handleClick = () => {
        if (!this.props.handleClick) {
            console.log(this, "undefined click handler");
        } else {
            this.props.handleClick(this.props.field);
        }
    };

    getImage = async (sport, field) => {
        const response = await fetch(`/db/images/${sport}/${field}`);
        if (response.status !== 200) return "";


        const blob = await response.blob();
        const url = await URL.createObjectURL(blob);

        return url;
    };
}