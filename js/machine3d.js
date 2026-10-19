/* M Tech — Autoconer winding unit, built in code. Scroll opens it up part by part and puts it back together. */
(() => {
  const sec = document.getElementById('machine');
  if (!sec || typeof THREE === 'undefined') return;
  const stage = sec.querySelector('.mc-stage');
  const labelsBox = sec.querySelector('.mc-labels');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;

  /* ---------- renderer / scene ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !small;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

  // soft studio light
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0a1230, 2.8));
  const key = new THREE.DirectionalLight(0xffffff, 6.5);
  key.position.set(6, 12, 8); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 12, bottom: -2, near: 1, far: 40 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5b7cff, 4.8); rim.position.set(-8, 6, -6); scene.add(rim);
  const warm = new THREE.PointLight(0xff8a4c, 40, 18, 2); warm.position.set(4, 3, 5); scene.add(warm);

  /* ---------- materials ---------- */
  const tex = (draw, w = 256, h = 256) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  };
  // wound yarn: fine crossing lines
  const yarnTex = tex((g, w, h) => {
    g.fillStyle = '#f3efe6'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      g.strokeStyle = `rgba(${170 + Math.random() * 40},${160 + Math.random() * 40},${140 + Math.random() * 40},${0.18 + Math.random() * 0.2})`;
      g.lineWidth = 0.6 + Math.random();
      const y = Math.random() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (Math.random() - .5) * 40); g.stroke();
    }
  });
  yarnTex.wrapS = yarnTex.wrapT = THREE.RepeatWrapping; yarnTex.repeat.set(3, 2);
  // drum groove: dark diagonal bands
  const drumTex = tex((g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9aa3b3'); gr.addColorStop(.5, '#e6eaf0'); gr.addColorStop(1, '#8e97a8');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(30,36,50,.75)'; g.lineWidth = 7;
    for (let i = -4; i < 8; i++) { g.beginPath(); g.moveTo(i * 48, 0); g.bezierCurveTo(i * 48 + 60, h * .35, i * 48 + 20, h * .65, i * 48 + 90, h); g.stroke(); }
  });
  drumTex.wrapS = drumTex.wrapT = THREE.RepeatWrapping;
  const screenTex = tex((g, w, h) => {
    g.fillStyle = '#04123a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f6bff'; g.fillRect(0, 0, w, 34);
    g.fillStyle = '#fff'; g.font = 'bold 24px Arial'; g.fillText('M TECH', 12, 25);
    g.fillStyle = '#9fb6ff'; g.font = '17px Arial';
    ['Spindle 12   ●  RUN', 'Speed  1400 m/min', 'Splices   OK', 'Cone   82%'].forEach((s, i) => g.fillText(s, 12, 66 + i * 26));
    g.fillStyle = '#ff8a4c'; g.fillRect(12, 168, w * .62, 10);
  }, 256, 192);

  const M = {
    frame: new THREE.MeshStandardMaterial({ color: 0x0f2fb8, metalness: .45, roughness: .35 }),
    frameDark: new THREE.MeshStandardMaterial({ color: 0x18213a, metalness: .5, roughness: .45 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xc9cfd9, metalness: .9, roughness: .22 }),
    alu: new THREE.MeshStandardMaterial({ color: 0xaab2c0, metalness: .7, roughness: .35 }),
    drum: new THREE.MeshStandardMaterial({ map: drumTex, metalness: .85, roughness: .25 }),
    yarn: new THREE.MeshStandardMaterial({ map: yarnTex, roughness: .92, metalness: 0 }),
    tube: new THREE.MeshStandardMaterial({ color: 0xff8a4c, roughness: .55 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xff6a1f, roughness: .4, metalness: .2 }),
    black: new THREE.MeshStandardMaterial({ color: 0x0e1018, roughness: .6, metalness: .3 }),
    screen: new THREE.MeshStandardMaterial({ map: screenTex, emissive: 0xffffff, emissiveMap: screenTex, emissiveIntensity: .9 }),
    led: new THREE.MeshStandardMaterial({ color: 0x55ff9a, emissive: 0x33ff88, emissiveIntensity: 2 }),
    thread: new THREE.MeshBasicMaterial({ color: 0xffffff }),
  };

  const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
  };
  const box = (w, h, d, mat, x, y, z, r = 0) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const cyl = (rt, rb, h, mat, x, y, z, seg = 40) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z);

  /* ---------- the machine: parts ---------- */
  const machine = new THREE.Group(); scene.add(machine);
  const parts = [];
  const part = (name, sub, explode, build) => {
    const g = new THREE.Group(); build(g); machine.add(g);
    const p = { name, sub, g, home: g.position.clone(), out: new THREE.Vector3(...explode), rot: (Math.random() - .5) * .5 };
    parts.push(p); return p;
  };

  // frame (stays put)
  const frame = new THREE.Group(); machine.add(frame);
  frame.add(box(3.2, .35, 2.2, M.frameDark, 0, .18, 0));
  frame.add(box(.42, 9.4, .5, M.frame, -1.05, 4.9, -.75));
  frame.add(box(.42, 9.4, .5, M.frame, 1.05, 4.9, -.75));
  frame.add(box(2.5, .3, .5, M.frame, 0, 9.45, -.75));
  frame.add(box(2.1, 8.4, .12, M.frameDark, 0, 5, -.95));
  for (let i = 0; i < 4; i++) frame.add(box(2.1, .05, .02, M.alu, 0, 1.6 + i * 2.1, -.88));

  part('Ring bobbin', 'Feed cop from the ring frame', [0, -.7, 3], (g) => {
    g.position.set(0, 1.65, .55);
    g.add(cyl(.09, .11, 2.6, M.tube, 0, .1, 0, 20));
    g.add(cyl(.17, .36, 1.9, M.yarn, 0, -.15, 0));
    g.add(cyl(.34, .34, .18, M.black, 0, -1.2, 0));
  });
  part('Balloon breaker', 'Calms the yarn coming off the cop', [-2.4, -.4, 1.4], (g) => {
    g.position.set(0, 3.25, .55);
    const ring = mesh(new THREE.TorusGeometry(.28, .045, 14, 40), M.steel); ring.rotation.x = Math.PI / 2; g.add(ring);
    g.add(box(.08, .08, 1.3, M.alu, 0, 0, -.6));
  });
  part('Tensioner', 'Disc tension, set per count', [2.6, .2, 1.6], (g) => {
    g.position.set(0, 4.15, .5);
    g.add(box(.9, .55, .45, M.frameDark, 0, 0, -.25));
    [-.18, .18].forEach((x) => { const d = cyl(.24, .24, .06, M.steel, x, .02, .08); d.rotation.z = Math.PI / 2; g.add(d); });
    const rod = cyl(.05, .05, .5, M.orange, 0, .02, .08, 12); rod.rotation.z = Math.PI / 2; g.add(rod);
  });
  part('Splicer', 'Air splicer: joins yarn ends without a knot', [-3, .3, 1.2], (g) => {
    g.position.set(0, 5.15, .38);
    g.add(box(1.25, .8, .75, M.alu, 0, 0, 0));
    g.add(box(1.0, .12, .2, M.black, 0, .14, .34));
    g.add(box(.3, .3, .2, M.orange, .42, -.2, .33));
    g.add(cyl(.06, .06, .5, M.steel, -.5, .55, 0, 12));
  });
  part('Yarn clearer', 'Sensor head: cuts out thick and thin faults', [2.9, .5, 1.3], (g) => {
    g.position.set(0, 6.15, .45);
    g.add(box(.62, .52, .55, M.frameDark, 0, 0, 0));
    g.add(box(.34, .12, .1, M.black, 0, .05, .29));
    g.add(mesh(new THREE.SphereGeometry(.05, 12, 12), M.led, .2, .16, .29));
  });
  part('Suction arm', 'Finds the broken end on the cone', [-3.2, .9, .6], (g) => {
    g.position.set(-.6, 6.9, .2);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -1.1, -.5), new THREE.Vector3(-.15, -.2, .1), new THREE.Vector3(.2, .55, .55), new THREE.Vector3(.75, .7, .7)]);
    g.add(mesh(new THREE.TubeGeometry(curve, 40, .13, 16), M.frameDark));
    g.add(box(.5, .14, .3, M.black, .82, .7, .72));
  });
  part('Winding drum', 'Grooved drum that traverses the yarn', [0, .8, 3.2], (g) => {
    g.position.set(0, 7.35, .25);
    const d = cyl(.46, .46, 1.9, M.drum, 0, 0, 0, 48); d.rotation.z = Math.PI / 2; g.add(d);
    [-1, 1].forEach((s) => { const c = cyl(.5, .5, .08, M.steel, s * .98, 0, 0, 40); c.rotation.z = Math.PI / 2; g.add(c); });
    g.add(box(.25, .9, .25, M.frameDark, 1.15, -.35, -.45));
  });
  part('Cone package', 'The finished cone, ready to dispatch', [0, 1.5, 2.8], (g) => {
    g.position.set(0, 8.33, .3);
    const c = cyl(.62, 1.02, 1.55, M.yarn, 0, 0, 0, 56); c.rotation.z = Math.PI / 2; g.add(c);
    const t = cyl(.2, .26, 1.9, M.tube, 0, 0, 0, 24); t.rotation.z = Math.PI / 2; g.add(t);
    [-1, 1].forEach((s) => g.add(box(.1, .25, 1.2, M.alu, s * 1.1, .05, -.55)));
  });
  part('Control panel', 'Spindle display and settings', [2.6, .8, -1], (g) => {
    g.position.set(.25, 9.95, .05);
    g.rotation.x = -.35;
    g.add(box(1.5, .95, .16, M.frameDark, 0, 0, 0));
    const s = mesh(new THREE.PlaneGeometry(1.3, .78), M.screen, 0, 0, .085); s.castShadow = false; g.add(s);
  });

  // yarn path (only visible while assembled)
  const yarnPts = [[0, 2.7, .55], [0, 3.25, .55], [0, 4.17, .58], [0, 5.2, .76], [0, 6.17, .73], [0, 7.0, .72], [0, 7.6, .7], [-.2, 8.0, .6]].map((p) => new THREE.Vector3(...p));
  const yarnLine = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(yarnPts), 80, .012, 6), M.thread);
  yarnLine.castShadow = false; machine.add(yarnLine);

  // floor shadow
  const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.ShadowMaterial({ opacity: .35 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  machine.position.y = -5;
  floor.position.y = -5;

  /* ---------- labels ---------- */
  const labelEls = parts.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'mc-label';
    el.innerHTML = `<i>${String(i + 1).padStart(2, '0')}</i><b>${p.name}</b><span>${p.sub}</span>`;
    labelsBox.appendChild(el); return el;
  });

  /* ---------- sizing ---------- */
  const size = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  addEventListener('resize', size); size();

  /* ---------- state ---------- */
  const state = { explode: 0, spin: -.55, drag: 0, labels: 0 };
  const v = new THREE.Vector3();
  let visible = true, t0 = performance.now();

  const apply = (time) => {
    const e = state.explode;
    const ease = e < .5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
    parts.forEach((p) => {
      p.g.position.copy(p.home).addScaledVector(p.out, ease);
      p.g.rotation.y = p.rot * ease;
    });
    yarnLine.material.opacity = 1 - Math.min(1, e * 4);
    yarnLine.visible = e < .25;
    // drum and cone turn while running (assembled)
    const run = Math.max(0, 1 - e * 3);
    parts[6].g.children[0].rotation.x = time * 0.006 * run;
    parts[7].g.children[0].rotation.x = -time * 0.0042 * run;
    drumTex.offset.x = -time * 0.0004 * run;
    machine.rotation.y = state.spin + state.drag;
    const dist = (small ? 19.5 : 22) + ease * (small ? 6 : 5);
    camera.position.set(Math.sin(.15) * dist, 1.2 + e * .6, Math.cos(.15) * dist);
    camera.lookAt(0, (small ? .3 : -.2) + e * .3, 0);
  };

  const placeLabels = () => {
    const w = stage.clientWidth, h = stage.clientHeight, gap = small ? 30 : 46;
    const items = [];
    parts.forEach((p, i) => {
      const el = labelEls[i];
      const show = Math.max(0, Math.min(1, (state.labels - i * .06) * 3));
      if (show <= 0) { el.style.opacity = 0; return; }
      p.g.getWorldPosition(v); v.project(camera);
      const x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h;
      items.push({ el, x, y, show, left: x < w / 2, ew: el.offsetWidth, eh: el.offsetHeight });
    });
    // keep labels on each side from stacking on top of each other
    [true, false].forEach((side) => {
      const col = items.filter((it) => it.left === side).sort((a, b) => a.y - b.y);
      let last = -1e9;
      col.forEach((it) => { it.ly = Math.max(it.y, last + it.eh + 6); last = it.ly; });
    });
    items.forEach((it) => {
      let lx = it.left ? it.x - gap - it.ew : it.x + gap;
      const clamped = Math.min(Math.max(lx, 6), w - it.ew - 6);
      it.el.classList.toggle('l', it.left);
      it.el.classList.toggle('cut', Math.abs(clamped - lx) > 2 || Math.abs(it.ly - it.y) > 2);
      it.el.style.opacity = it.show;
      it.el.style.transform = `translate(${clamped}px, ${it.ly - it.eh / 2}px)`;
    });
  };

  const tick = (now) => {
    if (visible) {
      const time = now - t0;
      apply(time);
      renderer.render(scene, camera);
      placeLabels();
    }
    requestAnimationFrame(tick);
  sec.classList.add('ready');
  };
  requestAnimationFrame(tick);

  // pause when off-screen
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { rootMargin: '200px' }).observe(stage);

  // drag to turn
  let down = null;
  stage.addEventListener('pointerdown', (e) => { down = { x: e.clientX, d: state.drag }; stage.setPointerCapture(e.pointerId); stage.classList.add('grab'); });
  stage.addEventListener('pointermove', (e) => { if (down) state.drag = down.d + (e.clientX - down.x) * .008; });
  const up = () => { down = null; stage.classList.remove('grab'); };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);

  /* ---------- scroll story ---------- */
  const steps = [...sec.querySelectorAll('.mc-step')];
  const setStep = (i) => steps.forEach((s, k) => s.classList.toggle('on', k === i));
  setStep(0);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduce) {
    state.explode = .55; state.labels = 1; setStep(1); return;
  }
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 1,
      onUpdate: (s) => setStep(s.progress < .2 ? 0 : s.progress < .62 ? 1 : s.progress < .8 ? 2 : 3),
    },
  });
  tl.to(state, { spin: .35, duration: 1.2, ease: 'none' })
    .to(state, { explode: 1, duration: 2, ease: 'none' }, .6)
    .to(state, { labels: 1.6, duration: 1.6, ease: 'none' }, 1.2)
    .to(state, { spin: 1.25, duration: 1.6, ease: 'none' }, 2.4)
    .to(state, { labels: 0, duration: .6, ease: 'none' }, 3.6)
    .to(state, { explode: 0, duration: 1.6, ease: 'none' }, 3.8)
    .to(state, { spin: 2 * Math.PI - .55, duration: 1.6, ease: 'none' }, 3.8);
})();
