import React, {useState} from 'react';

import { AUTO_MODE, THERMOSTAT_MODES } from '../helper/Constants.js';

import '../styles/ThermostatMode.css';

const ThermostatMode = (props) => {
  const thermostatMode = props.thermostatMode;
  const currentData = props.currentData;
  const switchThermostatMode = props.switchThermostatMode;

  const initAuto = thermostatMode === THERMOSTAT_MODES.AUTO_STANDBY || thermostatMode === THERMOSTAT_MODES.AUTO_COOLING || thermostatMode === THERMOSTAT_MODES.AUTO_HEATING;
  const initCooling = thermostatMode === THERMOSTAT_MODES.COOLING;
  const initHeating = thermostatMode === THERMOSTAT_MODES.HEATING;

  const [isAuto, setAuto] = useState(initAuto);
  const [isCooling, setCooling] = useState(initCooling);
  const [isHeating, setHeating] = useState(initHeating);


  // Do not like having two separate switch statements to manage modes
  const handleThermostatMode = (newThermostatMode) => {
    switch(newThermostatMode) {
      case AUTO_MODE:
        setAuto(true);
        setCooling(false);
        setHeating(false);
        break;
      case THERMOSTAT_MODES.COOLING:
        if (currentData.outside.currentAverage < 0){
          console.log("Outside temperature is lower than inside temperature")
          return;
        }
        setAuto(false);
        setCooling(true);
        setHeating(false);
        break;
      case THERMOSTAT_MODES.HEATING:
        setAuto(false);
        setCooling(false);
        setHeating(true);
        break;
      case THERMOSTAT_MODES.OFF:
      default:
        setAuto(false);
        setCooling(false);
        setHeating(false);
        break;
    }
    
    switchThermostatMode(newThermostatMode);
  }

  // Only initialize when thermometer is turned on

  return(
    <div className="container" id="thermostat-mode">
      <p className="thermostat-mode__title">Thermostat Mode</p>
      <div className="container thermostat-mode__buttons">
        <button 
          className={isAuto ? "thermostat-mode__auto mode_focus" : "thermostat-mode__auto"}
          onClick={() => handleThermostatMode(AUTO_MODE)}
        >  
            Auto
        </button>
        <button 
          className={isCooling ? "thermostat-mode__cooling mode_focus" : "thermostat-mode__cooling"}
          onClick={() => handleThermostatMode(THERMOSTAT_MODES.COOLING)}
        >
          Cooling
        </button>
        <button 
          className={isHeating ? "thermostat-mode__heating mode_focus" : "thermostat-mode__heating"}
          onClick={() => handleThermostatMode(THERMOSTAT_MODES.HEATING)}
        >
          Heating
        </button>
      </div>
    </div>
  );
}


export default ThermostatMode;