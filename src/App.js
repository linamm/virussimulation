import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType } from './Data';
import { WIDTH, HEIGHT, POPULATION_SIZE} from './Data';

const INTERVAL = 100; //move interval in milli seconds
const MARGIN = 50;
const MOBILITY = 0.2; // Number between 0 - 1; 1 being very mobile. 0 is not moving at all.

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
  const [numOfInfected, setNumOfInfected] = useState(1);
  const [numOfFatalities, setNumOfFatalities] = useState(0);
  const [numOfImmune, setNumOfImmune] = useState(0);
  const [numOfUnaffected, setNumOfUnaffected] = useState(POPULATION_SIZE - 1);
  const [stopped, setStopped] = useState(false);

  let d = new Date();
  let n = d.getTime();
  //console.log('Number of Infected is: ' + numOfInfected);

  if ( numOfInfected < dots.length && numOfInfected !== 0) {
    if (n > lastUpdate + INTERVAL && !stopped) {
      setLastUpdate(n);
      setNumOfInfected(numberOfType(dots, 'red'));
      setNumOfFatalities(numberOfType(dots, 'black'));
      setNumOfImmune(numberOfType(dots, 'green'));
      setNumOfUnaffected(numberOfType(dots, 'blue'));
      aTimer = setTimeout(()=> {
        const newDots = infectDots(moveDots(dots, MOBILITY));
        setDots(newDots);
      }, INTERVAL);
  }
}

  dots.forEach((dot) => {
    contents.push(<Circle color={dot.color} x={dot.x} y={dot.y}></Circle>); //Shift the display area by MARGIN
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

  return (
    <div className="App">
      <div className='body'>
        <div className='grid'>
          {contents}
        </div>
        <div>{'Infected: ' + numOfInfected + '  Dead: ' + numOfFatalities + '  Recovered: ' + numOfImmune + '  Unaffected: ' + numOfUnaffected}</div>
      </div>

    </div>
  );
}

export default App;
