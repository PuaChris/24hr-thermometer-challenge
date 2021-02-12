import React from 'react';
import moment from 'moment';

import Sidebar from './Sidebar.js';
import ThermostatDisplay from './ThermostatDisplay.js';
import ThermostatMode from './ThermostatMode.js';
import * as Constants from '../helper/Constants.js';

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
      thermostatMode: Constants.THERMOSTAT_MODES.OFF,
      recentTimestamp: null,
      currentData: {
        humidity: null,
        inside: null,
        outside: null,
      },
    };

    this.activate = this.activate.bind(this);
    this.register = this.register.bind(this);
    this.fetchCurrentTemp = this.fetchCurrentTemp.bind(this);
    this.getCurrentTemp = this.getCurrentTemp.bind(this);
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

    this.getCurrentTemp();

  }

  // Turns on thermometer. No other interactions except for registration can happen unless it is on
  activate() {
    let currentThermostatMode = this.state.thermostatMode;
    let newThermostatMode = Constants.THERMOSTAT_MODES.OFF;

    if (currentThermostatMode === Constants.THERMOSTAT_MODES.OFF) {
      newThermostatMode = Constants.THERMOSTAT_MODES.AUTO_STANDBY;
    }
    else {
      newThermostatMode = Constants.THERMOSTAT_MODES.OFF;
    }

    this.setState({ thermostatMode: newThermostatMode }, () => {
      console.log(`New thermostat mode is: ${newThermostatMode}`);
    });
  }

  // Handles thermometer registration logic
  async register() {
    console.log("Beginning registration.");
    let { registerId, thermostatMode } = this.state;
    let url = null;
    let method = null;

    // Update registered thermometer with current mode
    if (this.state.registerId != null) {
      url = new URL(`${Constants.UPDATE_MODE_URL}${registerId}/`);
      method = "PATCH";
    }
    // Register a new thermometer
    else {
      url = new URL(Constants.REGISTER_URL);
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

  // Executes the actual GET requests
  async fetchCurrentTemp(sensorType, url) {
    const method = "GET";
    let recentTimestamp = this.state.recentTimestamp;

    // Only make call if at least 5 minutes has elapsed to prevent spamming of requests.
    if (recentTimestamp === null || moment().diff(recentTimestamp, 'minutes') > 5) {

      const begin = moment().subtract(15, 'minutes').format();
      const end = moment().format();

      // Assuming using EST and military time
      url.search = new URLSearchParams({
        begin: begin,
        end: end,
      });

      await fetch(url, {
        method: method,
      }).then(data => data.json())
        .then((data) => {
          // Compute average 
          let currentData = 0;
          data.data_points.forEach(dataPoint => {
            // toFixed converts a decimal back into a string
            currentData += parseFloat(parseFloat(dataPoint.value).toFixed(1));
          });

          currentData = parseFloat(parseFloat(currentData / data.data_points.length).toFixed(1));

          this.setState({
            recentTimestamp: moment().format(),
            [sensorType]: {
              currentTemp: currentData,
              displaySymbol: data.display_symbol,
            },
          }, () => console.log(`Retrieved ${sensorType} data with an average of ${currentData}${data.display_symbol}`));
        });
      return;
    }
  }

  // Retrieves data from the last 15 minutes and calculates the average temperature. Default call is for indoor temperature
  getCurrentTemp() {
    console.log(`Retrieving current data`);
    const humidityUrl = new URL(`${Constants.CURRENT_TEMP_URL}humidity-1`);
    const insideTempUrl = new URL(`${Constants.CURRENT_TEMP_URL}temperature-1`);
    const outsideTempUrl = new URL(`${Constants.CURRENT_TEMP_URL}outdoor-1`);

    this.fetchCurrentTemp(Constants.SENSOR_TYPE.HUMIDITY, humidityUrl);
    this.fetchCurrentTemp(Constants.SENSOR_TYPE.INSIDE, insideTempUrl);
    this.fetchCurrentTemp(Constants.SENSOR_TYPE.OUTSIDE, outsideTempUrl);

    console.log(`Current data retrieved`);
  }

  increaseDesiredTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp + 1 }));
  }

  decreaseDesiredTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp - 1 }));
  }

  switchThermostatMode(newThermostatMode) {
    // Do nothing if no change in mode
    if (this.state.thermostatMode === newThermostatMode) {
      return;
    }

    this.setState({ thermostatMode: newThermostatMode }, () => {
      switch (newThermostatMode) {
        case Constants.AUTO_MODE:
          console.log("Auto mode activated.");
          break;
        case Constants.THERMOSTAT_MODES.COOLING:
          console.log("Cooling mode activated.");
          break;
        case Constants.THERMOSTAT_MODES.HEATING:
          console.log("Heating mode activated.");
          break;
        default:
          console.log("Nothing happened");
      }
    });

    return;
  }

  render() {
    let { units, thermostatMode } = this.state;

    return (
      <div className="main container">
        <Sidebar units={units} />
        <div className="container" id="thermostat">
          <div className="unit-info container">
            <p className="unit-info__title"> Unit 100 - Thermostat</p>
            <button
              className={thermostatMode === Constants.THERMOSTAT_MODES.OFF ? "unit-info__power unit-info__buttons on" : "unit-info__power unit-info__buttons off"}
              onClick={this.activate}
            >
              {thermostatMode === Constants.THERMOSTAT_MODES.OFF ? "Turn On" : " Turn Off"}
            </button>
            <button
              className="unit-info__register unit-info__buttons"
              onClick={this.register}
            >
              Register
            </button>
          </div>

          <div className="container thermostat-control">
            <ThermostatDisplay />
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