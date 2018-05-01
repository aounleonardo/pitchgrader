import React, { Component } from 'react';

import './App.css';

import ReactMapboxGl, {Layer, Feature} from "react-mapbox-gl";


const Mapbox = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    minZoom: 10,
    maxZoom: 20
});

class App extends Component {
    render() {
        return (
            <div>
                <h1>Hello {this.props.name}</h1>
                <Mapbox style="mapbox://styles/mapbox/streets-v9"
                        center={[6.5668, 46.5191]}
                        zoom={[15]}
                        containerStyle={{
                            height: "100vh",
                            width: "100vw"
                        }}>
                    <Layer type="symbol" id="marker" layout={{"icon-image": "marker-15"}}>
                        <Feature coordinates={[6.5668, 46.5191]}/>
                    </Layer>
                </Mapbox>
            </div>
        );
    }
}

export default App;