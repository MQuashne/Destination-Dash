import { Destinations,Cards,Crises } from './cardData.js'

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export function setupGame(){
  const map=shuffle(Destinations);
  const startdeck=shuffle(Cards);
  const playerHand=startdeck.splice(0,4);
  const boneyard=shuffle(startdeck.push(...Crises));
  const scrapyard=[];
  const log=[];
  const destinationsOnBoard=map.splice(0,3);
  let planes=3;
  let pax=0;
  let fuel=47;
  let actionsRemaining=2;
  let phase="draw";
  const gameState = {
    map,
    destinationsOnBoard,
    boneyard,
    playerHand,
    scrapyard,
    log,
    planes,
    pax,
    fuel,
    actionsRemaining,
    phase
  }
  return gameState;
}