// projects.jsx — Projects section with filters + markdown modal

const { useState, useEffect } = React;

// Tiny markdown renderer (good enough for our project files)
function renderMarkdown(md) {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, (_, c) => `<pre><code>${c}</code></pre>`);
  // Headings
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  // Bold / italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
  // Inline code
  html = html.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');
  // Lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>(\s*<li>[\s\S]*?<\/li>)*)/g, '<ul>$1</ul>');
  // Paragraphs (lines that aren't already wrapped)
  html = html.split(/\n{2,}/).map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (/^<(h\d|ul|ol|pre|blockquote)/.test(trimmed)) return trimmed;
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
  return html;
}

function ProjectsSection({ t, lang }) {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [openSlug, setOpenSlug] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const sectionRef = useReveal();

  useEffect(() => {
    fetch('projects/manifest.json')
      .then(r => r.json())
      .then(data => setProjects(data.projects))
      .catch(err => console.error('Failed to load projects manifest', err));
  }, []);

  useEffect(() => {
    if (!openSlug) return;
    setModalContent('Loading…');
    const proj = projects.find(p => p.slug === openSlug);
    setModalProject(proj);
    fetch(`projects/${openSlug}.md`)
      .then(r => r.text())
      .then(md => setModalContent(renderMarkdown(md)))
      .catch(() => setModalContent('<p>Could not load this project.</p>'));
  }, [openSlug, projects]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenSlug(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filters = [
    { id: 'all', label: t.projects_filter_all },
    { id: 'ai', label: t.projects_filter_ai },
    { id: 'physics', label: t.projects_filter_physics },
    { id: 'quantum', label: t.projects_filter_quantum },
    { id: 'fullstack', label: t.projects_filter_fullstack },
    { id: 'hardware', label: t.projects_filter_hardware },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section reveal" ref={sectionRef} data-screen-label="Projects">
      <span className="section-kicker">{t.projects_kicker}</span>
      <h2 className="section-title">{t.projects_title}</h2>
      <p className="projects-intro">{t.projects_intro}</p>

      <div className="proj-filters">
        {filters.map(f => (
          <button
            key={f.id}
            className={`proj-filter ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="proj-grid">
        {filtered.map(p => (
          <div key={p.slug} className="proj-card" onClick={() => setOpenSlug(p.slug)}>
            {p.featured && <span className="featured-tag">★ {t.projects_featured}</span>}
            <span className="year">{p.year}</span>
            <div className="cat">{categoryLabel(p.category, t)}</div>
            <h3>{lang === 'es' ? p.title_es : p.title_en}</h3>
            <p className="subtitle">{lang === 'es' ? p.subtitle_es : p.subtitle_en}</p>
            <div className="tags">
              {p.tags.map(tg => <span key={tg}>{tg}</span>)}
            </div>
            <div className="status">
              <span className="pulse"></span>
              {lang === 'es' ? p.status_es : p.status_en}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <div className={`modal-backdrop ${openSlug ? 'open' : ''}`} onClick={() => setOpenSlug(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setOpenSlug(null)} aria-label="Close">×</button>
          {modalContent && (
            <>
              <div dangerouslySetInnerHTML={{ __html: typeof modalContent === 'string' ? modalContent : '' }} />
              {modalProject && modalProject.links && modalProject.links.length > 0 && (
                <div className="modal-links">
                  {modalProject.links.map(l => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener">→ {l.label}</a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function categoryLabel(cat, t) {
  const map = {
    ai: t.projects_filter_ai,
    physics: t.projects_filter_physics,
    quantum: t.projects_filter_quantum,
    fullstack: t.projects_filter_fullstack,
    hardware: t.projects_filter_hardware,
  };
  return map[cat] || cat;
}

Object.assign(window, { ProjectsSection });
