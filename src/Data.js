export const POPULATION_SIZE = 500;
export const WIDTH = 500;
export const HEIGHT = 500;
export const MINIMUM_DISTANCE = 5;

const NUMBER_OF_DAYS_CURED = 14;
const NUMBER_OF_DAYS_MIGHT_DIE = 5;
const FATALITY_RATE = 0.05; //10%;


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

export const generateRandomDots = (population, maxWidth, maxHeight) => {
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

const getBoundedValue = (value, MIN, MAX, mobility) => {
  if (value < MIN) {
    value = getRandomInt(mobility);
  } else if (value > MAX) {
    value = MAX - getRandomInt(mobility);
  }
  return value;
}

const distance = (dot1, dot2) => {
  return Math.sqrt((dot1.x - dot2.x) * (dot1.x - dot2.x) + (dot1.y - dot2.y) * (dot1.y - dot2.y));
};

export const moveDots = (dots, mobility) => {
  let newDots = [];
  dots.forEach((dot)=>{
    let newDot = {};
    let newX = getBoundedValue((dot.x + getRandomPlusMinusInt(mobility)), 0, WIDTH, mobility);
    let newY = getBoundedValue((dot.y + getRandomPlusMinusInt(mobility)), 0, HEIGHT, mobility);
    
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

 export const infectDots = (oldDots) => {
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

 export const numberOfType = (dots, type) => {
   let count = 0;
   dots.forEach((dot) => {
     if (dot.color === type) count++;
   });
   return count;
 }