#!/usr/bin/env python3
"""Builds the M Tech Textile Traders static site (shared header/footer)."""
import json, os, re, html
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))

def V(rel_path):
    """Short content hash so browsers fetch fresh CSS/JS after every deploy."""
    import hashlib
    with open(os.path.join(ROOT, rel_path), "rb") as fh:
        return rel_path + "?v=" + hashlib.sha1(fh.read()).hexdigest()[:8]
SITE = "https://mtechtextiletraders.com"
WA = "923324681423"
OFFICIAL = "0332-4681423"
EMAIL = "mtechtextiletradersofficial@gmail.com"
CEO_SITE = "https://ceo.mtechtextiletraders.com"
FB = "https://www.facebook.com/mtechtextile"
IG = "https://www.instagram.com/mtechtextiletrader"
LI = "https://www.linkedin.com/company/mtechtextiletraders"
OFFICE = "Main Bazar Rasheed Town, Near Post Office, Manga Mandi, Lahore"
WAREHOUSE = "Darul Ehsan Town, Faisalabad"


def tel(n):
    return "+92" + re.sub(r"\D", "", n)[1:]

def wa_link(text=""):
    from urllib.parse import quote
    return f"https://wa.me/{WA}" + (f"?text={quote(text)}" if text else "")

ICON = {
 "wa": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4Z"/></svg>',
 "ph": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
 "mail": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>',
 "pin": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg>',
 "fb": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z"/></svg>',
 "ig": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 7.2c-.1-1.6-.4-3-1.6-4.1C18.3 2 16.8 1.6 15.2 1.5c-1.6-.1-6.6-.1-8.3 0-1.6.1-3 .4-4.1 1.6S1.6 5.6 1.5 7.2c-.1 1.6-.1 6.6 0 8.3.1 1.6.4 3 1.6 4.1s2.5 1.5 4.1 1.6c1.6.1 6.6.1 8.3 0 1.6-.1 3-.4 4.1-1.6 1.2-1.1 1.5-2.5 1.6-4.1.1-1.7.1-6.6 0-8.3Zm-2.1 10.1a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5 .4s-3.7.1-5-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.3s-.1-4 .4-5.3a3.3 3.3 0 0 1 1.9-1.9c1.3-.5 4.4-.4 5-.4s3.7-.1 5 .4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.3s.1 4-.4 5.3Z"/></svg>',
 "li": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4V9.5Z"/></svg>',
 "arr": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>',
}

def logo_svg(cls="", ids=False):
    return (f'<div class="{cls}" role="img" aria-label="M Tech logo">'
            '<img id="lgGear" src="{rel}assets/img/lg-gear.png" alt="" width="1500" height="780">'
            '<img id="lgArc" src="{rel}assets/img/lg-arc.png" alt="" width="1500" height="780">'
            '<img id="lgM" src="{rel}assets/img/lg-m.png" alt="" width="1500" height="780"></div>')

SERVICES = [
    ("machinery", "Textile Machinery", "New & pre-owned machinery, bought and sold", "ring-hall.jpg"),
    ("spare-parts", "Spinning Spare Parts", "Every part a spinning line runs on", "spare-parts.jpg"),
    ("yarn-cotton", "Yarn & Cotton Trade", "All kinds of yarn; local and imported cotton", "yarn-cones.jpg"),
    ("mill-sale-purchase", "Mill Sale & Purchase", "Complete mills, deals and advisory", "mill-exterior.jpg"),
]

TEAM = [
    dict(slug="soban-rasheed", name="Soban Rasheed", role="Inventory Manager", img="team-soban.jpg", phone="0322-4562220",
         short="Runs the godown: stock, machinery in and out, and every purchase and sale on the floor.",
         bio=["Soban looks after M Tech's inventory. Every machine and spare part that comes into the godown, and every one that leaves, passes through him.",
              "He keeps stock records current, checks condition when machinery arrives, and handles the buying and selling of machinery from the warehouse side, so a client asking “do you have it?” gets a straight answer the same day."],
         duties=["Godown stock and records", "Machinery purchase and sale", "Condition checks on incoming machinery", "Dispatch and loading"]),
    dict(slug="sufian-rasheed", name="Sufian Rasheed", role="Office Manager", img="team-sufian.jpg", phone="0309-9352267",
         short="Runs the office: marketing, accounts and the day-to-day paperwork behind every deal.",
         bio=["Sufian manages the M Tech office. He handles marketing, accounts and the paperwork that keeps every deal clean, from quotations and invoices to payments and records.",
              "He also looks after M Tech's online presence, so when a client finds us on the web or social media, the conversation starts with him."],
         duties=["Marketing and online presence", "Accounts and payments", "Quotations, invoices and records", "Client coordination"]),
    dict(slug="numan-rasheed", name="Numan Rasheed", role="Business Development", img="team-numan.jpg", phone="0304-4562220",
         short="Visits factories, meets owners and turns their needs into the right machinery deal.",
         bio=["Numan works on business development. He visits mills and factories across Pakistan, meets owners and managers, and listens to what their production actually needs.",
              "From those visits come suggestions on machinery, upgrades and spare parts, and the meetings where deals are agreed."],
         duties=["Factory and mill visits", "Client meetings", "Machinery and upgrade suggestions", "New business"]),
    dict(slug="moeen-rasheed", name="Moeen Rasheed", role="Business Development", img="team-moeen.jpg", phone="0323-4562220",
         short="On the road with clients: factory visits, meetings and practical advice.",
         bio=["Moeen also leads business development. He spends his time at client sites, seeing machinery in use, understanding how a unit runs and where it can improve.",
              "His visits shape the advice M Tech gives on buying, selling and upgrading machinery, and he follows each deal through meetings to a close."],
         duties=["Factory and mill visits", "Client meetings and follow-up", "Machinery advice", "New business"]),
]

BRANDS = ["Rieter", "Trützschler", "Toyota", "Murata", "Schlafhorst", "Savio", "Zinser", "Marzoli", "Suessen", "Saurer",
          "LMW", "Howa", "Ohara", "Crosrol", "Platt", "Volkmann", "SSM", "Hara Shokki", "Jingwei", "Vouk"]

NAV = [("index.html", "Home"), ("about.html", "About"), ("services.html", "Services"), ("stock.html", "Stock"), ("team.html", "Team"), ("contact.html", "Contact")]

def clean(path):
    """Cloudflare Pages serves /about.html at /about (308), so public URLs never carry .html."""
    return "" if path == "index.html" else re.sub(r"\.html$", "", path)

HREF_RE = re.compile(r'href="((?:\.\./|/)*)((?:[\w-]+/)*[\w-]+)\.html(#[^"]*)?"')

def clean_links(doc, rel):
    """Point internal links at the clean URL so visitors and crawlers skip the redirect hop."""
    def fix(m):
        up, name, frag = m.group(1), m.group(2), m.group(3) or ""
        if name == "index":
            name = ""
            if not up:
                up = "./"
        return f'href="{up}{name}{frag}"'
    return HREF_RE.sub(fix, doc)

def head(title, desc, rel, path, extra="", ld=None, noindex=False):
    canon = SITE + "/" + (clean(path) if path not in ("stock-folder.html", "stock-item.html") else "stock")
    if len(title) > 60 or len(title) < 50 or len(desc) < 140 or len(desc) > 160:
        if not noindex and path not in ("stock-folder.html", "stock-item.html"):
            print(f"  SEO length warning {path}: title {len(title)}, description {len(desc)}")
    robots = '<meta name="robots" content="noindex, follow">\n' if noindex else ""
    canon_tag = "" if noindex else f'<link rel="canonical" href="{canon}">\n'
    ld_tag = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False, separators=(",", ":"))}</script>\n' if ld else ""
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
{robots}{canon_tag}<meta name="theme-color" content="#0033F8">
<meta property="og:type" content="website">
<meta property="og:site_name" content="M Tech Textile Traders">
<meta property="og:locale" content="en_PK">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="M Tech Textile Traders, textile machinery, Lahore and Faisalabad">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(desc)}">
<meta name="twitter:image" content="{SITE}/assets/img/og.jpg">
<link rel="icon" href="{rel}assets/img/favicon.png" type="image/png" sizes="64x64">
<link rel="icon" href="{rel}assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="{rel}assets/img/apple-touch-icon.png">
<link rel="preload" href="{rel}assets/fonts/archivo-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{rel}assets/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{rel}{V('css/style.css')}">
{ld_tag}<script>try{{var d=document.documentElement;if(sessionStorage.getItem("pt")){{d.classList.add("pt-in");setTimeout(function(){{d.classList.remove("pt-in")}},2500)}}else if(!sessionStorage.getItem("ld")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){{sessionStorage.setItem("ld","1");d.classList.add("ld");setTimeout(function(){{d.classList.remove("ld")}},3200)}}}}catch(e){{}}</script>
{extra}</head>
'''

def header(rel, active):
    links = "".join(
        f'<a href="{rel}{h}"{" aria-current=\"page\"" if active == h else ""}>{t}</a>' for h, t in NAV)
    sheet = "".join(f'<a href="{rel}{h}">{t}</a>' for h, t in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="hdr" id="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="{rel}index.html" aria-label="M Tech Textile Traders home">
      <img src="{rel}assets/img/logo.png" alt="" width="62" height="32">
      <span class="brand-t"><b>M Tech</b><small>Textile Traders</small></span>
    </a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <a class="btn btn-wa hdr-cta" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="sheet" aria-label="Open menu"><span></span><span></span></button>
  </div>
  <div class="sheet" id="sheet" aria-hidden="true">
    <nav aria-label="Mobile">{sheet}</nav>
    <div class="sheet-ft">
      <a href="tel:{tel(OFFICIAL)}">{ICON["ph"]} {OFFICIAL}</a>
      <a href="{wa_link()}" target="_blank" rel="noopener">{ICON["wa"]} WhatsApp us</a>
    </div>
  </div>
</header>
'''

def footer(rel):
    svc = "".join(f'<li><a href="{rel}services/{s}.html">{t}</a></li>' for s, t, _, _ in SERVICES)
    return f'''<footer class="ftr">
  <div class="wrap ftr-top">
    <div class="ftr-brand">
      <img src="{rel}assets/img/logo.png" alt="M Tech" width="92" height="48">
      <p class="ftr-line">We specialize in buying and selling all types of new and pre-owned textile machinery.</p>
      <p class="ftr-small">Serving Pakistan's textile industry since 1988. Member of the Chamber of Commerce.</p>
      <div class="social">
        <a href="{FB}" target="_blank" rel="noopener" aria-label="Facebook">{ICON["fb"]}</a>
        <a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram">{ICON["ig"]}</a>
        <a href="{LI}" target="_blank" rel="noopener" aria-label="LinkedIn">{ICON["li"]}</a>
        <a href="{wa_link()}" target="_blank" rel="noopener" aria-label="WhatsApp">{ICON["wa"]}</a>
      </div>
    </div>
    <div><h2 class="ftr-h">Services</h2><ul>{svc}</ul></div>
    <div><h2 class="ftr-h">Company</h2><ul>
      <li><a href="{rel}about.html">About M Tech</a></li>
      <li><a href="{rel}stock.html">Stock</a></li>
      <li><a href="{rel}team.html">Our team</a></li>
      <li><a href="{CEO_SITE}/" target="_blank" rel="noopener">Abdul Rasheed Gill, CEO</a></li>
      <li><a href="{rel}contact.html">Contact</a></li></ul></div>
    <div><h2 class="ftr-h">Reach us</h2><ul class="ftr-c">
      <li><a href="tel:{tel(OFFICIAL)}">{ICON["ph"]}{OFFICIAL}</a></li>
      <li><a href="mailto:{EMAIL}">{ICON["mail"]}<span class="brk">{EMAIL.replace("@", "<wbr>@")}</span></a></li>
      <li>{ICON["pin"]}<span>Office: {OFFICE}</span></li>
      <li>{ICON["pin"]}<span>Warehouse: {WAREHOUSE}</span></li></ul></div>
  </div>
  <div class="ftr-mark" aria-hidden="true"><div class="ftr-mark-in">{"".join(f'<span>{c}</span>' if c != " " else '<span class="sp"> </span>' for c in "M TECH")}</div></div>
  <div class="wrap ftr-bot">
    <span>© <span id="yr">2026</span> M Tech Textile Traders. All rights reserved.</span>
    <span class="credit">Designed by <a href="https://navifexpro.com" target="_blank" rel="noopener">navifexpro.com</a></span>
  </div>
</footer>
<a class="fab" href="https://wa.me/923004681423?text={quote('Assalam o Alaikum Rasheed Sb, main M Tech ki website se raabta kar raha hoon. ')}" target="_blank" rel="noopener" aria-label="WhatsApp Rasheed Sb">{ICON["wa"]}<span class="fab-tip">Rasheed Sb ko WhatsApp</span></a>
<nav class="mbar" aria-label="Quick contact"><a class="mbar-call" href="tel:{tel(OFFICIAL)}">{ICON["ph"]}<span>Call</span></a><a class="mbar-wa" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a></nav>
<script src="{rel}js/vendor/gsap.min.js" defer></script>
<script src="{rel}js/vendor/ScrollTrigger.min.js" defer></script>
<script src="{rel}js/vendor/lenis.min.js" defer></script>
<script src="{rel}{V('js/main.js')}" defer></script>
<script src="{rel}{V('js/motion.js')}" defer></script>
<script src="{rel}{V('js/chat.js')}" defer></script>
</body>
</html>
'''

def page(path, title, desc, body, active=None, bodycls="", rel=None, extra="", scripts="", sitemap=True, ld=None, noindex=False):
    depth = path.count("/")
    rel = "../" * depth if rel is None else rel
    body = body.replace("{rel}", rel)
    ft = footer(rel)
    if scripts:
        ft = ft.replace("</body>", scripts.replace("{rel}", rel) + "\n</body>")
    out = head(title, desc, rel, path, extra, ld, noindex) + f'<body class="{bodycls}">\n' + header(rel, active or path) + f'<main id="main">\n{body}\n</main>\n' + ft
    out = clean_links(out, rel)
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w").write(out)
    if sitemap:
        PAGES.append(path)

PAGES = []

def pagehead(eyebrow, title, lead, crumbs=None, img=None):
    cr = ""
    if crumbs:
        cr = '<nav class="crumbs" aria-label="Breadcrumb">' + ' <span>/</span> '.join(
            f'<a href="{{rel}}{h}">{t}</a>' if h else f'<span aria-current="page">{t}</span>' for h, t in crumbs) + '</nav>'
    im = f'<div class="ph-img" data-parallax><img src="{{rel}}assets/img/{img}" alt="" width="1376" height="768" fetchpriority="high"></div>' if img else ""
    return f'''<section class="phead{' has-img' if img else ''}">
  <div class="gear-bg" aria-hidden="true">{gear_svg()}</div>
  <div class="wrap phead-in">
    {cr}
    <p class="eyebrow">{eyebrow}</p>
    <h1 class="h1 reveal-lines">{title}</h1>
    <p class="lead">{lead}</p>
  </div>
  {im}
</section>'''

def gear_svg(teeth=24, r=300, depth=34, cls="gear"):
    import math
    pts = []
    n = teeth * 4
    for i in range(n):
        a = 2 * math.pi * i / n
        k = i % 4
        rr = r + (depth if k in (1, 2) else 0)
        pts.append(f"{400 + rr * math.cos(a):.1f},{400 + rr * math.sin(a):.1f}")
    return (f'<svg class="{cls}" viewBox="0 0 800 800"><polygon points="{" ".join(pts)}" fill="none" stroke="currentColor" stroke-width="2"/>'
            f'<circle cx="400" cy="400" r="{r-70}" fill="none" stroke="currentColor" stroke-width="2"/>'
            f'<circle cx="400" cy="400" r="60" fill="none" stroke="currentColor" stroke-width="2"/></svg>')

def cta_band(title="Looking for a machine, a part, or a buyer?", text="Tell us what you need. We answer on call and WhatsApp, and godown visits are by appointment."):
    return f'''<section class="cta-band">
  <div class="wrap cta-in">
    <div><h2 class="h2">{title}</h2><p>{text}</p></div>
    <div class="cta-btns">
      <a class="btn btn-wa btn-lg" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp {OFFICIAL}</span></a>
      <a class="btn btn-ghost-w btn-lg" href="tel:{tel(OFFICIAL)}">{ICON["ph"]}<span>Call now</span></a>
    </div>
  </div>
</section>'''

# ---------------------------------------------------------------- HOME
brand_row = lambda items: "".join(f'<span class="bm">{b}</span><i aria-hidden="true">·</i>' for b in items)
def _a(body):
    return f'<svg viewBox="0 0 220 150" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{body}</svg>'

JOURNEY = [
    ("Blowroom", "Bales are opened, cleaned and blended into an even flow of cotton.",
     _a('<rect x="14" y="70" width="46" height="56" rx="4"/><path d="M14 88h46M14 106h46"/><path d="M60 98h22"/><rect x="82" y="52" width="70" height="74" rx="6"/><circle cx="104" cy="88" r="16"/><circle cx="132" cy="88" r="10"/><path d="M152 70h22l18-18h18M174 70v56h-22"/><path d="M96 88h16M104 80v16"/><path d="M8 126h204"/>')),
    ("Carding", "Fibres are separated one by one and condensed into a soft sliver.",
     _a('<circle cx="96" cy="78" r="44"/><circle cx="96" cy="78" r="8"/><circle cx="40" cy="104" r="14"/><circle cx="156" cy="104" r="18"/><path d="M58 40c20-14 56-14 76 0"/><path d="M174 104h18v22"/><path d="M8 126h204M64 122h64"/><path d="M96 34v-10M140 78h10M52 78H42"/>')),
    ("Draw frame", "Six to eight slivers are doubled and drafted for evenness.",
     _a('<rect x="18" y="80" width="26" height="46" rx="3"/><rect x="50" y="80" width="26" height="46" rx="3"/><rect x="82" y="80" width="26" height="46" rx="3"/><path d="M31 80c0-30 60-40 90-40M63 80c0-24 40-34 58-36M95 80c0-14 16-22 26-24"/><rect x="120" y="30" width="54" height="26" rx="5"/><circle cx="134" cy="43" r="5"/><circle cx="160" cy="43" r="5"/><path d="M174 43h12v40"/><rect x="172" y="84" width="30" height="42" rx="3"/><path d="M8 126h204"/>')),
    ("Comber", "Short fibres and neps are taken out for fine, strong counts.",
     _a('<rect x="20" y="40" width="180" height="60" rx="8"/><circle cx="56" cy="70" r="16"/><circle cx="110" cy="70" r="16"/><circle cx="164" cy="70" r="16"/><path d="M48 62l16 16M102 62l16 16M156 62l16 16"/><path d="M40 100v26M180 100v26M8 126h204"/><path d="M56 54v-8M110 54v-8M164 54v-8"/>')),
    ("Simplex", "Sliver is drafted into roving and given its first light twist.",
     _a('<path d="M20 40h180M20 126h180"/>' + ''.join(f'<path d="M{34+i*30} 52l-8 20h16z"/><rect x="{27+i*30}" y="72" width="14" height="40" rx="5"/><path d="M{34+i*30} 40v12"/>' for i in range(6)))),
    ("Ring frame", "The final draft and twist. Here the roving becomes yarn.",
     _a('<path d="M14 34h192M14 60h192M14 126h192"/>' + ''.join(f'<circle cx="{26+i*24}" cy="47" r="7"/><path d="M{26+i*24} 60v8"/><path d="M{20+i*24} 108c0-24 4-38 6-40 2 2 6 16 6 40z"/><path d="M{26+i*24} 108v14"/>' for i in range(8)))),
    ("Autoconer", "Yarn is cleared, spliced and wound onto export-ready cones.",
     _a('<rect x="22" y="22" width="20" height="104" rx="3"/><rect x="178" y="22" width="20" height="104" rx="3"/><path d="M58 42l50-10v52l-50-10z"/><path d="M108 32h40v52h-40"/><circle cx="128" cy="98" r="12"/><path d="M128 110v6M110 98H50M60 112v14h-8"/><rect x="146" y="20" width="26" height="18" rx="3"/><path d="M8 126h204"/>')),
    ("Open-end", "Rotor spinning straight from sliver, for coarser counts at speed.",
     _a('<rect x="24" y="30" width="172" height="96" rx="8"/><circle cx="80" cy="78" r="26"/><circle cx="80" cy="78" r="10"/><path d="M80 52V30M120 50h56v56h-56z"/><path d="M134 78h28M148 64v28"/><path d="M8 126h204"/>')),
]

PROCESS = [
    ("Blowroom", "Bales", "Clean tufts", "Compressed bales are opened, the cotton is plucked into small tufts, cleaned of trash and blended so every kilo runs the same.", "Trützschler · Rieter blowroom lines"),
    ("Carding", "Tufts", "Card sliver", "The card separates the fibres one by one into a fine web, then gathers that web into a soft rope called sliver.", "Trützschler TC · Rieter C series"),
    ("Draw frame", "6 to 8 slivers", "One even sliver", "Several slivers are doubled and drafted together. Thick and thin places cancel out and the fibres lie straight.", "Rieter RSB · Trützschler TD"),
    ("Comber", "Sliver", "Combed sliver", "Short fibres and neps are combed out. What is left makes finer, stronger and cleaner yarn.", "Rieter E series · Marzoli"),
    ("Simplex", "Sliver", "Roving", "Sliver is drawn thinner and given a light twist so it can be wound onto bobbins for the ring frame.", "Toyota FL · Zinser · Marzoli"),
    ("Ring frame", "Roving", "Yarn", "The final draft and twist. Thousands of spindles turn roving into yarn, wound onto small cops.", "Zinser · Toyota RX · Marzoli · LMW"),
    ("Autoconer", "Cops", "Cones", "Yarn from the cops is checked by the clearer, faults are cut and spliced, and it is wound onto large cones ready to sell.", "Murata · Schlafhorst · Savio"),
    ("Open-end", "Sliver", "Yarn", "Rotor spinning skips the simplex and ring frame and makes coarser yarn straight from sliver, at high speed.", "Rieter R · Schlafhorst Autocoro"),
]

LINE = [("Blowroom", "Opening & cleaning"), ("Carding", "Card & web"), ("Draw frame", "Drafting"), ("Comber", "Lap & combing"),
        ("Simplex", "Roving"), ("Ring frame", "Spinning"), ("Autoconer", "Winding"), ("Open-end", "Rotor spinning")]

home = f'''
<section class="cine" id="top" aria-label="M Tech Textile Traders, since 1988" data-three="{{rel}}{V('js/vendor/three-mt.min.js')}" data-cine="{{rel}}{V('js/cine.js')}">
  <div class="cine-pin">
    <div class="cine-stage" aria-hidden="true">
      <div class="cine-fb"><img src="{{rel}}assets/video/hero.jpg" alt="" width="1600" height="900" fetchpriority="high"><div class="hero-veil"></div><div class="hero-logo">{logo_svg("hl", ids=True)}</div></div>
      <div class="cine-gl"></div>
      <svg class="cine-svg"></svg>
      <div class="cine-labs"></div>
      <div class="cine-grain"></div>
    </div>
    <div class="wrap cine-in">
      <article class="cine-ch on" data-ch="0">
        <p class="eyebrow"><span class="dot"></span> Lahore · Faisalabad · Since 1988</p>
        <h1 class="hero-h">
          <span class="ln"><span>Textile machinery,</span></span>
          <span class="ln"><span>bought and sold</span></span>
          <span class="ln"><span class="acc">the right way.</span></span>
        </h1>
        <p class="hero-sub">We specialize in buying and selling all types of new and pre-owned textile machinery. Spinning is our core, with spare parts, yarn and cotton, and complete mills alongside it.</p>
        <ul class="hero-chips" aria-label="M Tech in numbers"><li><b>1988</b> Founded</li><li><b>50+</b> Mills traded</li><li><b>100+</b> Owners advised</li></ul>
        <div class="hero-btns">
          <a class="btn btn-pri btn-lg" href="{{rel}}services.html"><span>Our services</span>{ICON["arr"]}</a>
          <a class="btn btn-wa btn-lg" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a>
        </div>
      </article>
      <article class="cine-ch" data-ch="1">
        <p class="cine-num"><b>02</b><span>In motion</span></p>
        <h2 class="cine-h">Gears, spindles and cones that still turn true.</h2>
        <p class="cine-p">We check the parts that keep a spinning line turning before a machine changes hands, and tell you honestly what it is worth.</p>
      </article>
      <article class="cine-ch" data-ch="2">
        <p class="cine-num"><b>03</b><span>Inside the unit</span></p>
        <h2 class="cine-h">From blowroom to cone, we know every part.</h2>
        <p class="cine-p">Ring frames, Autocoro and open-end rotor machines, Autoconers, blowroom and drawing. New and pre-owned, with the spare parts to keep them running.</p>
      </article>
      <article class="cine-ch" data-ch="3">
        <p class="cine-num"><b>04</b><span>Since 1988</span></p>
        <h2 class="cine-h">A machine, a part or a buyer? Ask us.</h2>
        <p class="cine-year"><b data-y>2026</b><span>In the spinning trade since 1988, from Manga Mandi, Lahore.</span></p>
        <div class="hero-btns">
          <a class="btn btn-wa btn-lg" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp {OFFICIAL}</span></a>
          <a class="btn btn-ghost-w btn-lg" href="tel:{tel(OFFICIAL)}">{ICON["ph"]}<span>Call now</span></a>
        </div>
      </article>
    </div>
    <ol class="cine-rail" aria-hidden="true"><li class="on"><i>01</i><span>Reveal</span></li><li><i>02</i><span>In motion</span></li><li><i>03</i><span>Inside the unit</span></li><li><i>04</i><span>Since 1988</span></li></ol>
    <div class="cine-bar" aria-hidden="true"><i></i></div>
    <div class="scroll-cue" aria-hidden="true"><span></span></div>
  </div>
</section>

<section class="brands" aria-label="Machinery makes we deal in">
  <p class="brands-t">Makes we buy, sell and source parts for</p>
  <div class="marq"><div class="marq-tr">{brand_row(BRANDS[:10])}{brand_row(BRANDS[:10])}</div></div>
  <div class="marq rev"><div class="marq-tr">{brand_row(BRANDS[10:])}{brand_row(BRANDS[10:])}</div></div>
  <p class="brands-note">Brand names belong to their owners. M Tech trades new and pre-owned machinery of these makes; we are not their official agent.</p>
</section>

<section class="stats">
  <div class="wrap stats-in">
    <div class="stat"><b data-count="1988" data-plain>1988</b><span>Serving the industry since</span></div>
    <div class="stat"><b><span data-count="50">50</span>+</b><span>Mills bought and sold</span></div>
    <div class="stat"><b><span data-count="100">100</span>+</b><span>Factory owners we advise</span></div>
    <div class="stat"><b>All</b><span>Industrial cities of Pakistan</span></div>
  </div>
</section>

<section class="sec svc-sec">
  <div class="wrap">
    <div class="sec-hd">
      <p class="eyebrow">What we do</p>
      <h2 class="h2 reveal-lines">Four ways we work with mills</h2>
      <p class="sec-sub">One company for the machine, the parts that keep it running, the yarn it makes, and the mill itself.</p>
    </div>
    <p class="swipe-hint" aria-hidden="true">Swipe <svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg></p>
    <div class="svc-grid swipe">
      {"".join(f'''<a class="svc-card" href="{{rel}}services/{s}.html">
        <div class="svc-img"><img src="{{rel}}assets/img/{im}" alt="" loading="lazy" width="1376" height="768"></div>
        <div class="svc-body"><span class="svc-n">0{i+1}</span><h3>{t}</h3><p>{d}</p><span class="more">Learn more {ICON["arr"]}</span></div>
      </a>''' for i, (s, t, d, im) in enumerate(SERVICES))}
    </div>
  </div>
</section>

<section class="mc" id="machine" aria-label="Inside an Autoconer winding unit" data-js="{{rel}}{V('js/machine3d.js')}">
  <div class="mc-pin">
    <div class="mc-bg" aria-hidden="true"></div>
    <div class="wrap mc-in">
      <div class="mc-copy">
        <p class="eyebrow">Inside the machine</p>
        <h2 class="h2">We know an Autoconer down to the last part.</h2>
        <ol class="mc-steps">
          <li class="mc-step"><b>01</b><span>A complete winding unit, the way it reaches your mill.</span></li>
          <li class="mc-step"><b>02</b><span>Opened up: every part we check, value and replace.</span></li>
          <li class="mc-step"><b>03</b><span>Splicer, clearer and drum decide your yarn quality. We source all three.</span></li>
          <li class="mc-step"><b>04</b><span>Back together, tested, ready to run.</span></li>
        </ol>
        <p class="mc-hint" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg>Drag to turn the machine</p>
      </div>
      <div class="mc-stage" role="img" aria-label="3D model of an Autoconer winding unit opening into its parts"><div class="mc-labels" aria-hidden="true"></div><div class="mc-load" aria-hidden="true"><span></span></div></div>
    </div>
  </div>
</section>

<section class="pr" id="line" aria-label="How cotton becomes yarn">
  <div class="pr-pin">
    <div class="pr-stage" aria-hidden="true">
      {"".join(f'''<video class="pr-vid" data-src="{{rel}}assets/video/p{i+1}.mp4" poster="{{rel}}assets/video/p{i+1}.jpg" muted loop playsinline preload="none"></video>''' for i in range(len(PROCESS)))}
      <div class="pr-shade"></div>
    </div>
    <div class="wrap pr-in">
      <div class="pr-hd">
        <p class="eyebrow">How cotton becomes yarn</p>
        <h2 class="h2">From the first bale<br>to the final cone</h2>
      </div>
      <div class="pr-copy">
        {"".join(f'''<article class="pr-step"><span class="pr-n">{i+1:02d}<small>/ {len(PROCESS):02d}</small></span><h3>{t}</h3><p class="pr-state"><b>{a}</b><i aria-hidden="true">→</i><b>{z}</b></p><p class="pr-what">{d}</p><p class="pr-makes">{m}</p></article>''' for i, (t, a, z, d, m) in enumerate(PROCESS))}
      </div>
    </div>
    <div class="wrap pr-rail">
      <ol>{"".join(f'<li><span></span><b>{t}</b></li>' for t, *_ in PROCESS)}</ol>
      <div class="pr-bar"><i></i></div>
    </div>
  </div>
</section>

<section class="sec how">
  <div class="wrap how-in">
    <div class="how-l">
      <p class="eyebrow">How a deal works</p>
      <h2 class="h2 reveal-lines">Simple, direct, and done in person</h2>
      <p class="sec-sub">No middle layers. You talk to the family that has run M Tech for over three decades.</p>
      <a class="btn btn-pri" href="{{rel}}contact.html"><span>Start a conversation</span>{ICON["arr"]}</a>
    </div>
    <ol class="steps">
      <li class="step"><span>01</span><div><h3>Tell us what you need</h3><p>A machine to buy, machinery to sell, a part, yarn or cotton. Call or WhatsApp with the details.</p></div></li>
      <li class="step"><span>02</span><div><h3>We check and value it</h3><p>We see the machinery, check its condition and tell you honestly what it is worth.</p></div></li>
      <li class="step"><span>03</span><div><h3>A fair price, clean paperwork</h3><p>Terms are agreed face to face and every deal is documented properly.</p></div></li>
      <li class="step"><span>04</span><div><h3>Delivery, and installation if needed</h3><p>We arrange dispatch from our godown. Installation and shifting are available on request.</p></div></li>
    </ol>
  </div>
</section>

<section class="sec founder">
  <div class="wrap founder-in">
    <div class="founder-img reveal-img"><img src="{{rel}}assets/img/ceo.jpg" alt="Abdul Rasheed Gill, Founder and CEO of M Tech Textile Traders" loading="lazy" width="900" height="900"></div>
    <div class="founder-copy">
      <p class="eyebrow">Founder & CEO</p>
      <h2 class="h2 reveal-lines">Abdul Rasheed Gill</h2>
      <blockquote>Over three decades in spinning, from spare parts to complete mills.</blockquote>
      <p>Abdul Rasheed Gill started in spinning in 1988 and built M Tech from spare parts into machinery, complete mills and imports. Today his four sons work alongside him.</p>
      <div class="founder-btns">
        <a class="btn btn-pri" href="{CEO_SITE}" target="_blank" rel="noopener"><span>About the CEO</span>{ICON["arr"]}</a>
        <a class="btn btn-ghost" href="{{rel}}team.html"><span>Meet the team</span></a>
      </div>
    </div>
  </div>
</section>
{cta_band()}
'''

# ---------------------------------------------------------------- ABOUT
about = pagehead("About M Tech", "A family business, <span class=\"acc\">built on spinning</span>",
                 "M Tech Textile Traders has served Pakistan's textile industry since 1988, from Manga Mandi in Lahore and a warehouse in Faisalabad.",
                 [("index.html", "Home"), (None, "About")]) + f'''
<section class="sec">
  <div class="wrap story">
    <div class="story-copy">
      <h2 class="h2 reveal-lines">Our story</h2>
      <p>Abdul Rasheed Gill began his career in 1988 in the spinning trade, working with open-end and spinning machinery. That same year he founded M Tech Textile Traders.</p>
      <p>The business started with spare parts. It grew into machinery, then complete mills, and then imports from abroad. Through all of it, the work stayed the same: know the machine, value it honestly, and stand behind the deal.</p>
      <p>Today M Tech is run by Abdul Rasheed Gill and his four sons, from our head office in Manga Mandi, Lahore, and our warehouse in Darul Ehsan Town, Faisalabad.</p>
    </div>
    <figure class="story-img reveal-img"><img src="{{rel}}assets/img/family.jpg" alt="Abdul Rasheed Gill with two of his sons" loading="lazy" width="1400" height="933"><figcaption>Abdul Rasheed Gill with his sons</figcaption></figure>
  </div>
</section>

<section class="sec alt">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">Timeline</p><h2 class="h2 reveal-lines">How M Tech grew</h2></div>
    <ol class="tl">
      <li><b>1988</b><h3>The start</h3><p>Abdul Rasheed Gill enters the spinning trade and founds M Tech Textile Traders.</p></li>
      <li><b>Spare parts</b><h3>Parts first</h3><p>The business builds its name supplying spinning spare parts to mills.</p></li>
      <li><b>Machinery</b><h3>Machines</h3><p>M Tech moves into buying and selling new and pre-owned textile machinery.</p></li>
      <li><b>Mills</b><h3>Complete mills</h3><p>The company begins buying, selling and brokering complete mills, with more than 50 traded.</p></li>
      <li><b>Imports</b><h3>Beyond Pakistan</h3><p>Machinery imports and international exhibitions widen what we can source for clients.</p></li>
      <li><b>Today</b><h3>The next generation</h3><p>Four sons join the business, and export is the next step.</p></li>
    </ol>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">How we work</p><h2 class="h2 reveal-lines">What clients can count on</h2></div>
    <div class="vals">
      <div class="val"><span class="val-i">01</span><h3>Honest valuation</h3><p>We tell you what a machine is really worth, whether you are buying or selling.</p></div>
      <div class="val"><span class="val-i">02</span><h3>Spinning knowledge</h3><p>Over three decades with spinning machinery, department by department.</p></div>
      <div class="val"><span class="val-i">03</span><h3>Nationwide reach</h3><p>Clients in every industrial city of Pakistan, and more than 100 factory owners we advise.</p></div>
      <div class="val"><span class="val-i">04</span><h3>A family name</h3><p>The people you deal with own the business. Our name is on every deal.</p></div>
    </div>
    <p class="note-line">Member of the Chamber of Commerce. We currently sell within Pakistan; export is planned soon.</p>
  </div>
</section>
{cta_band()}
'''

# ---------------------------------------------------------------- SERVICES OVERVIEW
services = pagehead("Services", "Machinery, parts, <span class=\"acc\">yarn and mills</span>",
                    "Spinning is our core. Everything else we do grows out of knowing those machines well.",
                    [("index.html", "Home"), (None, "Services")]) + f'''
<section class="sec">
  <div class="wrap">
    <div class="svc-list">
      {"".join(f'''<a class="svc-row" href="{{rel}}services/{s}.html">
        <span class="svc-n">0{i+1}</span>
        <div class="svc-row-img"><img src="{{rel}}assets/img/{im}" alt="" loading="lazy" width="1376" height="768"></div>
        <div class="svc-row-t"><h2>{t}</h2><p>{d}</p></div>
        <span class="svc-go">{ICON["arr"]}</span>
      </a>''' for i, (s, t, d, im) in enumerate(SERVICES))}
    </div>
    <div class="extra">
      <div><h3>Installation & shifting</h3><p>Available on request when a client needs machinery installed or a unit moved.</p></div>
      <div><h3>Godown visits</h3><p>See machinery in person at our Faisalabad warehouse. Visits are by appointment, so please call first.</p></div>
    </div>
  </div>
</section>
{cta_band()}
'''

def guide_html(gd):
    """Educational guide section for a service page (general know-how, no company claims beyond the site's facts)."""
    items = "".join(f'''<article class="guide-item"><span class="val-i">{n + 1:02d}</span><h3>{h}</h3>{b}</article>''' for n, (h, b) in enumerate(gd["items"]))
    return f'''<section class="sec alt guide">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">{gd["eyebrow"]}</p><h2 class="h2 reveal-lines">{gd["h2"]}</h2><p class="sec-sub">{gd["sub"]}</p></div>
    <div class="guide-grid">{items}</div>
  </div>
</section>'''

def faq_html(faqs):
    qs = "".join(f'''<details class="faq-q"{" open" if n == 0 else ""}><summary><h3>{q}</h3></summary><div class="faq-a"><p>{a}</p></div></details>''' for n, (q, a) in enumerate(faqs))
    return f'''<section class="sec faq-sec">
  <div class="wrap faq">
    <div class="sec-hd faq-hd"><p class="eyebrow">FAQ</p><h2 class="h2 reveal-lines">Questions we are asked</h2><p class="sec-sub">Not answered here? Call or WhatsApp <a href="tel:{tel(OFFICIAL)}">{OFFICIAL}</a>.</p></div>
    <div class="faq-list">{qs}</div>
  </div>
</section>'''

def plain(x):
    return html.unescape(re.sub(r"<[^>]+>", "", x)).strip()

# Short Urdu summary per service (restates facts already on the page) for Urdu searches.
SVC_UR = {
    "machinery": "نئی اور استعمال شدہ ٹیکسٹائل اور اسپننگ مشینری کی خرید و فروخت: بلو روم، کارڈنگ، ڈرا فریم، رنگ فریم، آٹوکونر اور اوپن اینڈ۔ دفتر لاہور، گودام فیصل آباد۔",
    "spare-parts": "اسپننگ مل کے ہر شعبے کے نئے اور استعمال شدہ اسپیئر پارٹس: رنگ فریم، کارڈنگ، کومبنگ، سمپلیکس اور آٹوکونر۔ پورے پاکستان میں ڈیلیوری۔",
    "yarn-cotton": "ہر قسم کا یارن اور مقامی و درآمدی کپاس: کارڈڈ، کومبڈ، کمپیکٹ اور اوپن اینڈ یارن، پی سی اور سی وی سی بلینڈ اور وسکوس۔",
    "mill-sale-purchase": "مکمل اسپننگ ملز اور یونٹس کی خرید و فروخت، بروکریج، مشینری کی قیمت کا اندازہ اور نئی مل لگانے کا مشورہ۔ پہلی مشاورت مفت۔",
}
SVC_ALT = {
    "machinery": ["Used spinning machinery", "Used textile machinery for sale in Pakistan", "Spinning machinery Lahore and Faisalabad"],
    "spare-parts": ["Spinning spare parts Lahore", "Ring frame spare parts", "Autoconer spare parts", "Carding spare parts"],
    "yarn-cotton": ["Cotton yarn traders", "Yarn traders Pakistan", "Cotton trade Pakistan"],
    "mill-sale-purchase": ["Spinning mill for sale in Pakistan", "Mill sale purchase Pakistan", "Textile mill brokerage"],
}

def svc_page(slug, eyebrow, title, lead, img, intro, groups, extra_html=""):
    i = [s for s, *_ in SERVICES].index(slug)
    if slug in SVC_UR:
        intro += f'<p class="ur" lang="ur" dir="rtl">{SVC_UR[slug]}</p>'
    others = [x for x in SERVICES if x[0] != slug]
    g = "".join(f'''<div class="grp"><h2 class="grp-t">{gt}</h2><ul class="chips">{"".join(f"<li>{x}</li>" for x in items)}</ul></div>''' for gt, items in groups)
    nxt = SERVICES[(i + 1) % 4]
    more = SVC_MORE.get(slug, {})
    guide = guide_html(more["guide"]) if more.get("guide") else ""
    faqs = more.get("faqs", [])
    body = pagehead(eyebrow, title, lead, [("index.html", "Home"), ("services.html", "Services"), (None, SERVICES[i][1])], img) + f'''
<section class="sec">
  <div class="wrap svc-detail">
    <div class="svc-intro">{intro}</div>
    <div class="grps">{g}</div>
    {extra_html}
  </div>
</section>
{guide}
{faq_html(faqs) if faqs else ""}
<section class="sec alt">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">Other services</p></div>
    <div class="svc-grid three">
      {"".join(f'''<a class="svc-card" href="{s}.html"><div class="svc-img"><img src="{{rel}}assets/img/{im}" alt="" loading="lazy" width="1376" height="768"></div><div class="svc-body"><h3>{t}</h3><p>{d}</p><span class="more">Learn more {ICON["arr"]}</span></div></a>''' for s, t, d, im in others)}
    </div>
  </div>
</section>
{cta_band()}'''
    path = f"services/{slug}.html"
    t, d = SEO[path]
    ld = graph(webpage(path, "WebPage", t, d),
               {"@type": "Service", "@id": url_of(path) + "#service", "name": SERVICES[i][1], "serviceType": SERVICES[i][1],
                "alternateName": SVC_ALT.get(slug, []),
                "description": d, "url": url_of(path), "provider": BIZ_REF,
                "areaServed": [{"@type": "Country", "name": "Pakistan"}, {"@type": "City", "name": "Lahore"}, {"@type": "City", "name": "Faisalabad"}],
                "availableLanguage": ["en", "ur"],
                "hasOfferCatalog": {"@type": "OfferCatalog", "name": SERVICES[i][1], "itemListElement": [
                    {"@type": "OfferCatalog", "name": plain(gt), "itemListElement": [
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": plain(x)}} for x in items]} for gt, items in groups]},
                "image": f"{SITE}/assets/img/{img}"},
               crumbs_ld([("Home", "index.html"), ("Services", "services.html"), (SERVICES[i][1], path)]))
    if faqs:
        ld["@graph"].append({"@type": "FAQPage", "@id": url_of(path) + "#faq", "isPartOf": {"@id": url_of(path) + "#webpage"},
                             "mainEntity": [{"@type": "Question", "name": plain(q), "acceptedAnswer": {"@type": "Answer", "text": plain(a)}} for q, a in faqs]})
    page(path, t, d, body, active="services.html", ld=ld)

# ---------------------------------------------------------------- TEAM
team_cards = "".join(f'''<a class="tm" href="{{rel}}team/{t["slug"]}.html">
  <div class="tm-img"><img src="{{rel}}assets/img/{t["img"]}" alt="{t["name"]}" loading="lazy" width="720" height="960"></div>
  <div class="tm-b"><span class="tm-role">{t["role"]}</span><h3>{t["name"]}</h3><p>{t["short"]}</p><span class="more">View profile {ICON["arr"]}</span></div>
</a>''' for t in TEAM)

team = pagehead("Our team", "The family <span class=\"acc\">behind M Tech</span>",
                "A founder with over three decades in spinning, and four sons who run the business with him.",
                [("index.html", "Home"), (None, "Team")]) + f'''
<section class="sec">
  <div class="wrap">
    <div class="ceo">
      <div class="ceo-img reveal-img"><img src="{{rel}}assets/img/ceo.jpg" alt="Abdul Rasheed Gill" loading="lazy" width="900" height="900"></div>
      <div class="ceo-copy">
        <p class="eyebrow">Founder & CEO</p>
        <h2 class="h2">Abdul Rasheed Gill</h2>
        <p>Abdul Rasheed Gill founded M Tech Textile Traders in 1988 after starting out in spinning. He built the company from spare parts into machinery, complete mills and imports, and has advised more than 100 factory owners on machinery value, new mill setup and production.</p>
        <div class="ceo-btns">
          <a class="btn btn-pri" href="{CEO_SITE}" target="_blank" rel="noopener"><span>About the CEO</span>{ICON["arr"]}</a>
          <a class="btn btn-ghost" href="tel:+923004681423">{ICON["ph"]}<span>0300-4681423</span></a>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">The next generation</p><h2 class="h2 reveal-lines">Four brothers, one business</h2></div>
    <div class="tm-grid">{team_cards}</div>
  </div>
</section>
{cta_band()}
'''

def member_page(t):
    i = TEAM.index(t)
    nxt = TEAM[(i + 1) % len(TEAM)]
    first = t["name"].split()[0]
    body = f'''
<section class="mem">
  <div class="gear-bg" aria-hidden="true">{gear_svg()}</div>
  <div class="wrap mem-in">
    <div class="mem-img reveal-img"><img src="{{rel}}assets/img/{t["img"]}" alt="{t["name"]}" width="720" height="960" fetchpriority="high"></div>
    <div class="mem-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="{{rel}}index.html">Home</a> <span>/</span> <a href="{{rel}}team.html">Team</a> <span>/</span> <span aria-current="page">{t["name"]}</span></nav>
      <p class="eyebrow">{t["role"]}</p>
      <h1 class="h1 reveal-lines">{t["name"]}</h1>
      {"".join(f"<p>{p}</p>" for p in t["bio"])}
      <h2 class="mini">Looks after</h2>
      <ul class="chips">{"".join(f"<li>{d}</li>" for d in t["duties"])}</ul>
      <div class="mem-contact">
        <a class="btn btn-pri btn-lg" href="tel:{tel(t["phone"])}">{ICON["ph"]}<span>Call {first}: {t["phone"]}</span></a>
        <a class="btn btn-wa btn-lg" href="https://wa.me/92{re.sub(r"\D", "", t["phone"])[1:]}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a>
      </div>
      <div class="mem-nav"><a href="{{rel}}team.html">← Back to team</a><a href="{nxt["slug"]}.html">Next: {nxt["name"]} →</a></div>
    </div>
  </div>
</section>
{cta_band()}'''
    path = f"team/{t['slug']}.html"
    title = f"{t['name']}, {t['role']} | M Tech Textile Traders"
    desc = f"{t['name']}, {t['role']} at M Tech Textile Traders, Lahore. {t['short']}"
    if len(desc) > 160:
        desc = f"{t['name']}, {t['role']} at M Tech Textile Traders. {t['short']}"
    person = {"@type": "Person", "@id": url_of(path) + "#person", "name": t["name"], "jobTitle": t["role"],
              "telephone": tel(t["phone"]), "image": f"{SITE}/assets/img/{t['img']}", "url": url_of(path), "worksFor": BIZ_REF}
    ld = graph(webpage(path, "ProfilePage", title, desc, {"mainEntity": {"@id": person["@id"]}}), person,
               crumbs_ld([("Home", "index.html"), ("Team", "team.html"), (t["name"], path)]))
    page(path, title, desc, body, active="team.html", ld=ld)

# ---------------------------------------------------------------- CONTACT
contact = pagehead("Contact", "Talk to us <span class=\"acc\">directly</span>",
                   "We are available on call. Send an inquiry and it opens straight in WhatsApp.",
                   [("index.html", "Home"), (None, "Contact")]) + f'''
<section class="sec">
  <div class="wrap contact">
    <div class="c-info">
      <div class="c-block main">
        <span class="c-lab">M Tech official · Call & WhatsApp</span>
        <a class="c-big" href="tel:{tel(OFFICIAL)}">{OFFICIAL}</a>
        <div class="c-btns">
          <a class="btn btn-wa" href="{wa_link('Assalam o Alaikum M Tech, ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a>
          <a class="btn btn-ghost" href="tel:{tel(OFFICIAL)}">{ICON["ph"]}<span>Call</span></a>
        </div>
      </div>
      <div class="c-block">
        <span class="c-lab">Abdul Rasheed Gill · CEO</span>
        <a href="tel:+923004681423">0300-4681423</a><a href="tel:+923334562220">0333-4562220</a>
      </div>
      <div class="c-block">
        <span class="c-lab">Email</span>
        <a class="brk" href="mailto:{EMAIL}">{EMAIL}</a>
      </div>
      <div class="c-block">
        <span class="c-lab">Head office</span><p>{OFFICE}</p>
        <span class="c-lab">Warehouse (godown)</span><p>{WAREHOUSE}</p>
        <p class="c-note">On call, any time. Godown visits are by appointment, so please call before you come.</p>
      </div>
      <div class="c-block">
        <span class="c-lab">Follow M Tech</span>
        <div class="social dark">
          <a href="{FB}" target="_blank" rel="noopener" aria-label="Facebook">{ICON["fb"]}</a>
          <a href="{IG}" target="_blank" rel="noopener" aria-label="Instagram">{ICON["ig"]}</a>
          <a href="{LI}" target="_blank" rel="noopener" aria-label="LinkedIn">{ICON["li"]}</a>
        </div>
      </div>
    </div>
    <form class="c-form" id="inq" novalidate>
      <h2 class="h3">Send an inquiry</h2>
      <p class="f-sub">Fill this in and press send. WhatsApp opens with your message ready to go to {OFFICIAL}.</p>
      <div class="f-row">
        <label>Your name<input name="name" required autocomplete="name"></label>
        <label>Phone<input name="phone" type="tel" required autocomplete="tel" inputmode="tel"></label>
      </div>
      <div class="f-row">
        <label>Company / mill<input name="company" autocomplete="organization"></label>
        <label>City<input name="city" autocomplete="address-level2"></label>
      </div>
      <label>I am interested in
        <select name="topic">
          <option>Buying machinery</option><option>Selling machinery</option><option>Spinning spare parts</option>
          <option>Yarn</option><option>Cotton</option><option>Mill sale or purchase</option><option>Advice / valuation</option><option>Something else</option>
        </select>
      </label>
      <label>Details<textarea name="msg" rows="5" placeholder="Machine, make, model, quantity, or anything else that helps"></textarea></label>
      <p class="f-err" id="ferr" role="alert" hidden>Please add your name and phone number.</p>
      <button class="btn btn-wa btn-lg" type="submit">{ICON["wa"]}<span>Send on WhatsApp</span></button>
    </form>
  </div>
</section>
'''


# ---------------------------------------------------------------- STOCK
def stock_head(crumbs_html, eyebrow, title_html, lead_html, actions=""):
    return f'''<section class="phead stk-head">
  <div class="gear-bg" aria-hidden="true">{gear_svg()}</div>
  <div class="wrap phead-in">
    <nav class="crumbs" aria-label="Breadcrumb">{crumbs_html}</nav>
    <p class="eyebrow">{eyebrow}</p>
    <h1 class="h1 stk-h1">{title_html}</h1>
    <p class="lead">{lead_html}</p>
    {actions}
  </div>
</section>'''

STOCK_SCRIPTS = '<script src="{rel}' + V('js/stock.js') + '" defer></script>'
PDF_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14"/></svg>'

stock_index = stock_head('<a href="{rel}index.html">Home</a> <span>/</span> <span aria-current="page">Stock</span>',
    "Stock", 'What we have <span class="acc">in stock</span>',
    "What we have right now, department by department. Open a folder for pictures and details of every item, or download its stock list as a PDF.") + f'''
<section class="sec stk-sec">
  <div class="wrap">
    <div class="stk-folders" id="stkFolders" aria-live="polite">
      <div class="stk-skel"></div><div class="stk-skel"></div><div class="stk-skel"></div>
    </div>
  </div>
</section>
''' + cta_band("Need something that is not listed?", "Stock changes every week. Tell us what you are looking for and we will check the godown and our network.")

stock_folder = stock_head('<a href="/index.html">Home</a> <span>/</span> <a href="/stock.html">Stock</a> <span>/</span> <span aria-current="page" id="stkCrumb">Folder</span>',
    "Stock", '<span id="stkTitle">Loading</span>', '<span id="stkLead">Pictures and details of every item in this folder.</span>',
    f'<div class="stk-actions"><button class="btn btn-pri btn-lg" id="stkPdf" type="button" disabled>{PDF_ICON}<span>Download PDF</span></button><a class="btn btn-ghost btn-lg" href="/stock.html"><span>All folders</span></a></div>') + '''
<section class="sec stk-sec">
  <div class="wrap">
    <div class="stk-items" id="stkItems" aria-live="polite">
      <div class="stk-skel tall"></div><div class="stk-skel tall"></div><div class="stk-skel tall"></div>
    </div>
  </div>
</section>
''' + cta_band("Interested in something from this list?", "Call or WhatsApp us with the item name. Godown visits are by appointment.")

stock_item = stock_head('<a href="/index.html">Home</a> <span>/</span> <a href="/stock.html">Stock</a> <span>/</span> <a href="/stock.html" id="stkFolderLink">Folder</a> <span>/</span> <span aria-current="page" id="stkCrumb">Item</span>',
    '<span id="stkEyebrow">Stock</span>', '<span id="stkTitle">Loading</span>', '<span id="stkLead"></span>') + f'''
<section class="sec stk-sec">
  <div class="wrap stk-detail" id="stkDetail">
    <div class="stk-gallery" id="stkGallery"><div class="stk-skel tall"></div></div>
    <aside class="stk-info">
      <dl class="stk-dl" id="stkDl"></dl>
      <div class="stk-info-btns">
        <a class="btn btn-wa btn-lg" id="stkAsk" href="{wa_link()}" target="_blank" rel="noopener">{ICON["wa"]}<span>Ask about this item</span></a>
        <a class="btn btn-ghost btn-lg" id="stkBack" href="/stock.html"><span>Back to folder</span></a>
      </div>
    </aside>
  </div>
</section>
<div class="stk-lb" id="stkLb" hidden><button class="stk-lb-x" type="button" aria-label="Close">&times;</button><button class="stk-lb-p" type="button" aria-label="Previous picture">&#8249;</button><img alt=""><button class="stk-lb-n" type="button" aria-label="Next picture">&#8250;</button></div>
'''

NOTFOUND = pagehead("404", "This page <span class=\"acc\">is not here</span>", "The link may be old or mistyped.") + '''
<section class="sec"><div class="wrap" style="display:flex;gap:12px;flex-wrap:wrap">
<a class="btn btn-pri" href="/index.html"><span>Go to home</span></a><a class="btn btn-ghost" href="/contact.html"><span>Contact us</span></a></div></section>'''

# ---------------------------------------------------------------- STRUCTURED DATA
BIZ_ID = SITE + "/#business"
CEO_ID = CEO_SITE + "/#person"

def addr(street, city):
    a = {"@type": "PostalAddress", "addressLocality": city, "addressRegion": "Punjab", "addressCountry": "PK"}
    if street:
        a["streetAddress"] = street
    return a

BUSINESS = {
    "@type": "LocalBusiness", "@id": BIZ_ID, "name": "M Tech Textile Traders", "alternateName": "M Tech", "url": SITE + "/",
    "description": "Buying and selling new and pre-owned textile machinery, spinning spare parts, yarn and cotton, and complete spinning mills in Pakistan since 1988.",
    "logo": SITE + "/assets/img/icon-512.png", "image": SITE + "/assets/img/og.jpg",
    "telephone": tel(OFFICIAL), "email": EMAIL, "foundingDate": "1988",
    "founder": {"@type": "Person", "@id": CEO_ID, "name": "Abdul Rasheed Gill", "url": CEO_SITE + "/"},
    "address": addr("Main Bazar Rasheed Town, Near Post Office, Manga Mandi", "Lahore"),
    "department": [{"@type": "LocalBusiness", "name": "M Tech Textile Traders, Faisalabad warehouse",
                    "address": addr("Darul Ehsan Town", "Faisalabad"), "telephone": tel(OFFICIAL)}],
    "areaServed": [{"@type": "Country", "name": "Pakistan"}] + [{"@type": "City", "name": c} for c in
                   ("Lahore", "Faisalabad", "Karachi", "Hyderabad", "Nooriabad", "Multan", "Sheikhupura", "Mirpur")],
    "employee": [{"@id": SITE + "/team/" + t["slug"] + "#person"} for t in TEAM],
    "contactPoint": {"@type": "ContactPoint", "telephone": tel(OFFICIAL), "contactType": "sales",
                     "areaServed": "PK", "availableLanguage": ["en", "ur"]},
    "knowsAbout": ["Textile machinery", "Textile spinning machinery", "Used spinning machinery", "Spinning spare parts", "Ring frame spare parts",
                   "Autoconer spare parts", "Open-end spinning machinery", "Autocoro", "Cotton yarn trade", "Cotton trade", "Spinning mill sale and purchase",
                   "Machinery valuation", "New spinning mill setup"],
    "sameAs": [FB, IG, LI],
}
BIZ_REF = {"@id": BIZ_ID, "@type": "LocalBusiness", "name": "M Tech Textile Traders"}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "M Tech Textile Traders",
           "inLanguage": "en", "publisher": {"@id": BIZ_ID}}

def url_of(path):
    return SITE + "/" + clean(path)

def crumbs_ld(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": url_of(pth)} for i, (n, pth) in enumerate(items)]}

def graph(*nodes):
    return {"@context": "https://schema.org", "@graph": list(nodes)}

def webpage(path, kind, name, desc, extra=None):
    d = {"@type": kind, "@id": url_of(path) + "#webpage", "url": url_of(path), "name": name, "description": desc,
         "inLanguage": "en", "isPartOf": {"@id": SITE + "/#website"}, "about": {"@id": BIZ_ID}}
    d.update(extra or {})
    return d

SEO = {
    "index.html": ("Textile Machinery Pakistan | M Tech Textile Traders, Lahore",
                   "Textile machinery in Pakistan since 1988: new and used spinning machinery, spare parts, yarn, cotton, and complete mill sale and purchase. Lahore, Faisalabad."),
    "about.html": ("About Us | M Tech Textile Traders, Lahore, Since 1988",
                   "M Tech Textile Traders is a family textile machinery business serving Pakistan's spinning mills since 1988, from Manga Mandi, Lahore and Faisalabad."),
    "services.html": ("Textile Machinery Services Pakistan | M Tech Textile Traders",
                      "Textile machinery, spinning spare parts, yarn and cotton trade, and mill sale and purchase in Pakistan, from M Tech Textile Traders, Lahore and Faisalabad."),
    "services/machinery.html": ("Used Spinning Machinery Pakistan | M Tech Textile Traders",
                                "Used and new spinning machinery for sale in Pakistan: blowroom, carding, draw frames, ring frames, Autoconers, open-end. Lahore office, Faisalabad godown."),
    "services/spare-parts.html": ("Spinning Spare Parts in Lahore | M Tech Textile Traders",
                                  "Spinning spare parts in Lahore for every mill department: ring frame, carding, combing, simplex and Autoconer parts, new and used. Delivered across Pakistan."),
    "services/yarn-cotton.html": ("Cotton Yarn Traders in Pakistan | M Tech Textile Traders",
                                  "Cotton yarn traders in Pakistan: carded, combed, compact and open-end yarn, PC and CVC blends, viscose, and local and imported cotton. M Tech, Lahore."),
    "services/mill-sale-purchase.html": ("Spinning Mill for Sale in Pakistan | M Tech Textile Traders",
                                         "Spinning mill sale and purchase in Pakistan: buy or sell a complete mill or unit with M Tech, with brokerage, machinery valuation and new mill setup advice."),
    "team.html": ("Our Team | M Tech Textile Traders, Lahore & Faisalabad",
                  "Meet Abdul Rasheed Gill, founder of M Tech Textile Traders, and his four sons who run the Lahore office and Faisalabad warehouse of the textile machinery firm."),
    "stock.html": ("Used Machinery in Stock, Faisalabad | M Tech Textile Traders",
                   "Used textile and spinning machinery in stock with M Tech Textile Traders, by department: pictures, details and PDF stock lists. Godown in Faisalabad."),
    "contact.html": ("Contact M Tech Textile Traders | Lahore 0332-4681423",
                     "Call or WhatsApp M Tech Textile Traders on 0332-4681423. Head office in Manga Mandi, Lahore; machinery warehouse in Darul Ehsan Town, Faisalabad."),
}

# ---------------------------------------------------------------- SERVICE PAGE GUIDES + FAQ
# Company-specific claims here come only from facts already on the site or in BOT_FACTS (_worker.js),
# which Sufian supplied. Everything else is general, educational know-how about the service itself.
# Do not add prices, stock counts, delivery times, guarantees, client names or new numbers here.
SVC_MORE = {
 "machinery": dict(
  guide=dict(eyebrow="Buying guide", h2="Buying or selling used spinning machinery",
   sub="What to look at before you agree a price, whether you are buying one machine or a whole section.",
   items=[
    ("Machines we deal in",
     "<p>Our everyday work is with spinning machinery: Autocoro, RN and other open-end (rotor) machines, ring frames including Zinser, Autoconer winding machines, blowroom lines and draw frames — new and pre-owned, plus machinery we import for clients. Send the make, model and year of what you need or want to sell.</p>"),
    ("Start with make, model and year",
     "<p>The make, model and year of manufacture tell you which generation of technology you are getting, what speeds and counts the machine was built for, and how easy its parts will be to find. Two ring frames with the same spindle count can differ a lot in drafting system, drive and automation, so always note the serial number plate as well as the model name.</p>"),
    ("See it running if you can",
     "<p>A machine still running in a mill tells you more than one standing in a shed. Whether that is possible depends on the machine and where it is. If it is not running, look closely at the parts that wear: spindles and drafting rollers on a ring frame, wire on a card, splicers and drums on an Autoconer, rotors and opening rollers on open-end.</p>"),
    ("Check what comes with it",
     "<p>Ask exactly what is included: motors and drives, electrical panels, control units, suction and pneumafil, cans, bobbins and any spare parts. Missing accessories add cost and delay later, so they belong in the price discussion, not after it.</p>"),
    ("Match it to your line",
     "<p>A machine has to fit the sections before and after it. The output of blowroom, carding and draw frames should balance the ring frames or rotors they feed, and the counts you plan to spin decide whether you need combers, compact spinning or open-end. If you are unsure, ask before you buy.</p>"),
    ("Plan dismantling, transport and installation",
     "<p>Used machinery has to be dismantled, marked, loaded, moved and set up again. Agree who does each step, and at whose cost, before the deal is closed. M Tech arranges installation and shifting on request; it is charged separately from the machine.</p>"),
    ("Selling? Prepare the details",
     "<p>For a quick and fair valuation, send the make, model, year, number of spindles, deliveries or heads, the present condition, and clear photos of the nameplate and the main parts. The more complete the details, the more useful the first answer. Machinery we have right now is on our <a href=\"{rel}stock.html\">stock page</a>, which changes every week.</p>"),
   ]),
  faqs=[
   ("Do you sell both new and used textile machinery?",
    "Yes. We buy and sell new and pre-owned textile machinery. Spinning is our core; weaving, knitting, processing and utility machinery we handle on request."),
   ("Which machinery makes do you deal in?",
    "Makes that mills in Pakistan commonly run, including Rieter, Trützschler, Toyota, Murata, Schlafhorst, Savio, Zinser, Marzoli and LMW. We trade these makes but are not the official agent of any brand."),
   ("Do you buy old machinery?",
    f"Yes. Send the make, model, year and a few photos on WhatsApp to {OFFICIAL} and we will tell you what it is worth."),
   ("Can I see the machinery before buying?",
    f"Yes. Machinery at our warehouse in Darul Ehsan Town, Faisalabad can be seen by appointment. Please call {OFFICIAL} before you come so the visit is not wasted."),
   ("Do you arrange installation and shifting?",
    "Yes, on request. Installation and shifting are charged separately from the price of the machine."),
   ("Can you import machinery for us?",
    "Imports are part of our work. It is mostly good-condition used machinery, with new machinery on request. Timing depends on the machine and the country, so we confirm it case by case."),
   ("Do you sell outside Pakistan?",
    "For now we sell within Pakistan. Export is planned."),
  ]),
 "spare-parts": dict(
  guide=dict(eyebrow="Getting the right part", h2="How to match a spinning spare part",
   sub="A part that almost fits costs more than it saves. This is how to make sure it is the right one.",
   items=[
    ("Machine first, then the part",
     "<p>Tell us the make and model of the machine first, then the part. The same kind of part, a top roller or a spindle for example, comes in different sizes and designs for different machines, and sometimes for different versions of the same model.</p>"),
    ("Part number, photos, measurements",
     "<p>The surest match is the part number from the machine's parts catalogue or printed on the old part. If there is no number, send clear photos of the old part from more than one side, ideally next to a measuring tape, with its key sizes: diameter, length, bore, and the number of teeth on a gear.</p>"),
    ("New or pre-owned",
     "<p>We supply both. New parts make sense for wear items that decide yarn quality, such as cots, aprons, travellers and card wire. Good pre-owned parts can be a practical choice for slow-wearing parts, especially on older machines where new ones are hard to find. Ask about the condition before you decide.</p>"),
    ("Know which parts wear",
     "<ul class=\"guide-ul\"><li><b>Ring frame:</b> rings and travellers, cots, aprons and spindle tapes affect evenness and hairiness, so mills replace them on a schedule.</li><li><b>Carding:</b> cylinder, doffer and licker-in wire and flat tops lose sharpness over time, and blunt wire shows up as neps.</li><li><b>Winding:</b> splicer parts and drums on an Autoconer affect splice strength and cone build.</li></ul>"),
    ("Test one before you order many",
     "<p>When the same part is going onto many spindles or deliveries, fit and run one first. It is the easiest way to confirm size and finish before the full quantity is ordered.</p>"),
    ("Stock and delivery",
     "<p>Some parts are in stock and others are arranged on order. Parts are delivered all over Pakistan. If a part is not on our <a href=\"{rel}stock.html\">stock page</a>, ask anyway: we check the godown and our network.</p>"),
    ("Keep a record of what you fit",
     "<p>A simple list of part numbers, sources and fitting dates for each machine makes the next order faster, and shows which parts are wearing out sooner than they should. That is often the first sign of a setting or alignment problem.</p>"),
    ("Older machines, hard-to-find parts",
     "<p>For older or less common models, some new parts are no longer made. Good pre-owned parts taken from dismantled machines are often the practical answer, which is one reason our spare parts and machinery work go hand in hand.</p>"),
   ]),
  faqs=[
   ("Can you find a part from a photo?",
    f"Often, yes. Send clear photos of the part, its part number if it has one, and the make and model of the machine on WhatsApp to {OFFICIAL}. We will tell you whether we have it or can arrange it."),
   ("Do you supply new and used spare parts?",
    "Both. We supply new and pre-owned spinning spare parts for every department of a mill, from blowroom and carding to ring frame and winding."),
   ("Which machine makes do you supply parts for?",
    "Parts for the makes mills in Pakistan commonly run, including Rieter, Trützschler, Toyota, Zinser, Marzoli, Murata, Schlafhorst, Savio, Howa and LMW. We are not the official agent of these brands."),
   ("Are all parts in stock?",
    "Some parts are in stock and others are arranged on order. Tell us what you need and we will confirm."),
   ("Do you deliver outside Lahore?",
    "Yes. Spare parts are delivered all over Pakistan."),
   ("Can I come and see the parts?",
    f"Our office is in Manga Mandi, Lahore and our warehouse is in Darul Ehsan Town, Faisalabad. Visits are by appointment, so please call {OFFICIAL} first."),
  ]),
 "yarn-cotton": dict(
  guide=dict(eyebrow="Buying guide", h2="What to specify when buying yarn or cotton",
   sub="Clear specifications get you an accurate offer and the material you actually need.",
   items=[
    ("Count",
     "<p>Count is the thickness of the yarn. In Pakistan cotton yarn is usually quoted in English count (Ne): the higher the number, the finer the yarn. Give the exact count you need, for example 20s, 30s or 40s, and say whether it is single or ply.</p>"),
    ("Type of spinning",
     "<p>Carded yarn is the everyday choice for many fabrics. Combed yarn has the short fibres taken out, so it is cleaner, smoother and stronger and suits finer counts. Compact yarn is spun with an extra condensing zone that cuts hairiness further. Open-end (rotor) yarn is mostly used for coarser counts, in fabrics such as denim and towels.</p>"),
    ("Fibre and blend",
     "<p>Say whether you need 100% cotton, polyester, viscose or a blend. PC blends are polyester-rich; CVC (chief value cotton) blends are cotton-rich. Give the blend ratio you need, because two PC yarns of the same count can behave very differently in the fabric.</p>"),
    ("End use",
     "<p>Weaving and knitting yarns are made differently. Knitting yarn usually has less twist for a softer fabric and is often waxed; weaving yarn needs more twist for strength on the loom. Tell the seller the end use and the packing you want, usually cones.</p>"),
    ("Quality figures",
     "<p>For an important order, look at a yarn test report: count variation, strength, evenness (U% or CVm), imperfections (thin and thick places and neps) and hairiness.</p>"),
    ("Cotton: local and imported",
     "<p>When buying cotton the main points are staple length, micronaire (fineness), strength, trash content and moisture. Local and imported cotton differ in these, and the right choice depends on the count and quality you want to spin. We trade both, as lint and in bales.</p>"),
    ("Quantity, city and timing",
     "<p>Tell the seller the quantity, the city it has to reach and when you need it. Freight and delivery are worked out around these three, so an enquiry that includes them gets a clearer answer, faster.</p>"),
    ("One lot or several",
     "<p>For a large order, ask whether it comes from a single lot. Yarn from different lots, even of the same count and type, can differ slightly in shade after dyeing, which matters for fabric that will be dyed or cut together. For slub and fancy yarns, a sample or a photo of the fabric is the clearest way to describe what you need.</p>"),
   ]),
  faqs=[
   ("Which yarn counts do you deal in?",
    "Yarn in all counts. Tell us the count, type, blend and quantity you need and we will tell you what we can arrange."),
   ("Which types of yarn do you trade?",
    "Carded and combed cotton yarn, compact and open-end yarn, polyester, PC and CVC blends, viscose, and slub and fancy yarn."),
   ("Do you supply imported cotton?",
    "Yes. We trade both local and imported cotton, as lint and in bales, depending on what the client needs."),
   ("What is the minimum order?",
    f"Minimum order, delivery and freight depend on your requirement. Send us the details on WhatsApp at {OFFICIAL} and we will work out a solution."),
   ("How do I send a yarn or cotton enquiry?",
    f"WhatsApp or call {OFFICIAL} with the count, type, blend, quantity and the city it needs to reach."),
  ]),
 "mill-sale-purchase": dict(
  guide=dict(eyebrow="How it works", h2="How a mill sale or purchase works",
   sub="Selling or buying a mill takes time. These are the stages most deals go through.",
   items=[
    ("A first conversation",
     "<p>It starts with what is being sold or wanted: a complete mill, a unit or a single section, and whether land and building are part of it. A first conversation and initial guidance from us cost nothing.</p>"),
    ("Machinery list and inspection",
     "<p>Next comes a full machinery list, department by department: make, model, year, and the number of machines, spindles or rotors. Then the machinery is inspected on site for condition, upkeep and, where possible, how it runs.</p>"),
    ("Valuation",
     "<p>A mill's value depends on the age, make and condition of its machinery, how well the line is balanced, which spares and utilities come with it, and whether it is sold as a running unit or for dismantling. A detailed valuation is part of our paid advisory work.</p>"),
    ("Finding the other side",
     "<p>We buy and sell mills ourselves, and we act as the middleman when a buyer and a seller want someone both sides can trust.</p>"),
    ("Agreement and paperwork",
     "<p>Before anything is signed, both sides should be clear on exactly what is included: machinery, spare parts, and utilities such as compressors, generators and humidification. With M Tech, terms are agreed face to face and every deal is documented. The payment method is agreed per deal.</p>"),
    ("Dismantling, shifting and new setup",
     "<p>When machinery moves, it is dismantled section by section, marked, packed and loaded, then set up again. Installation and shifting are available on request. For owners setting up a new mill, our advice covers the machine mix, line balancing and layout.</p>"),
    ("Running unit or for dismantling",
     "<p>A buyer who will run the mill where it stands looks at the whole set-up: power, location, building and how the line performs today. A buyer who will move the machinery looks mainly at the machines and the cost of shifting them. Knowing which kind of buyer you are dealing with shapes both the price and the timeline.</p>"),
    ("More than the machines",
     "<p>A mill's running cost depends on more than its machinery. Power supply and generators, compressors, humidification and air conditioning, and the state of the building should all be checked alongside the machines, because they affect both the price and what it will cost to run.</p>"),
   ]),
  faqs=[
   ("Do you buy mills yourselves or only broker them?",
    "Both. We buy and sell complete mills and units ourselves, and we also work as the middleman between a buyer and a seller."),
   ("Can I sell only part of my mill?",
    "Yes. Along with complete mills we deal in units and sections, and in single machines through our <a href=\"machinery.html\">machinery service</a>."),
   ("Can you value my mill before I decide to sell?",
    "Yes. Machinery valuation is part of our advisory work. The first consultation is free; for detailed advice, please contact us."),
   ("Do you help set up a new spinning mill?",
    "Yes. New mill setup advice covers the machine mix, line balancing and layout, and planning for the production you want."),
   ("Which cities do you work in?",
    "Industrial cities all over Pakistan, including Karachi, Hyderabad, Nooriabad, Lahore, Faisalabad, Multan, Sheikhupura and Mirpur."),
   ("How do I start?",
    f"Call or WhatsApp {OFFICIAL} with the location of the mill and a short description of what you want to sell or buy, and we will arrange a meeting."),
  ]),
}

def build():
    def top(path, kind, body, crumb=None, nodes=(), **kw):
        t, d = SEO[path]
        extra = [crumbs_ld([("Home", "index.html"), (crumb, path)])] if crumb else []
        page(path, t, d, body, ld=graph(webpage(path, kind, t, d), *nodes, *extra), **kw)

    top("index.html", "WebPage", home, nodes=(BUSINESS, WEBSITE), bodycls="home vidhero",
        extra=f'<link rel="preload" href="{V("js/vendor/three-mt.min.js")}" as="script">\n')
    top("about.html", "AboutPage", about, "About")
    top("services.html", "CollectionPage", services, "Services", nodes=({"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": t, "url": url_of(f"services/{s}.html")} for i, (s, t, _, _) in enumerate(SERVICES)]},))

    svc_page("machinery", "Service 01 · Used spinning machinery", "Textile machinery, <span class=\"acc\">new and pre-owned</span>",
        "We buy and sell all types of new and pre-owned textile machinery. Spinning is our core, and we handle other departments when clients need them.",
        "ring-hall.jpg",
        "<p>Whether you are setting up a new unit, replacing a section, or selling machinery you no longer need, we deal directly. We inspect machinery, value it honestly and arrange the sale or purchase end to end.</p><p>Our warehouse in Faisalabad holds machinery you can see in person, by appointment. See what is <a href=\"{rel}stock.html\">in stock now</a>, and the <a href=\"spare-parts.html\">spinning spare parts</a> we supply to keep it running.</p>",
        [("Spinning preparatory", ["Blowroom lines", "Carding machines", "Draw frames", "Lap formers", "Combers", "Simplex / roving frames"]),
         ("Spinning", ["Ring frames", "Compact spinning systems", "Open-end (rotor) spinning", "Doubling and TFO"]),
         ("Winding & finishing", ["Autoconers", "Cone winding", "Yarn conditioning"]),
         ("Other departments, on request", ["Weaving", "Knitting", "Processing", "Utilities"])],
        '<div class="callout"><h3>Selling your machinery?</h3><p>Send the make, model, year and a few photos on WhatsApp. We will tell you what it is worth.</p><a class="btn btn-wa" href="' + wa_link("Assalam o Alaikum M Tech, I want to sell machinery: ") + '" target="_blank" rel="noopener">' + ICON["wa"] + '<span>Send details</span></a></div>')

    svc_page("spare-parts", "Service 02 · Spare parts, Lahore", "Spinning spare parts, <span class=\"acc\">all types</span>",
        "The parts that keep a spinning line running, supplied for the makes mills actually use.",
        "spare-parts.jpg",
        "<p>Spare parts are where M Tech began. We supply parts across every department of a spinning mill, new and pre-owned, and help you find the right part for your make and model. Looking for a whole machine instead? See our <a href=\"machinery.html\">used spinning machinery</a>.</p>",
        [("Ring frame & drafting parts", ["Spindles and spindle inserts", "Top rollers", "Rubber cots", "Top and bottom aprons", "Bottom fluted rollers", "Top arms / weighting arms", "Rings and travellers", "Bobbin holders", "Spindle tapes", "Tangential belts"]),
         ("Carding parts", ["Cylinder wire", "Doffer wire", "Licker-in wire", "Flat tops", "Card clothing", "Coiler parts"]),
         ("Combing & draw frame parts", ["Circular combs", "Top combs", "Draw frame rollers", "Cans and can springs"]),
         ("Simplex & Autoconer winding parts", ["Flyers", "Roving bobbins", "Autoconer splicer parts", "Winding drums"]),
         ("General mill parts", ["Bearings", "Gears", "Belts", "Pneumafil and suction parts", "Motors"])])

    svc_page("yarn-cotton", "Service 03 · Yarn traders", "Cotton yarn and cotton, <span class=\"acc\">traded</span>",
        "All kinds of yarn, and cotton both local and imported.",
        "yarn-cones.jpg",
        "<p>Our place in the spinning trade means we know both ends: the cotton that goes in and the yarn that comes out. We trade both, matching buyers and sellers with the counts and qualities they need.</p>",
        [("Yarn", ["Carded cotton yarn", "Combed cotton yarn", "Compact yarn", "Open-end yarn", "Polyester", "PC and CVC blends", "Viscose", "Slub and fancy yarn"]),
         ("Cotton", ["Local cotton", "Imported cotton", "Lint and bales"])],
        '<figure class="wide-img reveal-img"><img src="{rel}assets/img/cotton-bales.jpg" alt="Cotton bales in a warehouse" loading="lazy" width="1376" height="768"></figure>')

    svc_page("mill-sale-purchase", "Service 04 · Mills, Pakistan", "Spinning mill sale &amp; purchase, <span class=\"acc\">with advice</span>",
        "Buying or selling a complete mill, with an experienced hand on both sides of the table.",
        "mill-exterior.jpg",
        "<p>We have traded more than 50 mills. We buy and sell complete mills and units ourselves, and we act as the middleman when a buyer and seller need someone both sides can trust.</p><p>Advice comes with it. We help owners understand what their machinery is worth, how to set up a new mill, and how to get more from the production they have.</p>",
        [("Deals", ["Complete mill sale", "Complete mill purchase", "Units and sections", "Middleman / brokerage"]),
         ("Advisory", ["Machinery valuation", "New mill setup", "Production advice", "Upgrade planning", "Installation and shifting on request"])])

    top("team.html", "AboutPage", team, "Team")
    for t in TEAM:
        member_page(t)
    top("stock.html", "CollectionPage", stock_index, "Stock", scripts=STOCK_SCRIPTS)
    page("stock-folder.html", "Stock | M Tech Textile Traders", "Stock with pictures and details.", stock_folder, active="stock.html", rel="/", scripts=STOCK_SCRIPTS, sitemap=False, bodycls="stk-page")
    page("stock-item.html", "Stock | M Tech Textile Traders", "Stock with pictures and details.", stock_item, active="stock.html", rel="/", scripts=STOCK_SCRIPTS, sitemap=False, bodycls="stk-page")
    top("contact.html", "ContactPage", contact, "Contact", nodes=(BUSINESS,))

    # 404 with absolute paths
    nf = head("Page not found | M Tech Textile Traders", "This page could not be found. Browse textile machinery, spinning spare parts and stock from M Tech Textile Traders, Lahore.", "/", "404.html", noindex=True) + '<body>\n' + header("/", "") + f'<main id="main">{NOTFOUND.replace("{rel}", "/")}</main>' + footer("/")
    open(os.path.join(ROOT, "404.html"), "w").write(clean_links(nf, "/"))

    import datetime
    lastmod = os.environ.get("LASTMOD") or datetime.date.today().isoformat()
    urls = "".join(f"<url><loc>{SITE}/{clean(p)}</loc><lastmod>{lastmod}</lastmod></url>" for p in PAGES)
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nDisallow: /mtech-panel/\nDisallow: /api/\nSitemap: {SITE}/sitemap.xml\n")
    print("built", len(PAGES), "pages")

if __name__ == "__main__":
    build()
