import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
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
      // TODO: Add up and down arrows to indicate temperature going up or down
      <div className="container" id="thermostat-display">
        <CircularProgressbarWithChildren 
          value={value} 
          maxValue={1} 
          text={`${value * 100}\u00b0`}
          circleRatio={0.75}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0.625,
         
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'butt',
         
            // Text size
            textSize: '23px',
         
            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,
         
            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',
         
            // Colors
            pathColor: `rgba(224, 98, 77, ${value * 100})`,
            textColor: '#455A6B',
            trailColor: '#352C6F',
            backgroundColor: '#3e98c7',
          })}
        />
        <div className="container thermostat-display__modifier">
          <button className="thermostat-display__button plus">
            <FontAwesomeIcon icon="plus"/>
          </button>
          <button className="thermostat-display__button minus">
            <FontAwesomeIcon icon="minus"/>
          </button>

        </div>

      </div>
    );
  }
}

export default ThermostatDisplay;