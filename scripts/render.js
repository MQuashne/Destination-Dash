//Itinerary
function renderDestinations(gameState, renderCallback) {
  const destinationZone = document.getElementById("destination-zone");
  destinationZone.innerHTML = '';
  gameState.destinationsOnBoard.forEach((dest, i) => {
    const card = document.createElement("div");
    
    const image = document.createElement("img");
    image.classList.add("card-img");
    image.src = `images/${dest.id}.png`
    card.appendChild(image);
    card.classList.add("destination-card");
    destinationZone.appendChild(card);
  });
}

function renderFuel(gameState, renderCallback) {
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

function renderPax(gameState,renderCallback){
  const seats=document.querySelectorAll(".seat");
  seats.forEach((seat) => {
    seat.classList.remove("taken");
  })
  for (let i=0;i<gameState.pax;i++){
   seats[i].classList.add("taken");
  }
}

function renderPlanes(gameState,renderCallback){
  const planes = document.querySelectorAll(".plane");
  planes.forEach((plane, index) => {
    if (index>=gameState.planes){
      plane.classList.add("hidden");
    }
  })
}

function renderPlayerHand(gameState, renderCallback) {
  const playerCards = document.getElementById("player-cards");
  playerCards.innerHTML = '';
  gameState.playerHand.forEach((play, i) => {
    const slide = document.createElement("li");
    const card = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("card-img");
    image.src = `images/${play.id}.png`
    slide.appendChild(image);
    
    playerCards.appendChild(slide);
    if (i === gameState.playerHand.length - 1) {
      console.log("once")
      var stackedCard = new stackedCards({
        selector: '.stacked-cards',
        layout: "slide",
        transformOrigin: "center",
      });
      stackedCard.init();
      
    }
  })
}

export function render(gameState, renderCallback) {
  renderDestinations(gameState, renderCallback);
  renderPlayerHand(gameState, renderCallback);
  renderFuel(gameState, renderCallback);
  renderPax(gameState, renderCallback);
  renderPlanes(gameState, renderCallback);
}