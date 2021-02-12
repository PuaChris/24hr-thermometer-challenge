import React from 'react';

import '../styles/Styles.css';
import '../styles/Sidebar.css';

function Sidebar(props) {

  const units = props.units;
  

  return(
    <ul className="sidebar container">
      <span className="sidebar__title">Building Units ({units.length})</span>
      {units.map((unit) => (
        <button 
          key={unit.id}
          className="sidebar-units"
        >
          {unit.name}
        </button>
      ))}
    </ul>
  )
}

export default Sidebar;