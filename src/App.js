import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType } from './Data';
import { WIDTH, HEIGHT, POPULATION_SIZE} from './Data';

const INTERVAL = 200; //move interval in milli seconds
const MARGIN = 50;
let mobility = 0.5; // Number between 0 - 1; 1 being very mobile. 0 is not moving at all.

let aTimer;

const styles = {
  button: {
    margin: 10, 
    padding: 10,
    borderWidth: 2,
    borderColor: 'grey'
  }
}

function App() {
  let contents = [];
  const [population, setPopulation] = useState(POPULATION_SIZE);
  const [dots, setDots] = useState(generateRandomDots(population, WIDTH, HEIGHT)); //Initialise.
  const [lastUpdate, setLastUpdate] = useState(0);
  const [stopped, setStopped] = useState(false);

  let d = new Date();
  let n = d.getTime();
  //console.log('Number of Infected is: ' + numOfInfected);
  const numberOfInfected = numberOfType(dots, 'red');
  if ( numberOfInfected < dots.length && numberOfInfected !== 0) {
    if (n > lastUpdate + INTERVAL && !stopped) {
      setLastUpdate(n);
      aTimer = setTimeout(()=> {
        const newDots = infectDots(moveDots(dots, mobility));
        setDots(newDots);
      }, INTERVAL);
  }
}

  dots.forEach((dot) => {
    contents.push(<Circle color={dot.color} x={dot.x + MARGIN} y={dot.y + MARGIN}></Circle>); //Shift the display area by MARGIN
  });

  const onPause = () => {
    if(aTimer) {
      clearTimeout(aTimer);
      aTimer = null;
    }
    setStopped(!stopped);
  }

  const onRestart = () => {
    setDots(generateRandomDots(population, WIDTH, HEIGHT));
    setStopped(false);
  }

  const onMobilityChanged = (event) => {
    mobility = event.target.value;
  }

  return (
    <div className="App">
      <div className='body'>
        <div className='grid'>
          {contents}
        </div>
        <div style={{marginTop: 50, marginLeft: 400 + 50 + 10}}>
        <div>{'Infected: ' + numberOfType(dots, 'red') } </div>
        <div>{'Dead: ' + numberOfType(dots, 'black')} </div>
        <div>{'Recovered:  ' + numberOfType(dots, 'green') } </div>
        <div>{'Unaffected: ' +numberOfType(dots, 'blue') } </div>
        <input id="typeinp" type="range" min="0" max="1" defaultValue="0.5" step="0.1" style={{width: 100}} onChange={onMobilityChanged}/>

        </div>
        
      </div>

    </div>
  );
}

export default App;
