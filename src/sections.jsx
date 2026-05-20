// sections.jsx — About, Experience, Hardware, Timeline, Contact
// Content is loaded from data/*.json. Edit those files to update the site, no JSX touching.

const { useState, useEffect, useRef } = React;

// --- helper: bold markdown **text** → <strong>
function MdInline({ text }) {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0, m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={i++}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

// --- Reveal on scroll
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// --- Helper: fetch JSON once
function useJSON(path) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(path)
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('Failed to load', path, err));
  }, [path]);
  return data;
}

// --- Helper: pick the right language field
function tx(obj, field, lang) {
  return obj[`${field}_${lang}`] || obj[field] || '';
}

// =========================================
// ABOUT
// =========================================
function AboutSection({ t, lang }) {
  const ref = useReveal();
  const stack = useJSON('data/stack.json');

  return (
    <section id="about" className="section reveal" ref={ref} data-screen-label="About">
      <span className="section-kicker">{t.about_kicker}</span>
      <h2 className="section-title">{t.about_title}</h2>

      <div className="about-grid">
        <div className="about-text">
          <p><MdInline text={t.about_p1} /></p>
          <p><MdInline text={t.about_p2} /></p>
          <p><MdInline text={t.about_p3} /></p>
        </div>
        <div className="about-stats">
          <a className="stat-card" href="https://doi.org/10.1016/j.esmoop.2025.105594" target="_blank" rel="noopener">
            <h3>1×</h3>
            <p>{t.about_stat_pubs}<br/>{t.about_stat_pubs_sub}</p>
          </a>
          <div className="stat-card">
            <h3>{t.about_stat_uni}</h3>
            <p>{t.about_stat_uni_sub}</p>
          </div>
          <div className="stat-card">
            <h3>{t.about_stat_hpc}</h3>
            <p>{t.about_stat_hpc_sub}</p>
          </div>
          <a className="stat-card" href="https://orcid.org/0009-0007-2551-4031" target="_blank" rel="noopener">
            <h3>{t.about_stat_orcid}</h3>
            <p style={{fontFamily: 'var(--font-mono)', fontSize: '10px'}}>{t.about_stat_orcid_sub}</p>
          </a>
        </div>
      </div>

      {/* STACK — driven by data/stack.json */}
      <div className="stack-grid">
        {stack && stack.categories.map((cat, i) => (
          <div key={i} className="stack-card">
            <h4>{tx(cat, 'title', lang)}</h4>
            <div>
              {cat.items.map(s => (
                <span key={s} className={`chip ${cat.color !== 'default' ? cat.color : ''}`}>
                  <span className="dot"></span>{s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================
// EXPERIENCE — driven by data/experience.json
// =========================================
function ExperienceSection({ t, lang }) {
  const ref = useReveal();
  const data = useJSON('data/experience.json');
  return (
    <section id="experience" className="section reveal" ref={ref} data-screen-label="Experience">
      <span className="section-kicker">{t.exp_kicker}</span>
      <h2 className="section-title">{t.exp_title}</h2>
      <div className="exp-list">
        {data && data.items.map((it, i) => (
          <div key={i} className="exp-item">
            <div className="exp-when">{tx(it, 'when', lang)}</div>
            <div className="exp-content">
              <h3>{tx(it, 'role', lang)}</h3>
              <p>{tx(it, 'desc', lang)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================
// HARDWARE — driven by data/hardware.json
// =========================================
function HardwareSection({ t, lang }) {
  const ref = useReveal();
  const data = useJSON('data/hardware.json');
  return (
    <section id="hardware" className="section reveal" ref={ref} data-screen-label="Hardware">
      <span className="section-kicker">{t.hw_kicker}</span>
      <h2 className="section-title">{t.hw_title}</h2>
      <div className="hw-grid">
        <div className="hw-items">
          {data && data.items.map((it, i) => (
            <div key={i} className="hw-item">
              <div className="icon">{it.icon}</div>
              <div>
                <h3>{tx(it, 'title', lang)}</h3>
                <p>{tx(it, 'desc', lang)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="hw-gallery">
          {data && data.gallery.map((g, i) => (
            <div key={i} className={`hw-photo ${g.wide ? 'wide' : ''}`}>
              <img src={g.src} alt={tx(g, 'caption', lang)} loading="lazy" />
              <div className="caption"><span className="pulse"></span>{tx(g, 'caption', lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================
// TIMELINE — driven by data/timeline.json
// =========================================
function TimelineSection({ t, lang }) {
  const ref = useReveal();
  const data = useJSON('data/timeline.json');
  return (
    <section id="timeline" className="section reveal" ref={ref} data-screen-label="Timeline">
      <span className="section-kicker">{t.timeline_kicker}</span>
      <h2 className="section-title">{t.timeline_title}</h2>
      <div className="timeline">
        {data && data.items.map((it, i) => (
          <div key={i} className="tl-item">
            <div className="tl-year">{it.year}</div>
            <div className="tl-title">{tx(it, 'title', lang)}</div>
            <p className="tl-desc">{tx(it, 'desc', lang)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// =========================================
// CONTACT — driven by data/contact.json
// =========================================
function ContactSection({ t, lang }) {
  const ref = useReveal();
  const data = useJSON('data/contact.json');
  return (
    <section id="contact" className="section reveal" ref={ref} data-screen-label="Contact">
      <div className="contact-wrap">
        <span className="section-kicker">{t.contact_kicker}</span>
        <h2 className="section-title" style={{justifyContent:'center'}}>{t.contact_title}</h2>
        <p className="contact-intro">{t.contact_intro}</p>
        <div className="contact-grid">
          {data && data.items.map((c, i) => (
            <a key={i} className="contact-card" href={c.href} target="_blank" rel="noopener">
              <div className="ic">{c.icon}</div>
              <div>
                <div className="label">{tx(c, 'label', lang)}</div>
                <div className="value">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  AboutSection, ExperienceSection, HardwareSection, TimelineSection, ContactSection, MdInline, useReveal
});
