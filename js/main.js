/* M Tech Textile Traders: header, menu, form, hero video, stock teaser and the motion layer.
   All motion is self-playing (viewport enter, time loops, hover/tap). Native scrolling everywhere;
   content is plain HTML and stays visible if this file never runs (see the .js / .rv-safe gates). */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const IO = 'IntersectionObserver' in window;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- header: dark top, frosted after scroll, progress, back to top ---------- */
  const hdr = document.getElementById('hdr');
  const hero = document.querySelector('.hero');
  const darkHead = document.querySelector('.phead, .mem');
  const sheet = document.getElementById('sheet'), burger = document.getElementById('burger');
  const prog = hdr.querySelector('.prog i');
  const totop = document.querySelector('.totop');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, max = html.scrollHeight - innerHeight;
    const dark = !!hero || (innerWidth < 760 && !!darkHead);
    hdr.classList.toggle('scrolled', y > 30);
    hdr.classList.toggle('top', dark && y <= 30);
    if (prog) prog.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (totop) totop.classList.toggle('show', y > innerHeight * 1.2);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- mobile menu ---------- */
  const setMenu = (o) => {
    sheet.classList.toggle('open', o); sheet.setAttribute('aria-hidden', !o); hdr.classList.toggle('menu', o);
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    document.body.style.overflow = o ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!sheet.classList.contains('open')));
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('open')) { setMenu(false); burger.focus(); } });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- inquiry form -> WhatsApp ---------- */
  const form = document.getElementById('inq');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form), v = (k) => (f.get(k) || '').toString().trim();
    const err = document.getElementById('ferr');
    const bad = ['name', 'phone'].filter((k) => !v(k));
    form.querySelectorAll('input').forEach((i) => i.removeAttribute('aria-invalid'));
    bad.forEach((k) => form.elements[k].setAttribute('aria-invalid', 'true'));
    if (bad.length) { err.hidden = false; form.elements[bad[0]].focus(); return; }
    err.hidden = true;
    const lines = ['Assalam o Alaikum M Tech,', '', `Name: ${v('name')}`, `Phone: ${v('phone')}`];
    if (v('company')) lines.push(`Company: ${v('company')}`);
    if (v('city')) lines.push(`City: ${v('city')}`);
    lines.push(`Interested in: ${v('topic')}`);
    if (v('msg')) lines.push('', v('msg'));
    window.open('https://wa.me/923324681423?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  /* ---------- split headings into words (masked rise) ---------- */
  const split = (el) => {
    let i = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'sw'; w.style.setProperty('--i', i++);
          const s = document.createElement('span'); s.textContent = part; w.appendChild(s); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('sw')) walk(n);
    });
    walk(el); el.setAttribute('data-split', '');
  };
  $$('.hero-h, .h1:not(.stk-h1), .h2').forEach(split);

  /* ---------- helpers: eyebrow decode, counters ---------- */
  const GL = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  const decode = (el) => {
    if (el.dataset.dec || reduce) return; el.dataset.dec = 1;
    [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).forEach((n) => {
      const final = n.textContent; let f = 0;
      const id = setInterval(() => {
        f++; const k = f / 13;
        n.textContent = final.split('').map((c, i) => (/[\s·&,]/.test(c) || i / final.length < k) ? c : GL[(Math.random() * GL.length) | 0]).join('');
        if (f >= 13) { clearInterval(id); n.textContent = final; }
      }, 38);
    });
  };
  const count = (el) => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now(), D = 1600;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- reveal on enter ---------- */
  ['.svc-img', '.svc-row-img', '.split-img', '.ceo-img', '.ph-img', '.wide-img', '.tm-img', '.mem-img'].forEach((s, n) =>
    $$(s).forEach((el) => { el.classList.add('wp'); if (n === 2 || n === 3) el.classList.add('wl'); if (n === 5) el.classList.add('wd'); }));
  $$('.grps').forEach((g) => { g.classList.remove('rv'); $$('.chips li', g).forEach((li, i) => li.style.setProperty('--i', Math.min(i, 24))); });
  const stagger = (els) => {
    const groups = new Map();
    els.forEach((el) => { const p = el.parentElement; const i = groups.get(p) || 0; groups.set(p, i + 1); el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms'); });
  };
  const TARGETS = '.rv, [data-split], .wp, .slant, .grow, .draw, .grps, .line, .ftr-mark, [data-count], .eyebrow';
  const onIn = (el) => {
    el.classList.add('in');
    // cards in a horizontal swipe deck reveal together (the off-screen ones would never "enter")
    if (el.parentElement && el.parentElement.matches('[data-swipe]')) [...el.parentElement.children].forEach((c) => { c.classList.add('in'); $$('.wp', c).forEach((x) => x.classList.add('in')); });
    if (el.classList.contains('eyebrow')) decode(el);
    if (el.dataset.count) count(el);
  };
  let io = null;
  const watch = (root) => {
    const els = $$(TARGETS, root).filter((el) => !el.closest('.hero') && !el.classList.contains('in'));
    if (root !== document && root.matches && root.matches(TARGETS)) els.push(root);
    stagger(els.filter((el) => el.classList.contains('rv') || el.classList.contains('wp')));
    els.forEach((el) => (io ? io.observe(el) : onIn(el)));
  };
  if (IO && !reduce) {
    io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { onIn(x.target); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
  }
  watch(document);
  html.classList.add('mo');
  // safety: anything on screen that has not revealed after 2.5 s is shown
  setTimeout(() => $$(TARGETS).forEach((el) => {
    if (el.classList.contains('in') || el.closest('.hero')) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) onIn(el);
  }), 2500);

  /* ---------- home hero: entrance after the intro, background video ---------- */
  if (hero) {
    const go = () => { hero.classList.add('go'); decode(hero.querySelector('.eyebrow')); };
    if (html.classList.contains('intro')) { addEventListener('mt:introdone', go, { once: true }); setTimeout(go, 5000); }
    else requestAnimationFrame(() => setTimeout(go, 80));
  }
  const vid = hero && hero.querySelector('.hero-vid');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (vid && !reduce && !saveData) {
    const mq = matchMedia('(max-width: 759px)');
    let inView = true, started = false;
    const play = () => { if (!started || document.hidden || !inView) return; const p = vid.play(); if (p) p.catch(() => {}); };
    const setSrc = () => { const s = mq.matches ? vid.dataset.m : vid.dataset.d; if (vid.getAttribute('src') !== s) { vid.src = s; vid.load(); } };
    const start = () => {
      if (started) return; started = true;
      vid.muted = true; setSrc();
      vid.addEventListener('playing', () => hero.classList.add('vid-on'), { once: true });
      play();
    };
    mq.addEventListener('change', () => { if (started) { hero.classList.remove('vid-on'); setSrc(); vid.addEventListener('playing', () => hero.classList.add('vid-on'), { once: true }); play(); } });
    if (IO) new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? play() : vid.pause(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { document.hidden ? vid.pause() : play(); });
    const whenLoaded = (fn) => document.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true });
    whenLoaded(() => {
      if (html.classList.contains('intro')) addEventListener('mt:introdone', () => setTimeout(start, 150), { once: true });
      else setTimeout(start, 200);
    });
  }

  /* ---------- home: real stock folders flip in ---------- */
  const tl = document.getElementById('stockTeaser');
  if (tl && 'fetch' in window) {
    fetch('/api/folders', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list) || !list.length) return;
        const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        tl.innerHTML = list.slice(0, 6).map((f, i) => `<li style="--i:${i}"><a href="/stock/${encodeURIComponent(f.slug)}"><b>${esc(f.name)}</b><small>${f.count} ${f.count === 1 ? 'item' : 'items'}</small></a></li>`).join('');
        tl.hidden = false;
        tl.classList.add('rv-x');
        io ? io.observe(tl) : tl.classList.add('in');
        tiltOn(tl);
      })
      .catch(() => {});
  }

  /* ---------- stock pages: cards rise in as they arrive ---------- */
  ['stkFolders', 'stkItems'].forEach((id) => {
    const el = document.getElementById(id); if (!el) return;
    new MutationObserver(() => {
      $$('.stk-folder:not(.rv), .stk-item:not(.rv)', el).forEach((c) => c.classList.add('rv'));
      watch(el); tiltOn(el);
    }).observe(el, { childList: true });
  });

  /* ---------- marquees pause off screen ---------- */
  if (IO) $$('.marq').forEach((m) => new IntersectionObserver(([e]) => m.classList.toggle('off', !e.isIntersecting)).observe(m));

  /* ---------- spinning-line rail: auto-advances, swipe/scroll by hand ---------- */
  $$('[data-rail]').forEach((rail) => {
    const sec = rail.closest('.line'), track = rail.querySelector('.rail-track'), cards = $$('.rail-card', track);
    const bar = sec.querySelector('.rail-bar i'), cnt = sec.querySelector('.rail-count b');
    let idx = 0, inView = false, hold = 0;
    const pad = () => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const mark = (i) => {
      idx = i;
      cards.forEach((c, n) => { c.classList.toggle('on', n === i); c.classList.toggle('done', n < i); });
      if (bar) bar.style.transform = `scaleX(${(i + 1) / cards.length})`;
      if (cnt) cnt.textContent = String(i + 1).padStart(2, '0');
    };
    const goTo = (i) => { i = (i + cards.length) % cards.length; track.scrollTo({ left: cards[i].offsetLeft - pad() - track.offsetLeft * 0, behavior: reduce ? 'auto' : 'smooth' }); mark(i); };
    let st = 0;
    track.addEventListener('scroll', () => {
      clearTimeout(st); st = setTimeout(() => {
        const x = track.scrollLeft + pad();
        let best = 0, bd = Infinity; cards.forEach((c, n) => { const d = Math.abs(c.offsetLeft - x); if (d < bd) { bd = d; best = n; } });
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 && idx === cards.length - 1) best = idx;
        if (best !== idx) mark(best);
      }, 90);
    }, { passive: true });
    const pause = () => { hold = Date.now() + 7000; };
    ['pointerdown', 'wheel', 'touchstart', 'focusin', 'keydown'].forEach((ev) => track.addEventListener(ev, pause, { passive: true }));
    track.addEventListener('pointerenter', () => { if (fine) hold = Infinity; });
    track.addEventListener('pointerleave', () => { if (fine) hold = Date.now() + 1500; });
    const pv = sec.querySelector('.rail-prev'), nx = sec.querySelector('.rail-next');
    if (pv) pv.addEventListener('click', () => { pause(); goTo(idx - 1); });
    if (nx) nx.addEventListener('click', () => { pause(); goTo(idx + 1); });
    mark(0);
    if (IO) new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.35 }).observe(rail);
    if (!reduce) setInterval(() => { if (inView && !document.hidden && Date.now() > hold) goTo(idx + 1); }, 3200);
  });

  /* ---------- mobile swipe deck dots ---------- */
  $$('[data-swipe]').forEach((deck) => {
    const dots = $$('i', deck.nextElementSibling || document.createElement('div')); if (!dots.length) return;
    const upd = () => { const cs = [...deck.children]; let best = 0, bd = Infinity; cs.forEach((c, n) => { const d = Math.abs(c.offsetLeft - deck.scrollLeft - 16); if (d < bd) { bd = d; best = n; } }); dots.forEach((d, n) => d.classList.toggle('on', n === best)); };
    deck.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  });

  /* ---------- particles (drifting cotton fibres) in dark sections ---------- */
  if (!reduce) $$('.pcl').forEach((cv) => {
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const sec = cv.parentElement, N = innerWidth < 760 ? 26 : 56, dpr = Math.min(1.5, devicePixelRatio || 1);
    let W = 0, H = 0, P = [], on = false, raf = 0;
    const size = () => { W = sec.clientWidth; H = sec.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const mk = (y) => ({ x: Math.random() * W, y: y ?? Math.random() * H, r: Math.random() * 1.8 + .6, v: Math.random() * .35 + .12, a: Math.random() * .45 + .12, s: Math.random() * 6.28, o: Math.random() < .2 });
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      P.forEach((p) => {
        p.y -= p.v; p.s += .012; p.x += Math.sin(p.s) * .25;
        if (p.y < -10) Object.assign(p, mk(H + 10));
        ctx.globalAlpha = p.a; ctx.fillStyle = p.o ? '#FF8A4C' : '#ffffff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      });
      if (on) raf = requestAnimationFrame(tick);
    };
    const init = () => { size(); P = Array.from({ length: N }, () => mk()); };
    init(); addEventListener('resize', () => { size(); }, { passive: true });
    if (IO) new IntersectionObserver(([e]) => { on = e.isIntersecting && !document.hidden; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick); }).observe(sec);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { on = false; cancelAnimationFrame(raf); } });
  });

  /* ---------- buttons: ripple on tap, magnetic on desktop ---------- */
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.btn'); if (!b || reduce) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'rip'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 650);
  });
  function tiltOn(root) {
    if (!fine || reduce) return;
    $$('.svc-card, .tm, .stk-folder, .stk-item, .guide-item, .val, .trust-i, .teaser-list a', root).forEach((c) => {
      if (c.dataset.tilt) return; c.dataset.tilt = 1; c.classList.add('tilt');
      let raf = 0;
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
          c.style.transform = `perspective(900px) rotateX(${(.5 - py) * 7}deg) rotateY(${(px - .5) * 7}deg) translateY(-6px)`;
          c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
        });
      });
      c.addEventListener('pointerenter', () => { c.style.transition = 'transform .15s ease-out, box-shadow .5s, border-color .3s'; });
      c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1), box-shadow .5s, border-color .3s'; c.style.transform = ''; });
    });
  }
  tiltOn(document);
  if (fine && !reduce) {
    $$('.btn, .social a, .svc-go, .totop').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    /* custom cursor ring with labels */
    const c = document.createElement('div'); c.className = 'cur'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span></span>';
    document.body.appendChild(c);
    const txt = c.querySelector('span');
    let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
    const loop = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; c.style.transform = `translate(${cx}px, ${cy}px)`; if (Math.abs(tx - cx) + Math.abs(ty - cy) > .3) requestAnimationFrame(loop); else run = false; };
    const lab = (el) => {
      if (el.closest('.btn-wa, .fab, .mtc-wa')) return 'Chat';
      if (el.closest('a[href^="tel:"]')) return 'Call';
      if (el.closest('.svc-card, .svc-row, .tm, .stk-folder, .stk-item-img, .stk-main, .teaser-list a')) return 'View';
      if (el.closest('.rail-track')) return 'Drag';
      if (el.closest('.btn-pri')) return 'Open';
      return '';
    };
    addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY; c.classList.add('on'); if (!run) { run = true; requestAnimationFrame(loop); }
      const t = e.target; if (!(t instanceof Element)) return;
      const l = lab(t);
      c.classList.toggle('big', !!l); if (l) txt.textContent = l;
      c.classList.toggle('dark', !!t.closest('.hero, .line, .ftr, .cta-band, .brands, .stats, .callout, .c-block.main'));
      c.classList.toggle('txt', !l && !!t.closest('input, textarea, select, .mtc-panel'));
    }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    addEventListener('blur', () => c.classList.remove('on'));
  }

  /* ---------- quick page transition (never blocks: plain navigation underneath) ---------- */
  if (!reduce) {
    let pt = null;
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || /^\/(api|mtech-panel)/.test(u.pathname)) return;
      if (u.pathname === location.pathname && u.search === location.search) return;
      e.preventDefault();
      if (!pt) { pt = document.createElement('div'); pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true'); const logo = document.querySelector('.brand img'); pt.innerHTML = logo ? `<img src="${logo.getAttribute('src')}" alt="">` : ''; document.body.appendChild(pt); }
      void pt.offsetWidth; pt.classList.add('go');
      try { sessionStorage.setItem('mt_pt', '1'); } catch (er) {}
      setTimeout(() => { location.href = u.href; }, 300);
    });
    addEventListener('pageshow', (e) => { if (e.persisted && pt) pt.classList.remove('go'); html.classList.remove('pt-in'); });
  }
})();
