import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType, onAddInfection } from './Data';
import { WIDTH, HEIGHT, COLOR_INFECTED, COLOR_RECOVERED, COLOR_DEAD, COLOR_UNINFECTED } from './Data';

const INTERVAL = 200; //move interval in milli seconds
const MARGIN = 0.05;
const GRAPH_WIDTH = 0.7;
const PANEL_WIDTH = 0.2;
let mobility = 1; // Number between 0 - 1; 1 being very mobile. 0 is not moving at all.

let aTimer;

const styles = {
  button: {
    margin: 5, 
    padding: 5,
    borderWidth: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'black',
    flex: 1
  },
  label: {
    flex: 1,
    margin: 2, 
    padding: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    textAlign: 'center',
    color: 'black'
  },
  text: {
    flex: 1,
    margin:2,
    padding: 2,
    backgroundColor: '#eeeeee'
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'eeeeee',
    alignSelf: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    float: 'bottom',
    fontSize: 8
  },
  grid: {
  },
  panel: {
  },
  instructions: {
    
  }
}

const transformDisplay= (x, dataWidth, displayWidth) => {
  return x * displayWidth / dataWidth;
};


function App() {

  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });
  
  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    };
    
    window.addEventListener('resize', handleResize);
    return _ => {
      window.removeEventListener('resize', handleResize);
    }
  });

  let contents = [];
  const [dots, setDots] = useState(generateRandomDots()); //Initialise.
  const [lastUpdate, setLastUpdate] = useState(0);
  const [stopped, setStopped] = useState(false);

  let d = new Date();
  let n = d.getTime();
  //console.log('Number of Infected is: ' + numOfInfected);
  const numberOfInfected = numberOfType(dots, COLOR_INFECTED);
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
    contents.push(<Circle color={dot.color} x={transformDisplay(dot.x, WIDTH, dimensions.width * (GRAPH_WIDTH - 2 * MARGIN)) + dimensions.width * MARGIN} y={transformDisplay(dot.y, WIDTH, dimensions.width * (GRAPH_WIDTH - 2 * MARGIN)) + dimensions.width * MARGIN}></Circle>); //Shift the display area by MARGIN
  });

  const onPause = () => {
    if(aTimer) {
      clearTimeout(aTimer);
      aTimer = null;
    }
    setStopped(!stopped);
  }

  const onRestart = () => {
    setDots(generateRandomDots());
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
      <div style={styles.container}>
      <div style={{...styles.body, ...{width: dimensions.width}}}>
       <div style={{...styles.grid, ...{width: dimensions.width * GRAPH_WIDTH, height: dimensions.width * GRAPH_WIDTH}}}>
        {contents}
       </div>
       <div style={{...styles.panel, ...{width: dimensions.width * PANEL_WIDTH, marginTop: dimensions.width * MARGIN}}}>
          <div style={{...styles.label, ...{color: COLOR_INFECTED}}}>{'Infected: ' + numberOfType(dots, COLOR_INFECTED) } </div>
          <div style={{...styles.label, ...{color: COLOR_RECOVERED}}}>{'Recovered: ' + numberOfType(dots, COLOR_RECOVERED) } </div>
          <div style={{...styles.label, ...{color: COLOR_UNINFECTED}}}>{'Unaffected: ' +numberOfType(dots, COLOR_UNINFECTED) } </div>
          <div style={{...styles.label, ...{color: COLOR_DEAD}}}>{'Dead: ' + numberOfType(dots, COLOR_DEAD)} </div>
          <div style={styles.button} onClick={onRestart}> <div style={styles.text}>Restart</div>  </div>
          <div style={styles.button} onClick={_onAddInfection}> <div style={styles.text}>Add new case</div> </div>
            <div> Control mobility level </div>
            <input id="typeinp" type="range" min="0" max="1" defaultValue="1" step="0.1" onChange={onMobilityChanged} style={{alignSelf: "stretch"}}/>
        </div> 
    </div>
    <div style={{...styles.instructions, ...{margin: dimensions.width * MARGIN}}}>
        <p> Lower mobility means stricter lock down measures.</p>
        <p>1) Run the simulation without changing the mobility level and observe how the virus spread and the total number of fatalities.</p>
        <p>2) Reduce the mobility to mimick a lockdown and restart the simulation and observe how the virus spread again.</p>
        <p> 3) Change the mobility during the simulation is running to observe an mimicked lockdown - relax - lockdown again approach.
        </p>
        <p> 4) Add a new case once number of infections reaches zero, but there is still unaffected people arround. This is to observe how resillient the population is. i.e. test if the population has reached herd immunity. </p>
    </div>
    <div style={styles.footer}>
        Disclaimer: The intention of this simulation is to bring visualisation, therefore better understanding of the effect of different control measures. Not to accurately predict the actual effect. Much more detailed domain specific knowledge needed to accurately make prediction.
    </div>
    </div>

    </div>
  );
}

export default App;
