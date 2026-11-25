(function () {
  'use strict';

  var CAL = window.CALENDAR;
  if (!CAL || !CAL.config || !CAL.cards) {
    document.getElementById('content-error').hidden = false;
    return;
  }
  var CFG = CAL.config;

  /* Mode test : ?jour=5 dans l'adresse, ou #jour-5 (utile dans l'aperçu en ligne) */
  var params = new URLSearchParams(location.search);
  var previewDay = null;
  if (params.has('jour')) previewDay = parseInt(params.get('jour'), 10);
  var hashMatch = /jour-?(\d+)/.exec(location.hash);
  if (hashMatch) previewDay = parseInt(hashMatch[1], 10);
  if (previewDay !== null && isNaN(previewDay)) previewDay = null;
  var testMode = previewDay !== null;

  /* Si l'appareil demande moins d'animations, on garde une version douce (fondus) */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mémoire des cases ouvertes ---------------- */
  /* En mode test, rien n'est gardé : recharger la page remet tout à zéro. */
  var STORE_KEY = 'avent-' + CFG.year;
  var memory = [];
  function loadOpened() {
    if (testMode) return [];
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return memory.slice(); }
  }
  function saveOpened(list) {
    memory = list.slice();
    if (testMode) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* pas grave */ }
  }
  var opened = new Set(loadOpened());

  /* ---------------- Dates : une case s'ouvre à minuit, heure de son appareil ---------------- */
  function now() {
    if (previewDay !== null) return new Date(CFG.year, 11, previewDay, 12, 0, 0);
    return new Date();
  }
  function unlockAt(n) { return new Date(CFG.year, 11, n, 0, 0, 0, 0); }
  function currentDay() {
    var t = now();
    var d = 0;
    for (var n = 1; n <= 24; n++) { if (t >= unlockAt(n)) d = n; }
    return d;
  }
  var fmtDay = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  function dayLabel(n) {
    var s = fmtDay.format(unlockAt(n));
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------------- Formes ---------------- */
  var HEART = 'M60 104 C20 74 10 52 10 38 C10 22 22 12 36 12 C46 12 55 18 60 27 C65 18 74 12 84 12 C98 12 110 22 110 38 C110 52 100 74 60 104 Z';
  var STAR = 'M60 8 L74 43 L112 46 L83 70 L92 107 L60 87 L28 107 L37 70 L8 46 L46 43 Z';
  var MOON = 'M59.5 12 A48 48 0 1 0 106.7 71 A38 38 0 1 1 59.5 12 Z';
  var SQUARE = 'M34 14 H86 A20 20 0 0 1 106 34 V86 A20 20 0 0 1 86 106 H34 A20 20 0 0 1 14 86 V34 A20 20 0 0 1 34 14 Z';
  var CIRCLE = 'M12 60 A48 48 0 1 1 108 60 A48 48 0 1 1 12 60 Z';
  var DIAMOND = 'M60 8 L108 60 L60 112 L12 60 Z';
  var BAUBLE = 'M20 68 A40 40 0 1 1 100 68 A40 40 0 1 1 20 68 Z';
  var SPARK = 'M10 0 C11 6 14 9 20 10 C14 11 11 14 10 20 C9 14 6 11 0 10 C6 9 9 6 10 0 Z';
  var FLAME = 'M60 50 C47 44 44 30 52 18 C53 26 57 29 60 26 C59 16 63 8 71 3 C69 14 78 20 76 34 C74 44 67 50 60 50 Z';
  var FLOWER = (function () {
    var R = 38, r = 16.5, k = 8, pts = [];
    for (var i = 0; i <= k; i++) {
      var a = (-90 + i * 360 / k) * Math.PI / 180;
      pts.push((60 + R * Math.cos(a)).toFixed(2) + ' ' + (60 + R * Math.sin(a)).toFixed(2));
    }
    var d = 'M' + pts[0];
    for (var j = 1; j <= k; j++) d += ' A' + r + ' ' + r + ' 0 0 1 ' + pts[j];
    return d + ' Z';
  })();

  function scaleAbout(x, y, s) { return 'translate(' + x + ' ' + y + ') scale(' + s + ') translate(-' + x + ' -' + y + ')'; }

  var SHAPES = {
    heart:   { d: HEART,   tf: scaleAbout(60, 58, 0.8),  nx: 60, ny: 56, fs: 34 },
    star:    { d: STAR,    tf: scaleAbout(60, 62, 0.8),  nx: 60, ny: 72, fs: 30 },
    moon:    { d: MOON,    tf: scaleAbout(48, 60, 0.84), nx: 30, ny: 69, fs: 26 },
    square:  { d: SQUARE,  tf: scaleAbout(60, 60, 0.8),  nx: 60, ny: 71, fs: 34 },
    circle:  { d: CIRCLE,  tf: scaleAbout(60, 60, 0.82), nx: 60, ny: 71, fs: 34 },
    flower:  { d: FLOWER,  tf: scaleAbout(60, 60, 0.74), nx: 60, ny: 71, fs: 32 },
    diamond: { d: DIAMOND, tf: scaleAbout(60, 60, 0.74), nx: 60, ny: 70, fs: 28 },
    bauble:  { d: BAUBLE,  tf: scaleAbout(60, 68, 0.8),  nx: 60, ny: 79, fs: 30,
               under: '<rect class="extra-fill" x="49" y="18" width="22" height="13" rx="3"/><circle class="extra" cx="60" cy="12" r="6" style="stroke-width:3"/>' },
    flameheart: { d: HEART, tf: scaleAbout(60, 58, 0.8), group: 'translate(60 72) scale(0.82) translate(-60 -58)', nx: 60, ny: 76, fs: 28,
               under: '<path class="extra-fill" d="' + FLAME + '"/><path d="M60 47 C55 43 55 36 58 31 C59 35 62 36 63 33 C66 38 66 44 60 47 Z" fill="#F7EBDD" opacity="0.85"/>' }
  };

  /* couleur de fond, couture, numéro */
  var COLORS = {
    cherry:  ['#C8102E', '#F7EBDD', '#F7EBDD'],
    scarlet: ['#CC2B40', '#F7EBDD', '#F7EBDD'],
    carmine: ['#A5162D', '#F7EBDD', '#F7EBDD'],
    gold:    ['#E2B04A', '#3D0A14', '#2A060D'],
    cream:   ['#F7EBDD', '#C8102E', '#A5162D'],
    rose:    ['#F2A7B0', '#A5162D', '#2A060D']
  };

  /* forme, couleur, rotation (degrés), taille relative */
  var STYLE = {
    1:  ['heart', 'cherry', -8, 1.0],
    2:  ['star', 'gold', 10, 0.95],
    3:  ['flower', 'rose', -4, 1.0],
    4:  ['bauble', 'scarlet', 6, 0.95],
    5:  ['moon', 'gold', -12, 0.92],
    6:  ['circle', 'cream', 0, 0.9],
    7:  ['heart', 'scarlet', 12, 0.92],
    8:  ['diamond', 'cherry', 0, 0.92],
    9:  ['star', 'cherry', -6, 1.05],
    10: ['square', 'carmine', 8, 0.92],
    11: ['flower', 'gold', 0, 0.95],
    12: ['heart', 'rose', -10, 0.95],
    13: ['moon', 'carmine', 14, 0.95],
    14: ['bauble', 'gold', -6, 1.0],
    15: ['star', 'scarlet', 12, 0.9],
    16: ['circle', 'carmine', -4, 1.0],
    17: ['flameheart', 'cherry', -6, 1.05],
    18: ['diamond', 'gold', 8, 0.9],
    19: ['flower', 'cherry', 6, 1.0],
    20: ['square', 'cream', -10, 0.92],
    21: ['moon', 'rose', 10, 0.92],
    22: ['heart', 'gold', -14, 0.95],
    23: ['circle', 'scarlet', 4, 0.9]
  };

  /* Emplacements dans le grand cœur, plus large que haut (unités : largeur 6,6, hauteur 6,25), de haut en bas */
  var SLOTS = [
    [0.95, 0.85], [1.85, 0.50], [2.75, 0.80], [3.85, 0.80], [4.75, 0.50], [5.65, 0.85],
    [0.55, 1.75], [1.65, 1.75], [2.75, 1.75], [3.85, 1.75], [4.95, 1.75], [6.05, 1.75],
    [1.10, 2.75], [2.20, 2.75], [3.30, 2.80], [4.40, 2.75], [5.50, 2.75],
    [1.65, 3.75], [2.75, 3.75], [3.85, 3.75], [4.95, 3.75],
    [2.75, 4.70], [3.85, 4.70],
    [3.30, 5.62]
  ];
  /* Le numéro posé sur chaque emplacement : mélangés comme un vrai calendrier, le 24 au centre */
  var SLOT_DAYS = [7, 1, 13, 19, 3, 22, 16, 10, 5, 11, 20, 2, 14, 4, 24, 17, 8, 21, 23, 6, 15, 12, 18, 9];

  function cssVars(n) {
    if (n === 24) return '--fill:#C8102E;--fill2:#CC2B40;--stitch:#F7EBDD;--num:#F7EBDD;--extra:#E2B04A;--rot:0deg;--s:1.18;';
    var st = STYLE[n];
    var c = COLORS[st[1]];
    var extra = st[1] === 'gold' ? '#A5162D' : '#E2B04A';
    return '--fill:' + c[0] + ';--stitch:' + c[1] + ';--num:' + c[2] + ';--extra:' + extra +
      ';--rot:' + st[2] + 'deg;--s:' + st[3] + ';';
  }

  /* Case déjà ouverte : petit sceau bordeaux avec un cœur crème, lisible sur toutes les couleurs */
  var BADGE = '<g class="badge"><circle cx="97" cy="97" r="16"/><path d="' + HEART + '" transform="translate(97 98) scale(0.16) translate(-60 -58)"/></g>';
  function texture(d) { return '<path class="tex" d="' + d + '"/>'; }

  function svgFor(n) {
    if (n === 24) {
      return '<svg class="cherry" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
        '<path class="extra" d="M40 70 C44 40 62 24 88 16"/>' +
        '<path class="extra" d="M82 72 C84 50 86 34 88 16"/>' +
        '<path class="extra-fill" d="M88 16 C98 8 108 10 112 18 C104 24 94 24 88 16 Z"/>' +
        '<circle class="body" cx="40" cy="86" r="26"/>' +
        '<circle class="body body2" cx="82" cy="88" r="23"/>' +
        '<circle class="tex" cx="40" cy="86" r="26"/>' +
        '<circle class="tex" cx="82" cy="88" r="23"/>' +
        '<circle class="stitch" cx="40" cy="86" r="19"/>' +
        '<circle class="stitch" cx="82" cy="88" r="16"/>' +
        '<text class="num" x="40" y="95" font-size="24">24</text>' + BADGE +
        '</svg>';
    }
    var s = SHAPES[STYLE[n][0]];
    var fs = n >= 10 ? Math.round(s.fs * 0.92) : s.fs;
    var shape = '<path class="body" d="' + s.d + '"/>' + texture(s.d) + '<path class="stitch" d="' + s.d + '" transform="' + s.tf + '"/>';
    if (s.group) shape = '<g transform="' + s.group + '">' + shape + '</g>';
    return '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
      (s.under || '') + shape +
      '<text class="num" x="' + s.nx + '" y="' + s.ny + '" font-size="' + fs + '">' + n + '</text>' + BADGE +
      '</svg>';
  }

  /* ---------------- Grille en cœur ---------------- */
  var grid = document.getElementById('grid');

  function stateOf(n) {
    if (n > currentDay()) return 'locked';
    return opened.has(n) ? 'open' : 'ready';
  }
  function labelOf(n, state) {
    var base = 'Case ' + n + ', ' + dayLabel(n).toLowerCase() + ', ';
    if (state === 'locked') return base + 'verrouillée jusqu\'à minuit';
    if (state === 'open') return base + 'déjà ouverte, toucher pour la relire';
    return base + 'prête à ouvrir';
  }

  function renderGrid() {
    var html = '';
    // ordre du document = ordre des jours, pour le clavier et les lecteurs d'écran
    for (var n = 1; n <= 24; n++) {
      var slot = SLOTS[SLOT_DAYS.indexOf(n)];
      var st = stateOf(n);
      html += '<button type="button" class="cell ' + st + '" data-n="' + n + '" style="--x:' + slot[0] + ';--y:' + slot[1] + ';' +
        cssVars(n) + '" aria-label="' + labelOf(n, st) + '"><span class="stk">' + svgFor(n) + '</span></button>';
    }
    grid.innerHTML = html;
  }

  function refreshCell(n) {
    var btn = grid.querySelector('[data-n="' + n + '"]');
    if (!btn) return;
    var st = stateOf(n);
    btn.className = 'cell ' + st;
    btn.setAttribute('aria-label', labelOf(n, st));
  }

  /* ---------------- Mot mystère ---------------- */
  var mystery = document.getElementById('mystery');
  function cardOf(n) {
    for (var i = 0; i < CAL.cards.length; i++) { if (CAL.cards[i].day === n) return CAL.cards[i]; }
    return { day: n, title: 'Case ' + n, blocks: [] };
  }
  function renderMystery() {
    var word = (CFG.mysteryWord || '').toUpperCase();
    if (!word) { mystery.hidden = true; return; }
    var found = {};
    opened.forEach(function (n) {
      cardOf(n).blocks.forEach(function (b) {
        if (b.type === 'letter' && typeof b.index === 'number') found[b.index] = true;
      });
    });
    var all = true;
    var html = '<span class="mystery-label">Mot<br>mystère</span>';
    for (var i = 0; i < word.length; i++) {
      if (found[i]) html += '<span class="slot found">' + word.charAt(i) + '</span>';
      else { all = false; html += '<span class="slot">?</span>'; }
    }
    mystery.innerHTML = html;
    mystery.classList.toggle('complete', all);
  }

  /* ---------------- Compte à rebours ---------------- */
  var countdown = document.getElementById('countdown');
  function updateCountdown() {
    var d = currentDay();
    if (d >= 24) { countdown.textContent = CFG.finalMessage || ''; return; }
    var diff = unlockAt(d + 1) - now();
    var mins = Math.max(0, Math.floor(diff / 60000));
    var days = Math.floor(mins / 1440);
    var hours = Math.floor((mins % 1440) / 60);
    var m = mins % 60;
    var txt;
    if (days > 0) txt = days + ' j ' + hours + ' h';
    else if (hours > 0) txt = hours + ' h ' + m + ' min';
    else txt = m + ' min';
    countdown.textContent = (d === 0 ? 'La première case s\'ouvre dans ' : 'Prochaine case dans ') + txt;
  }

  /* ---------------- Message temporaire ---------------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------------- Effets ---------------- */
  var canAnimate = !!document.body.animate;
  var fancy = canAnimate && !reduceMotion;

  function burst(cx, cy, count, reach) {
    if (!fancy) return;
    var kinds = [
      { vb: '0 0 120 120', d: HEART, c: '#C8102E' },
      { vb: '0 0 120 120', d: HEART, c: '#F2A7B0' },
      { vb: '0 0 20 20', d: SPARK, c: '#E2B04A' },
      { vb: '0 0 20 20', d: SPARK, c: '#F7EBDD' },
      { vb: '0 0 120 120', d: HEART, c: '#CC2B40' },
      { vb: '0 0 20 20', d: SPARK, c: '#E2B04A' }
    ];
    for (var i = 0; i < count; i++) {
      var k = kinds[i % kinds.length];
      var size = 10 + Math.random() * 14;
      var p = document.createElement('span');
      p.className = 'spark';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (cx - size / 2) + 'px';
      p.style.top = (cy - size / 2) + 'px';
      p.innerHTML = '<svg viewBox="' + k.vb + '"><path d="' + k.d + '" fill="' + k.c + '"/></svg>';
      document.body.appendChild(p);
      var angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      var dist = reach * (0.55 + Math.random() * 0.6);
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist;
      var rot = (Math.random() - 0.5) * 540;
      var anim = p.animate([
        { transform: 'translate(0,0) scale(0.3) rotate(0deg)', opacity: 1 },
        { offset: 0.55, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1) rotate(' + (rot * 0.6) + 'deg)', opacity: 1 },
        { transform: 'translate(' + (dx * 1.12) + 'px,' + (dy + 90) + 'px) scale(0.5) rotate(' + rot + 'deg)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.12,.75,.35,1)' });
      anim.onfinish = (function (node) { return function () { node.remove(); }; })(p);
    }
  }

  function wave(cx, cy) {
    if (!fancy) return;
    var w = document.createElement('div');
    w.className = 'wave';
    w.style.left = cx + 'px';
    w.style.top = cy + 'px';
    document.body.appendChild(w);
    var a = w.animate([{ transform: 'scale(0.2)', opacity: 0.9 }, { transform: 'scale(7)', opacity: 0 }],
      { duration: 750, easing: 'cubic-bezier(.2,.7,.3,1)' });
    a.onfinish = function () { w.remove(); };
  }

  /* L'autocollant se décolle, tourbillonne et vole vers le centre */
  function peel(btn, n) {
    var r = btn.getBoundingClientRect();
    var ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.style.cssText = cssVars(n) + 'left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
    ghost.innerHTML = svgFor(n);
    document.body.appendChild(ghost);
    btn.style.visibility = 'hidden';
    var rot = parseFloat(STYLE[n] ? STYLE[n][2] : 0);
    var dx = window.innerWidth / 2 - (r.left + r.width / 2);
    var dy = window.innerHeight / 2 - (r.top + r.height / 2);
    var a = ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(' + rot + 'deg)' },
      { offset: 0.22, transform: 'translate(0,-12px) scale(1.35) rotate(' + (rot - 16) + 'deg)' },
      { offset: 0.38, transform: 'translate(0,-12px) scale(1.35) rotate(' + (rot + 12) + 'deg)' },
      { offset: 0.8, transform: 'translate(' + dx + 'px,' + dy + 'px) scale(2.4) rotate(' + (rot + 360) + 'deg)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(3) rotate(' + (rot + 380) + 'deg)', opacity: 0 }
    ], { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)' });
    a.onfinish = function () { ghost.remove(); btn.style.visibility = ''; };
  }

  /* ---------------- Blocs de contenu ---------------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function safeUrl(u) {
    return typeof u === 'string' && /^(https?:\/\/|mailto:|tel:|assets\/|\.\/assets\/)/i.test(u);
  }
  function missing(src) { return el('div', 'missing', 'Média à ajouter : ' + src); }

  function buildBlock(b) {
    var wrap = el('div', 'block');
    switch (b.type) {
      case 'title': wrap.appendChild(el('h3', 'b-title', b.text || '')); break;
      case 'text': wrap.appendChild(el('p', 'b-text', b.text || '')); break;
      case 'emoji':
        var em = el('div', 'b-emoji', b.emoji || '');
        em.setAttribute('aria-hidden', 'true');
        wrap.appendChild(em);
        break;
      case 'quote': wrap.appendChild(el('p', 'b-quote', b.text || '')); break;
      case 'divider': wrap.appendChild(el('hr', 'b-divider')); break;
      case 'image':
        var fig = el('figure', 'b-figure' + (b.tilt ? ' tilt' : ''));
        var img = document.createElement('img');
        img.alt = b.alt || b.caption || '';
        img.loading = 'lazy';
        img.src = b.src || '';
        img.onerror = function () { img.replaceWith(missing(b.src)); };
        fig.appendChild(img);
        if (b.caption) fig.appendChild(el('figcaption', '', b.caption));
        wrap.appendChild(fig);
        break;
      case 'video':
        var vf = el('figure', 'b-figure');
        var v = document.createElement('video');
        v.controls = true;
        v.playsInline = true;
        v.preload = 'metadata';
        if (b.poster) v.poster = b.poster;
        v.src = b.src || '';
        v.onerror = function () { v.replaceWith(missing(b.src)); };
        vf.appendChild(v);
        if (b.caption) vf.appendChild(el('figcaption', '', b.caption));
        wrap.appendChild(vf);
        break;
      case 'audio':
        var au = el('div', 'b-audio');
        if (b.label) au.appendChild(el('span', '', b.label));
        var a = document.createElement('audio');
        a.controls = true;
        a.preload = 'none';
        a.src = b.src || '';
        au.appendChild(a);
        wrap.appendChild(au);
        break;
      case 'link':
        var row = el('div', 'b-actions');
        var link = el('a', 'btn', b.label || 'Ouvrir');
        if (safeUrl(b.url)) {
          link.href = b.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        row.appendChild(link);
        wrap.appendChild(row);
        break;
      case 'qr':
        var qw = el('div', 'b-qr');
        try {
          var qr = qrcode(0, 'M');
          qr.addData(b.url || '');
          qr.make();
          var qi = document.createElement('img');
          qi.alt = 'QR code' + (b.label ? ' : ' + b.label : '');
          qi.src = qr.createDataURL(6, 0);
          qw.appendChild(qi);
        } catch (e) { qw.appendChild(missing('QR code')); }
        if (b.label) qw.appendChild(el('span', '', b.label));
        wrap.appendChild(qw);
        break;
      case 'list':
        var ol = el('ol', 'b-list');
        (b.items || []).forEach(function (it) { ol.appendChild(el('li', '', it)); });
        wrap.appendChild(ol);
        break;
      case 'letter':
        var lt = el('div', 'b-letter');
        lt.appendChild(el('div', 'stamp', b.letter || '?'));
        lt.appendChild(el('span', 'cap', 'Lettre du mot mystère'));
        wrap.appendChild(lt);
        break;
      case 'quiz':
        wrap.appendChild(buildQuiz(b));
        break;
      case 'envelopes':
        var envs = el('div', 'b-envs');
        (b.items || []).forEach(function (it) {
          var d = document.createElement('details');
          d.className = 'env';
          var sm = document.createElement('summary');
          sm.innerHTML = '<svg class="env-icon" viewBox="0 0 40 28" aria-hidden="true"><rect x="1" y="1" width="38" height="26" rx="4"/><path class="env-flap" d="M2 3 L20 16 L38 3"/></svg>';
          sm.appendChild(el('span', 'env-label', it.label || 'Ouvre quand…'));
          d.appendChild(sm);
          d.appendChild(el('p', 'env-text', it.text || ''));
          envs.appendChild(d);
        });
        wrap.appendChild(envs);
        break;
      default: return null;
    }
    return wrap;
  }

  /* Quiz à choix multiples : une question à la fois, score à la fin, prix au-dessus du seuil */
  function buildQuiz(b) {
    var qs = b.questions || [];
    var box = el('div', 'b-quiz');
    var i = 0, score = 0;
    function shuffled(n) {
      var a = [];
      for (var k = 0; k < n; k++) a.push(k);
      for (var j = a.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; }
      return a;
    }
    function render() {
      box.innerHTML = '';
      if (i < qs.length) {
        var q = qs[i];
        box.appendChild(el('p', 'quiz-step', 'Question ' + (i + 1) + ' sur ' + qs.length));
        box.appendChild(el('p', 'quiz-q', q.q || ''));
        var opts = el('div', 'quiz-opts');
        var done = false;
        var buttons = [];
        shuffled((q.options || []).length).forEach(function (k) {
          var bt = el('button', 'quiz-opt', q.options[k]);
          bt.type = 'button';
          buttons[k] = bt;
          bt.addEventListener('click', function () {
            if (done) return;
            done = true;
            var ok = k === q.answer;
            if (ok) score++;
            bt.classList.add(ok ? 'good' : 'bad');
            if (!ok && buttons[q.answer]) buttons[q.answer].classList.add('good');
            setTimeout(function () { i++; render(); }, 1000);
          });
          opts.appendChild(bt);
        });
        box.appendChild(opts);
      } else {
        var win = score >= (b.threshold || Math.ceil(qs.length * 0.7));
        box.appendChild(el('p', 'quiz-score', score + ' / ' + qs.length));
        box.appendChild(el('p', 'b-text', win ? (b.win || 'Bravo !') : (b.lose || 'Presque ! Tu peux rejouer.')));
        if (win && b.prize) box.appendChild(el('p', 'quiz-prize', b.prize));
        var row = el('div', 'b-actions');
        var again = el('button', 'btn btn-soft', 'Rejouer');
        again.type = 'button';
        again.addEventListener('click', function () { i = 0; score = 0; render(); });
        row.appendChild(again);
        box.appendChild(row);
        if (win) {
          var r = box.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + 40, 18, 140);
        }
      }
    }
    render();
    return box;
  }

  /* ---------------- Carte ---------------- */
  var modal = document.getElementById('modal');
  var card = document.getElementById('card');
  var blocksEl = document.getElementById('blocks');
  var lastBtn = null;
  var isOpen = false;
  var busy = false;

  function fillCard(n, late) {
    var data = cardOf(n);
    document.getElementById('card-sticker').innerHTML =
      '<span class="stk" style="' + cssVars(n) + '--rot:0deg">' + svgFor(n) + '</span>';
    document.getElementById('card-date').textContent = dayLabel(n);
    document.getElementById('card-title').textContent = data.title;
    card.classList.toggle('late', !!late);
    blocksEl.innerHTML = '';
    var i = 0;
    (data.blocks || []).forEach(function (b) {
      var node = buildBlock(b);
      if (node) { node.style.setProperty('--i', i++); blocksEl.appendChild(node); }
    });
    if (CFG.signature) {
      var sig = el('p', 'signature', CFG.signature);
      sig.style.setProperty('--i', i);
      blocksEl.appendChild(sig);
    }
    document.getElementById('card-inner').scrollTop = 0;
  }

  function originFor(btn) {
    var r = btn.getBoundingClientRect();
    var c = card.getBoundingClientRect();
    return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }

  function showModal() {
    modal.hidden = false;
    document.body.classList.add('noscroll');
    void modal.offsetWidth;
    modal.classList.add('show');
  }

  function openCard(n, btn) {
    if (isOpen || busy) return;
    isOpen = true;
    lastBtn = btn;
    var first = !opened.has(n);
    if (first) { opened.add(n); saveOpened(Array.from(opened)); }

    if (first && fancy) {
      // Première ouverture : l'autocollant se décolle, puis la carte éclate au centre
      busy = true;
      fillCard(n, true);
      card.style.opacity = '0';
      showModal();
      peel(btn, n);
      setTimeout(function () {
        card.style.opacity = '';
        card.style.transformOrigin = '50% 50%';
        card.animate([
          { transform: 'scale(0.3) rotate(-8deg)', opacity: 0 },
          { offset: 0.65, transform: 'scale(1.05) rotate(1.5deg)', opacity: 1 },
          { transform: 'scale(1) rotate(0deg)', opacity: 1 }
        ], { duration: 600, easing: 'cubic-bezier(.2,.9,.3,1)' });
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        wave(cx, cy);
        burst(cx, cy, 30, Math.min(window.innerWidth, 420) * 0.55);
        refreshCell(n);
        renderMystery();
        setTimeout(function () { busy = false; }, 500);
      }, 700);
    } else {
      // Réouverture : la carte grandit depuis sa case
      fillCard(n, false);
      showModal();
      if (canAnimate && reduceMotion) {
        card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      } else if (canAnimate) {
        var o = originFor(btn);
        card.style.transformOrigin = o.x + 'px ' + o.y + 'px';
        card.animate(
          [{ transform: 'scale(0.12) rotate(-8deg)', opacity: 0 }, { transform: 'scale(1) rotate(0deg)', opacity: 1 }],
          { duration: 480, easing: 'cubic-bezier(.2,1.15,.3,1)' }
        );
      }
      if (first) { refreshCell(n); renderMystery(); }
    }
    document.getElementById('card-x').focus({ preventScroll: true });
  }

  function closeCard() {
    if (!isOpen || busy) return;
    isOpen = false;
    modal.classList.remove('show');
    var done = function () {
      modal.hidden = true;
      blocksEl.innerHTML = '';
      document.body.classList.remove('noscroll');
      card.style.transformOrigin = '';
      if (lastBtn) lastBtn.focus({ preventScroll: true });
    };
    if (canAnimate && reduceMotion) {
      var fade = card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      fade.onfinish = function () { fade.cancel(); done(); };
    } else if (canAnimate && lastBtn) {
      var o = originFor(lastBtn);
      card.style.transformOrigin = o.x + 'px ' + o.y + 'px';
      var anim = card.animate(
        [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.12) rotate(6deg)', opacity: 0 }],
        { duration: 280, easing: 'ease-in', fill: 'forwards' }
      );
      anim.onfinish = function () { anim.cancel(); done(); };
    } else {
      done();
    }
  }

  /* ---------------- Événements ---------------- */
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.cell') : null;
    if (!btn) return;
    var n = parseInt(btn.dataset.n, 10);
    if (n > currentDay()) {
      btn.classList.remove('shake');
      void btn.offsetWidth;
      btn.classList.add('shake');
      toast('Cette case s\'ouvre le ' + dayLabel(n).toLowerCase() + ', à minuit.');
      if (navigator.vibrate) { try { navigator.vibrate(40); } catch (err) { /* ignoré */ } }
      return;
    }
    openCard(n, btn);
  });
  grid.addEventListener('animationend', function (e) {
    if (e.animationName === 'shake') e.target.classList.remove('shake');
  });

  document.getElementById('card-x').addEventListener('click', closeCard);
  document.getElementById('card-close').addEventListener('click', closeCard);
  document.getElementById('scrim').addEventListener('click', closeCard);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCard(); });

  /* ---------------- Décor du fond ---------------- */
  function buildDecor() {
    var bg = document.getElementById('bg');
    var seed = 11;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var kinds = [
      { vb: '0 0 20 20', d: SPARK, c: '#E2B04A' },
      { vb: '0 0 20 20', d: SPARK, c: '#F7EBDD' },
      { vb: '0 0 120 120', d: HEART, c: '#C8102E' },
      { vb: '0 0 20 20', d: SPARK, c: '#E2B04A' },
      { vb: '0 0 120 120', d: HEART, c: '#F2A7B0' },
      { vb: '0 0 120 120', d: CIRCLE, c: '#E2B04A' }
    ];
    var i, k, size, holder;
    for (i = 0; i < 26; i++) {
      k = kinds[i % kinds.length];
      size = (k.d === CIRCLE ? 4 : 8) + rnd() * (k.d === CIRCLE ? 4 : 14);
      holder = document.createElement('div');
      holder.className = 'twinkle';
      holder.style.left = (rnd() * 97) + '%';
      holder.style.top = (rnd() * 97) + '%';
      holder.style.width = size + 'px';
      holder.style.height = size + 'px';
      holder.style.animationDelay = (-rnd() * 6) + 's';
      holder.style.animationDuration = (3 + rnd() * 4) + 's';
      holder.innerHTML = '<svg viewBox="' + k.vb + '" width="100%" height="100%"><path d="' + k.d + '" fill="' + k.c + '"/></svg>';
      bg.appendChild(holder);
    }
    // quelques petits cœurs qui montent doucement
    for (i = 0; i < 7; i++) {
      size = 10 + rnd() * 12;
      holder = document.createElement('div');
      holder.className = 'floater';
      holder.style.left = (5 + rnd() * 90) + '%';
      holder.style.width = size + 'px';
      holder.style.height = size + 'px';
      var dur = 18 + rnd() * 12;
      holder.style.animationDuration = dur + 's';
      holder.style.animationDelay = (-rnd() * dur) + 's';
      holder.innerHTML = '<svg viewBox="0 0 120 120" width="100%" height="100%"><path d="' + HEART + '" fill="' + (i % 2 ? '#F2A7B0' : '#C8102E') + '"/></svg>';
      bg.appendChild(holder);
    }
  }

  /* ---------------- Démarrage ---------------- */
  document.getElementById('title-1').textContent = CFG.title || '';
  document.getElementById('title-2').textContent = CFG.subtitle || '';
  buildDecor();
  renderGrid();
  renderMystery();
  updateCountdown();

  var lastDay = currentDay();
  function tick() {
    var d = currentDay();
    if (d !== lastDay) {
      lastDay = d;
      renderGrid();
      toast('Une nouvelle case vient de s\'ouvrir.');
    }
    updateCountdown();
  }
  setInterval(tick, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
