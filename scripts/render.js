import { gameState } from './main.js';
import { viewDestination } from './actions/fly.js';


//Itinerary
function renderDestinations(renderCallback) {
  const destinationZone = document.getElementById("destination-zone");
  destinationZone.innerHTML = '';
  gameState.destinationsOnBoard.forEach((dest, i) => {
    const el = document.createElement('div');
    el.className = 'destination-card';
    el.dataset.cardId = dest.id ?? '';
    el.innerHTML = `
          <div class="dest-card-art"
            style="background-color:#6B9B6A33;"><img src="images/${dest.id}.png">
          </div>
            <div class="dest-card-title">
              ${dest.title ?? ''}
            </div>
            <div class="dest-card-stats">
              <span class="dest-card-stat"${gameState.fuel<dest.fuel ? 'style="color:#D94F3D"' : ''}>⛽ ${dest.fuel}</span>
              <span class="dest-card-stat"${(gameState.pax<dest.min_pax || gameState.pax>dest.max_pax) ? 'style="color:#D94F3D"' : ''}>👤 ${dest.min_pax}-${dest.max_pax}</span>
          </div>`;
    if (!dest.open) {
      el.classList.add("flipped");
    } else {
      el.addEventListener("click", () => { 
        console.log("clicked");
        viewDestination(dest) });
    }
    destinationZone.appendChild(el);
  });
}




function renderFuel(renderCallback) {
  const fuelZone = document.getElementById("fuel-zone");
  fuelZone.innerHTML = '';
  let fiveFuel = Math.floor(gameState.fuel / 5);
  
  let oneFuel = gameState.fuel % 5;
  
  
  for (let i = 0; i < fiveFuel; i++) {
    const fuelCan5 = document.createElement("img");
    fuelCan5.classList.add("resource");
    fuelCan5.src = "images/fuel_can_5.png";
    fuelZone.appendChild(fuelCan5);
  }
  for (let i = 0; i < oneFuel; i++) {
    const fuelCan1 = document.createElement("img");
    fuelCan1.classList.add("resource");
    fuelCan1.src = "images/fuel_can_1.png";
    fuelZone.appendChild(fuelCan1);
  }
}

function renderPax(renderCallback) {
  const seats = document.querySelectorAll(".seat");
  seats.forEach((seat) => {
    seat.classList.remove("taken");
  })
  for (let i = 0; i < gameState.pax; i++) {
    seats[i].classList.add("taken");
  }
}

function renderPlanes(renderCallback) {
  const planes = document.querySelectorAll(".plane");
  planes.forEach((plane, index) => {
    if (index >= gameState.planes) {
      plane.classList.add("hidden");
    }
  })
}


function renderButtons(renderCallback) {
  const actionRow = document.getElementById("action-row");
  const dealButton = document.getElementById("deal-btn");
  const drawButton = document.getElementById("draw-btn");
  const resolveButton = document.getElementById("resolve-btn");
  const endTurnButton = document.getElementById("end-turn-btn");
  const resolveCrisesButton = document.getElementById("resolve-crises-btn");
  const boardingButton = document.getElementById("boarding-btn");
  const banner = document.getElementById("banner");
  endTurnButton.textContent = `End Turn (${gameState.actionsRemaining})`
  
  for (const child of actionRow.children) {
    child.classList.add("hidden");
  }
  
  switch (gameState.phase) {
    case 'start':
      dealButton.classList.remove("hidden");
      break;
    case 'resolution':
      resolveCrisesButton.classList.remove("hidden");
      break;
    case 'action':
      endTurnButton.classList.remove("hidden");
      break;
    case 'draw':
      drawButton.classList.remove("hidden");
      break;
    case 'end-discard':
      banner.classList.remove("hidden");
      break;
     case 'end-turn':
       boardingButton.classList.remove("hidden");
    default:
      // Tab to edit
  }
  
  if (gameState.phase === "start") {
    
  }
  
}

export function render(renderCallback) {
  renderDestinations(renderCallback);
  renderFuel(renderCallback);
  renderPax(renderCallback);
  renderPlanes(renderCallback);
  renderButtons(renderCallback);
}


