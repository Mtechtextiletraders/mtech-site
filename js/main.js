/* M Tech Textile Traders — header, menu, form, scroll reveals, hero video, stock teaser.
   No scroll-jacking: the page always scrolls natively. */
(() => {
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- header ---------- */
  const hdr = document.getElementById('hdr');
  const hero = document.querySelector('.hero');
  const sheet = document.getElementById('sheet'), burger = document.getElementById('burger');
  const onScroll = () => {
    if (hero) hdr.classList.toggle('top', window.scrollY < 40 && !sheet.classList.contains('open'));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- mobile menu ---------- */
  const setMenu = (o) => {
    sheet.classList.toggle('open', o); sheet.setAttribute('aria-hidden', !o);
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    document.body.style.overflow = o ? 'hidden' : '';
    onScroll();
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

  /* ---------- scroll reveals: fade + 24px rise, once, staggered ---------- */
  const rv = [...document.querySelectorAll('.rv')];
  if (rv.length && !reduce && 'IntersectionObserver' in window) {
    const groups = new Map();
    rv.forEach((el) => { const p = el.parentElement; const i = groups.get(p) || 0; groups.set(p, i + 1); el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms'; });
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    // anything already on screen stays visible; only content below the fold animates
    rv.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) io.observe(el); else el.classList.add('in'); });
    html.classList.add('rv-on');
  }

  /* ---------- home hero background video ---------- */
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
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? play() : vid.pause(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { document.hidden ? vid.pause() : play(); });
    const whenLoaded = (fn) => document.readyState === 'complete' ? fn() : addEventListener('load', fn, { once: true });
    whenLoaded(() => {
      if (html.classList.contains('intro')) addEventListener('mt:introdone', () => setTimeout(start, 150), { once: true });
      else setTimeout(start, 200);
    });
  }

  /* ---------- home: real stock folders in the teaser ---------- */
  const tl = document.getElementById('stockTeaser');
  if (tl && 'fetch' in window) {
    fetch('/api/folders', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (!Array.isArray(list) || !list.length) return;
        const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        tl.innerHTML = list.slice(0, 6).map((f) => `<li><a href="/stock/${encodeURIComponent(f.slug)}">${esc(f.name)} <small>${f.count} ${f.count === 1 ? 'item' : 'items'}</small></a></li>`).join('');
        tl.hidden = false;
      })
      .catch(() => {});
  }
})();
