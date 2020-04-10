import React, {useState} from 'react';
import './App.css';
import Circle from './Circle';

const WIDTH = 300;
const HEIGHT = 300;
const MOBILITY = 30;
const MINIMUM_DISTANCE = 5;
const POPULATION_SIZE = 500;
const INTERVAL = 1000; //move interval in milli seconds
const MARGIN = 50;
const NUMBER_OF_DAYS_CURED = 14;
const NUMBER_OF_DAYS_MIGHT_DIE = 5;
const FATALITY_RATE = 0.5; //1%;


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomPlusMinusInt(max) {
  let random = Math.random();
  console.log('Math random is: ' + random);
  let randomInt = getRandomInt(max);
  return (random > 0.5) ? randomInt : randomInt * -1;
}

function ifDead() {
  let random = Math.random();
  return (random < 0.5 * FATALITY_RATE / NUMBER_OF_DAYS_CURED) ? true : false;
}

const generateRandomDots = (population, maxWidth, maxHeight) => {
  let dots = [];
  // days = 0, is not infected. days > 14 is infected and immune
  // red is infected. black is dead, blue is not infected, green is immune and not infectious.

  for(let i = 0; i < population; i++) {
    const dot =  {x: getRandomInt(maxWidth), y: getRandomInt(maxHeight), color: 'blue', days: 0};
    if (i === 0) {
      dot.color = 'red';
      dot.days = 1;
    }
    dots.push(dot);
  }
  return dots;
}

const getBoundedValue = (value, MIN, MAX) => {
  if (value < MIN) {
    value = getRandomInt(MOBILITY);
  } else if (value > MAX) {
    value = MAX - getRandomInt(MOBILITY);
  }
  return value;
}

const distance = (dot1, dot2) => {
  return Math.sqrt((dot1.x - dot2.x) * (dot1.x - dot2.x) + (dot1.y - dot2.y) * (dot1.y - dot2.y));
};

const moveDots = (dots) => {
  let newDots = [];
  dots.forEach((dot)=>{
    let newDot = {};
    let newX = getBoundedValue((dot.x + getRandomPlusMinusInt(MOBILITY)), 0, WIDTH);
    let newY = getBoundedValue((dot.y + getRandomPlusMinusInt(MOBILITY)), 0, HEIGHT);
    
    newDot.color = dot.color;

    if (dot.color === 'red') {
      newDot.days = dot.days + 1;
      if(newDot.days > NUMBER_OF_DAYS_MIGHT_DIE && newDot.days <= NUMBER_OF_DAYS_CURED) {
        if (ifDead() === true) {
          newDot.color = 'grey';
        }
      }
      if(!(newDot.color === 'grey') && newDot.days > NUMBER_OF_DAYS_CURED) {
          newDot.color = 'green';
      }
    }

    if (newDot.color === 'grey') {
      newDot.x = dot.x;
      newDot.y = dot.y;
    } else {
      newDot.x = newX;
      newDot.y = newY;
    }


    newDots.push(newDot);


  });
  return newDots;
}

 const infectDots = (oldDots) => {
  let newDots = [...oldDots];
  oldDots.forEach((i) => {
    if (i.color === 'red') {  // Check if the dot is red color //i.e. confirmed case of COVID-19
      newDots.forEach((j) => {// Enter a loop of check the distance with all other dots 
          if(j.color === 'blue') {
           const dist = distance(i, j);
            if ( dist < MINIMUM_DISTANCE) {//i.e. check if other not already infected people has been in contact
              j.color = 'red'; //infected
              j.days = 1;
              //console.log('distance is : ' + dist + ' infected');
            }
          }
      });
    }
  });
  //console.log('old Dots' + JSON.stringify(oldDots));
  //console.log('new Dots' + JSON.stringify(newDots));

  return newDots;
 }

 const numberOfType = (dots, type) => {
   let count = 0;
   dots.forEach((dot) => {
     if (dot.color === type) count++;
   });
   return count;
 }

function App() {
  let contents = [];
  const [dots, setDots] = useState(generateRandomDots(POPULATION_SIZE, WIDTH, HEIGHT)); //Initialise.
  const [lastUpdate, setLastUpdate] = useState(0);
  const [numOfInfected, setNumOfInfected] = useState(0);
  const [numOfFatalities, setNumOfFatalities] = useState(0);
  const [numOfImmune, setNumOfImmune] = useState(0);
  const [numOfUnaffected, setNumOfUnaffected] = useState(POPULATION_SIZE - 1);


  let d = new Date();
  let n = d.getTime();
  //console.log('Number of Infected is: ' + numOfInfected);

  if ( numOfInfected < dots.length) {
    if (n > lastUpdate + INTERVAL) {
      setLastUpdate(n);
      setNumOfInfected(numberOfType(dots, 'red'));
      setNumOfFatalities(numberOfType(dots, 'grey'));
      setNumOfImmune(numberOfType(dots, 'green'));
      setNumOfUnaffected(numberOfType(dots, 'blue'));
      setTimeout(()=>{
        const newDots = infectDots(moveDots(dots));
        setDots(newDots);
      }, INTERVAL);
  }
}

  dots.forEach((dot) => {
    contents.push(<Circle color={dot.color} x={dot.x + MARGIN} y={dot.y + MARGIN}></Circle>); //Shift the display area by MARGIN
  });

  return (
    <div className="App">
      <div style = {{margin: 50, backgroundColor: 'eeeeee', flex: 1}}>
        {contents}
        <div>{'Infected: ' + numOfInfected + ', Fatalities: ' + numOfFatalities + ', Immune: ' + numOfImmune + ', Unaffected: ' + numOfUnaffected}</div>
      </div>
    </div>
  );
}

export default App;
