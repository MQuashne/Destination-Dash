//-------
// Shuffle function
// Build gameState
// Deal function
// Creates hand and destinations, defines card actions for hand 
//--------




import { Destinations, Cards, Crises } from './cardData.js'
import { CardHand } from './cardhand.js'

import { effects, phaseCheck, endTurn, boarding, draw } from './actions/actionMap.js'

import { gameState } from './main.js'

import { viewPile } from './actions/viewPile.js';

import { choosePax } from './generalModal.js';

import {debugScreen} from './debug.js';



export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export function setupGame() {
  gameState.map = shuffle(Destinations);
  gameState.boneyard = shuffle(Cards);
  gameState.startHand = gameState.boneyard.splice(0, 4);
  gameState.boneyard.push(...Crises);
  shuffle(gameState.boneyard);
  gameState.startHand.push(...gameState.boneyard.splice(0, 1));
  //debugging only!
  //gameState.startHand.push(gameState.boneyard.find(item => item.id === 'fortune_overdrive'));
  
  //wire buttons
  document.getElementById('modal-play-btn').onclick = () => { const c = gameState.hand.getActiveCard(); if (c && gameState.hand._cbPlay) gameState.hand._cbPlay(c); };
  document.getElementById('modal-close-btn').onclick = () => { gameState.hand.closeModal() };
  document.getElementById('modal-resolve-btn').onclick = () => { const c = gameState.hand.getActiveCard(); if (c && gameState.hand._cbPlay) gameState.hand._cbPlay(c); };
  document.getElementById('modal-avert-btn').onclick = () => {
    const c = gameState.hand.getActiveCard();
    if (c && gameState.hand._cbDiscard)
      gameState.hand._cbDiscard(c);
    const avertc = gameState.hand.cards.find(h => h.id === "fortune_crisis_averted");
    const avertcIndex = gameState.hand.cards.indexOf(avertc);
    gameState.hand.navigateTo(avertcIndex);
    
    setTimeout(gameState.hand._cbPlay(avertc),500);
  };
  
  document.getElementById("resolve-crises-btn").addEventListener("click", () => {
    const firstCrisis = gameState.hand.cards.filter(c => c.type === "crisis")[0];
    const firstCrisisIndex = gameState.hand.cards.indexOf(firstCrisis);
    gameState.hand.navigateTo(firstCrisisIndex);
    phaseCheck();
  });
  document.getElementById("end-turn-btn").addEventListener("click", () => {
    endTurn();
  });
  document.getElementById("modal-discard-btn").addEventListener("click", () => {
    const c = gameState.hand.getActiveCard();
    gameState.discardRemaining = Math.max(gameState.discardRemaining - 1, 0);
    gameState.hand._cbDiscard(c)
  });
  document.getElementById("draw-btn").addEventListener("click", () => {
    draw();
  });
  document.getElementById("boarding-btn").addEventListener("click", () => {
    boarding();
  });
  
  document.getElementById("scrap-card").addEventListener("click", () => {
    if (gameState.scrapyard.length > 0) {
  viewPile("scrap",false);
    }
  });
  const debug=document.getElementById("debug");
  document.getElementById("track").addEventListener("click", () => {
  debugScreen();
});
  
  //
  //add banner row buttons
  //
//choosePax();
}

export function deal(renderCallback) {
  
  //Initiate player hand stage
  
  
  const hand = new CardHand('#hand-stage', {
    swipeThreshold: 40,
    holdDelay: 480,
    onActiveCardTap(c) {
      
      hand.openModal();
      const modalPlayBtn = document.getElementById("modal-play-btn");
      const modalResolveBtn = document.getElementById("modal-resolve-btn");
      const modalAvertBtn = document.getElementById("modal-avert-btn");
      const modalCloseBtn = document.getElementById("modal-close-btn");
      const modalDiscardBtn = document.getElementById("modal-discard-btn");
      const modalFlyBtn = document.getElementById("modal-fly-btn");
      const modalDestCloseBtn = document.getElementById("modal-dest-close-btn");
      const modalFooter = document.getElementById("modal-footer");
      for (const child of modalFooter.children) {
        child.classList.add("hidden");
      }
      modalCloseBtn.classList.remove("hidden");
      
      if (c.type === "crisis") {
        modalResolveBtn.classList.remove("hidden");
        if (gameState.hand.cards.some(fort => fort.id === "fortune_crisis_averted")) {
          modalAvertBtn.classList.remove("hidden");
        }
        if (c !== gameState.hand.cards.filter(f => f.type === "crisis")[0]) {
          modalResolveBtn.disabled = true;
          modalAvertBtn.disabled = true;
        } else {
          modalResolveBtn.disabled = false;
          modalAvertBtn.disabled = false;
        }
        
        
      } else if (gameState.phase === "end-discard" || gameState.phase === "draw-forced" || gameState.phase === "discard-avarice") {
        modalDiscardBtn.classList.remove("hidden");
      } else {
        modalPlayBtn.classList.remove("hidden");
        if (gameState.phase === "action" && gameState.actionsRemaining > 0) { modalPlayBtn.disabled = false; } else { modalPlayBtn.disabled = true; }
      }
      
    },
    onCardPlay(c) {
      if (c.type === "fuel") {
        effects["fuel"](c.fuel_value);
      } else {
        effects[c.id] ? effects[c.id]() : '';
      }
      hand.closeModal();
      hand.removeActiveCard({ animate: true });
      if (c.type !== "crisis" && c.id !== "fortune_crisis_averted") {
        gameState.forcedContractCount++;
        gameState.actionsRemaining--;
      };
      gameState.scrapyard.push(c);
      phaseCheck();
      renderCallback(renderCallback);
      
    },
    onCardDiscard(c) {
      hand.closeModal();
      hand.removeActiveCard({ animate: true });
      gameState.scrapyard.push(c);
      
      if (gameState.discardRemaining <= 0) {
        if (gameState.phase === "end-discard") {
          gameState.phase = "end-turn";
          
        }
      }
      phaseCheck()
      renderCallback(renderCallback);
    },
  });
  
  
  //Deal destinations 
  gameState.destinationsOnBoard = gameState.map.splice(0, 3);
  
  
  
  hand.dealHand(gameState.startHand);
  hand.navigateTo(0);
  //Set first phase
  if (hand.cards.some(c => c.type === "crisis")) {
    gameState.phase = "resolution"; 
  } else { 
    gameState.phase = "action"; 
  }
  gameState.hand = hand;
}