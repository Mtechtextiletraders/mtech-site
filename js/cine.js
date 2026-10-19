/* M Tech: cinematic hero. A machined-steel M Tech gear, a second gear, a ring-frame spindle with its yarn cone
   and an open-end rotor, all built in code with three.js. Scroll drives the story 1:1 (four chapters). */
(() => {
  const sec = document.querySelector('.cine');
  if (!sec) return;
  const T = window.THREE;
  const stage = sec.querySelector('.cine-stage'), glBox = sec.querySelector('.cine-gl');
  const labsBox = sec.querySelector('.cine-labs'), svg = sec.querySelector('.cine-svg');
  const chs = [...sec.querySelectorAll('.cine-ch')], rail = [...sec.querySelectorAll('.cine-rail li')];
  const bar = sec.querySelector('.cine-bar i'), yearEl = sec.querySelector('[data-y]');
  const cue = sec.querySelector('.scroll-cue');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasG = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const animated = !reduce && hasG;
  const phone = matchMedia('(max-width: 760px)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ss = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ================================================================ scroll + chapters (works with or without WebGL) */
  const CH = [0, .24, .5, .76];
  let pRaw = animated ? 0 : 1, p = pRaw, cur = -1, yearMax = 0;
  if (animated) {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (s) => { pRaw = s.progress; } });
    pRaw = p = st.progress;
    rail.forEach((li, k) => li.addEventListener('click', () => {
      const y = st.start + (st.end - st.start) * (CH[k] + (k ? .06 : 0));
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.4 }) : scrollTo({ top: y, behavior: 'smooth' });
    }));
    if (yearEl) yearEl.textContent = '1988';
  }
  const scramble = (el, final) => {
    if (!el) return; let n = 0;
    const id = setInterval(() => {
      n++; el.textContent = n > 7 ? final : final.replace(/\d/g, () => Math.floor(Math.random() * 10));
      if (n > 7) clearInterval(id);
    }, 45);
  };
  const setChapter = (q) => {
    const i = q >= CH[3] ? 3 : q >= CH[2] ? 2 : q >= CH[1] ? 1 : 0;
    if (i !== cur) {
      cur = i;
      chs.forEach((c, k) => { c.classList.toggle('on', k === i); c.classList.toggle('past', k < i); });
      rail.forEach((r, k) => { r.classList.toggle('on', k === i); r.classList.toggle('done', k < i); });
      const nb = chs[i].querySelector('.cine-num b'); if (nb) scramble(nb, nb.dataset.n || (nb.dataset.n = nb.textContent));
      sec.dataset.ch = i;
    }
    if (bar) bar.style.transform = `scaleX(${q.toFixed(4)})`;
    if (cue) cue.style.opacity = q > .015 ? 0 : '';
    // TASK B: the year counts 1988 -> 2026 as the last chapter plays, then stays on 2026
    if (yearEl && animated) {
      const y = ss(seg(q, .8, .95));
      if (y > yearMax) { yearMax = y; yearEl.textContent = String(1988 + Math.round(38 * yearMax)); }
    }
  };
  if (animated) setChapter(p);

  /* ================================================================ WebGL */
  let glOk = false;
  const force = /[?&]gl=force/.test(location.search);
  try {
    const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
    glOk = !!T && !!g;
    // software rasterisers (no GPU) cannot hold a frame rate: keep the static hero instead
    const di = g && g.getExtension('WEBGL_debug_renderer_info');
    const name = di ? String(g.getParameter(di.UNMASKED_RENDERER_WEBGL)) : '';
    if (!force && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)) glOk = false;
    const lose = g && g.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
  } catch (e) { glOk = false; }
  if (/[?&]gl=off/.test(location.search)) glOk = false;
  if (!glOk) {
    sec.classList.add('nogl');
    if (animated) { const loop = () => { p = pRaw; setChapter(p); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
    return;
  }

  const R = new T.WebGLRenderer({ antialias: !phone, powerPreference: 'high-performance' });
  const DPR = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 1.75);
  R.setPixelRatio(DPR);
  R.outputColorSpace = T.SRGBColorSpace;
  R.toneMapping = T.ACESFilmicToneMapping;
  R.toneMappingExposure = .98;
  R.shadowMap.enabled = !phone;
  R.shadowMap.type = T.PCFSoftShadowMap;
  glBox.appendChild(R.domElement);

  const BG = 0x030817;
  const scene = new T.Scene();
  scene.background = new T.Color(BG);
  scene.fog = new T.FogExp2(0x040b22, .05);
  const cam = new T.PerspectiveCamera(32, 1, .1, 80);

  /* ---------- procedural studio environment (softboxes in a dark mill hall), prefiltered with PMREM ---------- */
  {
    const env = new T.Scene();
    env.add(new T.Mesh(new T.BoxGeometry(30, 16, 30), new T.MeshBasicMaterial({ color: 0x0b1433, side: T.BackSide })));
    const panel = (w, h, col, k, x, y, z, rx = 0, ry = 0) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(col).multiplyScalar(k), side: T.DoubleSide }));
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0); env.add(m);
    };
    panel(10, 4, 0xffffff, 6, 0, 7.5, 2, Math.PI / 2);          // top softbox
    panel(2, 10, 0xdfe7ff, 3.2, -11, 2, 2, 0, Math.PI / 2);     // left strip
    panel(2, 10, 0x6f8dff, 2.4, 11, 1, -2, 0, -Math.PI / 2);    // right blue strip
    panel(14, 1.2, 0xff8a4c, 1.6, 0, -2, -12);                  // warm low bar (mill floor lights)
    for (let i = -3; i <= 3; i++) panel(1.4, .3, 0xffffff, 4, i * 3.4, 7, -10, Math.PI / 2.4); // ceiling tubes
    const pm = new T.PMREMGenerator(R);
    scene.environment = pm.fromScene(env, .03).texture;
    pm.dispose();
  }
  scene.environmentIntensity = .75;

  /* ---------- lights ---------- */
  const rig = new T.Group(); scene.add(rig);
  const spot = new T.SpotLight(0xfff1e0, 0, 0, .46, .7, 2);
  spot.position.set(1.2, 8.5, 4);
  spot.castShadow = !phone;
  if (!phone) { spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -.0005; spot.shadow.normalBias = .02; spot.shadow.camera.near = 3; spot.shadow.camera.far = 20; }
  scene.add(spot); scene.add(spot.target);
  const rimL = new T.DirectionalLight(0x5a7dff, 2.6); rimL.position.set(-6, 3, -6); scene.add(rimL);
  const rim2 = new T.DirectionalLight(0xbcd0ff, .8); rim2.position.set(6, 2, -4); scene.add(rim2);
  const warm = new T.PointLight(0xff7a2e, 0, 14, 2); warm.position.set(3.6, -1.2, 3.4); scene.add(warm);
  scene.add(new T.HemisphereLight(0x8fa6ff, 0x02040c, .18));

  /* ---------- textures (procedural) ---------- */
  const canvasTex = (w, h, draw, srgb) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace;
    t.anisotropy = Math.min(8, R.capabilities.getMaxAnisotropy()); return t;
  };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // machined face: concentric turning marks (roughness)
  const brushed = canvasTex(512, 512, (g, w) => {
    g.fillStyle = 'rgb(120,120,120)'; g.fillRect(0, 0, w, w);
    for (let i = 0; i < 1600; i++) {
      const r = rnd() * w * .72, v = 70 + rnd() * 120, a = rnd() * Math.PI * 2;
      g.strokeStyle = `rgba(${v},${v},${v},.35)`; g.lineWidth = .4 + rnd() * 1.4;
      g.beginPath(); g.arc(w / 2, w / 2, r, a, a + .4 + rnd() * 2.2); g.stroke();
    }
  });
  // cross-wound cotton yarn
  const yarnMap = canvasTex(512, 512, (g, w) => {
    g.fillStyle = '#efe9dd'; g.fillRect(0, 0, w, w);
    for (let k = 0; k < 2; k++) for (let i = -40; i < 80; i++) {
      const v = 200 + rnd() * 50;
      g.strokeStyle = `rgba(${v - 30},${v - 38},${v - 52},${.25 + rnd() * .3})`; g.lineWidth = 1 + rnd() * 2.2;
      g.beginPath(); const x = i * 9; g.moveTo(x, 0); g.lineTo(x + (k ? 1 : -1) * w * .55, w); g.stroke();
    }
    for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(255,255,255,${rnd() * .25})`; g.fillRect(rnd() * w, rnd() * w, 1 + rnd() * 3, 1); }
  }, true);
  yarnMap.wrapS = yarnMap.wrapT = T.RepeatWrapping; yarnMap.repeat.set(5, 3);
  const yarnBump = yarnMap.clone(); yarnBump.colorSpace = T.NoColorSpace; yarnBump.needsUpdate = true;

  /* ---------- materials (PBR) ---------- */
  const steelTex = (rTip) => { const t = brushed.clone(); t.needsUpdate = true; t.repeat.set(1 / (2 * rTip * 1.05), 1 / (2 * rTip * 1.05)); t.offset.set(.5, .5); return t; };
  const M = {
    gear: new T.MeshPhysicalMaterial({ color: 0xd9dee8, metalness: 1, roughness: .62, roughnessMap: steelTex(1.6), clearcoat: .35, clearcoatRoughness: .3 }),
    gear2: new T.MeshPhysicalMaterial({ color: 0xa9b2c2, metalness: 1, roughness: .7, roughnessMap: steelTex(1), clearcoat: .2, clearcoatRoughness: .35 }),
    blue: new T.MeshPhysicalMaterial({ color: 0x0a3cff, metalness: .55, roughness: .3, clearcoat: 1, clearcoatRoughness: .08 }),
    orange: new T.MeshPhysicalMaterial({ color: 0xe0560c, metalness: .35, roughness: .32, clearcoat: 1, clearcoatRoughness: .1 }),
    polish: new T.MeshPhysicalMaterial({ color: 0xe8ecf3, metalness: 1, roughness: .14 }),
    dark: new T.MeshStandardMaterial({ color: 0x151a26, metalness: .6, roughness: .45 }),
    tube: new T.MeshPhysicalMaterial({ color: 0xd2520f, roughness: .55, sheen: .4 }),
    yarn: new T.MeshPhysicalMaterial({ color: 0xffffff, map: yarnMap, bumpMap: yarnBump, bumpScale: 1.2, roughness: .92, sheen: 1, sheenColor: new T.Color(0xffffff), sheenRoughness: .55 }),
  };

  const shadowy = (m) => { m.castShadow = m.receiveShadow = !phone; return m; };

  /* ---------- the M Tech gear: scalloped teeth like the logo, machined ring, blue M, orange arc ---------- */
  const gearShape = (N, rTip, rRoot, rHole, holes = []) => {
    const s = new T.Shape(), K = N * 36;
    for (let i = 0; i <= K; i++) {
      const a = i / K * Math.PI * 2, t = (a * N / (Math.PI * 2)) % 1;
      const prof = ss(seg(t, .04, .2)) * (1 - ss(seg(t, .5, .66)));
      const r = rRoot + (rTip - rRoot) * prof, x = Math.cos(a) * r, y = Math.sin(a) * r;
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    }
    const hole = (x, y, r) => { const h = new T.Path(); h.absarc(x, y, r, 0, Math.PI * 2, true); s.holes.push(h); };
    hole(0, 0, rHole); holes.forEach((h) => hole(...h));
    return s;
  };
  const TOOTH_C = .35; // tooth centre as a fraction of one pitch (from the profile above)
  const extrude = (shape, depth, bevel) => {
    const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * .8, bevelSegments: phone ? 2 : 4, curveSegments: 40 });
    g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g;
  };

  const N1 = 12, N2 = 8, P1 = (1.6 + 1.3) / 2, P2 = (1.12 + .82) / 2;
  const gear = new T.Group(); rig.add(gear);
  const gearBody = shadowy(new T.Mesh(extrude(gearShape(N1, 1.6, 1.3, .98), .36, .05), M.gear));
  const turn = new T.Group(); gear.add(turn); turn.add(gearBody);
  const logo = new T.Group(); gear.add(logo);
  // inner bore lip
  const lip = shadowy(new T.Mesh(new T.TorusGeometry(.98, .035, 12, 96), M.polish)); lip.scale.z = 3; turn.add(lip);
  // orange arc (logo)
  const arc = shadowy(new T.Mesh(new T.TorusGeometry(.84, .05, 16, 80, Math.PI * .62), M.orange));
  arc.rotation.z = Math.PI * .5; logo.add(arc);
  // blue M
  {
    const m = [[0, 0], [.26, 0], [.26, .66], [.5, .2], [.7, .2], [.94, .66], [.94, 0], [1.2, 0], [1.2, 1.1], [.93, 1.1], [.6, .48], [.27, 1.1], [0, 1.1]];
    const s = new T.Shape(m.map(([x, y]) => new T.Vector2((x - .6) * .92, (y - .55) * .92)));
    const g = new T.ExtrudeGeometry(s, { depth: .2, bevelEnabled: true, bevelThickness: .03, bevelSize: .025, bevelSegments: 3 });
    g.translate(0, 0, -.1);
    const mm = shadowy(new T.Mesh(g, M.blue)); mm.position.z = .02; logo.add(mm);
    var Mmesh = mm;
  }

  // second gear with lightening holes
  const small = new T.Group(); rig.add(small);
  {
    const holes = [0, 1, 2, 3].map((k) => [Math.cos(k * Math.PI / 2 + .78) * .52, Math.sin(k * Math.PI / 2 + .78) * .52, .15]);
    small.add(shadowy(new T.Mesh(extrude(gearShape(N2, 1.12, .82, .2, holes), .3, .04), M.gear2)));
    const hub = shadowy(new T.Mesh(new T.CylinderGeometry(.27, .27, .5, 40), M.polish)); hub.rotation.x = Math.PI / 2; small.add(hub);
    const bore = new T.Mesh(new T.CylinderGeometry(.1, .1, .52, 24), M.dark); bore.rotation.x = Math.PI / 2; small.add(bore);
  }

  // ring-frame spindle
  const spinner = new T.Group(); rig.add(spinner);
  const spindle = new T.Group(); spinner.add(spindle);
  {
    const prof = [[0, 0], [.14, 0], [.14, .48], [.11, .5], [.11, .58], [.06, .6], [.055, .9], [.048, 2.55], [.035, 2.7], [.02, 2.76], [0, 2.77]].map(([x, y]) => new T.Vector2(x, y));
    spindle.add(shadowy(new T.Mesh(new T.LatheGeometry(prof, 48), M.polish)));
    const bolster = shadowy(new T.Mesh(new T.CylinderGeometry(.17, .19, .48, 40), M.dark)); bolster.position.y = .24; spindle.add(bolster);
    const wharve = shadowy(new T.Mesh(new T.CylinderGeometry(.2, .2, .2, 48), M.gear2)); wharve.position.y = .74; spindle.add(wharve);
    const tape = new T.Mesh(new T.TorusGeometry(.205, .02, 8, 48), M.dark); tape.rotation.x = Math.PI / 2; tape.position.y = .74; spindle.add(tape);
  }
  // yarn cone on the spindle
  const cone = new T.Group(); spinner.add(cone);
  const tubeR = (y) => lerp(.2, .11, (y - .95) / 1.7);
  {
    const tp = [[.2, .95], [.11, 2.65]];
    const tg = new T.LatheGeometry([new T.Vector2(tp[0][0], tp[0][1]), new T.Vector2(tp[1][0], tp[1][1])], 48);
    const tube = shadowy(new T.Mesh(tg, M.tube)); M.tube.side = T.DoubleSide; cone.add(tube);
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const y = lerp(1.08, 2.4, i / 24), e = Math.sin(Math.PI * clamp(i / 24 * 1.08)) ** .35;
      pts.push(new T.Vector2(tubeR(y) + .44 * e * lerp(1, .72, i / 24), y));
    }
    pts.unshift(new T.Vector2(tubeR(1.08) - .01, 1.08)); pts.push(new T.Vector2(tubeR(2.4) - .01, 2.4));
    var yarnBody = shadowy(new T.Mesh(new T.LatheGeometry(pts, 72), M.yarn)); cone.add(yarnBody);
  }
  // yarn thread from the guide down to the cone
  const NT = 28;
  const thread = new T.Line(new T.BufferGeometry().setAttribute('position', new T.BufferAttribute(new Float32Array(NT * 3), 3)),
    new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 }));
  thread.frustumCulled = false; spinner.add(thread);
  const guide = shadowy(new T.Mesh(new T.TorusGeometry(.07, .014, 8, 24, Math.PI * 1.6), M.polish)); guide.position.set(.0, 3.25, 0); guide.rotation.x = Math.PI / 2; spinner.add(guide);

  // open-end rotor
  const rotor = new T.Group(); rig.add(rotor);
  {
    const prof = [[0, -.9], [.06, -.9], [.06, 0], [.12, .02], [.5, .1], [.62, .3], [.6, .44], [.54, .46], [.5, .32], [.4, .2], [.0, .14]].map(([x, y]) => new T.Vector2(x, y));
    rotor.add(shadowy(new T.Mesh(new T.LatheGeometry(prof, 64), M.polish)));
    const ring = shadowy(new T.Mesh(new T.TorusGeometry(.56, .025, 8, 64), M.orange)); ring.rotation.x = Math.PI / 2; ring.position.y = .3; rotor.add(ring);
  }

  /* ---------- floor, halo, light cone, haze, cotton fibres ---------- */
  const floor = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshStandardMaterial({ color: 0x07102c, roughness: .42, metalness: .4 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.55; floor.receiveShadow = !phone; scene.add(floor);

  const halo = new T.Mesh(new T.PlaneGeometry(9, 9), new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uO: { value: .6 } },
    vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 v;uniform float uO;void main(){float d=length(v-.5)*2.;float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vec3(.12,.25,1.)*a*uO,1.);}',
  }));
  halo.position.set(0, .2, -2.6); scene.add(halo);

  const beamMat = new T.ShaderMaterial({
    transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.FrontSide, uniforms: { uO: { value: 0 } },
    vertexShader: 'varying float vY;varying vec3 vN;varying vec3 vV;void main(){vY=position.y/9.+.5;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'varying float vY;varying vec3 vN;varying vec3 vV;uniform float uO;void main(){float e=pow(abs(dot(vN,vV)),2.5);float a=pow(vY,1.6)*e*uO;gl_FragColor=vec4(vec3(1.,.95,.86)*a,1.);}',
  });
  const beam = new T.Mesh(new T.ConeGeometry(3.4, 9, 48, 1, true), beamMat);
  scene.add(beam);
  {
    // point the cone from the spot to the target
    const from = spot.position.clone(), to = new T.Vector3(0, -2.5, 0), mid = from.clone().add(to).multiplyScalar(.5);
    beam.position.copy(mid); beam.lookAt(to); beam.rotateX(-Math.PI / 2); beam.scale.y = from.distanceTo(to) / 9;
  }

  const NOISE = 'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}';
  const hazes = [];
  const hazeLayer = (z, y, op, speed, w = 26) => {
    const m = new T.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uO: { value: op }, uS: { value: speed }, uK: { value: 1 } },
      vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: NOISE + 'varying vec2 v;uniform float uT,uO,uS,uK;void main(){vec2 q=v*vec2(3.2,1.6);float f=fbm(q+vec2(uT*uS,uT*uS*.3));f=fbm(q*1.3+f*1.6-vec2(uT*uS*.5,0.));float edge=smoothstep(0.,.25,v.x)*smoothstep(1.,.75,v.x)*smoothstep(0.,.35,v.y)*smoothstep(1.,.45,v.y);float a=smoothstep(.35,.95,f)*edge*uO*uK;gl_FragColor=vec4(vec3(.62,.7,.9),a);}',
    });
    const mesh = new T.Mesh(new T.PlaneGeometry(w, 11), m); mesh.position.set(0, y, z); scene.add(mesh); hazes.push(m); return mesh;
  };
  hazeLayer(-6, .2, .38, .025, 34); hazeLayer(-2.2, -1.5, .3, .04);
  if (!phone) hazeLayer(2.4, -1.9, .22, .06, 18);

  const NF = phone ? 240 : 650;
  const fGeo = new T.BufferGeometry();
  {
    const pos = new Float32Array(NF * 3), sd = new Float32Array(NF);
    for (let i = 0; i < NF; i++) { pos[i * 3] = (rnd() - .5) * 20; pos[i * 3 + 1] = (rnd() - .5) * 12; pos[i * 3 + 2] = -11 + rnd() * 15; sd[i] = rnd(); }
    fGeo.setAttribute('position', new T.BufferAttribute(pos, 3)); fGeo.setAttribute('aS', new T.BufferAttribute(sd, 1));
  }
  const fMat = new T.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uO: { value: 1 }, uPx: { value: R.getPixelRatio() * (phone ? 26 : 30) } },
    vertexShader: 'attribute float aS;uniform float uT,uO,uPx;varying float vA,vR,vK;void main(){vec3 p=position;float t=uT*.06+aS*20.;p.y=mod(p.y+uT*(.05+aS*.12)+6.,12.)-6.;p.x+=sin(t*2.+p.y*.5)*.5;p.z+=cos(t*1.6+p.y*.4)*.35;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=uPx*(.5+aS*.9)/max(1.,-mv.z)*4.;vA=uO*smoothstep(-26.,-5.,mv.z)*smoothstep(-.3,-2.,mv.z)*(.35+.65*fract(aS*7.3));vR=aS*6.2832+uT*.15*(aS-.5);vK=step(.72,aS);}',
    fragmentShader: 'varying float vA,vR,vK;void main(){vec2 c=gl_PointCoord-.5;float s=sin(vR),co=cos(vR);c=mat2(co,-s,s,co)*c;float fib=smoothstep(.05,.0,abs(c.y-.12*sin(c.x*7.)))*smoothstep(.5,.25,abs(c.x));float dot_=smoothstep(.5,.0,length(c))*.6;float a=mix(fib,dot_,vK)*vA;if(a<.01)discard;gl_FragColor=vec4(.93,.95,1.,a);}',
  });
  const fibres = new T.Points(fGeo, fMat); fibres.frustumCulled = false; scene.add(fibres);

  /* ---------- post: subtle bloom (desktop) ---------- */
  let composer = null, bloom = null;
  if (!phone && T.EffectComposer) {
    composer = new T.EffectComposer(R);
    composer.addPass(new T.RenderPass(scene, cam));
    bloom = new T.UnrealBloomPass(new T.Vector2(512, 512), .32, .55, .86);
    composer.addPass(bloom);
    composer.addPass(new T.OutputPass());
  }

  /* ---------- labels (chapter 03) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const LAB = [
    { o: gear, n: 'Spare parts', s: 'Gears, bearings and drives for every department', a: [0, 1.5, 0] },
    { o: small, n: 'Blowroom & drawing', s: 'Preparatory machinery, new and pre-owned', a: [0, .9, 0] },
    { o: spindle, n: 'Ring frames', s: 'Zinser and other makes, with spindles and parts', a: [0, 1.7, 0] },
    { o: cone, n: 'Autoconer', s: 'Cone winding: Murata, Schlafhorst, Savio', a: [0, 1.75, .45] },
    { o: rotor, n: 'Autocoro & open-end (RN)', s: 'Rotor spinning machines and rotors', a: [.5, .35, 0] },
  ].map((L, i) => {
    const el = document.createElement('div'); el.className = 'cine-lab';
    el.innerHTML = `<i>0${i + 1}</i><b>${L.n}</b><span>${L.s}</span>`; labsBox.appendChild(el);
    const ln = document.createElementNS(NS, 'path'); ln.setAttribute('class', 'cine-ln'); svg.appendChild(ln);
    const dt = document.createElementNS(NS, 'circle'); dt.setAttribute('class', 'cine-dt'); dt.setAttribute('r', 3.5); svg.appendChild(dt);
    return { ...L, el, ln, dt, v: new T.Vector3() };
  });
  // yarn that flows into the year counter (chapter 04)
  const flow = document.createElementNS(NS, 'path'); flow.setAttribute('class', 'cine-flow'); flow.setAttribute('pathLength', '1'); svg.appendChild(flow);
  const flowGlow = document.createElementNS(NS, 'path'); flowGlow.setAttribute('class', 'cine-flow g'); flowGlow.setAttribute('pathLength', '1'); svg.insertBefore(flowGlow, flow);
  const head = document.createElementNS(NS, 'circle'); head.setAttribute('class', 'cine-head'); head.setAttribute('r', 4); svg.appendChild(head);

  /* ---------- layout ---------- */
  let W = 1, H = 1, portrait = false;
  const size = () => {
    W = stage.clientWidth || innerWidth; H = stage.clientHeight || innerHeight;
    portrait = W / H < .95;
    R.setSize(W, H, false);
    if (composer) { composer.setPixelRatio(DPR); composer.setSize(W, H); }
    cam.aspect = W / H;
    // lens shift: object sits right of the copy on wide screens, in the upper half on tall screens
    if (portrait) cam.setViewOffset(W, H, 0, H * .19, W, H); else cam.setViewOffset(W, H, -W * .19, H * .02, W, H);
    cam.updateProjectionMatrix();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    if (!animated) draw(performance.now());
  };

  /* ---------- camera path (keyframes over scroll) ---------- */
  const KF = [
    [0, 10.2, -.08, .9, .15], [.2, 9, .14, .6, .1], [.44, 8.4, .34, .3, -.1],
    [.56, 11.2, -.22, 1.1, -.2], [.7, 11, .16, .8, -.2], [.84, 8.9, .1, .5, 0], [1, 8.6, .16, .45, .05],
  ];
  const camAt = (q) => {
    let i = 0; while (i < KF.length - 2 && q > KF[i + 1][0]) i++;
    const a = KF[i], b = KF[i + 1], t = ss(seg(q, a[0], b[0]));
    return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t), lerp(a[4], b[4], t)];
  };

  const tmp = new T.Vector3(), tmp2 = new T.Vector3();
  const v3 = (x, y, z) => tmp.set(x, y, z);
  const meshAng = -2.36; // centre line from big gear to small gear (lower left)
  const meshPos = [Math.cos(meshAng) * (P1 + P2), Math.sin(meshAng) * (P1 + P2), .02];
  const c1 = TOOTH_C * Math.PI * 2 / N1, c2 = TOOTH_C * Math.PI * 2 / N2;
  const K2 = meshAng + Math.PI - c2 - Math.PI / N2 + (N1 / N2) * (meshAng - c1);
  let mx = 0, my = 0, smx = 0, smy = 0, introT0 = null, rv = animated ? 0 : 1;
  if (fine && animated) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });

  const proj = (obj, off, out) => { out.set(off[0], off[1], off[2]); obj.localToWorld(out); out.project(cam); return [(out.x * .5 + .5) * W, (-out.y * .5 + .5) * H, out.z]; };

  function pose(q, time) {
    const k1 = ss(seg(q, .14, .3));                                   // second gear + spindle arrive
    const wind = ss(seg(q, .22, .5));                                 // yarn builds on the cone
    const ex = ss(seg(q, .52, .62)) * (1 - ss(seg(q, .69, .79)));      // split, then reassemble
    const fin = ss(seg(q, .79, .92));                                  // final hero shot
    const spinA = q * Math.PI * 2 * 2.4;                               // gear turns 1:1 with scroll
    const em = 1 - rv;                                                 // intro: emerge from the haze

    // big gear
    gear.position.set(lerp(0, -.5, ex) + fin * -.55, lerp(0, .75, ex) - em * .9 + fin * .2, lerp(0, -1.1, ex) - em * 5);
    gear.rotation.set(-.08 + ex * .15 + fin * -.05, -.42 + k1 * .18 + ex * .32 + fin * .02, 0);
    turn.rotation.z = -spinA;
    logo.position.z = ex * .9; logo.rotation.z = Math.sin(spinA * .5) * .04;

    // second gear meshes on the left
    const out2 = 1 - k1;
    small.visible = k1 > .001 && fin < .999;
    small.position.set(meshPos[0] - out2 * 2.6 + ex * (-2.4 - meshPos[0]) - fin * 2.2, meshPos[1] - out2 * .4 + ex * (-1.15 - meshPos[1]) - fin * .8, meshPos[2] - out2 * 3.2 + ex * .9 - fin * 6);
    small.rotation.set(gear.rotation.x, gear.rotation.y + ex * .3, 0);
    // gear-train phase: θ2 = -(N1/N2)·θ1 + K2 keeps teeth in the gaps
    small.rotation.z = -(N1 / N2) * turn.rotation.z + K2 + ex * .6;

    // spindle + cone in front, lower right
    spinner.visible = k1 > .001;
    const sp = [1.2, -2.35, 1.55];
    spinner.position.set(sp[0] + ex * .55 + fin * .25, sp[1] - out2 * 3.8 + ex * .2 + fin * .25, sp[2] + ex * -.5 + fin * -.2);
    spinner.rotation.set(0, 0, ex * -.12);
    spinner.scale.setScalar(.66 + fin * .12);
    spindle.rotation.y = spinA * 5;
    cone.rotation.y = spinA * 5;
    cone.position.set(ex * -.2, ex * 1.9, ex * .7);
    const ws = lerp(.38, 1, wind) * (portrait ? 1 : 1);
    yarnBody.scale.set(ws, 1, ws);

    // thread: drafting roller -> guide -> traversing onto the cone
    thread.visible = k1 > .2 && ex < .05;
    thread.material.opacity = (1 - ex * 20) * k1 * (1 - fin * .6);
    if (thread.visible) {
      const pa = thread.geometry.attributes.position.array;
      const ty = lerp(1.25, 2.25, .5 + .5 * Math.sin(spinA * 1.7)), tr = tubeR(ty) + .44 * ws * .86;
      const a = -spinA * 5, ex0 = Math.cos(a) * 0, ez = tr;
      for (let i = 0; i < NT; i++) {
        const t = i / (NT - 1);
        let x, y, z;
        if (t < .4) { const u = t / .4; x = lerp(-.35, 0, u); y = lerp(3.9, 3.25, u); z = lerp(-.1, 0, u); }
        else { const u = (t - .4) / .6, b = Math.sin(u * Math.PI) * .18 * (1 + .3 * Math.sin(time * .008)); x = lerp(0, ex0, u) + b; y = lerp(3.25, ty, u); z = lerp(0, ez, u) + b * .4; }
        pa[i * 3] = x; pa[i * 3 + 1] = y; pa[i * 3 + 2] = z;
      }
      thread.geometry.attributes.position.needsUpdate = true;
    }

    // open-end rotor only appears in the split
    rotor.visible = ex > .002;
    rotor.scale.setScalar(Math.max(.001, ex) * 1.1);
    rotor.position.set(lerp(0, .35, ex), lerp(0, -2.25, ex), lerp(-.6, 1.9, ex));
    rotor.rotation.set(.55, spinA * 3, -.25);

    // light
    const sI = (portrait ? 330 : 380) * rv * (1 + fin * .25);
    spot.intensity = sI;
    spot.target.position.set(0, -.6, 0);
    warm.intensity = 4 + fin * 26 + k1 * 6;
    beamMat.uniforms.uO.value = .5 * rv * (1 - ex * .45);
    halo.material.uniforms.uO.value = (.35 + rv * .35 + fin * .35) * (1 - ex * .3);
    const hz = lerp(1.2, .6, seg(q, 0, .3)) * (1 - ex * .45) * (1 + em * .6);
    hazes.forEach((m) => { m.uniforms.uK.value = hz; m.uniforms.uT.value = time * .001; });
    fMat.uniforms.uT.value = time * .001; fMat.uniforms.uO.value = .9 - ex * .3;
    if (bloom) bloom.strength = .26 + fin * .14 + em * .2;

    // camera
    const [d, a, cy, ly] = camAt(q);
    const dd = d * (portrait ? 1.62 : 1);
    smx += (mx - smx) * .05; smy += (my - smy) * .05;
    const aa = a + smx * .12, yy = cy - smy * .5;
    cam.position.set(Math.sin(aa) * dd, yy, Math.cos(aa) * dd);
    cam.lookAt(0, ly, 0);

    // labels + flow line (screen space)
    const lo = ss(seg(q, .555, .6)) * (1 - ss(seg(q, .685, .72)));
    labels(lo);
    flowLine(ss(seg(q, .82, .95)) * (cur === 3 ? 1 : 0));
  }

  let copyR = null;
  const labels = (lo) => {
    if (lo <= .001) { LAB.forEach((L) => { L.el.style.opacity = 0; L.ln.style.opacity = 0; L.dt.style.opacity = 0; }); return; }
    const sr = stage.getBoundingClientRect();
    const cc = chs[2].getBoundingClientRect();
    const leftLimit = portrait ? 8 : Math.max(8, cc.right - sr.left + 16);
    const bottomLimit = portrait ? Math.min(H - 8, cc.top - sr.top - 8) : H - 70;
    const items = LAB.map((L, i) => {
      const [x, y] = proj(L.o, L.a, L.v);
      const ew = L.el.offsetWidth, eh = L.el.offsetHeight;
      return { L, i, x, y, ew, eh, show: clamp((lo - i * .05) / .75) };
    });
    // side: prefer away from the object centre, but never over the copy
    const cx = items.reduce((s, it) => s + it.x, 0) / items.length;
    items.forEach((it) => {
      const gap = portrait ? 18 : 40;
      let right = it.x >= cx;
      let lx = right ? it.x + gap : it.x - gap - it.ew;
      if (!right && lx < leftLimit) { right = true; lx = it.x + gap; }
      if (right && lx + it.ew > W - 70) { lx = Math.max(leftLimit, it.x - gap - it.ew); right = false; }
      it.lx = clamp(lx, leftLimit, W - it.ew - (portrait ? 8 : 70)); it.right = right;
      it.ly = clamp(it.y - it.eh / 2 - (portrait ? 0 : 6), (portrait ? 70 : 90), bottomLimit - it.eh);
    });
    // de-overlap: any two boxes that touch, the lower one moves down (then up if it runs off the bottom)
    const col = items.slice().sort((a, b) => a.ly - b.ly);
    for (let k = 1; k < col.length; k++) for (let j = 0; j < k; j++) {
      const pr = col[j], c = col[k];
      if (c.lx < pr.lx + pr.ew + 6 && c.lx + c.ew + 6 > pr.lx && c.ly < pr.ly + pr.eh + 6 && c.ly + c.eh > pr.ly) c.ly = pr.ly + pr.eh + 6;
    }
    for (let k = col.length - 1; k >= 0; k--) {
      const c = col[k], maxY = bottomLimit - c.eh;
      if (c.ly > maxY) { const d = c.ly - maxY; c.ly = maxY;
        for (let j = k - 1; j >= 0; j--) { const pr = col[j]; if (c.lx < pr.lx + pr.ew + 6 && c.lx + c.ew + 6 > pr.lx && pr.ly + pr.eh + 6 > c.ly) pr.ly = c.ly - pr.eh - 6; } }
    }
    items.forEach((it) => {
      const { L } = it, o = it.show;
      L.el.style.opacity = o; L.el.style.transform = `translate3d(${it.lx.toFixed(1)}px,${(it.ly + (1 - o) * 10).toFixed(1)}px,0)`;
      const ax = it.right ? it.lx : it.lx + it.ew, ay = it.ly + it.eh / 2;
      const mxp = it.right ? ax - 14 : ax + 14;
      L.ln.setAttribute('d', `M${it.x.toFixed(1)} ${it.y.toFixed(1)} L${mxp.toFixed(1)} ${ay.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)}`);
      L.ln.style.opacity = o; L.ln.style.strokeDashoffset = 1 - o;
      L.dt.setAttribute('cx', it.x.toFixed(1)); L.dt.setAttribute('cy', it.y.toFixed(1)); L.dt.style.opacity = o;
    });
  };

  const fv = new T.Vector3();
  const flowLine = (f) => {
    if (f <= .001 || !yearEl) { flow.style.opacity = 0; flowGlow.style.opacity = 0; head.style.opacity = 0; return; }
    const sr = stage.getBoundingClientRect(), yr = yearEl.getBoundingClientRect();
    const [x0, y0] = proj(cone, [-.3, 1.7, .5], fv);
    const x1 = portrait ? yr.left - sr.left + Math.min(yr.width, 150) * .5 : yr.right - sr.left + 18, y1 = portrait ? yr.top - sr.top - 8 : yr.top - sr.top + yr.height * .55;
    const d = portrait
      ? `M${x0} ${y0} C${x0 - 60} ${y0 + 120}, ${x1 + 90} ${y1 - 140}, ${x1} ${y1}`
      : `M${x0} ${y0} C${x0 - 120} ${y0 + 160}, ${x1 + 220} ${y1 + 120}, ${x1} ${y1}`;
    flow.setAttribute('d', d); flowGlow.setAttribute('d', d);
    flow.style.opacity = 1; flowGlow.style.opacity = .6;
    flow.style.strokeDashoffset = 1 - f; flowGlow.style.strokeDashoffset = 1 - f;
    try { const L = flow.getTotalLength(), pt = flow.getPointAtLength(L * f); head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y); head.style.opacity = f < .999 ? 1 : 0; } catch (e) {}
  };

  /* ---------- render loop ---------- */
  let inView = true, first = true, lastT = 0, slow = 0, frames = 0, tier = 0;
  // adaptive quality: if frames are slow, drop bloom and resolution; if still slow, keep the static hero
  const degrade = () => {
    tier++;
    if (tier === 1) { composer = null; R.setPixelRatio(Math.min(DPR, 1)); size(); }
    else if (tier === 2) { R.shadowMap.enabled = false; R.setPixelRatio(.75); size(); }
    else if (!force) { sec.classList.remove('gl'); sec.classList.add('nogl'); dead = true; }
  };
  let dead = false;
  function draw(now) {
    if (introT0 === null) introT0 = now;
    if (animated && sec.dataset.intro === '1') rv = ss(clamp((now - introT0) / 2400));
    pose(p, now);
    composer ? composer.render() : R.render(scene, cam);
    if (first) { first = false; sec.classList.add('gl'); }
  }
  const tick = (now) => {
    requestAnimationFrame(tick);
    const dt = Math.min(100, now - (lastT || now)); lastT = now;
    if (dead) { p = pRaw; setChapter(p); return; }
    if (!inView || document.hidden) return;
    // time-based smoothing, so slow devices still land on the right frame
    const k = 1 - Math.exp(-dt / (Math.abs(pRaw - p) > .25 ? 40 : 90));
    p += (pRaw - p) * k; if (force) p = pRaw;
    if (Math.abs(pRaw - p) < .00005) p = pRaw;
    setChapter(p);
    const t0 = performance.now();
    draw(now);
    if (!force && sec.dataset.intro) { frames++; if (frames > 8 && frames < 400) { slow = slow * .9 + (dt > 45 ? 1 : 0) * .1; if (slow > .6) { slow = 0; degrade(); } } }
  };

  size();
  addEventListener('resize', () => { size(); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); });
  if (animated) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { rootMargin: '100px' }).observe(sec);
    const startIntro = () => { if (sec.dataset.intro) return; sec.dataset.intro = '1'; introT0 = performance.now(); };
    if (document.documentElement.classList.contains('ld')) addEventListener('mt:intro', startIntro, { once: true }); else startIntro();
    setTimeout(startIntro, 2600);
    requestAnimationFrame(tick);
  } else {
    // reduced motion: one still frame of the finished story
    rv = 1; p = 1; cur = 3;
    draw(performance.now());
  }
})();
