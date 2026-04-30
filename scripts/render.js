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
        viewDestination(dest)
      });
    }
    destinationZone.appendChild(el);
  });
  let completionMarkers = "";
  for (let i = 1; i <= 8; i++) {
    if (i <= gameState.log.length) {
      completionMarkers += "check_circle\n";
    } else {
      completionMarkers += "radio_button_unchecked\n";
    }
  }
  document.getElementById("destination-progress").textContent = completionMarkers;
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

function renderScrap(renderCallback) {
  const scrap = document.getElementById("scrap-card");
  if (gameState.scrapyard.length === 0) {
    scrap.classList.add("invisible");
  } else {
    scrap.classList.remove("invisible");
    scrap.src = `images/${gameState.scrapyard[gameState.scrapyard.length-1].id}.png`;
  }
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
  //const debug=document.getElementById("do");
  //debug.textContent=gameState.phase;
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
    case 'reroute':
      banner.classList.remove("hidden");
      break;
    case 'end-turn':
      boardingButton.classList.remove("hidden");
    default:
      // Tab to edit
  }
  if (gameState.phase === "draw-forced" || gameState.phase === "end-discard" || gameState.phase === "discard-avarice") {
    banner.textContent = `Discard ${gameState.discardRemaining} Cards`;
    banner.classList.remove("hidden");
  }
  
}

export function render(renderCallback) {
  renderDestinations(renderCallback);
  renderFuel(renderCallback);
  renderPax(renderCallback);
  renderPlanes(renderCallback);
  renderScrap(renderCallback);
  renderButtons(renderCallback);
}