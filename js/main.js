/* M Tech Textile Traders — interactions */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- hero footage: lighter file on phones ---------- */
  const hv = document.querySelector('.hero-vid');
  if (hv && !reduce) { hv.src = matchMedia('(max-width: 760px)').matches ? hv.dataset.m : hv.dataset.d; const pp = hv.play(); if (pp) pp.catch(() => {}); }

  /* ---------- header ---------- */
  const hdr = document.getElementById('hdr');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('scrolled', y > 10);
    const open = document.getElementById('sheet').classList.contains('open');
    hdr.classList.toggle('hide', !open && y > 400 && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('hide');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burger'), sheet = document.getElementById('sheet');
  const setMenu = (o) => {
    sheet.classList.toggle('open', o); sheet.setAttribute('aria-hidden', !o);
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    document.body.style.overflow = o ? 'hidden' : '';
    if (window.__lenis) o ? window.__lenis.stop() : window.__lenis.start();
    if (o) hdr.classList.add('scrolled');
  };
  burger.addEventListener('click', () => setMenu(!sheet.classList.contains('open')));
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

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

  /* ---------- counters (shared) ---------- */
  const countUp = (el, dur = 1.6) => {
    const end = +el.dataset.count, plain = el.hasAttribute('data-plain');
    const start = plain ? Math.max(0, end - 60) : 0;
    if (!hasGSAP || reduce) { el.textContent = end; return; }
    const o = { v: start };
    gsap.to(o, { v: end, duration: dur, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
  };

  /* ---------- 3D machine: load three.js only on the page that needs it ---------- */
  const mc = document.getElementById('machine');
  if (mc) {
    const base = document.querySelector('script[src$="js/main.js"]').src.replace(/main\.js.*$/, '');
    const load = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.body.appendChild(s); });
    const go = () => load(base + 'vendor/three.min.js').then(() => load(base + 'machine3d.js')).catch(() => mc.classList.add('ready'));
    new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { ob.disconnect(); go(); } }, { rootMargin: '1500px 0px' }).observe(mc);
  }

  if (!hasGSAP || reduce) {
    document.querySelectorAll('.tl li').forEach((l) => l.classList.add('in'));
    document.querySelectorAll('.node').forEach((n) => n.classList.add('on'));
    return;
  }

  html.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- smooth scroll ---------- */
  if (typeof Lenis !== 'undefined' && matchMedia('(hover:hover)').matches) {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- split headings into a sliding line ---------- */
  document.querySelectorAll('.reveal-lines').forEach((h) => {
    h.innerHTML = `<span class="rl"><span>${h.innerHTML}</span></span>`;
  });

  /* ---------- hero intro ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero .eyebrow', { y: 20, opacity: 0, duration: .8 })
      .from('.hero-h .ln > span', { yPercent: 110, duration: 1.2, stagger: .12 }, '-=.5')
      .from('.hero-sub', { y: 24, opacity: 0, duration: 1 }, '-=.8')
      .from('.hero-btns .btn', { y: 24, opacity: 0, duration: .9, stagger: .1 }, '-=.8')
      .from('.ring', { scale: .6, opacity: 0, rotate: -60, duration: 1.8, stagger: .15 }, 0.1)
      .from('#lgGear', { rotate: -120, opacity: 0, duration: 1.6, ease: 'power4.out' }, 0.35)
      .from('#lgArc', { scale: 0, opacity: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.75)
      .from('#lgM', { yPercent: 40, opacity: 0, duration: 1.3 }, 0.55)
      .from('.hero-card', { y: 30, opacity: 0, scale: .9, duration: 1, stagger: .15, ease: 'back.out(1.6)' }, 1.0)
      .add(() => hero.querySelectorAll('.hero-card [data-count]').forEach((e) => countUp(e, 1.8)), 1.0);

    // scroll: gear turns, art drifts
    gsap.to('.hero-art', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -8, opacity: .3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

    // pointer tilt on desktop
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const art = document.querySelector('.hero-logo');
      const qx = gsap.quickTo(art, 'x', { duration: .8, ease: 'power3' }), qy = gsap.quickTo(art, 'y', { duration: .8, ease: 'power3' });
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        qx(((e.clientX - r.left) / r.width - .5) * 26); qy(((e.clientY - r.top) / r.height - .5) * 20);
      });
    }
  }

  /* ---------- page head intro ---------- */
  const ph = document.querySelector('.phead, .mem');
  if (ph) {
    const t2 = gsap.timeline({ defaults: { ease: 'expo.out' } });
    t2.from(ph.querySelectorAll('.crumbs, .eyebrow'), { y: 16, opacity: 0, duration: .8, stagger: .08 })
      .from(ph.querySelectorAll('.rl > span'), { yPercent: 110, duration: 1.2 }, '-=.6')
      .from(ph.querySelectorAll('.lead, .mem-copy > p:not(.eyebrow), .mem-copy .mini, .mem-copy .chips, .mem-contact, .mem-nav'), { y: 24, opacity: 0, duration: 1, stagger: .06 }, '-=.9');
    const pimg = ph.querySelector('.ph-img');
    if (pimg) {
      t2.from(pimg, { clipPath: 'inset(20% 10% 0% 10% round 18px)', duration: 1.6, ease: 'expo.inOut' }, .2);
      gsap.to(pimg.querySelector('img'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: pimg, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------- generic heading reveals (outside page head) ---------- */
  document.querySelectorAll('.reveal-lines').forEach((h) => {
    if (h.closest('.phead, .mem')) return;
    gsap.from(h.querySelector('.rl > span'), { yPercent: 110, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  /* ---------- image reveals ---------- */
  document.querySelectorAll('.reveal-img').forEach((el) => {
    const inPh = el.closest('.mem');
    gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.5, ease: 'expo.inOut', delay: inPh ? .2 : 0,
      scrollTrigger: inPh ? null : { trigger: el, start: 'top 85%' } });
    const img = el.querySelector('img');
    if (img) gsap.from(img, { scale: 1.25, duration: 2, ease: 'expo.out', delay: inPh ? .2 : 0, scrollTrigger: inPh ? null : { trigger: el, start: 'top 85%' } });
  });

  /* ---------- staggered groups ---------- */
  const groups = ['.svc-grid', '.steps', '.tm-grid', '.vals', '.tl', '.svc-list', '.extra', '.grps', '.c-info', '.stats-in', '.story-copy', '.founder-copy', '.ceo-copy', '.cta-in', '.svc-intro'];
  groups.forEach((sel) => document.querySelectorAll(sel).forEach((g) => {
    if (g.closest('.phead, .mem')) return;
    const kids = [...g.children].filter((k) => !k.classList.contains('reveal-lines'));
    gsap.set(kids, { opacity: 0, y: 40 });
    ScrollTrigger.batch(kids, { start: 'top 90%', once: true,
      onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .09, overwrite: true }) });
  }));
  document.querySelectorAll('.chips').forEach((c) => {
    if (c.closest('.mem')) return;
    gsap.from(c.children, { opacity: 0, y: 14, scale: .92, duration: .6, ease: 'back.out(1.8)', stagger: .03, scrollTrigger: { trigger: c, start: 'top 90%' } });
  });
  document.querySelectorAll('.c-form').forEach((f) => gsap.from(f, { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } }));

  /* ---------- timeline bars ---------- */
  document.querySelectorAll('.tl li').forEach((l) => ScrollTrigger.create({ trigger: l, start: 'top 85%', once: true, onEnter: () => setTimeout(() => l.classList.add('in'), 250) }));

  /* ---------- stats count ---------- */
  document.querySelectorAll('.stats [data-count]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el, 2) }));

  /* ---------- spinning line: horizontal journey ---------- */
  const jr = document.querySelector('.jr');
  if (jr) {
    const track = jr.querySelector('.jr-track'), cards = [...jr.querySelectorAll('.jr-card')];
    const svg = jr.querySelector('.jr-thread'), path = svg.querySelector('path');
    const bar = jr.querySelector('.jr-bar i'), cnt = jr.querySelector('.jr-count b');
    svg.insertAdjacentHTML('afterbegin', '<defs><linearGradient id="jrg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#FF8A4C"/></linearGradient></defs>');
    // prepare line art for drawing
    cards.forEach((c) => c.querySelectorAll('.jr-art svg *').forEach((el) => {
      if (!el.getTotalLength) return; const L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L;
    }));
    const draw = (c) => { if (c.dataset.drawn) return; c.dataset.drawn = 1;
      gsap.to(c.querySelectorAll('.jr-art svg *'), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: .04 }); };
    let L = 0;
    const build = () => {
      const W = track.scrollWidth; svg.setAttribute('viewBox', `0 0 ${W} 34`);
      const first = cards[0].offsetLeft + 35, step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 300;
      let d = `M0 12 L${first - step / 2} 12`;
      cards.forEach((c, i) => { const x = c.offsetLeft + 35; d += ` Q${x - step / 4} ${i % 2 ? 2 : 22} ${x} 12`; });
      d += ` L${W} 12`;
      path.setAttribute('d', d); L = path.getTotalLength(); path.style.strokeDasharray = L;
    };
    build();
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    let cur = -1;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: jr, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true, onRefresh: build },
      onUpdate: function () {
        const p = this.progress();
        path.style.strokeDashoffset = L * (1 - Math.min(1, p * 1.04));
        bar.style.transform = `scaleX(${p})`;
        const fb = innerWidth < 900 ? .5 : .38, focus = innerWidth * (fb + (.86 - fb) * Math.pow(p, 3));
        let best = 0, bd = 1e9;
        cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (r.left < innerWidth * .92) draw(c); const dd = Math.abs(r.left + r.width / 2 - focus); if (dd < bd) { bd = dd; best = i; } });
        if (best !== cur) { cur = best; cnt.textContent = String(best + 1).padStart(2, '0');
          cards.forEach((c, i) => { c.classList.toggle('on', i === best); c.classList.toggle('done', i < best); }); }
      } });
    ScrollTrigger.create({ trigger: jr, start: 'top 70%', once: true, onEnter: () => { cards.forEach((c) => { if (c.getBoundingClientRect().left < innerWidth * .92) draw(c); }); if (cur < 0) { cur = 0; cards[0].classList.add('on'); } } });
  }

  /* ---------- process story: one real clip per department ---------- */
  const pr = document.querySelector('.pr');
  if (pr) {
    const vids = [...pr.querySelectorAll('.pr-vid')], steps = [...pr.querySelectorAll('.pr-step')], dots = [...pr.querySelectorAll('.pr-rail li')];
    const bar = pr.querySelector('.pr-bar i'), n = steps.length;
    const load = (i) => { const v = vids[i]; if (v && !v.src) { v.src = v.dataset.src; v.preload = 'auto'; } };
    let cur = -1;
    const show = (i, quiet) => {
      if (i === cur) return; cur = i;
      if (!quiet) { vids.forEach((v, k) => { if (v.src && k !== i && k !== i + 1 && v.readyState < 3) { v.removeAttribute('src'); v.load(); } }); load(i); load(i + 1); }
      vids.forEach((v, k) => { const on = k === i; v.classList.toggle('on', on); if (on && v.src) { const pp = v.play(); if (pp) pp.catch(() => {}); } else if (!v.paused) setTimeout(() => { if (!v.classList.contains('on')) v.pause(); }, 1000); });
      steps.forEach((s, k) => s.classList.toggle('on', k === i));
      dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('done', k < i); });
    };
    const st = ScrollTrigger.create({ trigger: pr, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; show(Math.min(n - 1, Math.floor(s.progress * n))); },
      onToggle: (s) => { if (!s.isActive) vids.forEach((v) => v.pause()); else if (cur >= 0) { const pp = vids[cur].play(); if (pp) pp.catch(() => {}); } } });
    ScrollTrigger.create({ trigger: pr, start: 'top 150%', once: true, onEnter: () => { load(0); load(1); const pp = vids[0].play(); if (pp) pp.catch(() => {}); } });
    show(0, true);
    dots.forEach((d, k) => d.addEventListener('click', () => {
      const y = st.start + (st.end - st.start) * ((k + .5) / n);
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' });
    }));
  }

  /* ---------- background gears turn with scroll ---------- */
  if (!matchMedia('(max-width: 760px)').matches) document.querySelectorAll('.gear-bg').forEach((g) => gsap.to(g, { rotate: '+=120', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 } }));

  /* ---------- magnetic primary buttons ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.btn-lg').forEach((b) => {
      const qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .18); qy((e.clientY - r.top - r.height / 2) * .25); });
      b.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  /* ---------- pause marquees when off-screen ---------- */
  document.querySelectorAll('.marq').forEach((m) => new IntersectionObserver(([en]) => m.classList.toggle('off', !en.isIntersecting)).observe(m));

  /* ---------- mobile extras ---------- */
  const isPhone = matchMedia('(max-width: 760px)').matches;
  if (isPhone) {
    // bottom contact bar appears after the hero
    const mbar = document.querySelector('.mbar');
    if (mbar) ScrollTrigger.create({ start: () => innerHeight * .6, end: 'max', onToggle: (s) => mbar.classList.toggle('show', s.isActive) });
    // swipe deck: highlight the card in view
    document.querySelectorAll('.svc-grid.swipe').forEach((deck) => {
      const cards = [...deck.children];
      const mark = () => { const x = deck.scrollLeft + 20; let best = 0; cards.forEach((c, i) => { if (c.offsetLeft - deck.offsetLeft <= x) best = i; }); cards.forEach((c, i) => c.classList.toggle('on', i === best)); };
      deck.addEventListener('scroll', mark, { passive: true }); mark();
    });
    // deal steps: rail fills as you scroll
    document.querySelectorAll('.steps').forEach((st) => {
      st.insertAdjacentHTML('afterbegin', '<span class="steps-rail" aria-hidden="true"><i></i></span>');
      gsap.to(st.querySelector('.steps-rail i'), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: st, start: 'top 75%', end: 'bottom 60%', scrub: true } });
    });
    // footer accordion
    document.querySelectorAll('.ftr-top > div:not(.ftr-brand) h4').forEach((h) => {
      h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.setAttribute('aria-expanded', 'false');
      const t = () => { const o = h.parentElement.classList.toggle('open'); h.setAttribute('aria-expanded', o); setTimeout(() => ScrollTrigger.refresh(), 450); };
      h.addEventListener('click', t); h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
    const reach = [...document.querySelectorAll('.ftr-top > div:not(.ftr-brand)')].pop(); if (reach) { reach.classList.add('open'); reach.querySelector('h4').setAttribute('aria-expanded', 'true'); }
  }

  /* ---------- page transitions ---------- */
  const pt = document.createElement('div'); pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true');
  pt.innerHTML = '<div class="pt-in"><img src="' + document.querySelector('.brand img').getAttribute('src') + '" alt=""></div>';
  document.body.appendChild(pt);
  if (html.classList.contains('pt-in')) {
    try { sessionStorage.removeItem('pt'); } catch (e) {}
    gsap.set(pt, { yPercent: 0 }); html.classList.remove('pt-in');
    gsap.to(pt, { yPercent: -100, duration: .9, ease: 'expo.inOut', delay: .05 });
  } else gsap.set(pt, { yPercent: 100 });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash) || !/(\.html|\/)$/.test(u.pathname)) return;
    e.preventDefault();
    try { sessionStorage.setItem('pt', '1'); } catch (er) {}
    gsap.fromTo(pt, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'expo.inOut', onComplete: () => { location.href = u.href; } });
  });
  addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(pt, { yPercent: 100 }); });

  /* ---------- 3D tilt on cards ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.svc-card, .tm, .val, .svc-row').forEach((c) => {
      c.classList.add('tilt');
      const rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3' });
      gsap.set(c, { transformPerspective: 900 });
      c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * (c.classList.contains('svc-row') ? 3 : 9)); rx((.5 - py) * (c.classList.contains('svc-row') ? 3 : 9));
        c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%'); });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
