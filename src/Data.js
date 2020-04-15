export const POPULATION_SIZE = 1000;
export const WIDTH = 400;
export const HEIGHT = 400;

const NUMBER_OF_DAYS_CURED = 14;
const NUMBER_OF_DAYS_MIGHT_DIE = 5;
const FATALITY_RATE = 0.05; // 5%;
const MAX_MOVEMENT = 20;
const MINIMUM_DISTANCE = 4;

  // red is infected. black is dead, blue is not infected, green is immune and not infectious.
export const COLOR_INFECTED = 'red';
export const COLOR_RECOVERED = 'green';
export const COLOR_DEAD = 'black';
export const COLOR_UNINFECTED = 'blue';


export const onAddInfection = (dots) => {
  let newDots = [...dots];
  for(let i=0; i<newDots.length; i++) {
      if (newDots[i].color === COLOR_UNINFECTED) {
        newDots[i].color = COLOR_INFECTED;
        newDots[i].days = 0;
        break;
      }
  }
  return newDots;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomPlusMinusInt(max) {
  let random = Math.random();
  //console.log('Math random is: ' + random);
  let randomInt = getRandomInt(max);
  return (random > 0.5) ? randomInt : randomInt * -1;
}

function ifDead() {
  let random = Math.random();
  return (random < FATALITY_RATE / (NUMBER_OF_DAYS_CURED - NUMBER_OF_DAYS_MIGHT_DIE)) ? true : false;
}

const _generateRandomDots = (population, maxWidth, maxHeight) => {
  let dots = [];
  // days = 0, is not infected. days > 14 is infected and immune

  for(let i = 0; i < population; i++) {
    const dot =  {x: getRandomInt(maxWidth), y: getRandomInt(maxHeight), color: COLOR_UNINFECTED, days: 0};
    if (i === 0) {
      dot.color = COLOR_INFECTED;
      dot.days = 1;
    }
    dots.push(dot);
  }
  return dots;
}

export const generateRandomDots = () => {
 return  _generateRandomDots(POPULATION_SIZE, WIDTH, HEIGHT);
}

const getBoundedValue = (value, MIN, MAX, move) => {
  if (value < MIN) {
    value = getRandomInt(move);
  } else if (value > MAX) {
    value = MAX - getRandomInt(move);
  }
  return value;
}

const distance = (dot1, dot2) => {
  return Math.sqrt((dot1.x - dot2.x) * (dot1.x - dot2.x) + (dot1.y - dot2.y) * (dot1.y - dot2.y));
};

export const moveDots = (dots, mobility) => {
  let newDots = [];
  const move = mobility * MAX_MOVEMENT;
  dots.forEach((dot)=>{
    let newDot = {};
    let newX = getBoundedValue((dot.x + getRandomPlusMinusInt(move)), 0, WIDTH, move);
    let newY = getBoundedValue((dot.y + getRandomPlusMinusInt(move)), 0, HEIGHT, move);
    
    newDot.color = dot.color;

    if (dot.color === COLOR_INFECTED) {
      newDot.days = dot.days + 1;
      if(newDot.days > NUMBER_OF_DAYS_MIGHT_DIE && newDot.days <= NUMBER_OF_DAYS_CURED) {
        if (ifDead() === true) {
          newDot.color = COLOR_DEAD;
        }
      }
      if(!(newDot.color === COLOR_DEAD) && newDot.days > NUMBER_OF_DAYS_CURED) {
          newDot.color = COLOR_RECOVERED;
      }
    }

    if (newDot.color === COLOR_DEAD) {
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

 export const infectDots = (oldDots) => {
  let newDots = [...oldDots];
  oldDots.forEach((i) => {
    if (i.color === COLOR_INFECTED) {  // Check if the dot is red color //i.e. confirmed case of COVID-19
      newDots.forEach((j) => {// Enter a loop of check the distance with all other dots 
          if(j.color === COLOR_UNINFECTED) {
           const dist = distance(i, j);
            if ( dist < MINIMUM_DISTANCE) {//i.e. check if other not already infected people has been in contact
              j.color = COLOR_INFECTED; //infected
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

 export const numberOfType = (dots, type) => {
  let newDots = [...dots];
  let count = 0;
  newDots.forEach((dot) => {
     if (dot.color === type) count++;
   });
   return count;
 }