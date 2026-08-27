# BARIPLOMO — Blindaje Radiológico

Versión corregida para Vite + React.

## Correcciones incluidas en esta versión
- Navegación de `Ver Sección` desde la página principal con destino a la sección exacta.
- Botones de portada `Cotizar` y `Solicitar Asesoría` funcionales.
- WhatsApp Business fijo y visible en todo momento: +52 55 2822 0554.
- Botón `Enviar Solicitud` del formulario de cotización preparado para abrir un correo dirigido a `bariplomo@gmail.com` con los datos capturados.
- Eliminada la causa del crecimiento infinito del iframe: no se utiliza la altura del viewport del documento para medir el contenido.
- Eliminadas las alturas `vh` del hero de Productos que provocaban crecimiento circular dentro del iframe.
- Eliminados `min-h-screen` innecesarios de páginas embebidas.
- Pie de página queda inmediatamente después del contenido real, sin espacio blanco artificial.
- Fichas técnicas locales mostradas completas, sin `object-cover` ni recorte; mantienen proporción y cuentan con visor ampliado.
- Título de Aplicación corregido a `Servicio Especializado: Aplicación de Baritado` con la misma tipografía y tamaño que Colocación de Laminado.
- Se conservan materiales, productos, estudios, servicios y fichas existentes.

## Publicación
1. Sustituir el contenido del repositorio por el contenido de este paquete.
2. Hacer commit en la rama `main`.
3. Vercel ejecutará `npm run build` y publicará `dist`.

## Nota sobre el formulario
Por tratarse de un sitio estático, el botón abre una composición de Gmail dirigida a `bariplomo@gmail.com` con los datos del formulario ya preparados. El usuario confirma el envío dentro de Gmail.
