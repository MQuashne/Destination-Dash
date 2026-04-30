/* ═══════════════════════════════════════════════════════
   DiceRoller
   ═══════════════════════════════════════════════════════

   USAGE
   ─────
   // Roll 1 die, do something with the result
   DiceRoller.open(1, (total, values) => {
     gameState.fuel -= total;
   });

   // Roll 2 dice
   DiceRoller.open(2, (total, values) => {
     console.log('Total:', total, 'Values:', values);
   });

   // Close programmatically (also called by "Use Result" button)
   DiceRoller.close();

   CALLBACK receives:
     total   — sum of all dice  (number)
     values  — array of each die's value  e.g. [3, 5]

   The callback fires when the player taps "Use Result".
   If the player rolls again before confirming, the previous
   result is discarded and a new roll begins.
   ═══════════════════════════════════════════════════════ */

export const DiceRoller = (() => {

  /* ── DOM refs ── */
  const backdrop  = document.getElementById('dice-backdrop');
  const stage     = document.getElementById('dice-stage');
  const titleEl   = document.getElementById('dice-title');
  const totalEl   = document.getElementById('dice-total');
  const btnReroll = document.getElementById('btn-reroll');
  const btnConfirm= document.getElementById('btn-confirm');

  /* ── State ── */
  let _count    = 1;       // how many dice (1 or 2)
  let _callback = null;    // fn(total, values)
  let _values   = [];      // current rolled values
  let _rolling  = false;   // true while animation plays

  /* ── Roll duration in ms (matches CSS --roll-duration) ── */
  const ROLL_MS = 900;

  /* ── Build a single die element ── */
  function buildDie() {
    const die = document.createElement('div');
    die.className = 'die val-1';  // val-1 as placeholder
    /* Nine pip placeholders; CSS grid positions them */
    for (let i = 1; i <= 9; i++) {
      const pip = document.createElement('div');
      pip.className = `pip pip-${i}`;
      die.appendChild(pip);
    }
    return die;
  }

  /* ── Set a die element to show a specific value (1--6) ── */
  function setDieValue(dieEl, value) {
    /* Remove all existing value classes then apply new one */
    dieEl.classList.remove('val-1','val-2','val-3','val-4','val-5','val-6');
    dieEl.classList.add(`val-${value}`);
  }

  /* ── Perform a roll (or re-roll) ── */
  function roll() {
    if (_rolling) return;
    _rolling = true;

    /* Hide total and confirm button while rolling */
    totalEl.classList.remove('show');
    btnConfirm.classList.remove('show');

    /* Pick random values */
    _values = Array.from({ length: _count }, () => Math.floor(Math.random() * 6) + 1);

    /* Get die elements */
    const dice = Array.from(stage.querySelectorAll('.die'));

    /* Apply the new value and trigger animation on each die */
    dice.forEach((die, i) => {
      /* Set the face to the rolled value (visible once animation ends) */
      setDieValue(die, _values[i]);

      /* Remove then re-add .rolling so the animation restarts.
         A tiny timeout forces a browser reflow between the two. */
      die.classList.remove('rolling', 'delay');
      void die.offsetWidth;  /* reflow trick */
      die.classList.add('rolling');
      if (i === 1) die.classList.add('delay');
    });

    /* Wait for animation to finish, then show result */
    const longestDelay = _count === 2 ? ROLL_MS + 80 : ROLL_MS;
    setTimeout(() => {
      const total = _values.reduce((s, v) => s + v, 0);
      /*totalEl.textContent = _count === 1
        ? `Rolled: ${total}`
        : `Rolled: ${_values[0]} + ${_values[1]} = ${total}`;
      totalEl.classList.add('show');*/
      btnConfirm.classList.add('show');
      _rolling = false;
    }, longestDelay + 60);  /* +60ms buffer after last die lands */
  }

  /* ── Open the modal ── */
  function open(count = 1, callback = null) {
    _count    = count === 2 ? 2 : 1;
    _callback = callback;
    _values   = [];
    _rolling  = false;

    /* Update title */
    //titleEl.textContent = _count === 1 ? 'Roll the Die' : 'Roll the Dice';

    /* Rebuild dice in the stage */
    stage.innerHTML = '';
    for (let i = 0; i < _count; i++) {
      stage.appendChild(buildDie());
    }

    /* Reset result display */
    totalEl.textContent = '';
    totalEl.classList.remove('show');
    btnConfirm.classList.remove('show');

    /* Show backdrop */
    backdrop.classList.add('open');
    backdrop.classList.remove("hidden");

    /* Auto-roll on open so the dice are already moving */
    requestAnimationFrame(() => roll());
  }

  /* ── Close the modal ── */
  function close() {
    backdrop.classList.remove('open');
    _rolling  = false;
    _callback = null;
    backdrop.classList.add("hidden");
  }

  /* ── Button listeners ── */
  //btnReroll.addEventListener('click', roll);

  btnConfirm.addEventListener('click', () => {
    if (_callback && _values.length) {
      const total = _values.reduce((s, v) => s + v, 0);
      _callback(total, [..._values]);
    }
    close();
  });

  /* Close on backdrop tap 
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) close();
  });*/

  /* Public interface */
  return { open, close };

})();