/* M Tech Textile Traders: machinery stock pages + PDF stock list */
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
    const r = await fetch(u, { headers: { accept: 'application/json' } });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Could not load');
    return d;
  };
  const titleOf = (f, e) => (f.fields[0] && e.data[f.fields[0].id]) || 'Item';
  const detailsOf = (f, e, skipFirst = true) => f.fields.slice(skipFirst ? 1 : 0).filter((x) => e.data[x.id]).map((x) => ({ label: x.label, value: e.data[x.id], long: x.long }));
  const errBox = (el, msg) => { el.innerHTML = `<div class="stk-empty"><p>${esc(msg)}</p><a class="btn btn-ghost" href="/stock"><span>Back to stock</span></a></div>`; };
  const ICON_IMG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm0 10 4.5-4.5a1.5 1.5 0 0 1 2 0L16 17m-2-2 1.5-1.5a1.5 1.5 0 0 1 2 0L20 16M15 8.5h.01"/></svg>';

  /* ---------------------------------------------------------------- folders index */
  const foldersEl = $('#stkFolders');
  if (foldersEl) {
    getJSON('/api/folders').then((list) => {
      if (!list.length) {
        foldersEl.innerHTML = '<div class="stk-empty"><p>Stock lists are being updated. Call or WhatsApp us on 0332-4681423 for what is available today.</p></div>';
        return;
      }
      foldersEl.innerHTML = list.map((f, i) => `
        <a class="stk-folder" href="/stock/${encodeURIComponent(f.slug)}">
          <div class="stk-folder-img">${f.cover ? `<img src="${img(f.cover)}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}">` : `<span class="stk-folder-ph">${ICON_IMG}</span>`}</div>
          <div class="stk-folder-b">
            <span class="stk-num">${String(i + 1).padStart(2, '0')}</span>
            <h2 class="h3">${esc(f.name)}</h2>
            <p>${f.count} ${f.count === 1 ? 'item' : 'items'} in stock</p>
            <span class="stk-go">Open folder <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg></span>
          </div>
        </a>`).join('');
    }).catch(() => {
      foldersEl.innerHTML = '<div class="stk-empty"><p>The stock list could not load right now. Please call or WhatsApp 0332-4681423.</p></div>';
    });
  }

  /* ---------------------------------------------------------------- folder page */
  const itemsEl = $('#stkItems');
  if (itemsEl) {
    const slug = decodeURIComponent((location.pathname.match(/^\/stock\/([^/]+)/) || [])[1] || '');
    getJSON(`/api/folders/${encodeURIComponent(slug)}`).then(({ folder, entries }) => {
      $('#stkTitle').textContent = folder.name;
      $('#stkCrumb').textContent = folder.name;
      $('#stkLead').textContent = entries.length
        ? `${entries.length} ${entries.length === 1 ? 'item' : 'items'} in stock. Open any item to see all its pictures, or download the full list as a PDF.`
        : 'This folder is empty right now.';
      if (!entries.length) { itemsEl.innerHTML = '<div class="stk-empty"><p>Nothing listed in this folder at the moment.</p></div>'; return; }
      itemsEl.innerHTML = entries.map((e) => {
        const d = detailsOf(folder, e);
        const short = d.filter((x) => !x.long), long = d.filter((x) => x.long);
        const href = `/stock/${encodeURIComponent(folder.slug)}/${e.id}`;
        return `<article class="stk-item">
          <a class="stk-item-img" href="${href}" aria-label="Pictures of ${esc(titleOf(folder, e))}">
            ${e.photos.length ? `<img src="${img(e.photos[0])}" alt="${esc(titleOf(folder, e))}" loading="lazy">` : `<span class="stk-folder-ph">${ICON_IMG}<small>Pictures on request</small></span>`}
            ${e.photos.length > 1 ? `<span class="stk-count">${ICON_IMG}${e.photos.length}</span>` : ''}
          </a>
          <div class="stk-item-b">
            <h2 class="stk-item-t"><a href="${href}">${esc(titleOf(folder, e))}</a></h2>
            ${short.length ? `<dl class="stk-mini">${short.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>` : ''}
            ${long.map((x) => `<p class="stk-desc">${esc(x.value)}</p>`).join('')}
            <a class="stk-go" href="${href}">${e.photos.length ? `View ${e.photos.length === 1 ? 'picture' : `all ${e.photos.length} pictures`}` : 'View details'} <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </article>`;
      }).join('');
      const btn = $('#stkPdf');
      btn.disabled = false;
      btn.addEventListener('click', () => makePdf(folder, entries, btn));
    }).catch((e) => {
      $('#stkTitle').textContent = 'Not found';
      errBox(itemsEl, e.message === 'Folder not found.' ? 'This folder no longer exists.' : 'The stock list could not load right now. Please try again.');
    });
  }

  /* ---------------------------------------------------------------- machine page */
  const galEl = $('#stkGallery');
  if (galEl) {
    const id = (location.pathname.match(/^\/stock\/[^/]+\/([a-z0-9]+)/) || [])[1] || '';
    getJSON(`/api/entries/${id}`).then(({ entry, folder }) => {
      const t = titleOf(folder, entry);
      const fHref = `/stock/${encodeURIComponent(folder.slug)}`;
      $('#stkTitle').textContent = t;
      $('#stkCrumb').textContent = t;
      $('#stkEyebrow').textContent = folder.name;
      const fl = $('#stkFolderLink'); fl.textContent = folder.name; fl.href = fHref;
      $('#stkBack').href = fHref;
      const d = detailsOf(folder, entry);
      $('#stkLead').textContent = entry.photos.length ? `${entry.photos.length} ${entry.photos.length === 1 ? 'picture' : 'pictures'}` : 'Pictures available on request.';
      $('#stkDl').innerHTML = d.map((x) => `<div class="${x.long ? 'long' : ''}"><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('') || '';
      const lines = [`Assalam o Alaikum M Tech, I am interested in this item from your ${folder.name} stock:`, '', t, ...d.filter((x) => !x.long).map((x) => `${x.label}: ${x.value}`), '', location.href];
      $('#stkAsk').href = `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;

      const ph = entry.photos;
      if (!ph.length) { galEl.innerHTML = `<div class="stk-noimg">${ICON_IMG}<p>Pictures are available on request.</p></div>`; return; }
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
        cy += LH; link('ceo.mtechtextiletraders.com', cx, cy, 'https://abdulrasheedgill.com');
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
