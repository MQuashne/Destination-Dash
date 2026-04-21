/* =====================================================
   CardHand — Destination Dash
   =====================================================

   PUBLIC API
   ──────────
   const hand = new CardHand('#hand-stage', options);

   hand.addCard(data, {animate})   Add card to right end
   hand.removeCard(index?)         Remove by index (default = active)
   hand.removeActiveCard()         Remove active card
   hand.navigateTo(index)          Go to card by index
   hand.navigateNext()             Next card
   hand.navigatePrev()             Previous card
   hand.getActiveCard()            Returns active card data
   hand.openModal(index?)          Open detail modal
   hand.closeModal()               Close modal
   hand.onActiveCardTap(fn)        fn(cardData, el)
   hand.onCardPlay(fn)             fn(cardData)
   hand.onCardDiscard(fn)          fn(cardData)

   CARD DATA SHAPE
   ───────────────
   { id, type, title, body, art, faceDown, stats:[{icon,value}] }
   type: 'fortune' | 'crisis' | 'dest' | 'fuel' | 'model'

   FAN TUNING  (edit constants inside _measure())
   ───────────
   CARD_RATIO   card height / width          default 1.42
   CARD_W_FRAC  card width as % of stage     default 0.40
   PEEK_RATIO   horizontal shift per step    default 0.10
   DROOP_RATIO  downward drop per step       default 0.038
   BG_SCALE     scale per step from active   default 0.85
   MAX_ROT      max rotation in degrees      default 7
   ===================================================== */
import { gameState } from './main.js'


export class CardHand {
  
  constructor(selector, opts = {}) {
    this.stage = document.querySelector(selector);
    this.cards = []; // card data objects
    this._els = []; // parallel DOM elements
    
    this.activeIndex = 0;
    this._swipeThreshold = opts.swipeThreshold ?? 40;
    this._holdDelay = opts.holdDelay ?? 480;
    this._cbTap = opts.onActiveCardTap ?? null;
    this._cbPlay = opts.onCardPlay ?? null;
    this._cbDiscard = opts.onCardDiscard ?? null;
    
    this._drag = null;
    this._holdTimer = null;
    this._didMove = false;
    this._resizeTimer = null;
    
    this._navLeft = document.getElementById('nav-left');
    this._navRight = document.getElementById('nav-right');
    
    this._listen();
  }
  
  /* ── add / remove ──────────────────────────────── */
  
  addCard(data, opts = {}) {
    const animate = opts.animate !== false;
    this.cards.push(data);
    const el = this._build(data);
    this.stage.appendChild(el);
    this._els.push(el);
    
    // One rAF so the element has layout before we measure it
    requestAnimationFrame(() => {
      this._layout(animate);
      this._dots();
      this._hints();
      if (animate) {
        el.classList.add('card-entering');
        el.addEventListener('animationend',
          () => el.classList.remove('card-entering'), { once: true });
      }
    });
  }
  
  removeCard(idx = this.activeIndex, opts = {}) {
    if (!this.cards.length) return;
    idx = Math.max(0, Math.min(idx, this.cards.length - 1));
    const el = this._els[idx];
    if (opts.animate !== false) {
      el.style.transition = 'opacity .22s ease, transform .22s ease';
      el.style.opacity = '0';
      el.style.transform += ' scale(.82)';
    }
    setTimeout(() => {
      el.remove();
      this.cards.splice(idx, 1);
      this._els.splice(idx, 1);
      this.activeIndex = Math.min(this.activeIndex, Math.max(0, this.cards.length - 1));
      this._layout(true);
      this._dots();
      this._hints();
    }, opts.animate !== false ? 250 : 0);
  }
  
  removeActiveCard(opts={}) { this.removeCard(this.activeIndex,opts); }
  
dealHand(cards) {
  cards.forEach(c => {
    this.cards.push(c);
    const el = this._build(c);
    this.stage.appendChild(el);
    this._els.push(el);
  });

  this._dots();
  this._hints();

  requestAnimationFrame(() => {
    // Measure once, reuse for all cards
    const { sw, sh, cardW, cardH, peek, droop, BG_SCALE, MAX_ROT } = this._measure();
    const ai   = this.activeIndex;
    const count = this._els.length;
    const cx   = sw / 2;
    const cy   = sh / 2;
    const span = Math.max(1, Math.max(ai, count - 1 - ai));

    // Pre-calculate every card's final position without touching the DOM
    const targets = this._els.map((el, i) => {
      const dist    = i - ai;
      const absDist = Math.abs(dist);
      return {
        el,
        x:      cx - cardW / 2 + dist * peek,
        y:      cy - cardH / 2 + absDist * droop,
        scale:  Math.pow(BG_SCALE, absDist),
        rotate: dist * (MAX_ROT / span),
        z:      100 - absDist,
        opacity: Math.max(0.4, 1 - absDist * 0.07).toFixed(2),
      };
    });

    // Set all cards to their offscreen start — no transition yet
    targets.forEach(({ el, x }) => {
      el.style.transition = 'none';
      el.style.width      = `${cardW}px`;
      el.style.height     = `${cardH}px`;
      el.style.opacity    = '0';
      el.style.zIndex     = '50';
      // Start directly below their final X position
      el.style.transform  = `translate(${x}px, ${cy + sh * 0.7}px) scale(0.85)`;
      el.classList.toggle('is-active', targets.indexOf(targets.find(t => t.el === el)) === ai);
    });

    // Force a single reflow so all start positions are committed
    void this.stage.offsetHeight;

    // Now stagger each card flying to its final position
    targets.forEach(({ el, x, y, scale, rotate, z, opacity }, i) => {
      setTimeout(() => {
        el.style.transition = 'transform 0.45s cubic-bezier(.34,1.15,.64,1), opacity 0.3s ease';
        el.style.transform  = `translate(${x}px,${y}px) scale(${scale}) rotate(${rotate}deg)`;
        el.style.opacity    = opacity;
        el.style.zIndex     = z;
        el.classList.toggle('is-active', i === ai);
      }, i * 70);
    });
  });
}



 
 
  /* ── navigation ────────────────────────────────── */
  
  navigateTo(i) {
    if (i < 0 || i >= this.cards.length) return;
    this.activeIndex = i;
    this._layout(true);
    this._dots();
    this._hints();
  }
  navigateNext() { this.navigateTo(this.activeIndex + 1);}
  navigatePrev() { this.navigateTo(this.activeIndex - 1); }
  getActiveCard() { return this.cards[this.activeIndex] ?? null; }
  
  /* ── callbacks ─────────────────────────────────── */
  
  onActiveCardTap(fn) { this._cbTap = fn; }
  onCardPlay(fn) { this._cbPlay = fn; }
  onCardDiscard(fn) { this._cbDiscard = fn; }
  
  /* ── modal ──────────────────────────────────────── */
  
  openModal(idx = this.activeIndex) {
    const card = this.cards[idx];
    if (!card) return;
    const modal = document.getElementById('modal');
    modal.dataset.type = card.type;
    //modal art
    const artEl = document.getElementById('modal-art');
    artEl.innerHTML = '';
    const artImg = document.createElement("img");
    artImg.src = `images/${card.id}.png`;
    artEl.appendChild(artImg);
    artEl.style.backgroundImage = card.art ?
      `url('${card.art}')` :
      `linear-gradient(135deg,${this._color(card.type)}55,${this._color(card.type)}22)`;
    
    document.getElementById('modal-title').textContent = card.title ?? '';
    document.getElementById('modal-body').textContent = card.body ?? '';
    
    console.log(gameState.active_effects.some(a=> a==="fortune_a_pound_in_flesh"));
    
    if (gameState.active_effects.some(a=> a==="fortune_a_pound_in_flesh")){
      document.getElementById('modal-body').textContent = "FUEL DOUBLED AND PASSENGERS REMOVED THIS PLAY!"
    }
    
    
    
    document.getElementById('modal-badge').textContent = this._label(card.type);
    
    const stats = document.getElementById('modal-stats');
    stats.innerHTML = '';
    /*(card.stats ?? []).forEach(s => {
      const d = document.createElement('div');
      d.className = 'modal-stat';
      d.textContent = `${s.icon} ${s.value}`;
      stats.appendChild(d);
    });*/
    
    const backdrop = document.getElementById("modal-backdrop");
    backdrop.classList.add('open');
    const close = e => {
      if (e.target === backdrop) {
        this.closeModal();
        backdrop.removeEventListener('pointerdown', close);
      }
    };
    backdrop.addEventListener('pointerdown', close);
  }
  
  closeModal() {
    document.getElementById('modal-backdrop')?.classList.remove('open');
  }
  
  /* ── LAYOUT ENGINE ──────────────────────────────── */
  
  /*
   * _measure()
   * All layout constants in one place.
   * Edit these to tune the fan appearance.
   *
   * CARD_RATIO   — height ÷ width (1.42 ≈ real playing card)
   * CARD_W_FRAC  — card width as a fraction of stage width
   * PEEK_RATIO   — horizontal offset per step as fraction of stage width
   *                Increase for a wider, more spread fan
   * DROOP_RATIO  — downward arc per step as fraction of stage height
   *                Increase for a deeper curve
   * BG_SCALE     — scale multiplier per step away from active (0–1)
   *                Lower = background cards shrink more dramatically
   * MAX_ROT      — max rotation in degrees on the outermost card
   *                Increase for a more angular, dramatic fan
   */
  _measure() {
    const CARD_RATIO = 1.42;
    const CARD_W_FRAC = 0.40;
    const PEEK_RATIO = 0.15;
    const DROOP_RATIO = 0; //0.038;
    const BG_SCALE = 0.85;
    const MAX_ROT = 7;
    
    const sw = this.stage.offsetWidth;
    const sh = this.stage.offsetHeight;
    
    const cardW = Math.max(90, Math.min(210, sw * CARD_W_FRAC));
    const cardH = cardW * CARD_RATIO;
    const peek = sw * PEEK_RATIO;
    const droop = sh * DROOP_RATIO;
    
    return { sw, sh, cardW, cardH, peek, droop, BG_SCALE, MAX_ROT };
  }
  
  /*
   * _layout(animate)
   * Positions every card using pixel transforms.
   * All transform values are computed here in JS —
   * no CSS variables are parsed, avoiding the clamp() issue.
   */
  _layout(animate = true) {
    if (!this._els.length) return;
    
    const { sw, sh, cardW, cardH, peek, droop, BG_SCALE, MAX_ROT } = this._measure();
    const ai = this.activeIndex;
    const count = this._els.length;
    const cx = sw / 2;
    const cy = sh / 2;
    const span = Math.max(1, Math.max(ai, count - 1 - ai));
    
    this._els.forEach((el, i) => {
      const dist = i - ai; // negative = left, 0 = active, positive = right
      const absDist = Math.abs(dist);
      
      // Set dimensions first so the card has a real size in the DOM
      el.style.width = `${cardW}px`;
      el.style.height = `${cardH}px`;
      
      // X: centre the active card; offset others by peek per step
      const x = cx - cardW / 2 + dist * peek;
      // Y: active card at vertical centre; others drop by droop per step
      const y = cy - cardH / 2 + absDist * droop;
      
      // Scale: 1.0 for active, reduces by BG_SCALE per step
      const scale = Math.pow(BG_SCALE, absDist);
      
      // Rotation: spread evenly across MAX_ROT degrees
      const rotate = dist * (MAX_ROT / span);
      
      // Z-index: active always on top
      el.style.zIndex = 100 - absDist;
      
      // Opacity: gently fade distant cards
      el.style.opacity = Math.max(0.4, 1 - absDist * 0.07).toFixed(2);
      
      // Shadow
      el.style.boxShadow = absDist === 0 ?
        '0 16px 44px rgba(0,0,0,.65), 0 4px 14px rgba(0,0,0,.45)' :
        '0 5px 18px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3)';
      
      // Transition: on during navigation, off during drag
      el.style.transition = animate ?
        'transform .42s cubic-bezier(.34,1.15,.64,1), opacity .35s ease, box-shadow .35s ease' :
        'none';
      
      // The actual transform: translate from top-left, scale, rotate
      el.style.transform = `translate(${x}px,${y}px) scale(${scale}) rotate(${rotate}deg)`;
      
      el.classList.toggle('is-active', i === ai);
    });
  }
  
  _layoutOne(el, i) {
  const { sw, sh, cardW, cardH, peek, droop, BG_SCALE, MAX_ROT } = this._measure();
  const ai    = this.activeIndex;
  const count = this._els.length;
  const cx    = sw / 2;
  const cy    = sh / 2;
  const span  = Math.max(1, Math.max(ai, count - 1 - ai));

  const dist    = i - ai;
  const absDist = Math.abs(dist);

  el.style.width     = `${cardW}px`;
  el.style.height    = `${cardH}px`;
  el.style.zIndex    = 100 - absDist;
  el.style.opacity   = Math.max(0.4, 1 - absDist * 0.07).toFixed(2);
  el.style.boxShadow = absDist === 0
    ? '0 16px 44px rgba(0,0,0,.65), 0 4px 14px rgba(0,0,0,.45)'
    : '0 5px 18px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3)';

  const x      = cx - cardW / 2 + dist * peek;
  const y      = cy - cardH / 2 + absDist * droop;
  const scale  = Math.pow(BG_SCALE, absDist);
  const rotate = dist * (MAX_ROT / span);

  el.style.transform = `translate(${x}px,${y}px) scale(${scale}) rotate(${rotate}deg)`;
  el.classList.toggle('is-active', i === ai);
}

  
  /* ── BUILD CARD ELEMENT ─────────────────────────── */
  
  _build(data) {
    const el = document.createElement('div');
    el.className = 'hand-card';
    el.dataset.type = data.type ?? 'fortune';
    el.dataset.cardId = data.id ?? '';
    
    if (data.faceDown) {
      el.innerHTML = `<div class="card-back">
        <span class="card-back-label">Destination Dash</span></div>`;
    } else {
      const artBg = data.art ? `url('${data.art}')` : '';
      const artColor = this._color(data.type);
      /* 
       const artEl = document.getElementById('modal-art');
      artEl.innerHTML = '';
      const artImg = document.createElement("img");
      artImg.src = `images/${card.id}.png`;
      artEl.appendChild(artImg);
      */
      el.innerHTML = `
        <div class="card-face">
          <div class="card-art"
            style="background-color:${artColor}33;">
            <img src="images/${data.id}.png">
            </div>
          <div class="card-badge">${this._icon(data.type)}</div>
          <div class="card-text">
            <div class="card-title">${data.title ?? ''}</div>
            <div class="card-body">${data.body ?? ''}</div>
          </div>
        </div>`;
    }
    return el;
  }
  
  /* ── INPUT HANDLING ─────────────────────────────── */
  
  _listen() {
    const s = this.stage;
    s.addEventListener('pointerdown', e => this._down(e), { passive: true });
    s.addEventListener('pointermove', e => this._move(e), { passive: true });
    s.addEventListener('pointerup', e => this._up(e));
    s.addEventListener('pointercancel', () => this._cancel());
    
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this.navigateNext();
      if (e.key === 'ArrowLeft') this.navigatePrev();
      if (e.key === 'Enter' || e.key === ' ') this.openModal();
      if (e.key === 'Escape') this.closeModal();
    });
    
    window.addEventListener('resize', () => {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => this._layout(false), 80);
    });
  }
  
  _down(e) {
    this._didMove = false;
    this._drag = { startX: e.clientX, startY: e.clientY, lastX: e.clientX };
    this._holdTimer = setTimeout(() => {
      if (!this._didMove) this.openModal();
    }, this._holdDelay);
  }
  
  _move(e) {
    if (!this._drag) return;
    const dx = e.clientX - this._drag.startX;
    const dy = e.clientY - this._drag.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      this._didMove = true;
      clearTimeout(this._holdTimer);
    }
    this._drag.lastX = e.clientX;
  }
  
  _up(e) {
    if (!this._drag) return;
    clearTimeout(this._holdTimer);
    const dx = e.clientX - this._drag.startX;
    const dy = e.clientY - this._drag.startY;
    const didMove = this._didMove;
    this._drag = null;
    this._didMove = false;
    
    if (didMove) {
      // Swipe: horizontal must dominate
      if (Math.abs(dx) > this._swipeThreshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) this.navigateNext();
        else this.navigatePrev();
      }
    } else {
      // Short tap — identify which card was hit
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const cardEl = hit?.closest?.('.hand-card');
      const idx = cardEl ? this._els.indexOf(cardEl) : -1;
      
      if (idx === this.activeIndex && cardEl) {
        if (this._cbTap) this._cbTap(this.cards[idx], cardEl);
      } else if (idx !== -1) {
        this.navigateTo(idx);
      }
    }
  }
  
  _cancel() {
    clearTimeout(this._holdTimer);
    this._drag = null;
    this._didMove = false;
    this._layout(true);
  }
  
  /* ── UI HELPERS ─────────────────────────────────── */
  
  _dots() {
    const c = document.getElementById('card-dots');
    if (!c) return;
    c.innerHTML = '';
    this.cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = `dot${i === this.activeIndex ? ' active' : ''}`;
      c.appendChild(d);
    });
  }
  
  _hints() {
    this._navLeft?.classList.toggle('show', this.activeIndex > 0);
    this._navRight?.classList.toggle('show', this.activeIndex < this.cards.length - 1);
  }
  
  /* ── TYPE HELPERS ───────────────────────────────── */
  
  _icon(t) { return { fortune: '★', crisis: '⚠', dest: '◎', fuel: '⛽', model: '✈' } [t] ?? '?'; }
  _label(t) {
    return {
      fortune: '★ Fortune',
      crisis: '⚠ Crisis',
      dest: '◎ Destination',
      fuel: '⛽ Fuel Canister',
      model: '✈ Model (DLC)'
    } [t] ?? t;
  }
  _color(t) {
    return {
      fortune: '#E8A820',
      crisis: '#D94F3D',
      dest: '#6B9B6A',
      fuel: '#C8A97E',
      model: '#8B7FAF'
    } [t] ?? '#888';
  }
}

/* =====================================================
   INIT
   ===================================================== */