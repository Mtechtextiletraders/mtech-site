/* M Tech Textile Traders — interactions */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

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

  if (!hasGSAP || reduce) {
    document.querySelectorAll('.tl li').forEach((l) => l.classList.add('in'));
    document.querySelectorAll('.node').forEach((n) => n.classList.add('on'));
    return;
  }

  html.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);

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

  /* ---------- spinning line: thread draws, departments light up ---------- */
  const line = document.querySelector('.line-sec');
  if (line) {
    const path = document.getElementById('threadPath');
    const nodes = [...line.querySelectorAll('.node')];
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const wide = matchMedia('(min-width:1101px)').matches;
    gsap.timeline({ scrollTrigger: { trigger: line.querySelector('.line-track'), start: 'top 80%', end: 'bottom 45%', scrub: 1,
      onUpdate: (s) => nodes.forEach((n, i) => n.classList.toggle('on', s.progress >= (i + .5) / nodes.length)) } })
      .to(path, { strokeDashoffset: 0, ease: 'none' });
    gsap.from(nodes, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: line.querySelector('.line-nodes'), start: 'top 90%' } });
    if (!wide) ScrollTrigger.create({ trigger: line, start: 'top 60%', once: true, onEnter: () => nodes.forEach((n, i) => setTimeout(() => n.classList.add('on'), i * 180)) });
  }

  /* ---------- background gears turn with scroll ---------- */
  document.querySelectorAll('.gear-bg').forEach((g) => gsap.to(g, { rotate: '+=120', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 } }));

  /* ---------- magnetic primary buttons ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.btn-lg').forEach((b) => {
      const qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .18); qy((e.clientY - r.top - r.height / 2) * .25); });
      b.addEventListener('pointerleave', () => { qx(0); qy(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
