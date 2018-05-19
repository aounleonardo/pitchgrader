import React, {Component} from 'react';

export default class Inspector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sport: props.sport,
            field: props.field,
            image: ""
        };

        this.getImage(this.state.sport, this.state.field)
            .then(res => {
                this.setState({image: res});
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const res = nextProps.field !== this.props.field
            || (nextState.image !== this.state.image && (this.state.field !== nextState.field));
        return res
    }

    componentDidUpdate(prevProps, prevState) {
        this.getImage(this.props.sport, this.props.field)
            .then(res => {
                this.setState({
                    image: res,
                    sport: this.props.sport,
                    field: this.props.field,
                });
            });
    }

    render() {
        return (<img src={this.state.image} height={this.props.height}/>);
    }

    getImage = async (sport, field) => {
        const response = await fetch(`/db/images/${sport}/${field}`);
        if (response.status !== 200) return "";


        const blob = await response.blob();
        const url = await URL.createObjectURL(blob);

        return url;
    };
}