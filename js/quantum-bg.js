// quantum-bg.js — Three hero background animations on canvas
// Modes: 'quantum' (particle network), 'atom' (Bohr model), 'wave' (wavefunction)

(function () {
  let canvas, ctx, raf;
  let mode = 'quantum';
  let density = 80;
  let speed = 1;
  let accent = '#64ffda';
  let glow = 1;
  let mouseX = -9999, mouseY = -9999;
  let t0 = performance.now();

  let particles = [];
  function initParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.4 + 0.4
      });
    }
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles(density);
  }

  // ----- QUANTUM NETWORK -----
  function drawQuantum(w, h) {
    ctx.clearRect(0, 0, w, h);
    const linkDist = Math.min(w, h) * 0.18;
    const linkDist2 = linkDist * linkDist;

    // Move particles
    for (const p of particles) {
      p.x += p.vx * speed;
      p.y += p.vy * speed;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // Subtle mouse attraction
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const md2 = dx * dx + dy * dy;
      if (md2 < 30000) {
        const m = 0.0008 * speed;
        p.vx += dx * m / 60;
        p.vy += dy * m / 60;
      }
      // Friction
      p.vx *= 0.985; p.vy *= 0.985;
      // Drift
      p.vx += (Math.random() - 0.5) * 0.01;
      p.vy += (Math.random() - 0.5) * 0.01;
    }

    // Draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < linkDist2) {
          const alpha = (1 - d2 / linkDist2) * 0.4 * glow;
          ctx.strokeStyle = hexToRgba(accent, alpha);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8 * glow;
      ctx.fillStyle = hexToRgba(accent, 0.85);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // ----- BOHR ATOM -----
  function drawAtom(w, h) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const t = (performance.now() - t0) / 1000 * speed;
    const base = Math.min(w, h) * 0.35;

    // Nucleus glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.25);
    grad.addColorStop(0, hexToRgba(accent, 0.9 * glow));
    grad.addColorStop(0.4, hexToRgba(accent, 0.15 * glow));
    grad.addColorStop(1, hexToRgba(accent, 0));
    ctx.fillStyle = grad;
    ctx.fillRect(cx - base, cy - base, base * 2, base * 2);

    // Nucleus core
    ctx.shadowColor = accent;
    ctx.shadowBlur = 30 * glow;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Orbits & electrons
    const orbits = [
      { r: base * 0.55, tilt: 0.4, speed: 1.6, col: accent },
      { r: base * 0.75, tilt: -0.3, speed: 1.0, col: '#bd93f9' },
      { r: base * 0.95, tilt: 1.1, speed: 0.7, col: '#ff79c6' }
    ];
    for (let i = 0; i < orbits.length; i++) {
      const o = orbits[i];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(o.tilt + t * 0.05);
      // Ellipse orbit
      ctx.strokeStyle = hexToRgba(o.col, 0.25 * glow);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, o.r, o.r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Electron
      const angle = t * o.speed + i * 1.7;
      const ex = Math.cos(angle) * o.r;
      const ey = Math.sin(angle) * o.r * 0.35;
      ctx.shadowColor = o.col;
      ctx.shadowBlur = 18 * glow;
      ctx.fillStyle = o.col;
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fill();
      // Trail
      for (let k = 1; k < 18; k++) {
        const a = angle - k * 0.06;
        const tx = Math.cos(a) * o.r;
        const ty = Math.sin(a) * o.r * 0.35;
        ctx.fillStyle = hexToRgba(o.col, (1 - k / 18) * 0.35);
        ctx.beginPath();
        ctx.arc(tx, ty, 4 - k * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // Background stars
    for (const p of particles) {
      ctx.fillStyle = hexToRgba('#ffffff', 0.15 + p.r * 0.1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ----- WAVEFUNCTION -----
  function drawWave(w, h) {
    ctx.clearRect(0, 0, w, h);
    const t = (performance.now() - t0) / 1000 * speed;
    const cx = w / 2, cy = h / 2;

    // Probability cloud
    const cloudR = Math.min(w, h) * 0.4;
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloudR);
    cg.addColorStop(0, hexToRgba(accent, 0.18 * glow));
    cg.addColorStop(0.6, hexToRgba('#bd93f9', 0.06 * glow));
    cg.addColorStop(1, hexToRgba(accent, 0));
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h);

    // Multiple sin waves stacked
    const waveCount = 5;
    for (let i = 0; i < waveCount; i++) {
      const phase = i * 0.7 + t * 0.6;
      const amp = 30 + i * 8;
      const yOff = cy + (i - waveCount / 2) * 6;
      const col = i % 2 === 0 ? accent : '#bd93f9';
      ctx.strokeStyle = hexToRgba(col, (0.6 - i * 0.08) * glow);
      ctx.lineWidth = 1.2;
      ctx.shadowColor = col;
      ctx.shadowBlur = 8 * glow;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const env = Math.exp(-Math.pow((x - cx) / (w * 0.28), 2));
        const y = yOff + Math.sin(x * 0.02 + phase) * amp * env;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Particles drifting along the wave
    for (const p of particles) {
      p.x += p.vx * 0.5 * speed;
      p.y += p.vy * 0.3 * speed;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.fillStyle = hexToRgba(accent, 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    if (mode === 'quantum') drawQuantum(w, h);
    else if (mode === 'atom') drawAtom(w, h);
    else if (mode === 'wave') drawWave(w, h);
    raf = requestAnimationFrame(loop);
  }

  function hexToRgba(hex, alpha) {
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    return hex;
  }

  window.QuantumBG = {
    mount(el) {
      canvas = el;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
      });
      el.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
      loop();
    },
    set(opts) {
      if (opts.mode !== undefined) mode = opts.mode;
      if (opts.density !== undefined) { density = opts.density; if (canvas) initParticles(density); }
      if (opts.speed !== undefined) speed = opts.speed;
      if (opts.accent !== undefined) accent = opts.accent;
      if (opts.glow !== undefined) glow = opts.glow;
    },
    destroy() {
      cancelAnimationFrame(raf);
    }
  };
})();
