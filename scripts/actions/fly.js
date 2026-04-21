import { render } from '../render.js';
import { gameState } from '../main.js';

export function viewDestination(card) {
 
  //Declarations   
  const backdrop = document.getElementById("modal-backdrop");
  const modal = document.getElementById('modal');
  const artEl = document.getElementById('modal-art');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalBody = document.getElementById('modal-body');
  const modalStats = document.getElementById('modal-stats');
  const modalFooter = document.getElementById('modal-footer');
  const flyButton = document.getElementById("modal-fly-btn");
  const closeButton = document.getElementById("modal-dest-close-btn");
  
  //Show Modal, add close listener
  backdrop.classList.add('open');
  const close = e => {
    if (e.target === backdrop) {
      closeModal();
      backdrop.removeEventListener('pointerdown', close);
    }
  };
  backdrop.addEventListener('pointerdown', close);
  
  artEl.innerHTML = '';
  const artImg = document.createElement("img");
  artImg.src = `images/${card.id}.png`;
  artImg.style.margin = "-22% 0 0 -5%";
  artEl.appendChild(artImg);
  artEl.style.backgroundImage =
    `linear-gradient(135deg,#6B9B6A55,#6B9B6A22)`;
  
  modalTitle.textContent = card.title ?? '';
  modalBody.textContent = card.body ?? '';
  modalBadge.textContent = '🌎 Destination';
  
  
  modalStats.innerHTML = `
  <div class="dest-card-stats">
    <span class="modal-stat"${gameState.fuel<card.fuel ? 'style="color:#D94F3D"' : ''}>⛽ ${card.fuel}</span>
    <span class="modal-stat"${(gameState.pax<card.min_pax || gameState.pax>card.max_pax) ? 'style="color:#D94F3D"' : ''}>👤 ${card.min_pax}-${card.max_pax}</span>
  </div>`;
  
  for (const child of modalFooter.children) {
    child.classList.add("hidden");
  }
  flyButton.classList.remove("hidden");
  closeButton.classList.remove("hidden");
  
  if (gameState.phase === "resolution" || gameState.actionsRemaining === 0 || gameState.fuel < card.fuel || gameState.pax < card.min_pax || gameState.pax > card.max_pax) {
    flyButton.disabled = true;
  } else {
    flyButton.disabled = false;
  }
  closeButton.addEventListener("click", () => closeModal());
  flyButton.addEventListener("click",() => fly(card));
}

function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
}

function fly(card) {
  const destIndex = gameState.destinationsOnBoard.findIndex(card);
  gameState.log.push(...gameState.destinationsOnBoard.splice(destIndex, 1));
  if (gameState.map.length > 0) {
    gameState.destinationsOnBoard.push(...gameState.map.splice(0, 1));
  }
  
  let completionMarkers = "";
  
  for (let i = 1; i <= 8; i++) {
    if (i <= gameState.log.length) {
      completionMarkers += "task_alt\n";
    } else {
      completionMarkers += "radio_button_unchecked\n";
    }
  }
  document.getElementById("destination-progress").textContent = completionMarkers;
}