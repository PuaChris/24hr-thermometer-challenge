import React from 'react';

import Sidebar from './Sidebar.js';
import ThermostatDisplay from './ThermostatDisplay.js';
import ThermostatMode from './ThermostatMode.js';
import { THERMOSTAT_MODES } from '../Constants.js';

import '../styles/Styles.css';
import '../styles/Thermostat.css'

class unit {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.desiredTemp = null;
    this.insideTemp = null;
    this.outsideTemp = null;    
  }
}

class Thermostat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      power: false,
      units: [],
      currentUnit: null,
      thermostatMode: null,
    };

    this.activate = this.activate.bind(this);
    this.switchThermostatMode = this.switchThermostatMode.bind(this);
  }

  // Retrieve indoor and outdoor temperature data
  componentDidMount() {
    // Display units on sidebar for demonstration purposes
    let newUnits = [];
    for (let i = 0; i < 10; i++) {
      newUnits.push(new unit(i + 1, `Unit ${i + 1}00`));
    }

    this.setState({
      units: newUnits,
    });
  }

  // To turn on thermometer. No other interactions can happen unless it is on
  activate() {
    this.setState(
      (prevState) => ({
        power: !prevState.power,
      })
    );
  }

  // Future: Reduce increments to 0.1 and implement a slide bar and/or ability to hold down the button to continuously increase/decrease temperature
  increaseDesiredTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp + 1 }));
  }

  decreaseDesiredTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp - 1 }));
  }

  switchThermostatMode(newThermostatMode) {
    // Do nothing if no change in mode
    if (this.state.thermostatMode === newThermostatMode){
      return;
    }

    this.setState({ thermostatMode: newThermostatMode}, () => {
      switch(newThermostatMode){
        case THERMOSTAT_MODES.AUTO:
          console.log("Auto mode activated.");
          break;
        case THERMOSTAT_MODES.COOLING:
          console.log("Cooling mode activated.");
          break;
        case THERMOSTAT_MODES.HEATING:
          console.log("Heating mode activated.");
          break;
        default:
          console.log("Nothing happened");
      }
    });
    
    return;
  }

  // TODO: Set thermostat-control opacity to 30% when thermostat is turned off

  render() {
    let { power, units } = this.state;
  
    return(
      <div className="main container">
        <Sidebar units={units}/>
        <div className="container" id="thermostat">
          <div className="unit-info container">
            <p className="unit-info__title"> Unit 100 - Thermostat</p>
            <button 
              className={!power ? "on-off__button on" : "on-off__button off"}
              onClick={this.activate}  
            >
               {!power ? "Turn On" : " Turn Off"} 
            </button>
          </div>

          <div className="container thermostat-control">
            <ThermostatDisplay/>
            <ThermostatMode switchThermostatMode={this.switchThermostatMode}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Thermostat;