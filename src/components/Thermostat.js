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

    const registerId = localStorage.getItem("thermostatId");

    // Assume Thermostat starts in Auto mode
    this.state = {
      units: [],
      registerId: registerId ? registerId : null,
      currentUnit: null,
      thermostatMode: Constants.THERMOSTAT_MODES.OFF,
      recentTimestamp: null,
      desiredTemp: 23.0,
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
    this.increaseTemp = this.increaseTemp.bind(this);
    this.decreaseTemp = this.decreaseTemp.bind(this);
    this.switchThermostatMode = this.switchThermostatMode.bind(this);
  }

  componentDidMount() {
    // Retrieve indoor and outdoor temperature data
    this.getCurrentTemp();

    // Display units on sidebar for demonstration purposes
    let newUnits = [];
    for (let i = 0; i < 10; i++) {
      newUnits.push(new unit(i + 1, `Unit ${i + 1}00`));
    }

    this.setState({
      units: newUnits,
    });
  }

  // Turns on thermometer. No other interactions except for registration can happen unless it is on
  activate() {
    let currentThermostatMode = this.state.thermostatMode;
    let currentData = this.state.currentData;
    let newThermostatMode = Constants.THERMOSTAT_MODES.OFF;

    // Preventative to initializing components without data being retrieved
    if (!currentData) {
      return;
    }

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
        localStorage.setItem("thermostatId", registerInfo.uid_hash);
        console.log(`Registration complete with ${method}. ID of thermostat is ${registerInfo.uid_hash}`);
      });
  }

  // Executes the actual GET requests
  async fetchCurrentTemp(sensorType, url) {
    const method = "GET";
    let recentTimestamp = this.state.recentTimestamp;
    let newData = {};

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
          let currentAverage = 0;
          data.data_points.forEach(dataPoint => {
            // toFixed converts a decimal back into a string
            currentAverage += parseFloat(parseFloat(dataPoint.value).toFixed(1));
          });

          currentAverage = parseFloat(parseFloat(currentAverage / data.data_points.length).toFixed(1));

          newData = {
            sensorType: sensorType,
            currentAverage: currentAverage,
            displaySymbol: data.display_symbol,
          };

            console.log(`Retrieved ${sensorType} data with an average of ${currentAverage}${data.display_symbol}`);
        });
        return newData;
    }
    else {
      console.log(`Data is still too recent to retrieve new data`);
      return this.state.currentData[sensorType];
    }
  }

  // Retrieves data from the last 15 minutes and calculates the average temperature. Default call is for indoor temperature
  async getCurrentTemp() {
    console.log(`Retrieving current data`);
    const humidityUrl = new URL(`${Constants.CURRENT_TEMP_URL}humidity-1`);
    const insideTempUrl = new URL(`${Constants.CURRENT_TEMP_URL}temperature-1`);
    const outsideTempUrl = new URL(`${Constants.CURRENT_TEMP_URL}outdoor-1`);

    const humidityPromise = this.fetchCurrentTemp(Constants.SENSOR_TYPE.HUMIDITY, humidityUrl);
    const insidePromise = this.fetchCurrentTemp(Constants.SENSOR_TYPE.INSIDE, insideTempUrl);
    const outsidePromise = this.fetchCurrentTemp(Constants.SENSOR_TYPE.OUTSIDE, outsideTempUrl);

    let humidityData = null;
    let insideData = null;
    let outsideData = null;

    await Promise.all([humidityPromise, insidePromise, outsidePromise]).then((results) => {
      results.forEach((result) => {
        switch(result.sensorType){
          case Constants.SENSOR_TYPE.HUMIDITY:
            humidityData = result;
            break;
          case Constants.SENSOR_TYPE.INSIDE:
            insideData = result;
            break;
          case Constants.SENSOR_TYPE.OUTSIDE:
            outsideData = result;
            break;
        }
        console.log(result);
      });
      console.log(`Retrieved all current data`);
    });


    // Reset timestamp
    this.setState({
      recentTimestamp: moment().format(),
      currentData: {
        humidity: humidityData,
        inside: insideData,
        outside: outsideData
      }
    });
  }

  // Assuming Auto Mode
  increaseTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp + 0.1 }), () => {
      if (this.state.desiredTemp >= this.state.currentData.inside.currentAverage) {
        this.switchThermostatMode(Constants.AUTO_MODE);
      }
    });
  }

  // Assuming Auto Mode
  decreaseTemp() {
    this.setState((prevState) => ({ desiredTemp: prevState.desiredTemp - 0.1 }), () => {
      if (this.state.desiredTemp <= this.state.currentData.inside.currentAverage) {
        this.switchThermostatMode(Constants.AUTO_MODE);
      }
    });
  }

  switchThermostatMode(newThermostatMode) {
    const thermostatMode = this.state.thermostatMode;
    const desiredTemp = this.state.desiredTemp;
    const currentData = this.state.currentData;

    // Do nothing if no change in mode
    if (thermostatMode === newThermostatMode) {
      console.log("No change occurred");
      return;
    }


    switch (newThermostatMode) {
      // Break down into my specific auto mode
      case Constants.AUTO_MODE:
        if (desiredTemp < currentData.inside.currentAverage && currentData.outside.currentAverage >= 0){
          newThermostatMode = Constants.THERMOSTAT_MODES.AUTO_COOLING;
          console.log("Auto cooling mode activated.");
        }
        else if (desiredTemp > currentData.inside.currentAverage){
          newThermostatMode = Constants.THERMOSTAT_MODES.AUTO_HEATING;
          console.log("Auto heating mode activated.");
        }
        else {
          newThermostatMode = Constants.THERMOSTAT_MODES.AUTO_STANDBY;
          console.log("Auto standby mode activated.");
        }
        break;
      case Constants.THERMOSTAT_MODES.COOLING:
        console.log("Cooling mode activated.");
        break;
      case Constants.THERMOSTAT_MODES.HEATING:
        console.log("Heating mode activated.");
        break;
      default:
        console.log("No change occurred");
    }

    this.setState({thermostatMode: newThermostatMode});

    return;
  }

  render() {
    let { units, desiredTemp, currentData, thermostatMode } = this.state;

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
          {thermostatMode === Constants.THERMOSTAT_MODES.OFF ? "" : 
          <div className="container thermostat-control">
            <ThermostatDisplay 
              desiredTemp={desiredTemp}
              currentData={currentData}
              thermostatMode={thermostatMode}
              increaseTemp={this.increaseTemp}
              decreaseTemp={this.decreaseTemp}
            />
            <ThermostatMode
              thermostatMode={thermostatMode}
              currentData={currentData}
              getCurrentTemp={this.getCurrentTemp}
              switchThermostatMode={this.switchThermostatMode}
            />
          </div>
          }
        </div>
      </div>
    );
  }
}

export default Thermostat;