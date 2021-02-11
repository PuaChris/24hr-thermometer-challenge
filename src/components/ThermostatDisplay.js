import React from 'react';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import '../styles/ThermostatDisplay.css';

class ThermostatDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    

    };
  }

  render() {
   
    const value = 0.66;

    return(
      <div className="container" id="thermostat-display">
        <CircularProgressbar 
          value={value} 
          maxValue={1} 
          text={`${value * 100}%`}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0,
         
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',
         
            // Text size
            textSize: '16px',
         
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,
         
            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',
         
            // Colors
            pathColor: `rgba(62, 152, 199, ${value * 100})`,
            textColor: '#f88',
            trailColor: '#d6d6d6',
            backgroundColor: '#3e98c7',
          })}
        />

      </div>
    );
  }
}

export default ThermostatDisplay;