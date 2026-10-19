/* M Tech: shared motion layer for every page (loader, cursor, scroll progress, text decode,
   shape-mask transitions, horizontal timeline rail, giant wordmark footer). Content is real HTML and
   visible without this file; it only adds motion on top. */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasG = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const intro = () => { if (html.dataset.introDone) return; html.dataset.introDone = 1; html.classList.remove('ld'); dispatchEvent(new Event('mt:intro')); };

  /* ---------- first-visit loader (< 2 s, once per session) ---------- */
  if (html.classList.contains('ld')) {
    const brand = document.querySelector('.brand img');
    const L = document.createElement('div'); L.className = 'loader'; L.setAttribute('aria-hidden', 'true');
    L.innerHTML = `<img src="${brand ? brand.getAttribute('src') : ''}" alt="" width="62" height="32"><i></i><b>000</b>`;
    document.body.appendChild(L);
    const b = L.querySelector('b'), t0 = performance.now(), DUR = 1300;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / DUR), e = 1 - Math.pow(1 - k, 3);
      b.textContent = String(Math.round(e * 100)).padStart(3, '0'); L.style.setProperty('--p', e);
      if (k < 1) requestAnimationFrame(step);
      else { L.classList.add('out'); intro(); setTimeout(() => L.remove(), 1000); }
    };
    requestAnimationFrame(step);
  }
  if (!hasG || reduce) { intro(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- text decode on small eyebrow labels ---------- */
  const GL = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  const decode = (el) => {
    if (el.dataset.dec) return; el.dataset.dec = 1;
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    nodes.forEach((n) => {
      const final = n.textContent; let f = 0;
      const id = setInterval(() => {
        f++; const k = f / 14;
        n.textContent = final.split('').map((c, i) => (/\s|·|&|,/.test(c) || i / final.length < k) ? c : GL[(Math.random() * GL.length) | 0]).join('');
        if (f >= 14) { clearInterval(id); n.textContent = final; }
      }, 38);
    });
  };
  document.querySelectorAll('.sec-hd .eyebrow, .phead .eyebrow, .founder-copy .eyebrow, .ceo-copy .eyebrow, .mem .eyebrow, .how-l .eyebrow').forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => decode(el) }));

  /* ---------- shape-mask section transitions (diagonal edge flattens as it arrives) ---------- */
  const wipe = (sel, from = 7) => document.querySelectorAll(sel).forEach((el) => {
    gsap.fromTo(el, { clipPath: `polygon(0% ${from}vw, 100% 0%, 100% 100%, 0% 100%)` },
      { clipPath: 'polygon(0% 0vw, 100% 0%, 100% 100%, 0% 100%)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 65%', scrub: true } });
  });
  wipe('.cta-band', 4); wipe('.ftr', 4); wipe('.brands', 4); wipe('.stats', 3);
  // circle mask on the 3D machine section
  const mcs = document.querySelector('.mc');
  if (mcs) gsap.fromTo('.mc-pin', { clipPath: 'circle(18% at 50% 60%)' }, { clipPath: 'circle(150% at 50% 60%)', ease: 'none',
    scrollTrigger: { trigger: mcs, start: 'top bottom', end: 'top top', scrub: true } });

  /* ---------- section headings: subtle depth parallax ---------- */
  document.querySelectorAll('.sec-hd').forEach((h) => gsap.fromTo(h, { y: 30 }, { y: -10, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* ---------- About timeline: horizontal rail on desktop ---------- */
  const tl = document.querySelector('.tl');
  if (tl && innerWidth > 1100 && tl.children.length > 4) {
    const sec = tl.closest('.sec');
    tl.classList.add('rail');
    const dist = () => Math.max(0, tl.scrollWidth - tl.parentElement.clientWidth);
    gsap.to(tl, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: () => sec.offsetHeight < innerHeight ? 'center center' : 'top top', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
  }

  /* ---------- giant wordmark footer: letters rise one by one, then a light sweep ---------- */
  const fm = document.querySelector('.ftr-mark-in');
  if (fm) {
    const letters = fm.querySelectorAll('span:not(.sp)');
    gsap.set(letters, { yPercent: 70, opacity: 0 });
    ScrollTrigger.create({ trigger: fm, start: 'top 98%', once: true, onEnter: () => {
      gsap.to(letters, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .07 });
      gsap.fromTo(fm, { '--sw': '-100%' }, { '--sw': '100%', duration: 1.8, ease: 'power2.inOut', delay: .5 });
    } });
  }

  /* ---------- scroll progress with the current section name (desktop) ---------- */
  if (fine && innerWidth > 900) {
    const pg = document.createElement('div'); pg.className = 'sprog'; pg.setAttribute('aria-hidden', 'true');
    pg.innerHTML = '<span class="sprog-t"></span><span class="sprog-b"><i></i></span>';
    document.body.appendChild(pg);
    const label = pg.querySelector('.sprog-t'), fill = pg.querySelector('.sprog-b i');
    const marks = [...document.querySelectorAll('main section')].filter((x) => !x.parentElement.closest('main section')).map((s) => {
      const name = s.classList.contains('cine') ? null
        : (s.querySelector('.eyebrow, .sec-hd .eyebrow') || s.querySelector('h2, h1') || {}).textContent;
      if (s.classList.contains('cta-band')) return { s, name: 'Contact', dark: true };
      return { s, name: (s.getAttribute('aria-label') || name || '').trim().slice(0, 30), dark: s.matches('.mc, .pr, .cine, .cta-band, .brands, .stats') };
    }).filter((m) => m.name || m.s.classList.contains('cine'));
    const cineEl = document.querySelector('.cine');
    const cineNames = [...document.querySelectorAll('.cine-rail span')].map((s) => s.textContent);
    let last = '';
    const upd = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      fill.style.transform = `scaleY(${max > 0 ? scrollY / max : 0})`;
      const mid = innerHeight * .5;
      let m = null; marks.forEach((x) => { if (x.s.getBoundingClientRect().top < mid) m = x; });
      let name = m ? m.name : '';
      if (m && m.s === cineEl) name = cineNames[+cineEl.dataset.ch || 0] || '';
      if (name !== last) { last = name; label.textContent = name; }
      pg.classList.toggle('on', scrollY > innerHeight * .4 && !!name && !(m && m.s === cineEl));
      pg.classList.toggle('dark', !!(m && m.dark));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- custom cursor ring with labels (desktop only) ---------- */
  if (fine) {
    const c = document.createElement('div'); c.className = 'cur'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span></span>';
    document.body.appendChild(c);
    const txt = c.querySelector('span');
    const qx = gsap.quickTo(c, 'x', { duration: .35, ease: 'power3' }), qy = gsap.quickTo(c, 'y', { duration: .35, ease: 'power3' });
    const lab = (el) => {
      if (!el) return '';
      if (el.closest('.cine-rail li, .pr-rail li')) return 'Go';
      if (el.closest('.btn-wa, .mbar-wa, .fab')) return 'Chat';
      if (el.closest('a[href^="tel:"]')) return 'Call';
      if (el.closest('.mc-stage')) return 'Drag';
      if (el.closest('.svc-card, .svc-row, .tm, .stk-folder, .stk-item-img, .stk-main')) return 'View';
      if (el.closest('.btn-pri')) return 'Open';
      return '';
    };
    addEventListener('pointermove', (e) => {
      qx(e.clientX); qy(e.clientY); c.classList.add('on');
      const t = e.target, l = lab(t);
      c.classList.toggle('big', !!l); if (l) txt.textContent = l;
      c.classList.toggle('dark', !!t.closest('.cine, .mc, .pr, .ftr, .cta-band, .brands, .stats'));
    }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    addEventListener('blur', () => c.classList.remove('on'));
    // magnetic: all buttons, not only the large ones
    document.querySelectorAll('.btn:not(.btn-lg), .social a, .svc-go').forEach((b) => {
      const mx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), my = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .2); my((e.clientY - r.top - r.height / 2) * .28); });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  /* ---------- tilt + glow on stock folders (cards that load later) ---------- */
  if (fine) {
    const tiltOn = (root) => root.querySelectorAll('.stk-folder:not(.tilt), .stk-item:not(.tilt), .guide-item:not(.tilt)').forEach((c) => {
      c.classList.add('tilt'); gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3' });
      c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 6); rx((.5 - py) * 6); c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%'); });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    tiltOn(document);
    ['stkFolders', 'stkItems'].forEach((id) => { const el = document.getElementById(id); if (el) new MutationObserver(() => { tiltOn(el); reveal(el); ScrollTrigger.refresh(); }).observe(el, { childList: true }); });
  }
  /* ---------- stock cards rise in when they arrive ---------- */
  const reveal = (root) => {
    const kids = [...root.querySelectorAll('.stk-folder:not([data-in]), .stk-item:not([data-in])')];
    kids.forEach((k) => k.setAttribute('data-in', ''));
    if (kids.length) ScrollTrigger.batch(kids, { start: 'top 95%', once: true, onEnter: (b) => gsap.fromTo(b, { y: 40, opacity: 0, clipPath: 'inset(12% 0% 0% 0% round 18px)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1, ease: 'expo.out', stagger: .08, clearProps: 'clipPath' }) });
  };
  if (!fine) ['stkFolders', 'stkItems'].forEach((id) => { const el = document.getElementById(id); if (el) new MutationObserver(() => { reveal(el); ScrollTrigger.refresh(); }).observe(el, { childList: true }); });

  /* ---------- refresh once fonts and images have settled ---------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 200));
  addEventListener('pageshow', (e) => { if (e.persisted) ScrollTrigger.refresh(); });
})();
