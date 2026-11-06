/* M Tech Textile Traders: Buy & Sell pages (For Sale / Required), passwords, status pictures, PDF stock list */
(() => {
  const SITE = 'https://mtechtextiletraders.com';
  const MTECH = {
    name: 'M Tech Textile Traders',
    office: 'Office: Main Bazar Rasheed Town, Near Post Office, Manga Mandi, Lahore',
    godown: 'Godown: Darul Ehsan Town, Faisalabad',
    phone: 'Call / WhatsApp: 0332-4681423',
    web: 'info@mtechtextiletraders.com  ·  mtechtextiletraders.com',
  };
  const CEO = {
    name: 'Abdul Rasheed Gill',
    role: 'Founder & CEO',
    contact: '0300-4681423 (WhatsApp / Call)',
    email: 'chabdulrasheedgill@gmail.com',
  };
  const WA = '923324681423';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = (k) => `/img/${k}`;
  const getJSON = async (u) => {
    const r = await fetch(u, { headers: { accept: 'application/json' }, credentials: 'same-origin' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Could not load');
    return d;
  };
  const titleOf = (f, e) => (f.fields[0] && e.data[f.fields[0].id]) || 'Item';
  const detailsOf = (f, e, skipFirst = true) => f.fields.slice(skipFirst ? 1 : 0).filter((x) => e.data[x.id]).map((x) => ({ label: x.label, value: e.data[x.id], long: x.long }));
  const fieldVal = (f, e, label) => { const x = f.fields.find((y) => y.label.toLowerCase() === label); return x ? e.data[x.id] || '' : ''; };
  const errBox = (el, msg) => { el.innerHTML = `<div class="stk-empty"><p>${esc(msg)}</p><a class="btn btn-ghost" href="/stock"><span>Back to Buy &amp; Sell</span></a></div>`; };
  const ICON_IMG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm0 10 4.5-4.5a1.5 1.5 0 0 1 2 0L16 17m-2-2 1.5-1.5a1.5 1.5 0 0 1 2 0L20 16M15 8.5h.01"/></svg>';
  const ICON_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></svg>';
  const ICON_GO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4Z"/></svg>';
  const itemHref = (f, e) => `/stock/${encodeURIComponent(f.slug)}/${e.id}`;

  /* password box: k = "f" (a lot) or "e" (one item) */
  function lockBox(el, k, id, what) {
    el.innerHTML = `<form class="stk-lock" novalidate>
      <span class="stk-lock-i">${ICON_LOCK}</span>
      <h2 class="h3">This ${what} is password protected</h2>
      <p>Enter the password you received from M Tech. Don't have it? Ask on WhatsApp: 0332-4681423.</p>
      <label for="stkPw">Password</label>
      <div class="stk-lock-row"><input id="stkPw" type="password" autocomplete="off" required><button class="btn btn-pri" type="submit"><span>Open</span></button></div>
      <p class="stk-lock-err" role="alert" hidden></p>
    </form>`;
    const form = $('form', el), inp = $('#stkPw', el), errEl = $('.stk-lock-err', el), btn = $('button', form);
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!inp.value.trim()) { inp.focus(); return; }
      btn.disabled = true; errEl.hidden = true;
      try {
        const r = await fetch('/api/unlock', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ k, id, password: inp.value }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || 'Wrong password.');
        location.reload();
      } catch (e) { errEl.textContent = e.message; errEl.hidden = false; btn.disabled = false; inp.select(); }
    });
  }

  /* card for one machine (For Sale) */
  function machineCard(f, e, i) {
    const t = titleOf(f, e), href = itemHref(f, e);
    const type = fieldVal(f, e, 'type');
    if (e.locked) {
      return `<article class="stk-item is-locked">
        <a class="stk-item-img" href="${href}" aria-label="${esc(t)}, password protected"><span class="stk-folder-ph">${ICON_LOCK}<small>Password protected</small></span></a>
        <div class="stk-item-b"><h3 class="stk-item-t"><a href="${href}">${esc(t)}</a></h3><a class="stk-go" href="${href}">Enter password ${ICON_GO}</a></div>
      </article>`;
    }
    const d = detailsOf(f, e).filter((x) => !x.long && x.label.toLowerCase() !== 'type').slice(0, 4);
    return `<article class="stk-item">
      <a class="stk-item-img" href="${href}" aria-label="Pictures of ${esc(t)}">
        ${e.photos.length ? `<img src="${img(e.photos[0])}" alt="${esc(t)}" loading="${i < 3 ? 'eager' : 'lazy'}">` : `<span class="stk-folder-ph">${ICON_IMG}<small>Pictures on demand</small></span>`}
        ${type ? `<span class="stk-type">${esc(type)}</span>` : ''}
        ${e.photos.length > 1 ? `<span class="stk-count">${ICON_IMG}${e.photos.length}</span>` : ''}
      </a>
      <div class="stk-item-b">
        <h3 class="stk-item-t"><a href="${href}">${esc(t)}</a></h3>
        ${d.length ? `<dl class="stk-mini">${d.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>` : ''}
        <a class="stk-go" href="${href}">${e.photos.length ? `View ${e.photos.length === 1 ? 'picture' : `all ${e.photos.length} pictures`}` : 'View details'} ${ICON_GO}</a>
      </div>
    </article>`;
  }

  /* card for one required machine */
  function requiredCard(f, e) {
    const t = titleOf(f, e);
    const d = detailsOf(f, e);
    const msg = `Assalam o Alaikum M Tech, I have this machine you are looking for:\n\n${t}\n${d.filter((x) => !x.long).map((x) => `${x.label}: ${x.value}`).join('\n')}\n\nPictures and details:`;
    return `<article class="stk-req">
      <span class="stk-req-tag">Required</span>
      <h3 class="stk-item-t">${esc(t)}</h3>
      ${d.length ? `<dl class="stk-mini">${d.filter((x) => !x.long).map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>` : ''}
      ${d.filter((x) => x.long).map((x) => `<p class="stk-desc">${esc(x.value)}</p>`).join('')}
      <a class="btn btn-wa" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ICON_WA}<span>I have this machine</span></a>
    </article>`;
  }

  /* ---------------------------------------------------------------- Buy & Sell index */
  const foldersEl = $('#stkFolders');
  if (foldersEl) {
    // tabs
    const tabs = [$('#tabSale'), $('#tabReq')], panels = [$('#pSale'), $('#pReq')];
    const pick = (i, focus) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
      if (focus) tabs[i].focus();
      history.replaceState(null, '', i ? '#required' : location.pathname);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(i));
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(i ? 0 : 1, true); } });
    });
    if (location.hash === '#required') pick(1);

    const machinesEl = $('#stkMachines'), reqEl = $('#stkRequired');
    getJSON('/api/folders').then(async (list) => {
      const lots = list.filter((f) => f.kind === 'lot');
      const mFolders = list.filter((f) => f.kind === 'machines');
      const rFolders = list.filter((f) => f.kind === 'required');
      const load = (fs) => Promise.all(fs.map((f) => getJSON(`/api/folders/${encodeURIComponent(f.slug)}`).catch(() => null))).then((r) => r.filter(Boolean));

      // single machines
      const mData = await load(mFolders);
      const mCards = mData.flatMap(({ folder, entries }) => entries.map((e) => [folder, e]));
      if (mCards.length) {
        machinesEl.innerHTML = mCards.map(([f, e], i) => machineCard(f, e, i)).join('');
        machinesEl.hidden = false; $('#hMachines').hidden = false;
      }

      // lots
      if (!lots.length) {
        $('#hLots').hidden = !!mCards.length;
        foldersEl.innerHTML = mCards.length ? '' : '<div class="stk-empty"><p>Stock lists are being updated. Call or WhatsApp us on 0332-4681423 for what is available today.</p></div>';
      } else {
        foldersEl.innerHTML = lots.map((f, i) => `
        <a class="stk-folder${f.locked ? ' is-locked' : ''}" href="/stock/${encodeURIComponent(f.slug)}">
          <div class="stk-folder-img">${f.locked ? `<span class="stk-folder-ph">${ICON_LOCK}<small>Password protected</small></span>` : f.cover ? `<img src="${img(f.cover)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}">` : `<span class="stk-folder-ph">${ICON_IMG}</span>`}</div>
          <div class="stk-folder-b">
            <span class="stk-num">LOT ${String(i + 1).padStart(2, '0')}</span>
            <h3 class="h3">${esc(f.name)}</h3>
            <p>${f.count} ${f.count === 1 ? 'item' : 'items'}${f.protected ? ' · password protected' : ''}</p>
            <span class="stk-go">${f.locked ? 'Enter password' : 'Open lot'} ${ICON_GO}</span>
          </div>
        </a>`).join('');
      }

      // required
      const rData = await load(rFolders);
      const rCards = rData.flatMap(({ folder, entries }) => entries.map((e) => requiredCard(folder, e)));
      reqEl.innerHTML = rCards.length ? rCards.join('') : '<div class="stk-empty"><p>Nothing on the list right now. Have a machine to sell? Send us its details on WhatsApp: 0332-4681423.</p></div>';
      $('#tabReq').textContent = rCards.length ? `Required · ${rCards.length}` : 'Required';
      $('#tabSale').textContent = `For Sale · ${mCards.length + lots.length}`;
    }).catch(() => {
      foldersEl.innerHTML = '<div class="stk-empty"><p>The list could not load right now. Please call or WhatsApp 0332-4681423.</p></div>';
      reqEl.innerHTML = '';
    });
  }

  /* ---------------------------------------------------------------- folder page (a lot, or all machines / all required) */
  const itemsEl = $('#stkItems');
  if (itemsEl) {
    const slug = decodeURIComponent((location.pathname.match(/^\/stock\/([^/]+)/) || [])[1] || '');
    getJSON(`/api/folders/${encodeURIComponent(slug)}`).then(({ folder, entries, count }) => {
      const btn = $('#stkPdf');
      $('#stkTitle').textContent = folder.name;
      $('#stkCrumb').textContent = folder.name;
      if (folder.kind !== 'lot') btn.hidden = true;
      if (folder.locked) {
        $('#stkLead').textContent = `${count} ${count === 1 ? 'item' : 'items'}. This lot is password protected.`;
        btn.hidden = true;
        lockBox(itemsEl, 'f', folder.id, 'lot');
        itemsEl.classList.add('is-lock');
        return;
      }
      $('#stkLead').textContent = entries.length
        ? `${entries.length} ${entries.length === 1 ? 'item' : 'items'}. Open any item to see all its pictures${folder.kind === 'lot' ? ', or download the full list as a PDF' : ''}.`
        : 'This folder is empty right now.';
      if (!entries.length) { itemsEl.innerHTML = '<div class="stk-empty"><p>Nothing listed in this folder at the moment.</p></div>'; return; }
      if (folder.kind === 'required') { itemsEl.innerHTML = entries.map((e) => requiredCard(folder, e)).join(''); return; }
      if (folder.kind === 'machines') { itemsEl.innerHTML = entries.map((e, i) => machineCard(folder, e, i)).join(''); return; }
      itemsEl.innerHTML = entries.map((e) => {
        const d = detailsOf(folder, e);
        const short = d.filter((x) => !x.long), long = d.filter((x) => x.long);
        const href = itemHref(folder, e);
        return `<article class="stk-item">
          <a class="stk-item-img" href="${href}" aria-label="Pictures of ${esc(titleOf(folder, e))}">
            ${e.photos.length ? `<img src="${img(e.photos[0])}" alt="${esc(titleOf(folder, e))}" loading="lazy">` : `<span class="stk-folder-ph">${ICON_IMG}<small>Pictures on demand</small></span>`}
            ${e.photos.length > 1 ? `<span class="stk-count">${ICON_IMG}${e.photos.length}</span>` : ''}
          </a>
          <div class="stk-item-b">
            <h2 class="stk-item-t"><a href="${href}">${esc(titleOf(folder, e))}</a></h2>
            ${short.length ? `<dl class="stk-mini">${short.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>` : ''}
            ${long.map((x) => `<p class="stk-desc">${esc(x.value)}</p>`).join('')}
            <a class="stk-go" href="${href}">${e.photos.length ? `View ${e.photos.length === 1 ? 'picture' : `all ${e.photos.length} pictures`}` : 'View details'} ${ICON_GO}</a>
          </div>
        </article>`;
      }).join('');
      btn.disabled = false;
      btn.addEventListener('click', () => makePdf(folder, entries, btn));
    }).catch((e) => {
      $('#stkTitle').textContent = 'Not found';
      errBox(itemsEl, e.message === 'Folder not found.' ? 'This folder no longer exists.' : 'The list could not load right now. Please try again.');
    });
  }

  /* ---------------------------------------------------------------- machine page */
  const galEl = $('#stkGallery');
  if (galEl) {
    const id = (location.pathname.match(/^\/stock\/[^/]+\/([a-z0-9]+)/) || [])[1] || '';
    getJSON(`/api/entries/${id}`).then(({ entry, folder, lock }) => {
      const fHref = `/stock/${encodeURIComponent(folder.slug)}`;
      const label = folder.kind === 'machines' ? 'For Sale' : folder.kind === 'required' ? 'Required' : folder.name;
      $('#stkEyebrow').textContent = label;
      const fl = $('#stkFolderLink'); fl.textContent = folder.name; fl.href = fHref;
      $('#stkBack').href = folder.kind === 'machines' ? '/stock' : fHref;
      $('#stkBack span').textContent = folder.kind === 'machines' ? 'Back to Buy & Sell' : 'Back to lot';
      if (entry.locked) {
        const t = lock === 'e' ? titleOf(folder, entry) : 'Protected item';
        $('#stkTitle').textContent = t; $('#stkCrumb').textContent = t;
        $('#stkLead').textContent = 'Password protected.';
        $('#stkInfo').hidden = true;
        $('#stkDetail').classList.add('is-lock');
        lockBox(galEl, lock, lock === 'e' ? entry.id : folder.id, lock === 'e' ? 'machine' : 'lot');
        return;
      }
      const t = titleOf(folder, entry);
      $('#stkTitle').textContent = t;
      $('#stkCrumb').textContent = t;
      const d = detailsOf(folder, entry);
      const ph = entry.photos;
      $('#stkLead').textContent = ph.length ? `${ph.length} ${ph.length === 1 ? 'picture' : 'pictures'}` : 'Pictures available on request.';
      $('#stkDl').innerHTML = d.map((x) => `<div class="${x.long ? 'long' : ''}"><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('') || '';
      const link = SITE + location.pathname;
      const lines = [`Assalam o Alaikum M Tech, I am interested in this item (${label}):`, '', t, ...d.filter((x) => !x.long).map((x) => `${x.label}: ${x.value}`), '', link];
      $('#stkAsk').href = `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;

      // copy details: all the details as text, with the link
      const copyBtn = $('#stkCopy');
      copyBtn.hidden = false;
      copyBtn.addEventListener('click', async () => {
        const txt = [`*${t}*`, folder.kind === 'lot' ? `${folder.name} (lot)` : label, '', ...d.map((x) => x.long ? `${x.label}:\n${x.value}` : `${x.label}: ${x.value}`), '', `Pictures: ${link}`, '', 'M Tech Textile Traders', 'Call / WhatsApp: 0332-4681423'].join('\n').replace(/\n{3,}/g, '\n\n');
        const span = $('span', copyBtn), old = span.textContent;
        try { await navigator.clipboard.writeText(txt); }
        catch (e) { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
        span.textContent = 'Copied'; setTimeout(() => { span.textContent = old; }, 1800);
      });

      if (!ph.length) { galEl.innerHTML = `<div class="stk-noimg">${ICON_IMG}<p>Pictures are available on demand.</p></div>`; return; }

      // WhatsApp status picture: the prepared one if there is one, otherwise drawn here
      const stBtn = $('#stkStatus');
      stBtn.hidden = false;
      stBtn.addEventListener('click', () => withBusy(stBtn, 'Preparing…', async () => {
        const name = fileName(t);
        if (entry.status_photo) return saveBlob(await (await fetch(img(entry.status_photo))).blob(), `${name}-status.jpg`);
        saveBlob(await drawStatus(t, label, d, ph), `${name}-status.jpg`);
      }));
      // all pictures in one zip
      const allBtn = $('#stkAll');
      if (ph.length > 1) {
        allBtn.hidden = false;
        $('span', allBtn).textContent = `Download all ${ph.length} pictures`;
        allBtn.addEventListener('click', () => withBusy(allBtn, 'Preparing…', async () => {
          await loadScript('/js/vendor/jszip.min.js');
          const zip = new window.JSZip(), name = fileName(t);
          await Promise.all(ph.map(async (k, i) => zip.file(`${name}-${String(i + 1).padStart(2, '0')}.${k.split('.').pop()}`, await (await fetch(img(k))).blob())));
          saveBlob(await zip.generateAsync({ type: 'blob' }), `${name}-pictures.zip`);
        }));
      }

      galEl.innerHTML = `<button class="stk-main" type="button" aria-label="Open picture full screen"><img src="${img(ph[0])}" alt="${esc(t)}"></button>
        ${ph.length > 1 ? `<div class="stk-thumbs">${ph.map((k, i) => `<button type="button" data-i="${i}" ${i === 0 ? 'aria-current="true"' : ''} aria-label="Picture ${i + 1}"><img src="${img(k)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}`;
      let cur = 0;
      const mainImg = $('.stk-main img', galEl);
      const show = (i) => {
        cur = (i + ph.length) % ph.length;
        mainImg.src = img(ph[cur]);
        galEl.querySelectorAll('.stk-thumbs button').forEach((b) => b.toggleAttribute('aria-current', +b.dataset.i === cur));
      };
      galEl.querySelectorAll('.stk-thumbs button').forEach((b) => b.addEventListener('click', () => show(+b.dataset.i)));
      // lightbox
      const lb = $('#stkLb'), lbImg = $('img', lb);
      const open = () => { lbImg.src = img(ph[cur]); lb.hidden = false; document.body.style.overflow = 'hidden'; if (window.__lenis) window.__lenis.stop(); };
      const close = () => { lb.hidden = true; document.body.style.overflow = ''; if (window.__lenis) window.__lenis.start(); };
      const step = (n) => { show(cur + n); lbImg.src = img(ph[cur]); };
      $('.stk-main', galEl).addEventListener('click', open);
      $('.stk-lb-x', lb).addEventListener('click', close);
      $('.stk-lb-p', lb).addEventListener('click', () => step(-1));
      $('.stk-lb-n', lb).addEventListener('click', () => step(1));
      lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
      if (ph.length < 2) lb.classList.add('single');
      addEventListener('keydown', (e) => {
        if (lb.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      });
      let sx = null;
      lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); sx = null; });
    }).catch(() => {
      $('#stkTitle').textContent = 'Not found';
      errBox(galEl, 'This item is no longer listed.');
    });
  }

  /* ---------------------------------------------------------------- downloads */
  const fileName = (t) => ('M-Tech-' + t).replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  function saveBlob(blob, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  async function withBusy(btn, txt, fn) {
    const span = $('span', btn), old = span.textContent;
    btn.disabled = true; span.textContent = txt;
    try { await fn(); } catch (e) { alert('This could not be downloaded right now. Please try again.'); }
    btn.disabled = false; span.textContent = old;
  }
  const loadImg = (src) => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
  // 1080x1920 status picture in the M Tech style (used when no ready-made one was uploaded)
  async function drawStatus(title, label, details, photos) {
    try {
      const f = new FontFace('Archivo', 'url(/assets/fonts/archivo-latin-800-normal.woff2)', { weight: '800' });
      document.fonts.add(await f.load());
    } catch (e) { /* falls back to Arial */ }
    await document.fonts.ready.catch(() => {});
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
    const x = c.getContext('2d');
    x.fillStyle = '#07123A'; x.fillRect(0, 0, 1080, 1920);
    const logo = await loadImg('/assets/img/logo.png');
    const rr = (X, Y, W, H, R) => { x.beginPath(); x.moveTo(X + R, Y); x.arcTo(X + W, Y, X + W, Y + H, R); x.arcTo(X + W, Y + H, X, Y + H, R); x.arcTo(X, Y + H, X, Y, R); x.arcTo(X, Y, X + W, Y, R); x.closePath(); };
    x.fillStyle = '#fff'; rr(70, 50, 166, 98, 22); x.fill();
    x.drawImage(logo, 90, 66, 126, 126 * logo.height / logo.width);
    x.fillStyle = '#fff'; x.font = '800 44px Archivo, Arial, sans-serif'; x.fillText('M Tech Textile Traders', 262, 96);
    x.fillStyle = '#9FB2E8'; x.font = '500 26px Hanken, Arial, sans-serif'; x.fillText('Spinning machinery · Lahore · Faisalabad', 264, 136);
    // picture area, cover-fit
    const pic = await loadImg(img(photos[0]));
    const PX = 70, PY = 200, PW = 940, PH = 1100;
    x.save(); rr(PX, PY, PW, PH, 34); x.clip();
    const s = Math.max(PW / pic.naturalWidth, PH / pic.naturalHeight);
    x.drawImage(pic, PX + (PW - pic.naturalWidth * s) / 2, PY + (PH - pic.naturalHeight * s) / 2, pic.naturalWidth * s, pic.naturalHeight * s);
    x.restore();
    const chip = label === 'Required' ? 'REQUIRED' : 'FOR SALE';
    x.font = '800 34px Archivo, Arial, sans-serif';
    const cw = x.measureText(chip).width + 52;
    x.fillStyle = '#D04A00'; rr(PX + 30, PY + 30, cw, 64, 14); x.fill();
    x.fillStyle = '#fff'; x.fillText(chip, PX + 56, PY + 75);
    // text
    let y = 1400;
    const type = (details.find((d) => d.label.toLowerCase() === 'type') || {}).value;
    if (type) { x.fillStyle = '#FF8A3D'; x.font = '600 32px Hanken, Arial, sans-serif'; x.fillText(type.toUpperCase(), 70, y); y += 20; }
    let fs = 108; x.font = `800 ${fs}px Archivo, Arial, sans-serif`;
    while (x.measureText(title).width > 940 && fs > 56) { fs -= 4; x.font = `800 ${fs}px Archivo, Arial, sans-serif`; }
    x.fillStyle = '#fff'; x.fillText(title, 66, y + fs * 0.9); y += fs + 40;
    const specs = details.filter((d) => !d.long && d.label.toLowerCase() !== 'type').slice(0, 4).map((d) => (/^[\d.,\s]+$/.test(d.value) ? `${d.label}: ${d.value}` : d.value));
    x.font = '600 29px Hanken, Arial, sans-serif';
    let sx = 70;
    specs.forEach((t) => { const w = x.measureText(t).width + 44; if (sx + w > 1010) { sx = 70; y += 62; } x.fillStyle = 'rgba(255,255,255,.1)'; rr(sx, y, w, 50, 25); x.fill(); x.fillStyle = '#fff'; x.fillText(t, sx + 22, y + 35); sx += w + 12; });
    x.fillStyle = '#1FA855'; rr(70, 1722, 940, 118, 24); x.fill();
    x.fillStyle = '#fff'; x.font = '800 50px Archivo, Arial, sans-serif'; x.textAlign = 'center'; x.fillText('WhatsApp: 0300-4681423', 540, 1798);
    return new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.9));
  }

  /* ---------------------------------------------------------------- PDF */
  const loadScript = (src) => new Promise((ok, bad) => {
    if (document.querySelector(`script[src="${src}"]`)) return ok();
    const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = bad; document.head.appendChild(s);
  });
  const toDataURL = (src) => new Promise((ok, bad) => {
    const i = new Image();
    i.onload = () => { const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; c.getContext('2d').drawImage(i, 0, 0); ok({ data: c.toDataURL('image/png'), w: i.naturalWidth, h: i.naturalHeight }); };
    i.onerror = bad; i.src = src;
  });

  async function makePdf(folder, entries, btn) {
    const label = btn.querySelector('span'), old = label.textContent;
    btn.disabled = true; label.textContent = 'Preparing PDF…';
    try {
      await loadScript('/js/vendor/jspdf.umd.min.js');
      await loadScript('/js/vendor/jspdf.plugin.autotable.min.js');
      const logo = await toDataURL('/assets/img/logo.png');
      const { jsPDF } = window.jspdf;
      const cols = folder.fields;
      const doc = new jsPDF({ orientation: cols.length > 5 ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
      const M = 14, FOOT = 36;
      const BLUE = [0, 51, 248], NAVY = [7, 18, 58], MUTE = [85, 96, 126], LINE = [226, 231, 242], ORANGE = [208, 74, 0];
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      const watermark = () => {
        const ww = Math.min(W, H) * 0.78, wh = ww * logo.h / logo.w;
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.06 }));
        doc.addImage(logo.data, 'PNG', (W - ww) / 2, (H - wh) / 2 - 4, ww, wh, 'wm', 'FAST');
        doc.restoreGraphicsState();
      };
      const header = (first) => {
        const lw = 26, lh = lw * logo.h / logo.w;
        doc.addImage(logo.data, 'PNG', M, 10, lw, lh, 'lg', 'FAST');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...ORANGE);
        doc.text('M TECH STOCK LIST', M + lw + 6, 15, { charSpace: 0.6 });
        doc.setFontSize(first ? 20 : 14); doc.setTextColor(...NAVY);
        doc.text(folder.name, M + lw + 6, first ? 23.5 : 22);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...MUTE);
        doc.text(`Updated ${today}`, W - M, 15, { align: 'right' });
        doc.text(`${entries.length} ${entries.length === 1 ? 'item' : 'items'}`, W - M, 20, { align: 'right' });
        const vt = 'View on website  >';
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...BLUE);
        const vw = doc.getTextWidth(vt);
        doc.textWithLink(vt, W - M - vw, 25.5, { url: folderUrl });
        doc.setDrawColor(...BLUE); doc.setLineWidth(0.25); doc.line(W - M - vw, 26.3, W - M, 26.3);
        doc.setDrawColor(...BLUE); doc.setLineWidth(0.8); doc.line(M, 30, W - M, 30);
      };
      const footer = (n, total) => {
        const y = H - FOOT + 4;
        doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(M, y, W - M, y);
        const half = (W - 2 * M) / 2;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...NAVY);
        doc.text(MTECH.name, M, y + 6);
        doc.text(`${CEO.name}  ·  ${CEO.role}`, M + half + 6, y + 6);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.6); doc.setTextColor(...MUTE);
        const LH = 3.55;
        const link = (txt, x, yy, url) => { doc.setTextColor(...BLUE); doc.textWithLink(txt, x, yy, { url }); const w = doc.getTextWidth(txt); doc.setDrawColor(...BLUE); doc.setLineWidth(0.15); doc.line(x, yy + 0.6, x + w, yy + 0.6); doc.setTextColor(...MUTE); return w; };
        let yy = y + 10.5;
        doc.text(MTECH.office, M, yy); yy += LH;
        doc.text(MTECH.godown, M, yy); yy += LH;
        let x = M; doc.text('WhatsApp / Call: ', x, yy); x += doc.getTextWidth('WhatsApp / Call: ');
        link('0332-4681423', x, yy, 'https://wa.me/923324681423'); yy += LH;
        x = M; x += link('info@mtechtextiletraders.com', x, yy, 'mailto:info@mtechtextiletraders.com');
        doc.text('  ·  ', x, yy); x += doc.getTextWidth('  ·  ');
        link('mtechtextiletraders.com', x, yy, 'https://mtechtextiletraders.com');
        const cx = M + half + 6; let cy = y + 10.5;
        x = cx; doc.text('WhatsApp / Call: ', x, cy); x += doc.getTextWidth('WhatsApp / Call: ');
        link('0300-4681423', x, cy, 'https://wa.me/923004681423'); cy += LH;
        link(CEO.email, cx, cy, 'mailto:' + CEO.email);
        cy += LH; link('abdulrasheedgill.com', cx, cy, 'https://abdulrasheedgill.com');
        doc.setTextColor(...BLUE);
        doc.text(`Page ${n} of ${total}`, W - M, H - 6, { align: 'right' });
      };

      const head = [['S. No', ...cols.map((c) => c.label), 'Pictures']];
      const body = entries.map((e, i) => [String(i + 1), ...cols.map((c) => e.data[c.id] || ''), e.photos.length ? `View (${e.photos.length})` : '-']);
      const folderUrl = `${SITE}/stock/${encodeURIComponent(folder.slug)}`;
      const links = entries.map((e) => `${SITE}/stock/${encodeURIComponent(folder.slug)}/${e.id}`);
      const picCol = cols.length + 1;
      const colStyles = { 0: { cellWidth: 13, halign: 'center' } };
      cols.forEach((c, i) => { if (c.long) colStyles[i + 1] = { cellWidth: Math.min(70, (W - 2 * M) * 0.32) }; });
      colStyles[picCol] = { cellWidth: 22, halign: 'center', textColor: BLUE, fontStyle: 'bold' };

      doc.autoTable({
        head, body,
        startY: 36,
        margin: { top: 36, left: M, right: M, bottom: FOOT + 4 },
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.6, textColor: [11, 20, 48], lineColor: LINE, lineWidth: 0.2, valign: 'middle', overflow: 'linebreak' },
        headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 8.6, halign: 'left' },
        alternateRowStyles: { fillColor: [245, 247, 252] },
        columnStyles: colStyles,
        willDrawPage: (d) => { watermark(); header(d.pageNumber === 1); },
        didDrawCell: (d) => {
          if (d.section === 'body' && d.column.index === picCol && entries[d.row.index].photos.length) {
            doc.link(d.cell.x, d.cell.y, d.cell.width, d.cell.height, { url: links[d.row.index] });
            const tw = doc.getTextWidth(d.cell.text.join(' '));
            const cx = d.cell.x + d.cell.width / 2, ty = d.cell.y + d.cell.height / 2 + 1.6;
            doc.setDrawColor(...BLUE); doc.setLineWidth(0.25); doc.line(cx - tw / 2, ty, cx + tw / 2, ty);
          }
        },
      });

      const n = doc.internal.getNumberOfPages();
      for (let i = 1; i <= n; i++) { doc.setPage(i); footer(i, n); }
      doc.setProperties({ title: `M Tech Stock List - ${folder.name}`, author: MTECH.name, subject: `${folder.name} stock`, creator: 'mtechtextiletraders.com' });
      doc.save(`M-Tech-Stock-List-${folder.name.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}.pdf`);
    } catch (e) {
      alert('The PDF could not be made right now. Please try again.');
    } finally {
      btn.disabled = false; label.textContent = old;
    }
  }
})();
