import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProgressBar from './ProgressBar.js';
import '../styles/ThermostatDisplay.css';

const ThermostatDisplay = (props) => {
  // Adding one decimal place to match the current data decimal notation
  const desiredTemp = parseFloat(props.desiredTemp).toFixed(1);
  const currentData = props.currentData;
  const displaySymbol = currentData.inside.displaySymbol;
  const currentTemp = currentData.inside.currentAverage;

  const increaseTemp = props.increaseTemp;
  const decreaseTemp = props.decreaseTemp;

  const percentage = Math.min((desiredTemp/35)*100, 100);

  const isHeating = desiredTemp > currentTemp ? true : false;

  return (
    <div className="container" id="thermostat-display">

      <div className="container thermostat-display__info">
        <div className="container thermostat-display__info__temp">
          <span className="thermostat-display__info__title">Inside</span>
          <span className="thermostat-display__info__value">{currentTemp}{displaySymbol}</span>
        </div>

        {/* //TODO: Change arrow for different thermostat states (e.g. auto heating, cooling, etc.) */}
        <FontAwesomeIcon id="thermostat-display__info__arrow" className={isHeating ? "heat" : "cool"}  icon="long-arrow-alt-right"/>

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
      <span>Auto Heating</span>

    </div>
  );
}

export default ThermostatDisplay;