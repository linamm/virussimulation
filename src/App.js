import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType } from './Data';
import { WIDTH, HEIGHT} from './Data';

const INTERVAL = 1000; //move interval in milli seconds
const MARGIN = 50;
const POPULATION_SIZE = 500;
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
  const [numOfInfected, setNumOfInfected] = useState(0);
  const [numOfFatalities, setNumOfFatalities] = useState(0);
  const [numOfImmune, setNumOfImmune] = useState(0);
  const [numOfUnaffected, setNumOfUnaffected] = useState(POPULATION_SIZE - 1);
  const [stopped, setStopped] = useState(false);

  let d = new Date();
  let n = d.getTime();
  //console.log('Number of Infected is: ' + numOfInfected);

  if ( numOfInfected < dots.length) {
    if (n > lastUpdate + INTERVAL && !stopped) {
      setLastUpdate(n);
      setNumOfInfected(numberOfType(dots, 'red'));
      setNumOfFatalities(numberOfType(dots, 'grey'));
      setNumOfImmune(numberOfType(dots, 'green'));
      setNumOfUnaffected(numberOfType(dots, 'blue'));
      aTimer = setTimeout(()=>{
        const newDots = infectDots(moveDots(dots));
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

  return (
    <div className="App">
      <div style = {{margin: 50, backgroundColor: 'eeeeee', flex: 1}}>
        {contents}
        <div>{'Infected: ' + numOfInfected + ', Fatalities: ' + numOfFatalities + ', Immune: ' + numOfImmune + ', Unaffected: ' + numOfUnaffected}</div>
      </div>
      <div>{'Population: ' + population}</div>
      <input id="typeinp" type="range" min="100" max="1000" value={population} step="100" onChange={(event) => setPopulation(event.target.value)}/>
      <div onClick={onPause} style={styles.button}>{stopped ? 'Resume' : 'Stop'}</div>
      {stopped && (<div onClick={onRestart} style={styles.button}>Restart</div> )}
    </div>
  );
}

export default App;
