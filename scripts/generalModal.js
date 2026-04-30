import { gameState } from './main.js';
import { refillBoneyard, addPax } from './actions/actionMap.js'

const genModalBackdrop = document.getElementById("gen-modal-backdrop");
const genModalTitle = document.getElementById("gen-modal-title");
const genModalText = document.getElementById("gen-modal-text");
const genModalHeadline = document.getElementById("gen-modal-headline");
const genModalContent = document.getElementById("gen-modal-other-content");
const genModalFooter = document.getElementById("gen-modal-footer");


export function orderBox() {
  genModalBackdrop.classList.remove("hidden");
  
  genModalTitle.textContent = "20/20 Vision";
  genModalHeadline.textContent = "Look at the top 5 cards in the boneyard and reorder them.";
  genModalText.textContent = '';
  const visionCards = [];
  for (let i = 0; i < 5; i++) {
    if (gameState.boneyard.length < 1) {
      refillBoneyard();
    }
    const c = gameState.boneyard.splice(0, 1)[0];
    visionCards.push(c);
  }
  
  const reorderBtn = document.createElement("button");
  reorderBtn.classList.add("btn", "btn-fortune");
  reorderBtn.textContent = "Reorder";
  reorderBtn.addEventListener("click", () => {
    
    gameState.boneyard.unshift(...visionCards);
    genModalBackdrop.classList.add("hidden");
  });
  
  
  genModalFooter.appendChild(reorderBtn);
  
  
  function move(arr, from, to) {
    const element = arr.splice(from, 1)[0]; // Remove element
    arr.splice(to, 0, element); // Insert at new index
    redraw(arr);
  };
  
  function redraw(visionCards)
  {
    genModalContent.innerHTML = '';
    const orderZone = document.createElement('div');
    orderZone.classList.add("zone");
    orderZone.id = "order-zone";
    
    visionCards.forEach((c, i) => {
      //Card Row
      const cardRow = document.createElement("div");
      cardRow.classList.add("card-row");
      
      //Card Icon
      const cardIcon = document.createElement("div");
      cardIcon.classList.add("icon", "view", c.type);
      let icon = '';
      switch (c.type) {
        case "crisis":
          icon = "⚠";
          break;
        case "fortune":
          icon = "★";
          break;
        case "fuel":
          icon = '⛽';
          break;
        default:
          icon = "?";
      }
      cardIcon.textContent = icon;
      
      
      //Card Name
      const itemTitle = document.createElement('div');
      itemTitle.classList.add("view", "item-title");
      itemTitle.textContent = c.title
      
      const viewElements = [cardIcon, itemTitle];
      viewElements.forEach((el) => {
        el.addEventListener("click", () => {
          //OPEN MODAL
          const modalFooter = document.getElementById("modal-footer");
          const modalCloseBtn = document.getElementById("modal-view-close-btn");
          for (const child of modalFooter.children) {
            child.classList.add("hidden");
          }
          
          
          
          
          const modal = document.getElementById('modal');
          modal.dataset.type = c.type;
          //modal art
          const artEl = document.getElementById('modal-art');
          artEl.innerHTML = '';
          const artImg = document.createElement("img");
          artImg.src = `images/${c.id}.png`;
          artEl.appendChild(artImg);
          
          document.getElementById('modal-title').textContent = c.title ?? '';
          document.getElementById('modal-body').textContent = c.body ?? '';
          
          document.getElementById('modal-badge').textContent = icon + ' ' + c.type;
          
          const stats = document.getElementById('modal-stats');
          stats.innerHTML = '';
          
          const backdrop = document.getElementById("modal-backdrop");
          
          modalCloseBtn.classList.remove("hidden");
          modalCloseBtn.addEventListener("click", () => { backdrop.classList.add("hidden") });
          
          backdrop.classList.remove('hidden');
          
          const close = e => {
            if (e.target === backdrop) {
              //closeModal();
              backdrop.removeEventListener('pointerdown', close);
            }
          };
          backdrop.addEventListener('pointerdown', close);
        });
        
      });
      
      //Down Arrow
      const downArrow = document.createElement('div');
      downArrow.classList.add("down-button", "material-icons");
      downArrow.textContent = "keyboard_arrow_down";
      downArrow.addEventListener("click", () => move(visionCards, i, i + 1, orderBox))
      
      
      //Up Arrow
      const upArrow = document.createElement('div');
      upArrow.classList.add("down-button", "material-icons");
      upArrow.textContent = "keyboard_arrow_up";
      upArrow.addEventListener("click", () => move(visionCards, i, i - 1))
      
      cardRow.appendChild(cardIcon);
      cardRow.appendChild(itemTitle);
      if (i === 4) downArrow.classList.add("invisible");
      
      if (i === 0) upArrow.classList.add("invisible");
      cardRow.appendChild(downArrow);
      cardRow.appendChild(upArrow);
      orderZone.appendChild(cardRow);
    });
    genModalContent.appendChild(orderZone);
  }
  redraw(visionCards);
}

export function choosePax(add = true) {
  return new Promise((resolve) => {
    genModalText.innerHTML = '';
let p = 0;
const chooser = document.createElement("div");
const subtractBtn = document.createElement("div");
const addBtn = document.createElement("div");
const selectValue = document.createElement("div");
const doneBtn = document.createElement("button");
chooser.classList.add("chooser");
doneBtn.classList.add("btn", "btn-fortune");
doneBtn.textContent = `${add ? "Add" : "Remove"} ${p} Passengers`;

doneBtn.addEventListener("click", () => {
  genModalContent.innerHTML = '';
  genModalFooter.innerHTML = '';
  genModalBackdrop.classList.add("hidden");
  resolve(p);
})


subtractBtn.classList.add("btn", "btn-primary", "material-icons");

subtractBtn.textContent = "remove";
subtractBtn.addEventListener("click", () => {
  if (p > 0) {
    p--;
    selectValue.textContent = p;
    doneBtn.textContent = `${add ? "Add" : "Remove"} ${p} Passengers`;
  }
})

addBtn.classList.add("btn", "btn-primary", "material-icons");
addBtn.textContent = "add";

addBtn.addEventListener("click", () => {
  if ((add && p < 6) || (!add && p < Math.min(gameState.pax, 6))) {
    p++;
    selectValue.textContent = p;
    doneBtn.textContent = `${add ? "Add" : "Remove"} ${p} Passengers`;
  }
})


selectValue.textContent = p

chooser.appendChild(subtractBtn);
chooser.appendChild(selectValue);
chooser.appendChild(addBtn);
genModalContent.appendChild(chooser);
genModalFooter.appendChild(doneBtn);


genModalTitle.textContent = add ? "Hack the System" : "Good Riddance";
genModalHeadline.textContent = add ? "Gain up to six passengers at the end of this turn" : "Lose up to 6 passengers";


genModalBackdrop.classList.remove("hidden");
    
  })
  
}