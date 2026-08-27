import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const pages = {
  home: '/bariplomo-pages/home.html',
  materiales: '/bariplomo-pages/materiales-barita-mortero.html',
  plomo: '/bariplomo-pages/materiales-plomo-pegamento.html',
  productos: '/bariplomo-pages/productos-vidrio-puertas-mamparas.html',
  estudios: '/bariplomo-pages/estudios-certificados.html',
  aplicacion: '/bariplomo-pages/servicio-aplicacion-baritado.html',
  colocacion: '/bariplomo-pages/servicio-colocacion-laminado.html',
  cotizar: '/bariplomo-pages/cotizar.html',
};

const groups = [
  { key: 'materiales', label: 'MATERIALES', items: [
    ['Barita de Plomo', 'materiales', '#barita'],
    ['Mortero Mezcla de Barita', 'materiales', '#mortero'],
    ['Hoja / Lámina / Placa de Plomo', 'plomo', '#hoja-plomo'],
    ['Pegamento para colocar Plomo', 'plomo', '#pegamento'],
  ]},
  { key: 'productos', label: 'PRODUCTOS', items: [
    ['Vidrio Plomoso', 'productos', '#vidrio'],
    ['Puerta Emplomada', 'productos', '#puerta'],
    ['Mampara Emplomada', 'productos', '#mampara'],
  ]},
  { key: 'estudios', label: 'ESTUDIOS CERTIFICADOS', items: [
    ['Memoria Analítica', 'estudios', '#memoria'],
    ['Levantamiento de Niveles', 'estudios', '#levantamiento'],
  ]},
  { key: 'servicios', label: 'SERVICIOS', items: [
    ['Aplicación de Baritado', 'aplicacion', '#aplicacion'],
    ['Colocación de Laminado', 'colocacion', '#colocacion'],
  ]},
];

const whatsappUrl = 'https://wa.me/525528220554?text=Hola%20BARIPLOMO%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n.';

function App() {
  const getRoute = () => {
    const hash = window.location.hash.slice(1);
    return hash.split('#')[0] || 'home';
  };
  const initialPage = getRoute();
  const [page, setPage] = useState(pages[initialPage] ? initialPage : 'home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const iframeRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const currentSrc = useMemo(() => pages[page] || pages.home, [page]);

  const scrollFrameToHash = useCallback((hash) => {
    if (!hash || !iframeRef.current) return;
    try {
      const id = decodeURIComponent(hash.replace(/^#/, ''));
      const doc = iframeRef.current.contentDocument;
      const target = doc?.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } catch (_) {}
  }, []);

  const navigate = useCallback((key, hash = '') => {
    if (!pages[key]) return;
    setPage(key);
    setMobileOpen(false);
    window.history.replaceState({}, '', key === 'home' && !hash ? '/' : `/#${key}${hash || ''}`);
    const nextSrc = `${pages[key]}${hash || ''}`;
    if (iframeRef.current && iframeRef.current.src !== new URL(nextSrc, window.location.origin).href) {
      iframeRef.current.src = nextSrc;
    }
    // If we stay on the same document, move immediately to the requested section.
    window.setTimeout(() => scrollFrameToHash(hash), 0);
  }, [scrollFrameToHash]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      if (data.type === 'bariplomo:navigate' && pages[data.page]) {
        navigate(data.page, data.hash || '');
      }
    };
    const onPopState = () => {
      const key = getRoute();
      if (pages[key]) {
        const hash = window.location.hash.split('#').slice(2).join('#');
        setPage(key);
        setMobileOpen(false);
        if (iframeRef.current) iframeRef.current.src = `${pages[key]}${hash ? `#${hash}` : ''}`;
      }
    };
    window.addEventListener('message', onMessage);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigate]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    frame.src = currentSrc;
  }, [currentSrc]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;

    const cleanupObserver = () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };

    const measure = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc?.documentElement || !doc.body) return;
        // The embedded pages contain their own responsive nav/min-height rules.
        // The React shell owns the navigation, so remove the duplicate embedded nav
        // and all viewport-based minimum heights before measuring the real content.
        if (!doc.getElementById('bariplomo-shell-normalize')) {
          const style = doc.createElement('style');
          style.id = 'bariplomo-shell-normalize';
          style.textContent = `
            html, body { min-height: 0 !important; height: auto !important; }
            body { overflow-x: hidden !important; }
            .bp-nav { display: none !important; }
            .bp-mobile-menu { display: none !important; }
            main { min-height: 0 !important; }
          `;
          doc.head.appendChild(style);
        }
        const body = doc.body;
        const html = doc.documentElement;
        const height = Math.ceil(Math.max(
          body.scrollHeight,
          body.offsetHeight,
          body.getBoundingClientRect().height,
          html.scrollHeight,
          html.offsetHeight,
          html.getBoundingClientRect().height
        ));
        if (height > 0) frame.style.height = `${height}px`;
      } catch (_) {}
    };

    const scheduleMeasure = () => {
      window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(measure, 30);
    };

    const onLoad = () => {
      cleanupObserver();
      measure();
      const hash = new URL(frame.src, window.location.origin).hash;
      if (hash) {
        requestAnimationFrame(() => requestAnimationFrame(() => scrollFrameToHash(hash)));
      }
      try {
        const doc = frame.contentDocument;
        if (doc?.documentElement) {
          resizeObserverRef.current = new ResizeObserver(scheduleMeasure);
          resizeObserverRef.current.observe(doc.documentElement);
          resizeObserverRef.current.observe(doc.body);
        }
        // Images and web fonts can change the document height after load.
        doc?.querySelectorAll('img').forEach(img => {
          if (!img.complete) img.addEventListener('load', scheduleMeasure, { once: true });
        });
      } catch (_) {}
      [100, 300, 800, 1500].forEach(ms => window.setTimeout(measure, ms));
    };

    frame.addEventListener('load', onLoad);
    return () => {
      frame.removeEventListener('load', onLoad);
      cleanupObserver();
      window.clearTimeout(resizeTimerRef.current);
    };
  }, [currentSrc, scrollFrameToHash]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }} aria-label="BARIPLOMO inicio">
          <span className="brand-mark">☢</span>
          <span><strong>BARIPLOMO</strong><small>BLINDAJE RADIOLÓGICO</small></span>
        </a>
        <button className="mobile-toggle" onClick={() => setMobileOpen(v => !v)} aria-label="Abrir menú">☰</button>
        <nav className={`main-nav ${mobileOpen ? 'open' : ''}`} aria-label="Navegación principal">
          {groups.map(group => (
            <div className={`nav-group ${group.items.some(([,key]) => key === page) ? 'active' : ''}`} key={group.key}>
              <button type="button">{group.label}</button>
              <div className="dropdown">
                {group.items.map(([label, key, hash]) => (
                  <a key={label} href={`/#${key}${hash}`} onClick={(e) => { e.preventDefault(); navigate(key, hash); }}>{label}</a>
                ))}
              </div>
            </div>
          ))}
          <a className={`quote-btn ${page === 'cotizar' ? 'active' : ''}`} href="/#cotizar" onClick={(e) => { e.preventDefault(); navigate('cotizar'); }}>COTIZAR</a>
        </nav>
      </header>
      <main className="content-frame">
        <iframe ref={iframeRef} title="Contenido BARIPLOMO" src={currentSrc} className="page-frame" />
      </main>
      <a className="whatsapp-fab" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp Business de BARIPLOMO" title="WhatsApp Business BARIPLOMO">
        <span className="whatsapp-icon" aria-hidden="true">⌕</span>
      </a>
    </div>
  );
}

export default App;
