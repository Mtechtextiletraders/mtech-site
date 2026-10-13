/* M Tech Textile Traders: website chat ("Sufian Assistant") */
(() => {
  const RASHEED = { wa: '923004681423', tel: '+923004681423', show: '0300-4681423' };
  const MTECH = { wa: '923324681423', tel: '+923324681423', show: '0332-4681423' };
  const KEY = 'mt_chat_v1';
  const WELCOME = 'Assalam o Alaikum! Main Sufian Assistant hoon, M Tech Textile Traders ki taraf se. Machinery, spare parts, yarn, cotton ya mill ke baare mein poochiye.\n\nHello! I am Sufian Assistant from M Tech Textile Traders. Ask me about machinery, spare parts, yarn, cotton or mills.';
  const CHIPS = [
    ['Machinery chahiye', 'Mujhe machinery chahiye'],
    ['Machine bechni hai', 'Mujhe apni machine bechni hai'],
    ['Spare parts', 'Spare parts ke baare mein batayein'],
    ['Yarn / Cotton', 'Yarn aur cotton ke baare mein batayein'],
    ['Visit / Contact', 'Office ya godown visit karna hai, kaise raabta karun?'],
  ];
  const I = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-4.6 3.5A.9.9 0 0 1 3 20.8V6a2 2 0 0 1 1-2Zm3 6.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4Z"/></svg>',
    ph: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
  };

  // ---------- state (per tab; storage may be unavailable) ----------
  let msgs = [];
  try { msgs = JSON.parse(sessionStorage.getItem(KEY) || '[]'); if (!Array.isArray(msgs)) msgs = []; } catch (e) { msgs = []; }
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30))); } catch (e) {} };

  // ---------- language: decides which number the WhatsApp button uses ----------
  const ROMAN = /\b(hai|hain|hy|kya|kia|ka|ki|ke|ko|se|mein|mujhe|mjhe|aap|ap|chahiye|chaiye|chahye|krna|karna|krni|karni|kitna|kitne|kahan|kaise|kaisay|kab|nahi|nhi|batayein|bataen|btao|bhai|sahab|sb|janab|machine\s+chahiye|ji)\b/i;
  const lang = () => {
    const u = msgs.filter((m) => m.role === 'user').map((m) => m.content).join(' ');
    if (!u) return 'ur';
    if (/[؀-ۿ]/.test(u)) return 'ur';
    return ROMAN.test(u) ? 'ur' : 'en';
  };

  // ---------- DOM ----------
  const root = document.createElement('div');
  root.className = 'mtc';
  root.innerHTML = `
    <button class="mtc-btn" type="button" aria-expanded="false" aria-controls="mtcPanel" aria-label="Chat with Sufian Assistant">
      <span class="mtc-ico mtc-ico-open">${I.chat}</span><span class="mtc-ico mtc-ico-close">${I.x}</span>
      <span class="mtc-tip">Sawal poochiye</span>
    </button>
    <section class="mtc-panel" id="mtcPanel" role="dialog" aria-label="Sufian Assistant chat" aria-hidden="true">
      <header class="mtc-hd">
        <img src="/assets/img/icon-192.png" alt="" width="40" height="40">
        <div class="mtc-hd-t"><b>Sufian Assistant</b><small><i></i>M Tech Textile Traders</small></div>
        <button class="mtc-x" type="button" aria-label="Close chat">${I.x}</button>
      </header>
      <div class="mtc-log" data-lenis-prevent aria-live="polite"></div>
      <div class="mtc-cta">
        <a class="mtc-wa" target="_blank" rel="noopener">${I.wa}<span></span></a>
        <a class="mtc-call">${I.ph}<span></span></a>
      </div>
      <form class="mtc-form" autocomplete="off">
        <textarea rows="1" maxlength="600" placeholder="Sawal likhein / Type here" aria-label="Your message"></textarea>
        <button type="submit" aria-label="Send">${I.send}</button>
      </form>
      <p class="mtc-note">Automatic jawab hain, pakki baat ke liye Rasheed Sb se raabta karein.</p>
    </section>`;
  document.body.appendChild(root);

  const btn = root.querySelector('.mtc-btn'), panel = root.querySelector('.mtc-panel');
  const log = root.querySelector('.mtc-log'), form = root.querySelector('.mtc-form');
  const ta = form.querySelector('textarea'), sendBtn = form.querySelector('button');
  const waA = root.querySelector('.mtc-wa'), callA = root.querySelector('.mtc-call');
  let busy = false;

  const bubble = (role, text, extra = '') => {
    const d = document.createElement('div');
    d.className = `mtc-m mtc-${role}${extra ? ' ' + extra : ''}`;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  };

  const updateCta = () => {
    const en = lang() === 'en';
    const who = en ? MTECH : RASHEED;
    const users = msgs.filter((m) => m.role === 'user').map((m) => m.content).slice(-4);
    const need = users.length ? users.join('\n') : '';
    const text = en
      ? `Assalam o Alaikum, I am contacting M Tech from the website.${need ? '\n\nMy requirement:\n' + need : ''}`
      : `Assalam o Alaikum Rasheed Sb, main M Tech ki website se raabta kar raha hoon.${need ? '\n\nMeri requirement:\n' + need : ''}`;
    waA.href = `https://wa.me/${who.wa}?text=${encodeURIComponent(text)}`;
    waA.querySelector('span').textContent = en ? 'WhatsApp M Tech' : 'Rasheed Sb ko WhatsApp';
    waA.title = en ? 'Send your requirement to M Tech on WhatsApp' : 'Apni requirement Rasheed Sb ko WhatsApp pe bhejein';
    callA.href = `tel:${who.tel}`;
    callA.querySelector('span').textContent = who.show;
    root.classList.toggle('has-talk', users.length > 0);
  };

  const chips = () => {
    const w = document.createElement('div');
    w.className = 'mtc-chips';
    CHIPS.forEach(([label, q]) => {
      const c = document.createElement('button');
      c.type = 'button'; c.textContent = label;
      c.addEventListener('click', () => { w.remove(); send(q); });
      w.appendChild(c);
    });
    log.appendChild(w);
  };

  const render = () => {
    log.innerHTML = '';
    bubble('bot', WELCOME);
    msgs.forEach((m) => bubble(m.role === 'user' ? 'me' : 'bot', m.content));
    if (!msgs.length) chips();
    updateCta();
  };

  const setOpen = (o) => {
    root.classList.toggle('open', o);
    btn.setAttribute('aria-expanded', o);
    panel.setAttribute('aria-hidden', !o);
    if (o) { if (!log.childElementCount) render(); setTimeout(() => { log.scrollTop = log.scrollHeight; if (matchMedia('(min-width: 761px)').matches) ta.focus(); }, 60); }
    document.documentElement.classList.toggle('mtc-lock', o && matchMedia('(max-width: 760px)').matches);
    if (window.__lenis) o && matchMedia('(max-width: 760px)').matches ? window.__lenis.stop() : window.__lenis.start();
  };
  btn.addEventListener('click', () => setOpen(!root.classList.contains('open')));
  root.querySelector('.mtc-x').addEventListener('click', () => setOpen(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open')) setOpen(false); });

  async function send(text) {
    text = String(text || '').trim().slice(0, 600);
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true;
    root.querySelector('.mtc-chips')?.remove();
    msgs.push({ role: 'user', content: text }); save();
    bubble('me', text); updateCta();
    const typing = bubble('bot', '', 'mtc-typing');
    typing.innerHTML = '<i></i><i></i><i></i>';
    let reply = '', fail = false;
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: msgs.slice(-12) }), signal: ctl.signal });
      clearTimeout(to);
      const d = await r.json().catch(() => ({}));
      if (d && d.reply) reply = d.reply; else fail = true;
    } catch (e) { fail = true; }
    typing.remove();
    if (fail) {
      const en = lang() === 'en';
      bubble('bot', en
        ? 'Sorry, I cannot answer right now. Please send your requirement on WhatsApp with the button below, or call M Tech on 0332-4681423.'
        : 'Maazrat, is waqt jawab nahi de pa raha. Neeche diye gaye WhatsApp button se apni requirement Rasheed Sb ko bhej dein, ya 0300-4681423 pe call kar lein.', 'mtc-warn');
      root.classList.add('has-talk');
    } else {
      msgs.push({ role: 'assistant', content: reply }); save();
      bubble('bot', reply);
    }
    updateCta();
    busy = false; sendBtn.disabled = false;
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = ta.value; ta.value = ''; ta.style.height = ''; send(v); });
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; });

  // short hint bubble once per visit
  try {
    if (!sessionStorage.getItem('mt_chat_tip')) {
      setTimeout(() => { if (!root.classList.contains('open')) root.classList.add('tip'); }, 6000);
      setTimeout(() => root.classList.remove('tip'), 14000);
      sessionStorage.setItem('mt_chat_tip', '1');
    }
  } catch (e) {}
})();
