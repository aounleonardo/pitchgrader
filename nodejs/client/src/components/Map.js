import React, {Component} from 'react';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";

export default class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            football: [],
            tennis: [],
            selected: [],
            highlighted: [],
            features: {
                football: [],
                tennis: [],
                selected: [],
                highlighted: [],
            },
            center: [6.5668, 46.5191],
            zoom: [props.initialZoom],
        };

        this.featureClick = props.featureClick;

        this.mapbox = ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
            minZoom: 9,
            maxZoom: 20
        });

        this.markers = this.populateMarkers(props.markerSize);
        this.highlightFeature = this.highlightFeature.bind(this);
        this.unhighlightFeature = this.unhighlightFeature.bind(this);
        this.setSelectedFeatures = this.setSelectedFeatures.bind(this);
        this.unsetSelectedFeatures = this.unsetSelectedFeatures.bind(this);
        this.flyToField = this.flyToField.bind(this);
    }

    componentDidMount() {
        this.getSport(this.props.sport);
    }

    componentDidUpdate(prevProps, prevState) {
        const currentSport = this.props.sport;
        if (prevProps.sport !== currentSport) {
            this.getSport(currentSport);
        }
    }

    getSport(sport) {
        this.getPoints(sport)
            .then(res => {
                this.setState({
                    minScore: res.minScore,
                    maxScore: res.maxScore,
                    features: this.populateFeatures(sport, res.locations),
                });
            })
            .catch(err => console.log(err));
    }

    getSportInRange(sport, grades, scale) {
        this.getPointsInScoreRange(sport, grades, scale)
            .then(res => {
                this.setState({features: this.populateFeatures(sport, res.locations)});
            })
            .catch(err => console.log(err));
    }

    flyToField(field) {
        const found = this.state.features[this.props.sport].find((feature) => {
            return feature.id === field;
        });
        if (found) {
            this.setState({center: [found.longitude, found.latitude], zoom:[this.props.initialZoom]})
        }
    }

    render() {
        return (
            // mapbox://styles/mapbox/streets-v9
            // mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab
            <div>
                <this.mapbox style="mapbox://styles/aounleonardo/cjgthx50a002f2rp5soeptwab"
                             center={this.state.center}
                             zoom={this.state.zoom}
                    // longitude, latitude
                             maxBounds={[[5.75, 46], [7.5, 47]]}
                             containerStyle={{
                                 height: "60vh",
                                 borderRadius: 10
                             }}>
                    {["football", "tennis", "selected", "highlighted"].map((name) => this.createLayer(name))}
                </this.mapbox>
            </div>
        );
    }

    getPoints = (sport) => this.contactServerWith('/db/locations/' + sport);

    getPointsInScoreRange = (sport, grades, scale) => {
        const scoreRange = this.state.maxScore - this.state.minScore;
        const minScore = (grades.min / scale) * scoreRange + this.state.minScore;
        const maxScore = (grades.max / scale) * scoreRange + this.state.minScore;
        const request = `/db/locations/${sport}/range/${minScore}/${maxScore}`;
        return this.contactServerWith(request)
    };

    populateMarkers = (size) => {
        return ["football", "tennis", "selected", "highlighted"].reduce((ret, name) => {
            ret[name] = this.createMarker(size, name);
            return ret;
        }, {});
    };

    createMarker = (size, name) => {
        const marker = new Image(size, size);
        marker.src = `/images/markers/${name}.png`;
        return marker;
    };

    createLayer = (name) => {
        const zoom = (name === "selected") ? 9 : 14;
        return (<Layer type="symbol" key={name} minZoom={zoom} layout={{"icon-image": name}} images={[name, this.markers[name]]}>
            {this.state.features[name].map((feature) => <Feature
                coordinates={[feature.longitude, feature.latitude]}
                onClick={() => {
                    this.featureClick(feature,
                        this.state.features[name])
                }}
                onMouseEnter={(mapWithEvt) => {
                    this.highlightFeature(feature);
                }}
                onMouseLeave={(mapWithEvt) => {
                    this.unhighlightFeature();
                }}
                key={feature.id}/>)}
        </Layer>);
    };

    populateFeatures = (sport, features) => {
        const ret = {
            football: [],
            tennis: [],
            selected: [],
            highlighted: [],
        };
        ret[sport] = features;
        return ret;
    };

    highlightFeature = (feature) => {
        const ret = this.state.features;
        ret.highlighted = [feature];
        this.setState({features: ret});
    };

    unhighlightFeature = () => {
        const ret = this.state.features;
        ret.highlighted = [];
        this.setState({features: ret});
    };

    setSelectedFeatures = (features) => {
        const ret = this.state.features;
        ret.selected = features;
        this.setState({features: ret});
    };

    unsetSelectedFeatures = () => {
        const ret = this.state.features;
        ret.selected = [];
        this.setState({features: ret});
    };


    contactServerWith = async (request) => {
        const response = await fetch(request);

        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };
}

