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
  const requestedHashRef = useRef('');
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
    requestedHashRef.current = hash || '';
    const samePage = page === key;
    setPage(key);
    setMobileOpen(false);
    window.history.replaceState({}, '', key === 'home' && !hash ? '/' : `/#${key}${hash || ''}`);

    // For the same page, change the iframe immediately. For a new page,
    // the page effect below will load it with the requested hash.
    if (samePage && iframeRef.current) {
      iframeRef.current.src = `${pages[key]}${hash || ''}`;
      window.setTimeout(() => scrollFrameToHash(hash), 50);
    }
  }, [page, scrollFrameToHash]);

  useEffect(() => {
  const frame = iframeRef.current;
  if (!frame) return;

  // Reiniciar inmediatamente la altura al cambiar de página
  frame.style.height = '1px';

  const onLoad = () => {
    try {
      const doc = frame.contentDocument;
      if (!doc?.documentElement || !doc.body) return;

      // Eliminar cualquier regla anterior que pudiera alterar la altura
      const oldStyle = doc.getElementById('bariplomo-shell-normalize');
      if (oldStyle) oldStyle.remove();

      // Evitar alturas artificiales dentro de las páginas
      const style = doc.createElement('style');
      style.id = 'bariplomo-shell-normalize';
      style.textContent = `
        html,
        body {
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
        }

        body {
          overflow-x: hidden !important;
        }

        main {
          min-height: 0 !important;
        }
      `;

      doc.head.appendChild(style);

      // Esperar a que el navegador termine de acomodar el contenido
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const height = Math.max(
            doc.body.scrollHeight,
            doc.body.offsetHeight,
            doc.documentElement.scrollHeight,
            doc.documentElement.offsetHeight
          );

          if (Number.isFinite(height) && height > 0) {
            frame.style.height = `${Math.ceil(height)}px`;
          }

          const hash = new URL(frame.src, window.location.origin).hash;

          if (hash) {
            requestAnimationFrame(() => {
              scrollFrameToHash(hash);
            });
          }
        });
      });
    } catch (_) {}
  };

  frame.addEventListener('load', onLoad);

  // Si el documento ya terminó de cargar
  if (frame.contentDocument?.readyState === 'complete') {
    onLoad();
  }

  return () => {
    frame.removeEventListener('load', onLoad);
  };
}, [page, scrollFrameToHash]);
    frame.removeEventListener('load', onLoad);
  };
}, [page, scrollFrameToHash]);

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
        <span className="whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" role="img" aria-hidden="true">
            <path d="M16 3.2a12.6 12.6 0 0 0-10.9 19L3.4 29l7-1.6A12.6 12.6 0 1 0 16 3.2Zm0 22.8c-2 0-3.9-.6-5.5-1.7l-.4-.3-4.1.9.9-4-.3-.4A10.4 10.4 0 1 1 16 26Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.1-.3-.5.3-.4.8-1.4.1-.2.1-.4 0-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.3 3.6 5.6 5 .8.3 1.4.5 1.9.6.8.3 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"/>
          </svg>
        </span>
      </a>
    </div>
  );
}

export default App;
