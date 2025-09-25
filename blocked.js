(function(){
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  const context = document.getElementById('context');
  if (context) {
    if (from) {
      try {
        const u = new URL(from);
        context.textContent = `You came from: ${u.hostname}${u.pathname}`;
      } catch {
        context.textContent = 'You came from a blocked page.';
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

  // Keyboard shortcuts: list-mode + timers + input helpers
  (function(){
    const intent = document.getElementById('intent');
    const exStart = document.getElementById('exStart');
    const journalBox = document.getElementById('journalBox');
    const entriesBox = document.getElementById('journalEntries');
    const prayBtn = document.getElementById('prayBtn');
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
      if (key === 's') { ev.preventDefault(); if (exStart) exStart.click(); return; }
      if (key === 'j') { ev.preventDefault(); if (intent) intent.focus(); return; }
      if (key === 'l') { ev.preventDefault(); enterListMode(); return; }
    });
  })();
})();
