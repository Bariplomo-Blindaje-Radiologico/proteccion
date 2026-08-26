import { useEffect, useState } from 'react';
import meta from './page-meta.json';
import './index.css';

type RouteKey = keyof typeof meta;

const routeMap: Record<string, string> = {
  'inicio': '/',
  'materiales': '/materiales/barita',
  'productos': '/productos/lamina-plomo',
  'servicios': '/servicios/baritado',
  'estudios certificados': '/servicios/estudios-certificados',
  'certificaciones': '/servicios/estudios-certificados',
  'cotizar': '/cotizar',
  'cotizar ahora': '/cotizar',
  'solicitar cotización': '/cotizar',
};

function currentPath(): RouteKey {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  return (p in meta ? p : '/') as RouteKey;
}

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function runPageScripts(scripts: string[]) {
  // Stitch exports occasionally include small DOM scripts. Re-run them after
  // the fragment is mounted; the integration keeps those behaviours intact.
  for (const raw of scripts) {
    if (!raw.trim()) continue;
    let script = raw.trim();
    if (script.includes('DOMContentLoaded')) {
      script = script.replace(/document\.addEventListener\(['"]DOMContentLoaded['"],\s*\(\)\s*=>\s*\{([\s\S]*)\}\);?\s*$/m, '$1');
    }
    try { window.eval(script); } catch (error) { console.warn('Stitch page script skipped:', error); }
  }
}

export default function App() {
  const [path, setPath] = useState<RouteKey>(currentPath());
  const [html, setHtml] = useState('');

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    let alive = true;
    const page = meta[path] as { file: string; bodyClass: string; scripts: string[] };
    document.body.className = page.bodyClass;
    fetch(page.file)
      .then((r) => r.text())
      .then((text) => { if (alive) setHtml(text); })
      .catch((e) => console.error('No se pudo cargar la página Stitch', e));
    return () => { alive = false; };
  }, [path]);

  useEffect(() => {
    if (!html) return;
    const page = meta[path] as { scripts: string[] };
    runPageScripts(page.scripts);

    const root = document.getElementById('stitch-root');
    if (!root) return;

    const go = (href: string) => {
      if (!href || href === '#') return false;
      if (href.startsWith('/')) { navigate(href); return true; }
      return false;
    };

    root.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
      const label = a.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';
      const href = a.getAttribute('href') || '';
      if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (label in routeMap) {
        a.addEventListener('click', (e) => { e.preventDefault(); navigate(routeMap[label]); });
      }
      if (href.startsWith('#') && path !== '/') {
        // Section anchors from the Stitch subpages point to the home page.
        a.addEventListener('click', (e) => {
          const target = href;
          if (target !== '#') { e.preventDefault(); navigate('/' + target); }
        });
      }
    });

    root.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      const label = button.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';
      if (label.startsWith('ver sección')) {
        const card = button.closest('div.flex.flex-col');
        const title = card?.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
        const target = title.includes('barita') ? '/materiales/barita'
          : title.includes('mortero') ? '/materiales/barita#mortero'
          : title.includes('hoja') || title.includes('lámina') || title.includes('placa') ? '/productos/lamina-plomo'
          : title.includes('vidrio') ? '/productos/vidrio-plomoso'
          : title.includes('estudios') ? '/servicios/estudios-certificados'
          : title.includes('servicios') ? '/servicios/baritado'
          : '/';
        button.addEventListener('click', () => navigate(target));
      }
      if (label === 'cotizar' || label === 'cotizar ahora' || label === 'solicitar asesoría' || label === 'solicitar cotización') {
        button.addEventListener('click', () => navigate('/cotizar'));
      }
    });
  }, [html, path]);

  return <div id="stitch-root" dangerouslySetInnerHTML={{ __html: html }} />;
}
