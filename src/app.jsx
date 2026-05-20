// app.jsx — Main app: Nav, Loader, Hero (with 3 variants), cursor, tweaks integration

const { useState, useEffect, useRef, useMemo } = React;

// ============ TWEAK DEFAULTS ============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroMode": "quantum",
  "particleDensity": 80,
  "animSpeed": 1,
  "customCursor": true,
  "hoverSounds": false,
  "accentColor": "#64ffda",
  "glowIntensity": 1
}/*EDITMODE-END*/;

// ============ SOUND ============
let audioCtx;
function playBlip(freq = 880, duration = 0.04, type = 'sine') {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

// ============ LOADER ============
function Loader({ visible, t }) {
  return (
    <div id="loader" className={visible ? '' : 'done'}>
      <div className="loader-core">
        <div className="loader-atom">
          <div className="orbit"></div>
          <div className="orbit"></div>
          <div className="orbit"></div>
          <div className="nucleus"></div>
        </div>
        <div className="loader-text">
          {t.loader_quantum} <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
        </div>
        <div className="loader-bar"></div>
      </div>
    </div>
  );
}

// ============ CUSTOM CURSOR ============
function CustomCursor({ enabled }) {
  const atomRef = useRef(null);
  const dotRef = useRef(null);
  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('no-cursor');
      return;
    }
    document.body.classList.add('no-cursor');
    let mx = 0, my = 0, ax = 0, ay = 0;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e) => {
      if (e.target.closest('a, button, .proj-card, .stat-card, .contact-card, .chip, .hw-photo, .hw-item, .exp-item')) {
        atomRef.current && atomRef.current.classList.add('hovering');
      }
    };
    const onOut = (e) => {
      atomRef.current && atomRef.current.classList.remove('hovering');
    };
    const onLeave = () => {
      if (atomRef.current) atomRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (atomRef.current) atomRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    let raf;
    const tick = () => {
      ax += (mx - ax) * 0.15;
      ay += (my - ay) * 0.15;
      if (atomRef.current) {
        atomRef.current.style.left = ax + 'px';
        atomRef.current.style.top = ay + 'px';
      }
      if (dotRef.current) {
        dotRef.current.style.left = mx + 'px';
        dotRef.current.style.top = my + 'px';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('no-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="cursor-atom" ref={atomRef}>
        <div className="c-orbit"></div>
        <div className="c-orbit"></div>
        <div className="c-core"></div>
      </div>
      <div className="cursor-dot" ref={dotRef}></div>
    </>
  );
}

// ============ NAV ============
function Nav({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'about', label: t.nav_about, num: '01' },
    { id: 'experience', label: t.nav_experience, num: '02' },
    { id: 'projects', label: t.nav_projects, num: '03' },
    { id: 'hardware', label: t.nav_hardware, num: '04' },
    { id: 'timeline', label: t.nav_timeline, num: '05' },
    { id: 'contact', label: t.nav_contact, num: '06' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a className="nav-logo" href="#home">
        <span className="glyph"><span className="core"></span></span>
        SH<span style={{color:'var(--text-3)'}}>·</span>V
      </a>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(l => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
            <span className="num">{l.num}.</span>{l.label}
          </a>
        ))}
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <button className="nav-burger" onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
      </div>
    </nav>
  );
}

// ============ HERO ============
function Hero({ t, tweaks }) {
  const canvasRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);
  const roles = [t.hero_role_a, t.hero_role_b, t.hero_role_c];

  useEffect(() => {
    if (canvasRef.current && window.QuantumBG) {
      window.QuantumBG.mount(canvasRef.current);
      window.QuantumBG.set({
        mode: tweaks.heroMode,
        density: tweaks.particleDensity,
        speed: tweaks.animSpeed,
        accent: tweaks.accentColor,
        glow: tweaks.glowIntensity
      });
    }
  }, []);

  useEffect(() => {
    if (window.QuantumBG) {
      window.QuantumBG.set({
        mode: tweaks.heroMode,
        density: tweaks.particleDensity,
        speed: tweaks.animSpeed,
        accent: tweaks.accentColor,
        glow: tweaks.glowIntensity
      });
    }
    document.documentElement.style.setProperty('--accent', tweaks.accentColor);
  }, [tweaks]);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [t]);

  return (
    <section id="home" className="hero" data-screen-label="Hero">
      <canvas className="hero-canvas" ref={canvasRef}></canvas>
      <div className="hero-content">
        <div className="hero-tag">{t.hero_tag}</div>
        <h1 className="hero-name">
          Sergio A.<br />
          <span className="accent">Hernández Vera</span>
        </h1>
        <div className="hero-alias">{t.hero_alias}</div>
        <div className="hero-roles">
          {roles.map((r, i) => (
            <span key={i} className={`role ${i === roleIdx ? 'active' : ''}`}>{r}</span>
          ))}
        </div>
        <div className="hero-phrase">"{t.hero_phrase}"</div>
        <div className="hero-cta">
          <a className="btn btn-filled" href="#projects">
            {t.hero_cta_projects} <span className="arrow">→</span>
          </a>
          <a className="btn" href="#contact">
            {t.hero_cta_contact} <span className="arrow">↗</span>
          </a>
        </div>
      </div>
      <div className="hero-scroll">{t.hero_scroll}</div>
    </section>
  );
}

// ============ FOOTER ============
function Footer({ t }) {
  return (
    <footer className="footer">
      <span>{t.footer_built} <span className="heart">⚛</span></span>
      <span>·</span>
      <span>{t.footer_location}</span>
      <span>·</span>
      <span>© {new Date().getFullYear()} Sergio A. Hernández Vera</span>
    </footer>
  );
}

// ============ TWEAKS PANEL ============
function TweaksUI({ tweaks, setTweak, t }) {
  return (
    <TweaksPanel title={t.tw_title}>
      <TweakSection title={t.tw_hero}>
        <TweakRadio
          value={tweaks.heroMode}
          onChange={v => setTweak('heroMode', v)}
          options={[
            { value: 'quantum', label: t.tw_hero_quantum },
            { value: 'atom', label: t.tw_hero_atom },
            { value: 'wave', label: t.tw_hero_wave }
          ]}
        />
        <TweakSlider label={t.tw_density} value={tweaks.particleDensity} onChange={v => setTweak('particleDensity', v)} min={20} max={180} step={5} />
        <TweakSlider label={t.tw_speed} value={tweaks.animSpeed} onChange={v => setTweak('animSpeed', v)} min={0.1} max={3} step={0.1} />
        <TweakSlider label={t.tw_glow} value={tweaks.glowIntensity} onChange={v => setTweak('glowIntensity', v)} min={0} max={2} step={0.1} />
      </TweakSection>
      <TweakSection title={t.tw_accent}>
        <TweakColor
          value={tweaks.accentColor}
          onChange={v => setTweak('accentColor', v)}
          options={['#64ffda', '#bd93f9', '#ff79c6', '#ffb86c']}
        />
      </TweakSection>
      <TweakSection title="UX">
        <TweakToggle label={t.tw_cursor} value={tweaks.customCursor} onChange={v => setTweak('customCursor', v)} />
        <TweakToggle label={t.tw_sounds} value={tweaks.hoverSounds} onChange={v => setTweak('hoverSounds', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// ============ MAIN APP ============
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('portfolio-lang') || 'es';
  });
  const [loading, setLoading] = useState(true);

  const t = window.I18N[lang];

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(id);
  }, []);

  // Hover sounds — attach delegate when enabled
  useEffect(() => {
    if (!tweaks.hoverSounds) return;
    const handler = (e) => {
      if (e.target.closest('a, button, .proj-card, .stat-card, .chip')) {
        playBlip(720 + Math.random() * 280, 0.06, 'sine');
      }
    };
    document.addEventListener('mouseover', handler);
    return () => document.removeEventListener('mouseover', handler);
  }, [tweaks.hoverSounds]);

  return (
    <>
      <Loader visible={loading} t={t} />
      <CustomCursor enabled={tweaks.customCursor} />
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} tweaks={tweaks} />
      <AboutSection t={t} lang={lang} />
      <ExperienceSection t={t} lang={lang} />
      <ProjectsSection t={t} lang={lang} />
      <HardwareSection t={t} lang={lang} />
      <TimelineSection t={t} lang={lang} />
      <ContactSection t={t} lang={lang} />
      <Footer t={t} />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} t={t} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
