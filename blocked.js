(function(){
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  const context = document.getElementById('context');
  if (context) {
    // All sites now use content script approach like x.com
    // Use 'from' parameter first, fall back to document.referrer
    let referrerUrl = from || document.referrer;
    
    if (referrerUrl && referrerUrl.trim()) {
      try {
        const u = new URL(referrerUrl);
        context.textContent = `You came from: ${u.hostname}${u.pathname}`;
      } catch (e) {
        // If URL parsing fails, try to extract domain from the string
        const domainMatch = referrerUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
        if (domainMatch) {
          context.textContent = `You came from: ${domainMatch[1]}`;
        } else {
          context.textContent = 'You came from a blocked page.';
        }
      }
    } else {
      context.textContent = 'You came from a blocked page.';
    }
  }

  const $intent = document.getElementById('intent');
  const keyIntent = 'site-blocker:intent';
  const keyJournal = 'site-blocker:journal';
  if ($intent) {
    const saved = localStorage.getItem(keyIntent);
    if (saved) $intent.value = saved;
    const saveBtn = document.getElementById('saveIntent');
    const clearBtn = document.getElementById('clearIntent');
    if (saveBtn) saveBtn.onclick = () => {
      const text = ($intent.value || '').trim();
      localStorage.setItem(keyIntent, text);
      if (text) {
        const entries = JSON.parse(localStorage.getItem(keyJournal) || '[]');
        entries.unshift({ text, at: new Date().toISOString(), from });
        localStorage.setItem(keyJournal, JSON.stringify(entries.slice(0,200)));
        renderJournal();
        // highlight the newly added entry
        try {
          const box = document.getElementById('journalEntries');
          const first = box && box.querySelector && box.querySelector('.entry');
          if (first) {
            first.classList.add('added');
            setTimeout(()=> first.classList.remove('added'), 1000);
          }
        } catch {}
      }
      const savedEl = document.getElementById('intentSaved');
      if (savedEl) savedEl.style.display = 'none';
      // clear and blur textarea
      $intent.value = '';
      // ensure nothing persists on reload
      localStorage.removeItem(keyIntent);
      $intent.blur();
    };
    if (clearBtn) clearBtn.onclick = () => {
      $intent.value = '';
      localStorage.removeItem(keyIntent);
      const savedEl = document.getElementById('intentSaved');
      if (savedEl) savedEl.style.display = 'none';
    };
  }

  function renderJournal(){
    const box = document.getElementById('journalEntries');
    if (!box) return;
    const entries = JSON.parse(localStorage.getItem(keyJournal) || '[]');
    if (!entries.length) { box.textContent = 'No entries yet.'; return; }
    box.innerHTML = '';
    entries.forEach((e, idx) => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.setAttribute('data-index', String(idx));
      const when = new Date(e.at).toLocaleString();
      const fromTxt = e.from ? (()=>{ try{ const u=new URL(e.from); return ` • from ${u.hostname}`; } catch { return ''; } })() : '';
      div.innerHTML = `<small>${when}${fromTxt}</small><br>${(e.text||'').replace(/</g,'&lt;')}`;
      box.appendChild(div);
    });
  }
  renderJournal();

  function beep(freq=880, durMs=160){
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type='sine'; o.frequency.value=freq;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+durMs/1000);
      o.connect(g); g.connect(ctx.destination);
      o.start(); setTimeout(()=>{ o.stop(); ctx.close(); }, durMs+60);
    } catch {}
  }

  function createHoverCancelController(button, defaultLabel){
    let hover=false, running=false, currentLabel=defaultLabel, lockedWidthPx='';
    function setLabel(text){ currentLabel = text; if (hover && running) { button.textContent = 'Cancel'; } else { button.textContent = text; } }
    function start(){ running=true; setLabel(currentLabel); button.classList.remove('cancel'); }
    function stop(){ running=false; hover=false; currentLabel=defaultLabel; button.classList.remove('cancel'); button.style.width=''; button.textContent = defaultLabel; }
    button.addEventListener('mouseenter', ()=>{ if(running){
      hover=true;
      const currentW = Math.ceil(button.getBoundingClientRect().width);
      button.textContent = 'Cancel';
      const cancelW = Math.ceil(button.getBoundingClientRect().width);
      const w = Math.max(currentW, cancelW);
      lockedWidthPx = w ? `${w}px` : '';
      if (lockedWidthPx) button.style.width = lockedWidthPx;
      button.classList.add('cancel');
      button.textContent='Cancel';
    } });
    button.addEventListener('mouseleave', ()=>{ if(running){ hover=false; button.classList.remove('cancel'); button.textContent=currentLabel; } button.style.width=''; lockedWidthPx=''; });
    return { setLabel, start, stop, isRunning:()=>running, setRunning:(v)=>{running=v;}, isHover:()=>hover };
  }

  const routine = [
    { group: 'Neck', name: 'Neck bridges (floor)', sets: [10,10], notes: 'Slow roll head back/forward. Gentle.' },
    { group: 'Chest', name: 'TRX push-ups', sets: [4,6,6], notes: '@45–60°, straps ~30–40 cm (mid-shin). Full ROM.' },
    { group: 'Triceps', name: 'TRX extensions', sets: [10,10], notes: '@45°, straps ~60–70 cm (mid-thigh).' },
    { group: 'Legs', name: 'TRX pistol squats (assisted)', sets: [4,6,6], notes: 'Per leg @30–45°, straps ~60–80 cm. Control tempo.' },
    { group: 'Legs', name: 'TRX lunges', sets: [8,10], notes: 'Per leg @45°, straps ~30–40 cm.' },
    { group: 'Legs', name: 'TRX calf raises', sets: [15,15], notes: 'Per leg @45°, straps ~30–40 cm.' },
    { group: 'Shoulders', name: 'TRX presses', sets: [10,10], notes: '@45°, straps ~70–80 cm (chest).' },
    { group: 'Shoulders', name: 'TRX lateral raises', sets: [10,10], notes: '@30°, straps ~70–80 cm.' },
    { group: 'Back', name: 'TRX rows', sets: [4,6,6], notes: '@45–60°, straps ~100–110 cm (chest/waist).' },
    { group: 'Back', name: 'TRX face pulls', sets: [6,8,8], notes: '@30°, straps ~80–90 cm (shoulders).' },
    { group: 'Arms', name: 'TRX curls', sets: [10,10], notes: '@45°, straps ~60–70 cm. Supinated wide grip.' },
    { group: 'Arms', name: 'TRX reverse curls', sets: [10,10], notes: '@45°, straps ~60–70 cm. Pronated grip.' },
    { group: 'Arms', name: 'Finger extensions (floor)', sets: [12,12], notes: 'Open/close hands; slow control.' }
  ];
  const keyIdx = 'site-blocker:routine:index';
  const flat = [];
  routine.forEach((ex, exIdx) => ex.sets.forEach((reps, setIdx) => flat.push({ exIdx, setIdx, reps })));
  window.__SB_FLAT_LEN__ = flat.length;
  function getIndex(){ const v = parseInt(localStorage.getItem(keyIdx) || '0', 10); if (Number.isNaN(v) || v < 0) return 0; return v % flat.length; }
  function setIndex(v){ localStorage.setItem(keyIdx, String(v % flat.length)); }
  function renderExercise(){
    const i = getIndex(); const item = flat[i]; const ex = routine[item.exIdx];
    const tEl = document.getElementById('exTitle'); if (tEl) tEl.textContent = `${ex.group}: ${ex.name}`;
    const sEl = document.getElementById('exSubtitle'); if (sEl) sEl.textContent = `Set ${item.setIdx + 1} of ${ex.sets.length} — ${item.reps} reps`;
    const nEl = document.getElementById('exNotes'); if (nEl) nEl.textContent = ex.notes + ' Tempo 4s/rep, 75s rest between sets, 2m between exercises.';
    const pEl = document.getElementById('exProgress'); if (pEl) pEl.textContent = `Progress: ${i + 1} / ${flat.length}. After finishing all sets, the cycle restarts.`;
  }
  window.renderExercise = renderExercise; renderExercise();

  (function(){
    const startBtn = document.getElementById('exStart');
    const skipBtn = document.getElementById('exSkip');
    const resetBtn = document.getElementById('exReset');
    if (!startBtn) return;

    const controller = createHoverCancelController(startBtn, startBtn.textContent || 'Start set');
    let timer=null, sec=0;

    function cancel(){ if(timer){ clearInterval(timer); timer=null; } controller.stop(); }
    function getReps(){ const sub=(document.getElementById('exSubtitle')||{}).textContent||''; const m=sub.match(/—\s(\d+)\sreps/); return m?parseInt(m[1],10):10; }

    function run(){ if (controller.isRunning()) return; controller.setRunning(true); controller.start();
      const reps=getReps(); let state='prep', prep=5, rep=0; sec=0; controller.setLabel('Get ready… 5s'); beep(660,150);
      timer=setInterval(()=>{
        if(state==='prep'){
          prep-=1; controller.setLabel(`Get ready… ${Math.max(prep,0)}s`);
          if(prep<=0){ state='work'; rep=1; controller.setLabel(`Rep ${rep}/${reps} — 4s`); beep(880,180);} return;
        }
        if(state==='work'){
          sec+=1; const within=4-((sec-1)%4); controller.setLabel(`Rep ${rep}/${reps} — ${within}s`);
          if((sec-1)%4===0) beep(880,160);
          if(sec%4===0){ if(rep>=reps){ clearInterval(timer); timer=null; controller.stop(); beep(1200,220); setTimeout(()=>beep(900,260),260); try{ const i=getIndex(); setIndex(i+1); renderExercise(); }catch{} return;} rep+=1; }
        }
      },1000);
    }

    startBtn.addEventListener('click', ()=>{ if(controller.isRunning()) cancel(); else run(); });
    if (skipBtn) skipBtn.addEventListener('click', ()=>{ const i=getIndex(); setIndex(i+1); renderExercise(); cancel(); });
    if (resetBtn) resetBtn.addEventListener('click', ()=>{ setIndex(0); renderExercise(); cancel(); });
  })();

  (function(){
    const prayBtn = document.getElementById('prayBtn');
    if (!prayBtn) return;
    const controller = createHoverCancelController(prayBtn, prayBtn.textContent || '1‑min prayer');
    let s=60, id=null;
    function start(){ if(id) clearInterval(id); s=60; controller.setRunning(true); controller.start(); controller.setLabel('60s'); id=setInterval(()=>{ s-=1; if(!controller.isHover()) controller.setLabel(`${String(s%60).padStart(2,'0')}s`); if(s<=0){ clearInterval(id); id=null; controller.stop(); beep(1200,220); setTimeout(()=>beep(900,260),260); } },1000); beep(800,160); }
    function cancel(){ if(id){ clearInterval(id); id=null; } controller.stop(); }
    prayBtn.addEventListener('click', ()=>{ if(controller.isRunning()) cancel(); else start(); });
  })();

  // 1-minute reading RSVP modal
  (function(){
    const openBtn = document.getElementById('readBtn');
    const modal = document.getElementById('readModal');
    const closeBtn = document.getElementById('readClose');
    if (!openBtn || !modal || !closeBtn) return;

    const startBtn = document.getElementById('readStart');
    const pauseBtn = document.getElementById('readPause');
    const skipBtn = document.getElementById('readSkip');
    const wordEl = document.getElementById('readWord');
    const readerBox = document.querySelector('.reader');
    const controlsEl = modal && modal.querySelector && modal.querySelector('.controls');
    const wpmInput = document.getElementById('wpm');
    const infoEl = document.getElementById('readInfo');
    const statusEl = document.getElementById('readStatus');

    // Store only in memory to avoid localStorage 5MB limit
    let __BOOK_TEXT__ = '';
    const keyBookMeta = 'site-blocker:reader:book:len';
    const keyPtr = 'site-blocker:reader:pointer';
    const keyWpm = 'site-blocker:reader:wpm';

    function getStoredText(){ return __BOOK_TEXT__ || ''; }
    function setStoredText(t){ __BOOK_TEXT__ = t || ''; try { localStorage.setItem(keyBookMeta, String(__BOOK_TEXT__.length)); } catch {} }
    function getPointer(){ const v = parseInt(localStorage.getItem(keyPtr)||'0',10); return Number.isNaN(v)||v<0?0:v; }
    function setPointer(v){ localStorage.setItem(keyPtr, String(Math.max(0, v))); }
    function getWpm(){ const v=parseInt(localStorage.getItem(keyWpm)||String(wpmInput&&wpmInput.value||250),10); return Number.isNaN(v)?250:Math.max(60, Math.min(1200, v)); }
    function setWpm(v){ localStorage.setItem(keyWpm, String(v)); if (wpmInput) wpmInput.value = String(v); }

    function normalizeTextToParagraphs(text){
      const cleaned = (text||'').replace(/\r\n?/g,'\n');
      const paras = cleaned.split(/\n\s*\n+/).map(s=>s.trim()).filter(Boolean);
      return paras;
    }
    function countWords(s){ return (s.match(/\b\w+\b/g)||[]).length; }
    function computeChunk(paragraphs, pointer, wpm){
      // pick as many next paragraphs as fit in ~60s by words at given wpm
      const wordsPerMinute = Math.max(60, wpm);
      const wordsBudget = wordsPerMinute; // 1 minute budget
      let acc = [];
      let totalWords = 0;
      let idx = pointer % Math.max(1, paragraphs.length);
      for (let i=0; i<paragraphs.length; i++) {
        const p = paragraphs[idx];
        const wc = countWords(p);
        if (totalWords + wc <= wordsBudget || acc.length===0) {
          acc.push(p); totalWords += wc; idx = (idx + 1) % paragraphs.length; if (totalWords >= wordsBudget) break;
        } else {
          break;
        }
      }
      return { chunk: acc.join(' '), nextPtr: idx, words: totalWords };
    }

    let timer = null; let words = []; let pos = 0; let running=false; let chunkNextPtr=0; let currentChunkText='';
    let paraEl=null;
    function ensureParagraphEl(){
      if (paraEl && paraEl.isConnected) return paraEl;
      const panel = modal && modal.querySelector && modal.querySelector('.panel');
      if (!panel) return null;
      const el = document.createElement('div');
      el.id = 'readParagraph';
      el.setAttribute('tabindex', '0');
      el.setAttribute('contenteditable', 'true');
      el.style.outline = 'none';
      el.style.width = '100%';
      el.style.maxHeight = '260px';
      el.style.overflow = 'auto';
      el.style.padding = '12px';
      el.style.borderRadius = '10px';
      el.style.background = '#0a1322';
      el.style.border = '1px solid #243242';
      el.style.whiteSpace = 'pre-wrap';
      el.style.marginTop = '8px';
      panel.appendChild(el);
      paraEl = el;
      return paraEl;
    }
    function showParagraphView(text){
      if (readerBox) readerBox.style.display = 'none';
      if (controlsEl) controlsEl.style.display = 'none';
      const el = ensureParagraphEl(); if (!el) return;
      el.textContent = text || '';
      el.style.display = '';
      try { el.focus(); } catch {}
      selectionInit(text||'');
      attachParagraphPointerEvents();
      // place visible caret at current pointer position (start)
      setCollapsedCaret(lastCaretIndex);
    }
    function hideParagraphView(){
      if (readerBox) readerBox.style.display = '';
      if (controlsEl) controlsEl.style.display = '';
      if (paraEl) paraEl.style.display = 'none';
      clearNativeSelection();
    }
    function getOrCreateFullEl(){
      let el = document.getElementById('readFull');
      if (!el) {
        el = document.createElement('div');
        el.id = 'readFull';
        el.style.marginTop = '8px';
        el.style.whiteSpace = 'pre-wrap';
        el.style.border = '1px solid #243242';
        el.style.borderRadius = '10px';
        el.style.padding = '10px';
        el.style.background = '#0a1322';
        const panel = modal && modal.querySelector && modal.querySelector('.panel');
        if (panel) panel.appendChild(el);
      }
      return el;
    }
    function clearFullEl(){
      const el = document.getElementById('readFull');
      if (el) el.textContent = '';
    }
    function updateInfo(){ if (!infoEl) return; const t=getStoredText(); const paras=normalizeTextToParagraphs(t); infoEl.textContent = `${paras.length} paragraphs • pointer ${getPointer()+1}/${Math.max(1,paras.length)} • WPM ${getWpm()}`; }
    function showModal(){
      modal.classList.add('show');
      updateInfo();
      if (wpmInput) wpmInput.value = String(getWpm());
      if (wordEl) wordEl.textContent = '—';
      clearFullEl();
      hideParagraphView();
      // Ensure text is loaded, then auto-start if available
      Promise.resolve(loadBook(false)).then(()=>{ if (getStoredText()) start(); });
    }
    function hideModal(){ modal.classList.remove('show'); cancel(); }
    function cancel(){ if (timer){ clearInterval(timer); timer=null; } running=false; }
    function start(){ if (running) return; const t=getStoredText(); if (!t) { if(statusEl) statusEl.textContent='No text found. Ensure book.txt is bundled in the extension.'; return; }
      const paras=normalizeTextToParagraphs(t); let ptr=getPointer(); const {chunk, nextPtr}=computeChunk(paras, ptr, getWpm()); currentChunkText = chunk; clearFullEl(); chunkNextPtr=nextPtr; words = chunk.split(/\s+/).filter(Boolean); pos = 0; running=true; step(); }
    function pause(){ running=false; if (timer) { clearInterval(timer); timer=null; } }
    function skip(){ pause(); const t=getStoredText(); if (!t) return; const paras=normalizeTextToParagraphs(t); setPointer(chunkNextPtr); updateInfo(); start(); }
    function step(){
      const wpm = getWpm();
      const intervalMs = Math.max(40, Math.round(60000 / Math.max(1, wpm)));
      if (timer) clearInterval(timer);
      timer = setInterval(()=>{
        if(!running) return;
        if (pos >= words.length) {
          clearInterval(timer); timer=null; running=false; setPointer(chunkNextPtr); updateInfo();
          try { showParagraphView(currentChunkText); } catch {}
          beep(1200,220); setTimeout(()=>beep(900,260),260); return;
        }
        const current = words[pos++];
        if (wordEl) wordEl.textContent = current;
      }, intervalMs);
    }

    // Events
    openBtn.addEventListener('click', ()=>{ showModal(); });
    closeBtn.addEventListener('click', ()=>{ hideModal(); });
    startBtn && startBtn.addEventListener('click', ()=>{ running?null:start(); });
    pauseBtn && pauseBtn.addEventListener('click', ()=>{ pause(); });
    skipBtn && skipBtn.addEventListener('click', ()=>{ skip(); });
    wpmInput && wpmInput.addEventListener('change', ()=>{ const v=parseInt(wpmInput.value||'250',10); const clamped = Number.isNaN(v)?250:Math.max(60, Math.min(1200, v)); setWpm(clamped); if (running) step(); updateInfo(); });
    // no import UI anymore

    // Close on backdrop click
    modal.addEventListener('click', (ev)=>{ if (ev.target === modal) hideModal(); });
    // Modal-scoped keybindings
    document.addEventListener('keydown', (ev)=>{
      if (!modal.classList.contains('show')) return;
      const key = (ev.key || '').toLowerCase();
      // Always allow Escape or q to close
      if (key === 'escape' || key === 'q') { ev.preventDefault(); hideModal(); return; }
      // If paragraph view is visible, enable keyboard selection UX
      if (paraEl && paraEl.isConnected && paraEl.style.display !== 'none') {
        if (handleParagraphKey(ev, key)) return;
      }
      // If typing in an input inside modal, don't hijack
      const t = ev.target;
      const tag = (t && t.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return;
      // Space toggles start/pause
      if (ev.key === ' ') { ev.preventDefault(); running ? pause() : start(); return; }
      // l skips current chunk
      if (key === 'l') { ev.preventDefault(); skip(); return; }
      // j/k adjust WPM in 10 wpm steps (j: down, k: up)
      if (key === 'k') { ev.preventDefault(); setWpm(Math.min(1200, getWpm()+10)); if (running) step(); updateInfo(); return; }
      if (key === 'j') { ev.preventDefault(); setWpm(Math.max(60, getWpm()-10)); if (running) step(); updateInfo(); return; }
    });

    // Paragraph selection controller
    let selText = '';
    let selActive = false;
    let selAnchor = 0; // fixed end of selection
    let selFocus = 0;  // moving end of selection
    let paraText = '';
    let lastCaretIndex = 0; // updated from clicks within paragraph
    function selectionInit(text){
      paraText = text || '';
      selActive = false; selAnchor = 0; selFocus = 0; selText = '';
      clearNativeSelection();
      lastCaretIndex = 0;
    }
    function clearNativeSelection(){
      try { const s = window.getSelection(); if (s) s.removeAllRanges(); } catch {}
    }
    function setCollapsedCaret(pos){
      if (!paraEl || !paraEl.firstChild) return;
      const p = clamp(pos, 0, paraText.length);
      const r = document.createRange();
      r.setStart(paraEl.firstChild, p);
      r.collapse(true);
      const s = window.getSelection();
      if (!s) return;
      s.removeAllRanges();
      s.addRange(r);
      lastCaretIndex = p;
      selFocus = p;
    }
    function getSelectionIfInsidePara(){
      try {
        const s = window.getSelection();
        if (!s || s.rangeCount === 0) return null;
        const r = s.getRangeAt(0);
        if (!paraEl) return null;
        if (!paraEl.contains(r.commonAncestorContainer)) return null;
        return r;
      } catch { return null; }
    }
    function getCaretOffsetFromPoint(x, y){
      try {
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(x, y);
          if (range && range.startContainer && paraEl && paraEl.contains(range.startContainer)) {
            return range.startOffset;
          }
        } else if (document.caretPositionFromPoint) {
          const pos = document.caretPositionFromPoint(x, y);
          if (pos && pos.offsetNode && paraEl && paraEl.contains(pos.offsetNode)) {
            return pos.offset;
          }
        }
      } catch {}
      return null;
    }
    function attachParagraphPointerEvents(){
      if (!paraEl) return;
      paraEl.onmousedown = (e)=>{
        const off = getCaretOffsetFromPoint(e.clientX, e.clientY);
        if (off != null) lastCaretIndex = clamp(off, 0, paraText.length);
      };
      paraEl.onmouseup = (e)=>{
        const off = getCaretOffsetFromPoint(e.clientX, e.clientY);
        if (off != null) lastCaretIndex = clamp(off, 0, paraText.length);
      };
      paraEl.onkeyup = ()=>{
        const r = getSelectionIfInsidePara();
        if (r) lastCaretIndex = clamp(r.endOffset, 0, paraText.length);
      };
    }
    function applySelection(){
      if (!paraEl || !paraEl.firstChild) return;
      clearNativeSelection();
      const start = Math.max(0, Math.min(selAnchor, selFocus));
      const end = Math.max(0, Math.max(selAnchor, selFocus));
      const range = document.createRange();
      const node = paraEl.firstChild; // text node
      try { range.setStart(node, start); range.setEnd(node, end); } catch {}
      const s = window.getSelection();
      if (s) s.addRange(range);
      selText = paraText.slice(start, end);
    }
    function moveChar(delta){ selFocus = clamp(selFocus + delta, 0, paraText.length); applySelection(); }
    function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
    function isWordChar(ch){ return /[A-Za-z0-9_]/.test(ch); }
    function nextWordIndex(idx){
      let i = clamp(idx,0,paraText.length);
      // skip current word/non-word then advance to start of next word
      while (i < paraText.length && isWordChar(paraText[i])) i++;
      while (i < paraText.length && !isWordChar(paraText[i])) i++;
      return i;
    }
    function prevWordIndex(idx){
      let i = clamp(idx,0,paraText.length);
      // move left skipping spaces/non-word
      while (i > 0 && !isWordChar(paraText[i-1])) i--;
      // then move to start of current word
      while (i > 0 && isWordChar(paraText[i-1])) i--;
      return i;
    }
    const ABBREV = new Set(['mr','mrs','ms','dr','prof','sr','jr','st','vs','etc','e.g','i.e','fr','rev']);
    function isSentencePunct(ch){ return /[\.\!\?]/.test(ch); }
    function tokenBefore(index){
      let i = Math.max(0, index-1);
      // skip spaces and quotes
      while (i > 0 && /[\s"'\)\]]/.test(paraText[i])) i--;
      // collect letters before dot
      let start = i;
      while (start > 0 && /[A-Za-z]/.test(paraText[start-1])) start--;
      return paraText.slice(start, i+1).toLowerCase();
    }
    function looksLikeSentenceBoundary(i){
      // i points at punctuation; check abbreviation before and capitalization after
      const prevTok = tokenBefore(i);
      if (ABBREV.has(prevTok.replace(/\.$/, ''))) return false;
      // Next non-space character should be uppercase letter to count as boundary
      let j = i+1;
      while (j < paraText.length && /\s/.test(paraText[j])) j++;
      if (j < paraText.length && /[A-Z]/.test(paraText[j])) return true;
      return /[\n]/.test(paraText[j]||'');
    }
    function nextSentenceIndex(idx){
      let i = clamp(idx,0,paraText.length);
      while (i < paraText.length) {
        if (isSentencePunct(paraText[i]) && looksLikeSentenceBoundary(i)) {
          i++;
          while (i < paraText.length && /\s/.test(paraText[i])) i++;
          break;
        }
        i++;
      }
      return i;
    }
    function prevSentenceIndex(idx){
      let i = clamp(idx,0,paraText.length);
      // move left skipping spaces
      while (i > 0 && /\s/.test(paraText[i-1])) i--;
      // find previous sentence boundary
      let k = i-1;
      while (k > 0) {
        if (isSentencePunct(paraText[k]) && looksLikeSentenceBoundary(k)) { k--; break; }
        k--;
      }
      // jump to start after that boundary
      let start = k+1;
      while (start < paraText.length && /\s/.test(paraText[start])) start++;
      return clamp(start, 0, paraText.length);
    }
    function beginSelection(){
      selActive = true;
      // Prefer current caret/selection inside the paragraph
      const r = getSelectionIfInsidePara();
      if (r) {
        selAnchor = clamp(r.startOffset, 0, paraText.length);
      } else {
        selAnchor = clamp(lastCaretIndex, 0, paraText.length);
      }
      selFocus = clamp(selAnchor+1, 0, paraText.length); // make 1-char visible
      applySelection();
    }
    function clearSelection(){ selActive = false; selAnchor = selFocus; selText=''; clearNativeSelection(); }
    function copySelection(){ const t = (selText && selText.trim()) || paraText; try{ navigator.clipboard.writeText(t); if (statusEl) { const prev = statusEl.textContent; statusEl.textContent = 'Copied to clipboard'; setTimeout(()=>{ if (statusEl) statusEl.textContent = prev || ''; }, 900); } }catch{} }
    function journalSelection(){
      const txt = (selText && selText.trim()) || paraText;
      try {
        const intent = document.getElementById('intent');
        if (intent) {
          // Set the textarea to the selected/full paragraph
          intent.value = txt || '';
          // Ensure two newlines at the end for quick continuation typing
          const val = String(intent.value || '');
          const needs = /\n\n$/.test(val) ? '' : (val.endsWith('\n') ? '\n' : '\n\n');
          intent.value = val + needs;
          // Move caret to end, focus, and scroll to keep caret visible
          const end = intent.value.length;
          if (typeof intent.setSelectionRange === 'function') intent.setSelectionRange(end, end);
          intent.focus();
          intent.scrollTop = intent.scrollHeight;
        }
      } catch {}
      hideModal();
    }
    function handleParagraphKey(ev, key){
      // allow tab navigation inside element
      if (ev.key === 'Tab') return false;
      // do not react if typing inside inputs (already filtered above)
      const target = ev.target;
      if (target && (target.tagName||'').toLowerCase() !== 'body' && target !== paraEl) {
        // let clicks inside paragraph still work
      }
      // Controls:
      // v: toggle selection (start at current focus)
      if (key === 'v') { ev.preventDefault(); if (selActive) { clearSelection(); } else { beginSelection(); } return true; }
      // 0 and $: jump
      if (key === '0') { ev.preventDefault(); selFocus = 0; if (selActive) applySelection(); return true; }
      if (ev.key === '$') { ev.preventDefault(); selFocus = paraText.length; if (selActive) applySelection(); return true; }
      // h/l driven selection with modifiers:
      // - h/l: char
      // - Shift+h / Shift+l: word
      // - Cmd+h / Cmd+l (or Ctrl as fallback): sentence
      if (key === 'h' || key === 'l') {
        ev.preventDefault();
        if (!selActive) {
          // caret-only movement
          const dir = key === 'h' ? -1 : 1;
          if (ev.metaKey || ev.ctrlKey) {
            const next = dir < 0 ? prevSentenceIndex(lastCaretIndex) : nextSentenceIndex(lastCaretIndex);
            setCollapsedCaret(next);
            return true;
          } else if (ev.shiftKey) {
            const next = dir < 0 ? prevWordIndex(lastCaretIndex) : nextWordIndex(lastCaretIndex);
            setCollapsedCaret(next);
            return true;
          } else {
            setCollapsedCaret(lastCaretIndex + dir);
            return true;
          }
        }
        const dir = key === 'h' ? -1 : 1;
        if (ev.metaKey || ev.ctrlKey) {
          selFocus = dir < 0 ? prevSentenceIndex(selFocus) : nextSentenceIndex(selFocus);
          applySelection();
          return true;
        } else if (ev.shiftKey) {
          selFocus = dir < 0 ? prevWordIndex(selFocus) : nextWordIndex(selFocus);
          applySelection();
          return true;
        } else {
          moveChar(dir);
          return true;
        }
      }
      // Arrow keys move caret (no selection) until 'v' is pressed
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); if (!selActive) { setCollapsedCaret(lastCaretIndex-1); return true; } moveChar(-1); return true; }
      if (ev.key === 'ArrowRight') { ev.preventDefault(); if (!selActive) { setCollapsedCaret(lastCaretIndex+1); return true; } moveChar(1); return true; }
      // Optional legacy bindings
      if (key === 'w') { ev.preventDefault(); if (!selActive) beginSelection(); selFocus = nextWordIndex(selFocus); applySelection(); return true; }
      if (key === 'b') { ev.preventDefault(); if (!selActive) beginSelection(); selFocus = prevWordIndex(selFocus); applySelection(); return true; }
      if (key === 's') { ev.preventDefault(); if (!selActive) beginSelection(); selFocus = nextSentenceIndex(selFocus); applySelection(); return true; }
      if (key === 'a') { ev.preventDefault(); if (!selActive) beginSelection(); selFocus = prevSentenceIndex(selFocus); applySelection(); return true; }
      // c: copy; j: to journal and close
      if (key === 'c') { ev.preventDefault(); copySelection(); return true; }
      if (key === 'j') { ev.preventDefault(); journalSelection(); return true; }
      // escape clears selection
      if (key === 'escape') { ev.preventDefault(); clearSelection(); return true; }
      return false;
    }

    // Initialize: load bundled TXT (book.txt)
    async function loadBook(force){
      try {
        if (force) { __BOOK_TEXT__=''; try{ localStorage.removeItem(keyBookMeta);}catch{} }
        if (!getStoredText()) {
          if (statusEl) statusEl.textContent = 'Loading text…';
          const attempted = [];
          const urls = [];
          try { urls.push(chrome.runtime.getURL('book.txt')); } catch {}
          urls.push('/book.txt');
          urls.push('book.txt');
          let txt = '';
          let lastErr = '';
          for (let i=0;i<urls.length;i++){
            const u = urls[i]; attempted.push(u);
            try {
              const res = await fetch(u, { cache: 'no-store' });
              if (res && res.ok) { txt = await res.text(); break; }
              lastErr = `status ${res && res.status}`;
            } catch(e){ lastErr = String(e); }
          }
          if (txt) {
            setStoredText(txt);
            if (statusEl) statusEl.textContent = `Loaded text (${txt.length} chars)`;
          } else {
            if (statusEl) statusEl.textContent = `Failed to load text`;
            try { console.warn('Reader could not fetch book.txt. Tried URLs:', attempted, 'Last error:', lastErr); } catch {}
          }
        } else { if (statusEl) statusEl.textContent = 'Ready'; }
      } catch {
        if (statusEl) statusEl.textContent = 'Failed to load text';
      }
      updateInfo();
    }

    // wire reload button
    // Removed reload button; always load at init

    // initial load
    loadBook(false);
  })();

  // Keyboard shortcuts: list-mode + timers + input helpers
  (function(){
    const intent = document.getElementById('intent');
    const exStart = document.getElementById('exStart');
    const journalBox = document.getElementById('journalBox');
    const entriesBox = document.getElementById('journalEntries');
    const prayBtn = document.getElementById('prayBtn');
    const readBtn = document.getElementById('readBtn');
    const overlay = document.getElementById('overlay');
    const overlayMsg = document.getElementById('overlayMsg');
    const saveBtn = document.getElementById('saveIntent');

    let listMode = false;
    let selected = -1;

    function getEntries(){
      return Array.from((entriesBox||{}).querySelectorAll('.entry')||[]);
    }
    function clearSelection(){ getEntries().forEach(el=>el.classList.remove('selected')); }
    function ensureVisible(el){
      if (!el || !journalBox) return;
      const pr = journalBox.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (er.top < pr.top) el.scrollIntoView({block:'nearest'});
      else if (er.bottom > pr.bottom) el.scrollIntoView({block:'nearest'});
    }
    function enterListMode(){
      const items = getEntries(); if (!items.length) return;
      listMode = true; selected = 0; clearSelection();
      items[selected].classList.add('selected'); ensureVisible(items[selected]);
    }
    function exitListMode(){ listMode = false; selected = -1; clearSelection(); }
    function moveSel(delta){
      const items = getEntries(); if (!items.length) return;
      selected = Math.max(0, Math.min(items.length-1, selected + delta));
      clearSelection(); items[selected].classList.add('selected'); ensureVisible(items[selected]);
    }
    function showOverlay(text){
      if (!overlay) return;
      if (overlayMsg) overlayMsg.textContent = text;
      overlay.classList.add('show');
      setTimeout(()=>{ overlay.classList.remove('show'); }, 900);
    }
    async function copySelected(){
      const items = getEntries(); if (!items.length || selected < 0) return;
      const node = items[selected];
      const html = node.innerHTML; const parts = html.split('<br>');
      const textHtml = parts.slice(1).join('<br>');
      const tmp = document.createElement('div'); tmp.innerHTML = textHtml;
      const text = tmp.textContent || '';
      try { await navigator.clipboard.writeText(text); } catch {}
      node.classList.add('copied'); setTimeout(()=>{ node.classList.remove('copied'); }, 700);
      showOverlay('Copied to clipboard');
      exitListMode();
    }
    function isTypingContext(el){
      if (!el) return false;
      const tag = (el.tagName||'').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (el.isContentEditable) return true;
      const ce = el.closest && el.closest('[contenteditable="true"]');
      if (ce) return true;
      return false;
    }
    document.addEventListener('keydown', (ev)=>{
      const key = ev.key.toLowerCase();
      // If any modal is open, ignore global shortcuts
      const anyModalOpen = !!document.querySelector('.modal.show');
      if (anyModalOpen) return;
      const active = document.activeElement;
      // If typing: handle Escape to blur and Cmd+Enter to submit, otherwise pass through
      if (isTypingContext(active)) {
        if (key === 'escape') { ev.preventDefault(); if (active && active.blur) active.blur(); return; }
        if (key === 'enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); if (saveBtn) saveBtn.click(); return; }
        return;
      }
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (listMode) {
        if (key === 'j') { ev.preventDefault(); moveSel(1); return; }
        if (key === 'k') { ev.preventDefault(); moveSel(-1); return; }
        if (key === 'c') { ev.preventDefault(); copySelected(); return; }
        if (key === 'escape') { ev.preventDefault(); exitListMode(); return; }
      }
      if (key === 'p') { ev.preventDefault(); if (prayBtn) prayBtn.click(); return; }
      if (key === 'r') { ev.preventDefault(); if (readBtn) readBtn.click(); return; }
      if (key === 's') { ev.preventDefault(); if (exStart) exStart.click(); return; }
      if (key === 'j') { ev.preventDefault(); if (intent) intent.focus(); return; }
      if (key === 'l') { ev.preventDefault(); enterListMode(); return; }
    });
  })();
})();
