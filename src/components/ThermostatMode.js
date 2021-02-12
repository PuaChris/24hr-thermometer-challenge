import React from 'react';

import '../styles/ThermostatMode.css';

class ThermostatMode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      

    };
  }

  render() {
    return(
      <div className="container" id="thermostat-mode">
        <p className="thermostat-mode__title">Thermostat Mode</p>
        <button className="thermostat-mode__auto">Auto</button>
        <button className="thermostat-mode__cooling">Cooling</button>
        <button className="thermostat-mode__heating">Heating</button>
      </div>
    );
  }
}

export default ThermostatMode;