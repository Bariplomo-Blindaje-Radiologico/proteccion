import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  {
    key: 'materiales', label: 'MATERIALES', items: [
      ['Barita de Plomo', 'materiales', '#barita'],
      ['Mortero Mezcla de Barita', 'materiales', '#mortero'],
      ['Hoja / Lámina / Placa de Plomo', 'plomo', '#hoja-plomo'],
      ['Pegamento para colocar Plomo', 'plomo', '#pegamento'],
    ],
  },
  {
    key: 'productos', label: 'PRODUCTOS', items: [
      ['Vidrio Plomoso', 'productos', '#vidrio'],
      ['Puerta Emplomada', 'productos', '#puerta'],
      ['Mampara Emplomada', 'productos', '#mampara'],
    ],
  },
  {
    key: 'estudios', label: 'ESTUDIOS CERTIFICADOS', items: [
      ['Memoria Analítica', 'estudios', '#memoria'],
      ['Levantamiento de Niveles', 'estudios', '#levantamiento'],
    ],
  },
  {
    key: 'servicios', label: 'SERVICIOS', items: [
      ['Aplicación de Baritado', 'aplicacion', '#aplicacion'],
      ['Colocación de Laminado', 'colocacion', '#colocacion'],
    ],
  },
];

function App() {
  const [page, setPage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const iframeRef = useRef(null);

  const currentSrc = useMemo(() => pages[page] || pages.home, [page]);

  const navigate = (key, hash = '') => {
    setPage(key);
    setMobileOpen(false);
    const src = `${pages[key] || pages.home}${hash || ''}`;
    if (iframeRef.current) iframeRef.current.src = src;
    window.history.replaceState({}, '', key === 'home' ? '/' : `/#${key}`);
  };

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      if (data.type === 'bariplomo:navigate' && pages[data.page]) {
        navigate(data.page, data.hash || '');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
  const frame = iframeRef.current;
  if (!frame) return;

  const resize = () => {
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;

      const height = Math.max(
        doc.body.offsetHeight,
        doc.body.scrollHeight,
        doc.documentElement.offsetHeight
      );

      frame.style.height = `${height + 8}px`;
    } catch (_) {}
  };

  const onLoad = () => {
    // Reiniciar la altura al cambiar de página
    frame.style.height = '100px';

    resize();

    // Esperar a que terminen de cargar imágenes,
    // fuentes y otros elementos de la página.
    setTimeout(resize, 100);
    setTimeout(resize, 500);
    setTimeout(resize, 1000);

    try {
      const doc = frame.contentDocument;
      if (!doc) return;

      const observer = new ResizeObserver(() => {
        resize();
      });

      observer.observe(doc.body);
      observer.observe(doc.documentElement);

      frame._bariplomoObserver = observer;
    } catch (_) {}
  };

  frame.addEventListener('load', onLoad);

  return () => {
    frame.removeEventListener('load', onLoad);
    frame._bariplomoObserver?.disconnect();
  };
}, [currentSrc]);

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
    </div>
  );
}

export default App;
