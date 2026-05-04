import { gameState } from './main.js';

export function debugScreen() {
  const debug = document.getElementById("debug")
  debug.innerHTML = '';
  Object.entries(gameState).forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.addEventListener("click", () => {
      console.log(key);
      console.log(value);
    });
    debug.appendChild(btn);
  });
  
  const hcbtn = document.createElement("button");
  hcbtn.textContent = "hand.cards"
  hcbtn.addEventListener("click", () => {
    console.log("hand.cards");
    console.log(gameState.hand.cards);
  });
  debug.appendChild(hcbtn);
  
  const backbtn = document.createElement("button");
backbtn.textContent = "Back"
hcbtn.addEventListener("click", () => {
 debug.classList.toggle("hidden");
});
debug.appendChild(backbtn);
debug.classList.toggle("hidden");
  
  
  
}