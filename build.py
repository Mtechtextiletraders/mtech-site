#!/usr/bin/env python3
"""Builds the M Tech Textile Traders static site (shared header/footer)."""
import json, os, re, html

ROOT = os.path.dirname(os.path.abspath(__file__))
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

NAV = [("index.html", "Home"), ("about.html", "About"), ("services.html", "Services"), ("team.html", "Team"), ("contact.html", "Contact")]

def head(title, desc, rel, path, extra=""):
    canon = SITE + "/" + ("" if path == "index.html" else path)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canon}">
<meta name="theme-color" content="#0033F8">
<meta property="og:type" content="website">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{rel}assets/img/favicon.png" type="image/png" sizes="64x64">
<link rel="icon" href="{rel}assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="{rel}assets/img/apple-touch-icon.png">
<link rel="preload" href="{rel}assets/fonts/archivo-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{rel}assets/fonts/hanken-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{rel}css/style.css">
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
    <div><h4>Services</h4><ul>{svc}</ul></div>
    <div><h4>Company</h4><ul>
      <li><a href="{rel}about.html">About M Tech</a></li>
      <li><a href="{rel}team.html">Our team</a></li>
      <li><a href="{CEO_SITE}" target="_blank" rel="noopener">Abdul Rasheed Gill</a></li>
      <li><a href="{rel}contact.html">Contact</a></li></ul></div>
    <div><h4>Reach us</h4><ul class="ftr-c">
      <li><a href="tel:{tel(OFFICIAL)}">{ICON["ph"]}{OFFICIAL}</a></li>
      <li><a href="mailto:{EMAIL}">{ICON["mail"]}<span class="brk">{EMAIL}</span></a></li>
      <li>{ICON["pin"]}<span>Office: {OFFICE}</span></li>
      <li>{ICON["pin"]}<span>Warehouse: {WAREHOUSE}</span></li></ul></div>
  </div>
  <div class="wrap ftr-bot">
    <span>© <span id="yr">2026</span> M Tech Textile Traders. All rights reserved.</span>
    <span class="credit">Designed by <a href="https://navifexpro.com" target="_blank" rel="noopener">navifexpro.com</a></span>
  </div>
</footer>
<a class="fab" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">{ICON["wa"]}</a>
<script src="{rel}js/vendor/gsap.min.js" defer></script>
<script src="{rel}js/vendor/ScrollTrigger.min.js" defer></script>
<script src="{rel}js/vendor/lenis.min.js" defer></script>
<script src="{rel}js/main.js" defer></script>
</body>
</html>
'''

def page(path, title, desc, body, active=None, bodycls=""):
    depth = path.count("/")
    rel = "../" * depth
    body = body.replace("{rel}", rel)
    out = head(title, desc, rel, path) + f'<body class="{bodycls}">\n' + header(rel, active or path) + f'<main id="main">\n{body}\n</main>\n' + footer(rel)
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, "w").write(out)
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
LINE = [("Blowroom", "Opening & cleaning"), ("Carding", "Card & web"), ("Draw frame", "Drafting"), ("Comber", "Lap & combing"),
        ("Simplex", "Roving"), ("Ring frame", "Spinning"), ("Autoconer", "Winding"), ("Open-end", "Rotor spinning")]

home = f'''
<section class="hero" id="top">
  <div class="hero-grid-bg" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-copy">
      <p class="eyebrow"><span class="dot"></span> Lahore · Faisalabad · Since 1988</p>
      <h1 class="hero-h">
        <span class="ln"><span>Textile machinery,</span></span>
        <span class="ln"><span>bought and sold</span></span>
        <span class="ln"><span class="acc">the right way.</span></span>
      </h1>
      <p class="hero-sub">We specialize in buying and selling all types of new and pre-owned textile machinery. Spinning is our core, with spare parts, yarn and cotton, and complete mills alongside it.</p>
      <div class="hero-btns">
        <a class="btn btn-pri btn-lg" href="{{rel}}services.html"><span>Our services</span>{ICON["arr"]}</a>
        <a class="btn btn-wa btn-lg" href="{wa_link('Assalam o Alaikum M Tech, I want to ask about ')}" target="_blank" rel="noopener">{ICON["wa"]}<span>WhatsApp</span></a>
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="ring r1">{gear_svg(32, 330, 26, "g1")}</div>
      <div class="ring r2">{gear_svg(18, 300, 40, "g2")}</div>
      <div class="hero-logo">{logo_svg("hl", ids=True)}</div>
      <div class="hero-card c1"><b data-count="1988" data-plain>1988</b><span>Founded</span></div>
      <div class="hero-card c2"><b><span data-count="50">50</span>+</b><span>Mills traded</span></div>
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true"><span></span></div>
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
    <div class="svc-grid">
      {"".join(f'''<a class="svc-card" href="{{rel}}services/{s}.html">
        <div class="svc-img"><img src="{{rel}}assets/img/{im}" alt="" loading="lazy" width="1376" height="768"></div>
        <div class="svc-body"><span class="svc-n">0{i+1}</span><h3>{t}</h3><p>{d}</p><span class="more">Learn more {ICON["arr"]}</span></div>
      </a>''' for i, (s, t, d, im) in enumerate(SERVICES))}
    </div>
  </div>
</section>

<section class="line-sec" id="line">
  <div class="wrap">
    <div class="sec-hd light">
      <p class="eyebrow">Across the spinning line</p>
      <h2 class="h2 reveal-lines">From the first bale to the final cone</h2>
      <p class="sec-sub">We trade machinery and parts for every department of a spinning mill. Other departments, like weaving and processing, we handle when a client needs it.</p>
    </div>
  </div>
  <div class="line-track">
    <svg class="thread" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden="true">
      <path id="threadPath" d="M0 110 C 120 30, 220 190, 340 110 S 560 30, 680 110 S 900 190, 1020 110 S 1240 30, 1360 110 S 1520 170, 1600 110" fill="none" stroke="url(#tg)" stroke-width="3" stroke-linecap="round"/>
      <defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".2"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#FF8A4C"/></linearGradient></defs>
    </svg>
    <ol class="line-nodes">
      {"".join(f'<li class="node"><span class="nd"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/><circle cx="20" cy="20" r="6" fill="currentColor"/></svg></span><b>{a}</b><small>{b}</small></li>' for a, b in LINE)}
    </ol>
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

def svc_page(slug, eyebrow, title, lead, img, intro, groups, extra_html=""):
    i = [s for s, *_ in SERVICES].index(slug)
    others = [x for x in SERVICES if x[0] != slug]
    g = "".join(f'''<div class="grp"><h3>{gt}</h3><ul class="chips">{"".join(f"<li>{x}</li>" for x in items)}</ul></div>''' for gt, items in groups)
    nxt = SERVICES[(i + 1) % 4]
    body = pagehead(eyebrow, title, lead, [("index.html", "Home"), ("services.html", "Services"), (None, SERVICES[i][1])], img) + f'''
<section class="sec">
  <div class="wrap svc-detail">
    <div class="svc-intro">{intro}</div>
    <div class="grps">{g}</div>
    {extra_html}
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    <div class="sec-hd"><p class="eyebrow">Other services</p></div>
    <div class="svc-grid three">
      {"".join(f'''<a class="svc-card" href="{s}.html"><div class="svc-img"><img src="{{rel}}assets/img/{im}" alt="" loading="lazy" width="1376" height="768"></div><div class="svc-body"><h3>{t}</h3><p>{d}</p><span class="more">Learn more {ICON["arr"]}</span></div></a>''' for s, t, d, im in others)}
    </div>
  </div>
</section>
{cta_band()}'''
    page(f"services/{slug}.html", f"{SERVICES[i][1]} | M Tech Textile Traders", lead, body, active="services.html")

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
    page(f"team/{t['slug']}.html", f"{t['name']}, {t['role']} | M Tech Textile Traders", f"{t['name']}, {t['role']} at M Tech Textile Traders. {t['short']}", body, active="team.html")

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

NOTFOUND = pagehead("404", "This page <span class=\"acc\">is not here</span>", "The link may be old or mistyped.") + '''
<section class="sec"><div class="wrap" style="display:flex;gap:12px;flex-wrap:wrap">
<a class="btn btn-pri" href="/index.html"><span>Go to home</span></a><a class="btn btn-ghost" href="/contact.html"><span>Contact us</span></a></div></section>'''

def build():
    page("index.html", "M Tech Textile Traders | New & Pre-owned Textile Machinery, Lahore",
         "M Tech Textile Traders buys and sells new and pre-owned textile machinery, spinning spare parts, yarn and cotton, and complete mills across Pakistan. Since 1988.", home, bodycls="home")
    page("about.html", "About | M Tech Textile Traders", "The story of M Tech Textile Traders: a family business serving Pakistan's spinning industry since 1988.", about)
    page("services.html", "Services | M Tech Textile Traders", "Textile machinery, spinning spare parts, yarn and cotton trade, and mill sale and purchase.", services)

    svc_page("machinery", "Service 01", "Textile machinery, <span class=\"acc\">new and pre-owned</span>",
        "We buy and sell all types of new and pre-owned textile machinery. Spinning is our core, and we handle other departments when clients need them.",
        "ring-hall.jpg",
        "<p>Whether you are setting up a new unit, replacing a section, or selling machinery you no longer need, we deal directly. We inspect machinery, value it honestly and arrange the sale or purchase end to end.</p><p>Our warehouse in Faisalabad holds machinery you can see in person, by appointment.</p>",
        [("Spinning preparatory", ["Blowroom lines", "Carding machines", "Draw frames", "Lap formers", "Combers", "Simplex / roving frames"]),
         ("Spinning", ["Ring frames", "Compact spinning systems", "Open-end (rotor) spinning", "Doubling and TFO"]),
         ("Winding & finishing", ["Autoconers", "Cone winding", "Yarn conditioning"]),
         ("Other departments, on request", ["Weaving", "Knitting", "Processing", "Utilities"])],
        '<div class="callout"><h3>Selling your machinery?</h3><p>Send the make, model, year and a few photos on WhatsApp. We will tell you what it is worth.</p><a class="btn btn-wa" href="' + wa_link("Assalam o Alaikum M Tech, I want to sell machinery: ") + '" target="_blank" rel="noopener">' + ICON["wa"] + '<span>Send details</span></a></div>')

    svc_page("spare-parts", "Service 02", "Spinning spare parts, <span class=\"acc\">all types</span>",
        "The parts that keep a spinning line running, supplied for the makes mills actually use.",
        "spare-parts.jpg",
        "<p>Spare parts are where M Tech began. We supply parts across every department of a spinning mill, new and pre-owned, and help you find the right part for your make and model.</p>",
        [("Drafting & ring frame", ["Spindles and spindle inserts", "Top rollers", "Rubber cots", "Top and bottom aprons", "Bottom fluted rollers", "Top arms / weighting arms", "Rings and travellers", "Bobbin holders", "Spindle tapes", "Tangential belts"]),
         ("Carding", ["Cylinder wire", "Doffer wire", "Licker-in wire", "Flat tops", "Card clothing", "Coiler parts"]),
         ("Combing & drawing", ["Circular combs", "Top combs", "Draw frame rollers", "Cans and can springs"]),
         ("Simplex & winding", ["Flyers", "Roving bobbins", "Autoconer splicer parts", "Winding drums"]),
         ("General", ["Bearings", "Gears", "Belts", "Pneumafil and suction parts", "Motors"])])

    svc_page("yarn-cotton", "Service 03", "Yarn and cotton, <span class=\"acc\">traded</span>",
        "All kinds of yarn, and cotton both local and imported.",
        "yarn-cones.jpg",
        "<p>Our place in the spinning trade means we know both ends: the cotton that goes in and the yarn that comes out. We trade both, matching buyers and sellers with the counts and qualities they need.</p>",
        [("Yarn", ["Carded cotton yarn", "Combed cotton yarn", "Compact yarn", "Open-end yarn", "Polyester", "PC and CVC blends", "Viscose", "Slub and fancy yarn"]),
         ("Cotton", ["Local cotton", "Imported cotton", "Lint and bales"])],
        '<figure class="wide-img reveal-img"><img src="{rel}assets/img/cotton-bales.jpg" alt="Cotton bales in a warehouse" loading="lazy" width="1376" height="768"></figure>')

    svc_page("mill-sale-purchase", "Service 04", "Mill sale & purchase, <span class=\"acc\">with advice</span>",
        "Buying or selling a complete mill, with an experienced hand on both sides of the table.",
        "mill-exterior.jpg",
        "<p>We have traded more than 50 mills. We buy and sell complete mills and units ourselves, and we act as the middleman when a buyer and seller need someone both sides can trust.</p><p>Advice comes with it. We help owners understand what their machinery is worth, how to set up a new mill, and how to get more from the production they have.</p>",
        [("Deals", ["Complete mill sale", "Complete mill purchase", "Units and sections", "Middleman / brokerage"]),
         ("Advisory", ["Machinery valuation", "New mill setup", "Production advice", "Upgrade planning", "Installation and shifting on request"])])

    page("team.html", "Team | M Tech Textile Traders", "Meet Abdul Rasheed Gill and his four sons, the family behind M Tech Textile Traders.", team)
    for t in TEAM:
        member_page(t)
    page("contact.html", "Contact | M Tech Textile Traders", f"Call or WhatsApp M Tech Textile Traders on {OFFICIAL}. Office in Manga Mandi, Lahore; warehouse in Faisalabad.", contact)

    # 404 with absolute paths
    nf = head("Page not found | M Tech Textile Traders", "Page not found.", "/", "404.html") + '<body>\n' + header("/", "") + f'<main id="main">{NOTFOUND.replace("{rel}", "/")}</main>' + footer("/")
    open(os.path.join(ROOT, "404.html"), "w").write(nf)

    urls = "".join(f"<url><loc>{SITE}/{'' if p == 'index.html' else p}</loc></url>" for p in PAGES)
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    open(os.path.join(ROOT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n")
    print("built", len(PAGES), "pages")

if __name__ == "__main__":
    build()
