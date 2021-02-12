import './App.css';
import Thermostat from './components/Thermostat';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faMinus)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <Thermostat/>    
    </div>
  );
}

export default App;
