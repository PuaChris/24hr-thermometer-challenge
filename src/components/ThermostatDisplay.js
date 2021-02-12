import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProgressBar from './ProgressBar.js';
import '../styles/ThermostatDisplay.css';

const ThermostatDisplay = (props) => {
  const value = 66;

  return (
    <div className="container" id="thermostat-display">

      <div className="container thermostat-display__info">
        <div className="container thermostat-display__info__temp">
          <span className="thermostat-display__info__title">Inside</span>
          <span className="thermostat-display__info__value">20{'\u00b0'} C</span>
        </div>

        {/* //TODO: Put in modifer for different thermostat states (e.g. auto heating, cooling, etc.) */}
        <FontAwesomeIcon className="thermostat-display__info__arrow" icon="long-arrow-alt-right" />

        <div className="container thermostat-display__info__temp">
          <span className="thermostat-display__info__title">Set To</span>
          <span className="thermostat-display__info__value">23{'\u00b0'} C</span>
        </div>
      </div>
      <div className="container thermostat-display__modifier">
        <button className="thermostat-display__button minus">
          <FontAwesomeIcon icon="minus" />
        </button>
        <ProgressBar percentage={value} />
        <button className="thermostat-display__button plus">
          <FontAwesomeIcon icon="plus" />
        </button>
      </div>
      <span>Auto Heating</span>

    </div>
  );
}

export default ThermostatDisplay;