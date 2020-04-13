import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType, onAddInfection } from './Data';
import { WIDTH, HEIGHT, POPULATION_SIZE, COLOR_INFECTED, COLOR_RECOVERED, COLOR_DEAD, COLOR_UNINFECTED } from './Data';

const INTERVAL = 200; //move interval in milli seconds
const MARGIN = 50;
let mobility = 1; // Number between 0 - 1; 1 being very mobile. 0 is not moving at all.

let aTimer;

const styles = {
  button: {
    margin: 10, 
    padding: 10,
    borderWidth: 5,
    borderRadius: 5,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  label: {
    margin: 2, 
    padding: 2,
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: 'center',
    color: 'black'
  },
  text: {
    margin:2,
    padding: 2,
    backgroundColor: '#eeeeee'
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
 // if ( numberOfInfected < dots.length && numberOfInfected !== 0) {
    if (n > lastUpdate + INTERVAL && !stopped) {
      setLastUpdate(n);
      aTimer = setTimeout(()=> {
        const newDots = infectDots(moveDots(dots, mobility));
        setDots(newDots);
      }, INTERVAL);
 // }
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
    alert('Simulation Restarting');
  }

  const onMobilityChanged = (event) => {
    mobility = event.target.value;
  }

  const _onAddInfection = () => {
      setDots(onAddInfection(dots));
  }

  return (
    <div className="App">
      <div className='body'>
        <div className='grid'>
          {contents}
        </div>
        <div style={{marginTop: 50, marginLeft: 400 + 50 + 10}}>
        <div style={{...styles.label, ...{color: COLOR_INFECTED}}}>{'Infected: ' + numberOfType(dots, COLOR_INFECTED) } </div>
        <div style={{...styles.label, ...{color: COLOR_RECOVERED}}}>{'Recovered: ' + numberOfType(dots, COLOR_RECOVERED) } </div>
        <div style={{...styles.label, ...{color: COLOR_UNINFECTED}}}>{'Unaffected: ' +numberOfType(dots, COLOR_UNINFECTED) } </div>
        <div style={{...styles.label, ...{color: COLOR_DEAD}}}>{'Dead: ' + numberOfType(dots, COLOR_DEAD)} </div>

       <div style={styles.button} onClick={onRestart}> <div style={styles.text}>Restart</div>  </div>
        <div style={styles.button} onClick={_onAddInfection}> <div style={styles.text}>Add new case</div> </div>

        <div style={styles.button}>
        <div> Control mobility level </div>
        <input id="typeinp" type="range" min="0" max="1" defaultValue="1" step="0.1" style={{width: 100}} onChange={onMobilityChanged}/>
        </div>

        </div>
        
      </div>

    </div>
  );
}

export default App;
