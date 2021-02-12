import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProgressBar from './ProgressBar.js';
import * as Constants from '../helper/Constants.js';
import '../styles/ThermostatDisplay.css';

const ThermostatDisplay = (props) => {
  // Adding one decimal place to match the current data decimal notation
  const desiredTemp = parseFloat(props.desiredTemp).toFixed(1);
  const currentData = props.currentData;
  const displaySymbol = currentData.inside.displaySymbol;
  const currentTemp = currentData.inside.currentAverage;
  const thermostatMode = props.thermostatMode;

  const increaseTemp = props.increaseTemp;
  const decreaseTemp = props.decreaseTemp;

  const percentage = Math.min((desiredTemp/35)*100, 100);

  let currentModeDescription = "";

  switch (thermostatMode) {
    case Constants.THERMOSTAT_MODES.AUTO_COOLING:
      currentModeDescription = "Auto Cooling Mode";
      break; 
    case Constants.THERMOSTAT_MODES.AUTO_HEATING:
      currentModeDescription = "Auto Heating Mode";
      break;
    case Constants.THERMOSTAT_MODES.AUTO_STANDBY:
      currentModeDescription = "Stand By Mode";
      break;
    case Constants.THERMOSTAT_MODES.COOLING:
      currentModeDescription = "Cooling Mode";
      break;
    case Constants.THERMOSTAT_MODES.HEATING:
      currentModeDescription = "Heating Mode";
      break;
    default:
  }


  return (
    <div className="container" id="thermostat-display">

      <div className="container thermostat-display__info">
        <div className="container thermostat-display__info__temp">
          <span className="thermostat-display__info__title">Inside</span>
          <span className="thermostat-display__info__value">{currentTemp}{displaySymbol}</span>
        </div>

        <FontAwesomeIcon className="thermostat-display__info__arrow" icon="long-arrow-alt-right"/>

        <div className="container thermostat-display__info__temp">
          <span className="thermostat-display__info__title">Set To</span>
          <span className="thermostat-display__info__value">{desiredTemp}{displaySymbol} </span>
        </div>
      </div>

      <div className="container thermostat-display__modifier">
        <button 
          className="thermostat-display__button minus"
          onClick={() => decreaseTemp()}  
        >
          <FontAwesomeIcon icon="minus" />
        </button>

        <ProgressBar percentage={percentage} />

        <button 
          className="thermostat-display__button plus"
          onClick={() => increaseTemp()}  
        >
          <FontAwesomeIcon icon="plus" />
        </button>
      </div>
      <span>{currentModeDescription}</span>

    </div>
  );
}

export default ThermostatDisplay;