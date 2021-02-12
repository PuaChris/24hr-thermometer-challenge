import React from 'react';

import Sidebar from './Sidebar.js';
import ThermostatDisplay from './ThermostatDisplay.js';
import ThermostatMode from './ThermostatMode.js';

import '../styles/Styles.css';
import '../styles/Thermostat.css'

class unit {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.desiredTemp = null;    
  }
}

class Thermostat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      power: false,
      units: [],
      currentUnit: null,
    };

    this.activate = this.activate.bind(this);
  }

  componentDidMount() {
    let newUnits = [];
    for (let i = 0; i < 10; i++) {
      newUnits.push(new unit(i + 1, `Unit ${i + 1}00`));
    }

    this.setState({
      units: newUnits,
    });
  }

  activate() {
    this.setState(
      (prevState) => ({
        power: !prevState.power,
      })
    );

  }

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

          <div className="thermostat-control container">
            <ThermostatDisplay/>
            <ThermostatMode/>
          </div>
        </div>
      </div>
    );
  }
}

export default Thermostat;