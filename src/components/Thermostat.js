import React from 'react';

import Sidebar from './Sidebar.js';
import ThermostatDisplay from './ThermostatDisplay.js';
import ThermostatMode from './ThermostatMode.js';


import '../styles/Styles.css';
import '../styles/Thermostat.css'


class Thermostat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      power: false,

    };
  }

  render() {
    return(
      <div className="container main">
        <Sidebar/>
        <div className="container" id="thermostat">
          <div className="container unit-info">
            <h1 className="unit-info__title"> Unit 100 - Thermostat</h1>
            <button className="on-off__button"> Turn On/Off </button>
          </div>

          <div className="container thermostat-control">
            <ThermostatDisplay/>
            <ThermostatMode/>
          </div>
        </div>
      </div>
    );
  }
}

export default Thermostat;