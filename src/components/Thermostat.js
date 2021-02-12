import React from 'react';

import Sidebar from './Sidebar.js';
import ThermostatDisplay from './ThermostatDisplay.js';
import ThermostatMode from './ThermostatMode.js';
import { THERMOSTAT_MODES, AUTO_MODE, REGISTER_URL, UPDATE_MODE_URL} from '../helper/Constants.js';

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

    // Assume Thermostat starts in Auto mode
    this.state = {
      units: [],
      registerId: null,
      currentUnit: null,
      thermostatMode: THERMOSTAT_MODES.OFF,
    };

    this.activate = this.activate.bind(this);
    this.register = this.register.bind(this);
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
    let currentThermostatMode = this.state.thermostatMode;
    let newThermostatMode = THERMOSTAT_MODES.OFF;

    if (currentThermostatMode === THERMOSTAT_MODES.OFF){
      newThermostatMode = THERMOSTAT_MODES.AUTO_STANDBY;
    }
    else {
      newThermostatMode = THERMOSTAT_MODES.OFF;
    }

    this.setState({thermostatMode: newThermostatMode}, () => {
      console.log(`New thermostat mode is: ${newThermostatMode}`);
    });
  }

  async register() {
    console.log("Beginning registration.");
    let { registerId, thermostatMode } = this.state;
    let url = null;
    let method = null;

    if (this.state.registerId != null) {
      url = new URL(`${UPDATE_MODE_URL}${registerId}/`);
      method = "PATCH";
    }
    else {
      url = new URL(REGISTER_URL);
      method = "POST";
    }

    url.search = new URLSearchParams({
      state: thermostatMode, 
    });

    await fetch(url, {
      method: method,
    }).then(data => data.json())
      .then((registerInfo) => {
        this.setState({
          registerId: registerInfo.uid_hash,
        });
      })
    console.log(`Registration complete with ${method}.`);
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
        case AUTO_MODE:
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
    let {units, registerId, thermostatMode } = this.state;
  
    return(
      <div className="main container">
        <Sidebar units={units}/>
        <div className="container" id="thermostat">
          <div className="unit-info container">
            <p className="unit-info__title"> Unit 100 - Thermostat</p>
            <button 
              className={thermostatMode === THERMOSTAT_MODES.OFF ? "unit-info__power unit-info__buttons on" : "unit-info__power unit-info__buttons off"}
              onClick={this.activate}  
            >
               {thermostatMode === THERMOSTAT_MODES.OFF ? "Turn On" : " Turn Off"} 
            </button>
            <button 
              className="unit-info__register unit-info__buttons"
              onClick={this.register}
            > 
              Register
            </button>
          </div>

          <div className="container thermostat-control">
            <ThermostatDisplay/>
            <ThermostatMode 
              thermostatMode={thermostatMode}
              switchThermostatMode={this.switchThermostatMode}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Thermostat;