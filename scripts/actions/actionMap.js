import { render } from '../render.js';
import { DiceRoller } from '../diceRoller/diceRoller.js'
import { gameState } from '../main.js'
import { shuffle } from '../setup.js'
import { orderBox, choosePax } from '../generalModal.js'
import { viewPile } from './viewPile.js'


// ==========================================
//   STATUS CHECKS
// ==========================================

export function phaseCheck() {
  
  //Move from resolution to action
  if (gameState.hand.cards.filter(c => c.type === "crisis").length <= 1 && gameState.phase === "resolution") {
    if (gameState.active_effects.some(f => f === "fortune_avarice")) {
      gameState.discardRemaining = ((gameState.hand.cards.length) - 1) - 5;
      if (gameState.discardRemaining > 0) {
        gameState.phase = "discard-avarice";
      } else { gameState.phase === "action"; }
    } else {
      gameState.phase = "action";
      console.log(`Res to Action. Phase:  ${gameState.phase}. Crises: ${gameState.hand.cards.filter(c => c.type === "crisis").length}`);
      console.log(gameState.hand.cards.filter(c => c.type === "crisis"))
      
      
    }
    
  } else {
    if (gameState.phase === "resolution") {
      console.log(`STILL Resolution. Phase:  ${gameState.phase}. Crises: ${gameState.hand.cards.filter(c => c.type === "crisis").length}`);
      console.log(gameState.hand.cards.filter(c => c.type === "crisis"))
    }
    
  }
  
  if (gameState.phase === "end-discard" && gameState.discardRemaining <= 0) {
    gameState.phase = "end-turn";
  }
  
  if (gameState.phase === "draw-forced" && gameState.discardRemaining <= 0) {
    gameState.phase = "action";
  }
  if (gameState.phase === "discard-avarice" && gameState.discardRemaining <= 0) {
    gameState.phase = "action";
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
  const bannerArea = document.getElementById('notifications');
  let activeNotifications = bannerArea.children.length;
  const banner = document.createElement('div')
  banner.classList.add("toast", style);
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
    case 'dest':
      icon = "✈ ";
      break;
    default:
      icon = "";
  }
  banner.textContent = `${icon}${message}`;
  banner.style.setProperty('--notification-height', `${-120*activeNotifications}%`)
  bannerArea.appendChild(banner);
  
  banner.addEventListener("animationend", () => {
    banner.remove();
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
    // Do Nothing
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
  if (gameState.hand.cards.some(c => c.type === "crisis")) {
    gameState.phase = "resolution";
  } else {
    if (gameState.active_effects.some(f => f === "fortune_avarice")) {
      gameState.discardRemaining = ((gameState.hand.cards.length)) - 5;
      gameState.phase = "discard-avarice"
    } else {
      gameState.phase = "action";
    }
    
  }
  render(render);
}

export function endTurn() {
  //Die roll change logic
  document.getElementById("end-turn-btn").classList.add("hidden");
  if (gameState.actionsRemaining === 2 && gameState.hand.cards.length > 0) {
    gameState.phase = "end-discard";
    gameState.discardRemaining = 1;
    render(render);
    
    /*const discardBanner = document.getElementById("banner");
    discardBanner.textContent = "Discard 1 Card";
    discardBanner.classList.remove("hidden");
    */
    //force discard 1
    //
  } /*else if (gameState.active_effects.some(c => c.id === "fortune_hack_the_system")) {
    //
    //user choose up to 6
    //
  } */else {
    gameState.phase = "end-turn";
    render(render);
  }
}

export async function boarding() {
  gameState.phase = "boarding";
  
  if (gameState.active_effects.some(f => f === "fortune_hack_the_system")) {
    const paxAdd = await choosePax(true);
    let wreck = addPax(paxAdd);
    if (!wreck) {
      //phaseCheck();
      notify(`${paxAdd} Passengers Removed`, "crisis");
      render(render);
    }
    
} else {
  document.getElementById("dice-title").textContent = "Roll to add passengers";
  DiceRoller.open(1, (total, values) => {
    let wreck = addPax(total);
    if (!wreck) {
      notify(`${total} Passengers Added`);
    }
    render(render);
  });
}
//Clear the bad weather
const destZone = document.getElementById("destination-zone");
destZone.classList.remove("hidden");
render(render);

//Reset actions remaining
gameState.actionsRemaining = 2;

//Handle action counter 
if (!gameState.staged_effects.some(f => f === "crisis_forced_contract")) {
  gameState.forcedContractCount = 0;
}
//Activate staged effects
gameState.active_effects = [];
gameState.staged_effects.forEach((effect) => {
  gameState.active_effects.push(effect);
});
gameState.staged_effects = [];

if (gameState.active_effects.some(f => f === "crisis_forced_contract")) {
  
  gameState.phase = "draw-forced";
  gameState.discardRemaining = gameState.forcedContractCount;
  if (gameState.hand.cards.length===0) gameState.discardRemaining=0;
  if (gameState.discardRemaining <= 0) {
    gameState.phase = "action";
  }
  gameState.forcedContractCount = 0;
} else {
  gameState.phase = "draw";
}
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
    
    gameState.scrapyard.push(...gameState.hand.cards.filter((ci) => ci.id!=="crisis_sabotaged"));
    
    gameState.hand.clearHand();
    
    notify("All Cards Discarded", "crisis");
    phaseCheck();
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
    gameState.staged_effects.push("crisis_forced_contract");
    notify("No Draw Next Turn", "crisis");
    phaseCheck();
    render(render);
  },
  fortune_a_pound_in_flesh: () => {
    gameState.active_effects.push("fortune_a_pound_in_flesh");
    notify("Passenger-Fuel Trade Activated", "fortune");
    phaseCheck();
    render(render);
    
  },
  crisis_full_metal_alchemist: () => {
    let wreck = addPax(gameState.fuel - gameState.pax);
    if (!wreck) {
      phaseCheck();
      if (gameState.fuel - gameState.pax >= 0) {
        notify(`${gameState.fuel-gameState.pax} Passengers Added`, "crisis")
      }
      else {
        notify(`${gameState.pax-gameState.fuel} Passengers Removed`, "crisis")
      }
    }
    render(render);
    
  },
  fortune_reroute: () => {
    if (gameState.map.length === 0) {
      gameState.fuel = 0;
      gameState.pax = 0;
      notify("Aircraft Emptied", "fortune");
    } else {
      const banner = document.getElementById("banner");
      const destZone = document.getElementById("destination-zone");
      const cover = document.getElementById("cover");
      gameState.phase = "reroute";
      banner.classList.add("fortune");
      
      banner.textContent = "Reroute 1 Location";
      
      cover.classList.remove("hidden");
      
      //stack elements
      cover.style.zIndex = 800;
      destZone.style.zIndex = 900;
      banner.style.zIndex = 900;
      
      
      gameState.phase = "reroute";
    }
    render(render);
  },
  fortune_20_20_vision: () => {
    orderBox();
    render(render);
  },
  fortune_avarice: () => {
    gameState.staged_effects.push("fortune_avarice");
  },
  fortune_overdrive: () => {
    gameState.actionsRemaining = 99;
  },
  fortune_garbage_collector: () => {
    viewPile("scrap", true);
  },
  fortune_hack_the_system: () => {
    gameState.active_effects.push("fortune_hack_the_system");
    /* const paxAdd = await choosePax(true);
     let wreck = addPax(paxAdd);
     if (!wreck) {
       phaseCheck();
       notify(`${paxAdd} Passengers Added`, "crisis");
       render(render);*/
  },
  fortune_good_riddance: async () => {
    const paxAdd = await choosePax(false);
    let wreck = addPax(0 - paxAdd);
    if (!wreck) {
      phaseCheck();
      notify(`${paxAdd} Passengers Removed`, "crisis");
      render(render);
    }
    
  },
  fortune_crystal_ball: () => {
    viewPile("bone");
    phaseCheck();
    render(render);
  }
  
}