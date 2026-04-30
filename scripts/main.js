import { setupGame, deal } from './setup.js';
import { render } from './render.js';
import { DiceRoller } from "./diceRoller/diceRoller.js";


export const gameState = {
  map: [],
  destinationsOnBoard: [],
  boneyard: [],
  startHand: [],
  scrapyard: [],
  log: [],
  planes: 3,
  pax: 0,
  fuel: 0,
  actionsRemaining: 2,
  phase: "start",
  staged_effects: [],
  active_effects: [],
  forcedContractCount: 0,
  animateHand: false,
  discardRemaining:0
}
/*phases:

1. draw
1a. draw_avarice
2. resolution (normal if crises on the board)
2a. resolution_forced
2b. resolution_avarice
3. action
3a. action_avarice
3b.  




/* could add indicators for in-turn  and next turn  unresolved crises (destinations all closed, etc.)

ugh, do i need sub-phases to load game mid-turn later? i do, don't i. for the below too.

note: banner should show instructions when resolving some things instead of buttons. (you must resolve crises, you must discard X more, etc.) 

bad weather: reverses at end of turn (add class to zone/cards if  gs indicator true, remove class on  every turn end.

crisis out of bounds: reverses on any flight. destinationsOnBoard holds open indicator

crisis forced contract: 2 properties- 1 indicator to arm, 1 that holds the number of actions / discards. On next turn, if indicator, change to false, force discard of cards until count is zero. 
this one needs a custom phase to handle disabling buttons too. end of turn - if indicator, customphase, remove indicator. treat phase similar to resolution.
on discard, if  custom phase and count is zero, go to action phase. 

fortune_reroute: need new reroute button on destination modal. 

fortune garbage collector: new modal and new Hand to browse scrapyard.

fortune overdrive: actions to 99

fortune hack the system: indicator, picker at end of turn instead of roll, remove indicator. new modal...

fortune crystal ball: see garbage collector

fortune pound in flesh: add trigger, adjust addfuel

fortune 2020: might just not allow reorder

fortune avarice: trigger indicator and custom phase 


CHECKS:

DEAL:
(DONE) check for crises (resolution/action)

BEFORE CRISIS:
(DONE) Check for crisis averted card

AFTER CRISIS:
(DONE) check for any more crises (resolution/action)

AFTER ANY PLANE DESTROYED
(DONE) Check for game over

AFTER ANY ADDED PAX:
(DONE) Check for overweight
 
 AFTER ALL CRISES RESOLVED
 check for avarice
 
 BEFORE FORTUNE:
 (DONE) Check number remaining
 
 BEFORE BONEYARD ACTION (20/20, crystal, garbage):
 Check for enough (shuffle scrap)
 
 (DONE) BEFORE FUELING
 check for pound in flesh
 
 BEFORE FLYING:
 Check fuel, pax,  (open maybe?)
 check actions remaining 
 
 AFTER FLYING:
 Check game win
 Check closed, open them

BEFORE ADDING DESTINATION:
Check number left

ON END TURN:
Check for hack
Count actions taken (if 0, discard) - need later

AFTER DICE ROLL
check for overweight
check game end

BEFORE DRAW
check for forced contract
check for avarice

*/



document.addEventListener("DOMContentLoaded", (event) => {
  const drawBtn = document.getElementById("deal-btn");
  drawBtn.addEventListener("click", () => {
    deal(render);
    render(render);
  });
  setupGame();
  render(render);
  //const doBtn=document.getElementById("go");
  //doBtn.addEventListener("click", () => {
//  });
})