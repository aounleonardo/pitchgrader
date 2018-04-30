import React, { Component } from 'react';
import './App.css';



class App extends Component {
    render() {
        return (
            <div className="shopping-list">
                <h1>Shopping List for {this.props.name}</h1>
                <ul>
                    <li>Instagram</li>
                    <li>WhatsApp</li>
                    <li>Oculus</li>
                    <li>{process.env.REACT_APP_MAPBOX_TOKEN}</li>
                </ul>
            </div>
        );
    }
}

export default App;
