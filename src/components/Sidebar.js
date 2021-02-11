import React from 'react';

import '../styles/Styles.css';
import '../styles/Sidebar.css';

class Sidebar extends React.Component{
  constructor(props){
    super(props);

  }
  render() {
    return(
      <div className="container sidebar">
        This is a sidebar
      </div>
    )
  }
}

export default Sidebar;