import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';
import { infectDots, moveDots, generateRandomDots, numberOfType, onAddInfection } from './Data';
import { WIDTH, COLOR_INFECTED, COLOR_RECOVERED, COLOR_DEAD, COLOR_UNINFECTED } from './Data';

const INTERVAL = 200; //move interval in milli seconds
const MARGIN_TOP = 20;
const MARGIN = 0.05;
const GRAPH_WIDTH = 0.7;
const PANEL_WIDTH = 0.2;
const SMALL_SCREEN_LIMIT = 600;
let lockdown = 0; // Number between 0 - 1; 1 being very mobile. 0 is not moving at all.
let ppe = 0;
let contactTracing = 0;

let aTimer;

const styles = {
  header:{
    fontSize: 20,
    padding: 10
  },
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
    display: 'flex',
    margin: 2, 
    padding: 2,
    display: "flex",
    justifyContent: "center",
    color: 'black',
    flexDirection: 'column'
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
    fontSize: 10
  },
  grid: {
  },
  panel: {
    flexDirection: 'column',
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
        const newDots = infectDots(moveDots(dots, 1 - lockdown, contactTracing), ppe, contactTracing);
        setDots(newDots);
      }, INTERVAL);
 // }
}



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

  const onLockdownChanged = (event) => {
    lockdown = event.target.value;
  }

  const onPPEChanged = (event) => {
    ppe = event.target.value;
  }

  const onContactTracingChanged = (event) => {
    contactTracing = event.target.value;
  }

  const _onAddInfection = () => {
      setDots(onAddInfection(dots));
  }

  const isSmallScreen = dimensions.width < SMALL_SCREEN_LIMIT ? true : false;
  const panelWidth = isSmallScreen ? dimensions.width * GRAPH_WIDTH : dimensions.width * PANEL_WIDTH;
  const gridSize = isSmallScreen ? dimensions.width * 0.9 : dimensions.width * GRAPH_WIDTH;
  const dotsSize = isSmallScreen ? dimensions.width * 0.9 : dimensions.width * (GRAPH_WIDTH - 2 * MARGIN);

  const panelStyle = isSmallScreen ? { marginTop: dimensions.width * MARGIN }  : {marginLeft: dimensions.width * MARGIN};

  dots.forEach((dot) => {
    contents.push(<Circle color={dot.color} x={transformDisplay(dot.x, WIDTH, dotsSize) + dimensions.width * MARGIN + MARGIN_TOP} y={transformDisplay(dot.y, WIDTH, dotsSize) + dimensions.width * MARGIN}></Circle>); //Shift the display area by MARGIN
  });

  return (
    <div className="App">
      <div style={styles.header}><b>Visualise the Spreading of Virus</b></div>
      <div style={styles.container}>
      <div style={{...styles.body, ...{width: dimensions.width, flexDirection: isSmallScreen ? 'column' : 'row'}}}>
       <div style={{...styles.grid, ...{width: gridSize, height: gridSize}}}>
        {contents}
       </div>
       <div style={{...styles.panel, ...{width: panelWidth}, ...panelStyle}}>
         <div>
          <div style={{...styles.label, ...{color: COLOR_INFECTED}}}> <div>{'Infected: '} </div> <div> {numberOfType(dots, COLOR_INFECTED)} </div></div>
          <div style={{...styles.label, ...{color: COLOR_RECOVERED}}}><div>{'Recovered: '}</div> <div> {numberOfType(dots, COLOR_RECOVERED) }</div>  </div>
          <div style={{...styles.label, ...{color: COLOR_UNINFECTED}}}><div>{'Unaffected: '}</div> <div>{numberOfType(dots, COLOR_UNINFECTED) }</div> </div>
          <div style={{...styles.label, ...{color: COLOR_DEAD}}}><div>{'Dead: '}</div> <div>{numberOfType(dots, COLOR_DEAD)}</div> </div>
        </div>
          <div style={styles.button} onClick={onRestart}> <div style={styles.text}>Restart</div>  </div>
          <div style={styles.button} onClick={_onAddInfection}> <div style={styles.text}>Add new case</div> </div>
          <div>  Lockdown Measures </div>
          <input id="typeinp" type="range" min="0" max="0.8" defaultValue="0" step="0.08" onChange={onLockdownChanged} style={{alignSelf: "stretch"}}/>
          <div>  Personal Protection </div>
          <input id="typeinp" type="range" min="0" max="0.5" defaultValue="0" step="0.05" onChange={onPPEChanged} style={{alignSelf: "stretch"}}/>
          <div>  Contact Tracing </div>
          <input id="typeinp" type="range" min="0" max="0.5" defaultValue="0" step="0.05" onChange={onContactTracingChanged} style={{alignSelf: "stretch"}}/>
        </div> 
    </div>
    <div style={{...styles.instructions, ...{marginRight: dimensions.width * MARGIN, marginLeft: dimensions.width * MARGIN}}}>
        <p> Maximum lock down effect is 80% assuming 20% keyworkers are not affected</p>
        <p>1) Run the simulation without changing the lockdown level and observe how the virus spread and the total number of fatalities.</p>
        <p>2) Increase the lockdown level and restart the simulation and observe how the virus spread.</p>
        <p> 3) Change the lockdown level during a running simulation to observe an mimicked approach of 'lockdown - relax - lockdown - relax again'.
        </p>
        <p> 4) Add a new case once number of infections reaches zero, but there is still unaffected people arround. This is to observe how resillient the population is. i.e. test if the population has reached herd immunity. </p>
        <p> 5) Adjust the Personal Protection level to observe it's effect. This includes the general population practices social distancing, 2 meters apart from each other, always wear mask, gloves, glasses, keep washing hands, etc. As it is imppossible to practice these 100% perfect, it is assumed here that these measures are only 50% effective when set to maximum.</p>
        <p> 6) Adjust Contact Tracing level to observe it's effect. This includes strict quarantine of infected individuals and the people they might have infected. Taking into account of the potential missed out contacts due to insufficient tracing and asymptomatic carriers, etc, we consider this only has maximum of 50% effect as well.</p>
        <p>
        </p>
        <p></p>
        <p> Conclusion: Because of the partical effect of each approach, hopefully, you'll agree, after observing the simuation, all those measures are needed to defeat the virus completely and minimise casualty. Lock down has serious economic impacts, therefore it should be avoided as much as possible. Personal protection costs very little in comparison. Only thing required is participation and carefulness from everyone. Contact tracing could be a little bit more costly, but, should be much cheaper than having to treat a seriously ill patient. The more can be done on Personal Protection and Contact Tracing, the less we need to stay in lock down. </p>
    </div>
    <div style={styles.footer}>
        Disclaimer: The intention of this simulation is to bring visualisation, therefore better understanding of the effect of different control measures. Not to make accurate prediction.
    </div>
    </div>

    </div>
  );
}

export default App;
