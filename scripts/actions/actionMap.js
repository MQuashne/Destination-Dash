import { render } from '../render.js';
import { DiceRoller } from '../diceRoller/diceRoller.js'
import { gameState } from '../main.js'
import { shuffle } from '../setup.js'


// ==========================================
//   STATUS CHECKS
// ==========================================

export function phaseCheck() {
  
  //Move from resolution to action
  if (gameState.hand.cards.filter(c => c.type === "crisis").length <= 1 && gameState.phase === "resolution") { 
    gameState.phase = "action" 
    
  }
  
  if (gameState.phase==="end-discard" && gameState.discardRemaining<=0){
    //not sure this is where i want to be
    gameState.phase="boarding";
  }
  
  
  console.log(gameState.phase);
}

export function checkGameEnd() {
  let gameOver = false;
  gameState.planes > 0 ? gameOver = false : gameOver = true;
  return gameOver;
}


// ==========================================
//   UTILITIES
// ==========================================

/*export function discard(card) {
  gameState.scrapyard.push(...gameState.playerHand.splice(gameState.playerHand.indexOf(card), 1));
}
*/
export function notify(message, style = "none") {
  const banner = document.getElementById("toast");
  let icon = "";
  switch (style) {
    case 'crisis':
      icon = "⚠ ";
      break;
    case 'fuel':
      icon = "⛽ ";
      break;
    case 'fortune':
      icon = "★ "
      break;
    default:
      icon = "";
  }
  banner.textContent = `${icon}${message}`;
  banner.classList.add(style);
  banner.classList.remove("hidden");
  banner.addEventListener("animationend", () => {
    banner.classList.add("hidden");
    banner.classList.remove(style)
  });
}

export function addPax(pax) {
  let overWeight = false;
  gameState.pax += pax
  gameState.pax > 16 ? (destroyPlane(), overWeight = true) : overWeight = false;
  return overWeight;
}

export function destroyPlane() {
  gameState.planes--;
  gameState.fuel = 0;
  gameState.pax = 0;
  if (!checkGameEnd()) {
    phaseCheck();
    notify("1 Plane Destroyed", "crisis");
  } else {
    notify("GAME OVER", "crisis");
  }
}

export function addFuel(fuel) {
  if (gameState.active_effects.some(a => a === "fortune_a_pound_in_flesh")) {
    gameState.pax = Math.max(gameState.pax - fuel, 0);
    fuel += fuel;
  }
  gameState.fuel += fuel;
  phaseCheck();
  notify(`${fuel} Fuel Added`, "fuel")
}

export function refillBoneyard() {
  gameState.boneyard.push(...gameState.scrapyard.splice(0, gameState.scrapyard.length));
  shuffle(gameState.boneyard);
}


// ==========================================
//   GAME FLOW
// ==========================================

export function draw() {
  gameState.phase = "draw";
  let cardMax = 5;
  if (gameState.active_effects.some(f => f === "fortune_avarice")) {
    cardMax = 8;
  }
  if (gameState.active_effects.some(f => f === "crisis_forced_contract")) {
    //
    // Handle Forced Discard
    //
  } else {
    
    //add to hand in gs
    let newCards = [];
    for (let i = gameState.hand.cards.length; i < cardMax; i++) {
      if (gameState.boneyard.length < 1) {
        refillBoneyard();
      }
      gameState.hand.addCard(...gameState.boneyard.splice(0, 1));
    }
  }
  
  //set phase
  if (gameState.hand.cards.some(c => c.type === "crisis")) { gameState.phase = "resolution"; } else { gameState.phase = "action"; }
  render(render);
}


export function endTurn() {
  //Die roll change logic
  document.getElementById("end-turn-btn").classList.add("hidden");
  console.log(gameState.hand.cards)
  if (gameState.actionsRemaining === 2 && gameState.hand.cards.length>0) {
    gameState.phase="end-discard";
    gameState.discardRemaining=1;
    
    const discardBanner = document.getElementById("banner");
    discardBanner.textContent="Discard 1 Card";
    discardBanner.classList.remove("hidden");
    
    //force discard 1
    //
  } else if (gameState.active_effects.some(c => c.id === "fortune_hack_the_system")) {
    //
    //user choose up to 6
    //
  } else {
    gameState.phase="end-turn";
    render(render);
  }
}

export function boarding() {
  gameState.phase = "boarding";

  document.getElementById("dice-title").textContent="Roll to add passengers";
  DiceRoller.open(1, (total, values) => {
    let wreck = addPax(total);
    if (!wreck) {
      notify(`${total} Passengers Added`);
    }
        //Clear the bad weather
    const destZone = document.getElementById("destination-zone");
    destZone.classList.remove("hidden");
    render(render);
  });
    //Reset actions remaining
  if (gameState.staged_effects.some(f => f === "fortune_overdrive")) {
    gameState.actionsRemaining = 99;
  } else {
    gameState.actionsRemaining = 2;
  }
  
  //Handle action counter 
  if (!gameState.staged_effects.some(f => f === "crisis_forced_contract")) {
    gameState.forcedContractCount = 0;
    //otherwise reset counter after discard action
  }
  //Activate staged effects
  gameState.active_effects = [];
  gameState.staged_effects.forEach((effect) => {
    gameState.active_effects.push(effect);
  });
  gameState.phase="draw";
  render(render);
}


// ==========================================
//   EFFECTS
// ==========================================

export const effects = {
  fuel: (fuelValue) => {
    addFuel(fuelValue);
    render(render);
  },
  crisis_misguided_bird: () => {
    destroyPlane();
    checkGameEnd();
    render(render);
  },
  crisis_fuel_leak: () => {
    DiceRoller.open(2, (total, values) => {
      let remove = Math.min(total, gameState.fuel);
      gameState.fuel -= remove;
      phaseCheck();
      notify(`${remove} Fuel Removed`, "crisis");
      render(render);
    });
  },
  crisis_attack_on_karen: () => {
    let wreck = addPax(gameState.pax);
    if (!wreck) {
      phaseCheck();
      notify(`${gameState.pax/2} Passengers Added`, "crisis");
      render(render);
    }
    
  },
  crisis_sabotaged: () => {
    
   gameState.hand.cards.forEach((card, index) => {
     setTimeout( () =>{
     const myIndex=gameState.hand.cards.indexOf(card);
     gameState.hand.removeCard(myIndex);},200*(index))
   })
   
    phaseCheck();
    notify("All Cards Discarded", "crisis");
    render(render);
  },
  crisis_temporal_anomaly: () => {
    if (gameState.log.length > 0) {
      gameState.map.unshift(...gameState.log.splice(0, 1));
      notify("1 Destination Returned to Map", "crisis");
    } else {
      notify("0 Destinations Returned", "crisis");
    }
    phaseCheck();
    render(render);
  },
  fortune_crisis_averted: () => {
    notify("Crisis Averted!", "fortune");
    phaseCheck();
    render(render);
  },
  crisis_bad_weather: () => {
    const destZone = document.getElementById("destination-zone");
    destZone.classList.add("hidden");
    notify("All Destinations Closed", "crisis");
    phaseCheck();
    render(render);
  },
  crisis_switcheroo: () => {
    if (gameState.scrapyard.length > 0) {
      const swap = gameState.boneyard.splice(0, gameState.boneyard.length);
      gameState.boneyard.push(...gameState.scrapyard.splice(0, gameState.scrapyard.length));
      gameState.scrapyard.push(...swap);
      shuffle(gameState.boneyard);
      notify("Decks Swapped", "crisis");
      phaseCheck();
      render(render);
    } else {
      notify("Nothing Happened", "crisis");
      phaseCheck();
      render(render);
    }
  },
  crisis_out_of_bounds: () => {
    if (gameState.destinationsOnBoard.length > 1) {
      const maxDest = gameState.destinationsOnBoard.reduce((prev, current) => (prev.fuel > current.fuel) ? prev : current)
      maxDest.open = false;
      notify("1 Destination Closed", "crisis");
      phaseCheck();
    } else {
      notify("Nothing Happened", "crisis");
      phaseCheck();
    }
    render(render);
  },
  crisis_forced_contract: () => {
    gameState.staged_effects.push("forced_contract");
    notify("No Draw Next Turn", "crisis");
    phaseCheck();
    render(render);
  },
  fortune_a_pound_in_flesh: () => {
    gameState.active_effects.push("fortune_a_pound_in_flesh");
    notify("Passenger-Fuel Trade Activated", "fortune");
    phaseCheck();
    render(render);
    
  }
}