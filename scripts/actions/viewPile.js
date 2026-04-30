import { gameState } from '../main.js';
import { CardHand } from '../cardhand.js';
import { notify } from './actionMap.js';
import { shuffle } from '../setup.js';

export function viewPile(pile, gc = false) {
  const genModalBackdrop = document.getElementById("gen-modal-backdrop");
  const genModal = document.getElementById("gen-modal");
  const genModalBody = document.getElementById("gen-modal-body");
  const genModalTitle = document.getElementById("gen-modal-title");
  const genModalHeadline = document.getElementById("gen-modal-headline");
  const genModalText = document.getElementById("gen-modal-text");
  const genModalContent = document.getElementById("gen-modal-other-content");
  const genModalFooter = document.getElementById("gen-modal-footer");
  genModalBackdrop.classList.remove("hidden");
  genModalContent.innerHTML = '<div class="nav-hint left" id="pile-nav-left">‹</div><div class="nav-hint right" id="pile-nav-right">›</div>';
  
  genModalContent.classList.add("hand-stage", "pile-stage");
  genModal.classList.add("pile-modal");
  
  genModalHeadline.textContent = ""
  genModalText.textContent = ''
  genModalBody.classList.add("pile-body");
  
  const closePileBtn = document.createElement("button");
  closePileBtn.classList.add("btn", "btn-discard");
  closePileBtn.innerHTML = "✕ Close";
  closePileBtn.addEventListener("click", () => {
    genModalContent.classList.remove("hand-stage", "pile-stage");
    genModal.classList.remove("pile-modal");
    genModalBody.classList.remove("pile-body");
    genModalFooter.innerHTML = '';
    genModalContent.innerHTML = '';
    genModalBackdrop.classList.add("hidden");
  })
  genModalFooter.appendChild(closePileBtn);
  
  
  function viewScrap(gc = false) {
    genModalTitle.textContent = "SCRAPYARD";
    
    const scrap = new CardHand('#gen-modal-other-content', {
      swipeThreshold: 40,
      holdDelay: 480,
      onActiveCardTap(c) {
        scrap.openModal();
        const modalCloseBtn = document.getElementById("modal-close-btn");
        const modalFooter = document.getElementById("modal-footer");
        for (const child of modalFooter.children) {
          child.classList.add("hidden");
        }
        modalCloseBtn.classList.remove("hidden");
        if (gc) {
          const restoreBtn = document.getElementById("modal-restore-btn");
          restoreBtn.classList.remove("hidden");
          restoreBtn.addEventListener("click", () => {
            genModalBackdrop.classList.add("hidden");
            scrap.closeModal();
            gameState.hand.addCard(c, { animate: false });
            gameState.scrapyard.splice(gameState.scrapyard.indexOf(c), 1);
            genModalFooter.innerHTML = '';
            genModalContent.innerHTML = '';
            restoreBtn.classList.add("hidden");
            genModalBody.classList.remove("pile-body");
            genModal.classList.remove("pile-modal");
            notify("Card Returned To Hand", "fortune")
          }, { once: true });
          modalFooter.prepend(restoreBtn);
        }
      }
    });
    if (gc) {
      genModalHeadline.textContent = "Add a fuel canister from the scrapyard to your hand."
      scrap.dealHand(gameState.scrapyard.filter((c) => c.type === "fuel"));
    } else {
      scrap.dealHand(gameState.scrapyard)
    }
  }
  
  function viewBone() {
    genModalTitle.textContent = "Crystal Ball";
    genModalHeadline.textContent = "Look at all of the cards in the boneyard and pick one. If it is a crisis, discard it. Otherwise, add it to your hand. Shuffle the boneyard."
    
    const bone = new CardHand('#gen-modal-other-content', {
      swipeThreshold: 40,
      holdDelay: 480,
      onActiveCardTap(c) {
        bone.openModal();
        const modalCloseBtn = document.getElementById("modal-close-btn");
        const modalFooter = document.getElementById("modal-footer");
        for (const child of modalFooter.children) {
          child.classList.add("hidden");
        }
        modalCloseBtn.classList.remove("hidden");
        
        if (c.type !== "crisis") {
          //ADD TO HAND
          const restoreBtn = document.createElement("button");
          restoreBtn.classList.add("btn", "btn-fortune");
          restoreBtn.textContent = "➕ Add to Hand";
          restoreBtn.addEventListener("click", () => {
            genModalBackdrop.classList.add("hidden");
            bone.closeModal();
            gameState.hand.addCard(c, { animate: false });
            gameState.boneyard.splice(gameState.boneyard.indexOf(c), 1);
            genModalFooter.innerHTML = '';
            genModalContent.innerHTML = '';
            shuffle(gameState.boneyard)
            notify("Card Returned To Hand", "fortune")
            genModal.classList.remove("pile-modal");
            genModalBody.classList.remove("pile-body");
          });
          modalFooter.prepend(restoreBtn);
          
        } else {
          //DISCARD CRISIS
          const discardBtn = document.createElement("button");
          discardBtn.classList.add("btn", "btn-fortune");
          discardBtn.textContent = "🗑️ Discard Crisis";
          discardBtn.addEventListener("click", () => {
            genModalBackdrop.classList.add("hidden");
            bone.closeModal();
            gameState.scrapyard.push(...gameState.boneyard.splice(gameState.boneyard.indexOf(c), 1));
            genModalFooter.innerHTML = '';
            genModalContent.innerHTML = '';
            shuffle(gameState.boneyard);
            notify("Crisis Discarded", "fortune");
            genModal.classList.remove("pile-modal");
            genModalBody.classList.remove("pile-body");
          });
          modalFooter.prepend(discardBtn);
        }
      }
    });
    bone.dealHand(gameState.boneyard)
  }
  
  if (pile === "scrap") {
    viewScrap(gc);
  } else {
    viewBone();
  }
}





/*
export function viewScrap(gc = false) {
  const genModalBackdrop = document.getElementById("gen-modal-backdrop");
  const genModal = document.getElementById("gen-modal");
  const genModalBody = document.getElementById("gen-modal-body");
  const genModalTitle = document.getElementById("gen-modal-title");
  const genModalHeadline = document.getElementById("gen-modal-headline");
  const genModalText = document.getElementById("gen-modal-text");
  const genModalContent = document.getElementById("gen-modal-other-content");
  const genModalFooter = document.getElementById("gen-modal-footer");
  
  /*
  <div class="hand-stage" id="hand-stage">
        <div class="nav-hint left" id="nav-left">‹</div>
        <div class="nav-hint right" id="nav-right">›</div>
      </div>
  
  genModalBackdrop.classList.remove("hidden");
  genModalContent.innerHTML = '<div class="nav-hint left" id="scrap-nav-left">‹</div><div class="nav-hint right" id="scrap-nav-right">›</div>';
  
  genModalContent.classList.add("hand-stage", "pile-stage");
  genModal.classList.add("pile-modal");
  genModalTitle.textContent = "SCRAPYARD";
  genModalHeadline.textContent = ""
  genModalText.textContent = ''
  genModalBody.classList.add("pile-body");
  
  const closeScrapBtn = document.createElement("button");
  closeScrapBtn.classList.add("btn", "btn-discard");
  closeScrapBtn.innerHTML = "✕ Close";
  closeScrapBtn.addEventListener("click", () => {
    genModalContent.classList.remove("hand-stage", "pile-stage");
    genModal.classList.remove("pile-modal");
    genModalBody.classList.remove("pile-body");
    genModalFooter.innerHTML = '';
    genModalBackdrop.classList.add("hidden");
  })
 
  
  genModalFooter.appendChild(closeScrapBtn);
  
  
  const scrap = new CardHand('#gen-modal-other-content', {
    swipeThreshold: 40,
    holdDelay: 480,
    onActiveCardTap(c) {
      scrap.openModal();
      const modalCloseBtn = document.getElementById("modal-close-btn");
      const modalFooter = document.getElementById("modal-footer");
      for (const child of modalFooter.children) {
        child.classList.add("hidden");
      }
      modalCloseBtn.classList.remove("hidden");
      if (gc){
        const restoreBtn = document.createElement("button");
        restoreBtn.classList.add("btn","btn-fortune");
        restoreBtn.textContent="♻️ Restore";
        restoreBtn.addEventListener("click",() => {
        genModalBackdrop.classList.add("hidden");
        scrap.closeModal();
        gameState.hand.addCard(c,{ animate:false});
        gameState.scrapyard.splice(gameState.scrapyard.indexOf(c),1);
        });
        modalFooter.prepend(restoreBtn);
        
        /*
        <button class="btn btn-fortune" id="modal-reroute-btn">♻️ Rees/button>
        
        
      }
    }
  });
  if (gc){
  scrap.dealHand(gameState.scrapyard.filter((c) => c.type==="fuel"));
  } else {
    scrap.dealHand(gameState.scrapyard)
  }
}

*/