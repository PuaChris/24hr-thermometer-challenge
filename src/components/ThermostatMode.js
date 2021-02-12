import React from 'react';

import { THERMOSTAT_MODES } from '../Constants.js';

import '../styles/ThermostatMode.css';

const ThermostatMode = (props) => {
  const switchThermostatMode = props.switchThermostatMode;

  return(
    <div className="container" id="thermostat-mode">
      <p className="thermostat-mode__title">Thermostat Mode</p>
      <div className="container thermostat-mode__buttons">
        <button 
          className="thermostat-mode__auto"
          onClick={() => switchThermostatMode(THERMOSTAT_MODES.AUTO)}
        >  
            Auto
        </button>
        <button 
          className="thermostat-mode__cooling"
          onClick={() => switchThermostatMode(THERMOSTAT_MODES.COOLING)}
        >
          Cooling
        </button>
        <button 
          className="thermostat-mode__heating"
          onClick={() => switchThermostatMode(THERMOSTAT_MODES.HEATING)}
        >
          Heating
        </button>
      </div>
    </div>
  );
}


export default ThermostatMode;