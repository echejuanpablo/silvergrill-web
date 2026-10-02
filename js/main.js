/* Silver Grill & Bar — interacciones de la página (sin frameworks) */
(function () {
  'use strict';

  var WHATSAPP_URL = 'https://wa.me/573104812911?text=Hola%2C%20quiero%20reservar%20una%20mesa%20en%20Silver%20Grill%20%26%20Bar';
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  document.documentElement.classList.add('js');

  /* Crea un elemento con clase y texto opcionales (siempre como texto, nunca HTML). */
  function crear(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  /* ---------- Encabezado: fondo sólido al bajar y menú en celular ---------- */
  function iniciarEncabezado() {
    var encabezado = document.querySelector('[data-encabezado]');
    var nav = document.querySelector('[data-nav]');
    var boton = document.querySelector('[data-nav-toggle]');
    if (!encabezado || !nav || !boton) return;

    var etiqueta = boton.querySelector('.sr-only');

    function alHacerScroll() {
      encabezado.classList.toggle('es-solido', window.scrollY > 24);
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    alHacerScroll();

    function cambiarMenu(abrir) {
      nav.classList.toggle('esta-abierto', abrir);
      encabezado.classList.toggle('menu-abierto', abrir);
      boton.setAttribute('aria-expanded', String(abrir));
      if (etiqueta) etiqueta.textContent = abrir ? 'Cerrar menú de secciones' : 'Abrir menú de secciones';
    }

    boton.addEventListener('click', function () {
      cambiarMenu(boton.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) cambiarMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && boton.getAttribute('aria-expanded') === 'true') {
        cambiarMenu(false);
        boton.focus();
      }
    });
    var escritorio = window.matchMedia('(min-width: 1000px)');
    if (escritorio.addEventListener) {
      escritorio.addEventListener('change', function () { cambiarMenu(false); });
    }
  }

  /* ---------- Horario: día de hoy y estado abierto/cerrado (hora de Colombia) ---------- */
  function aMinutos(hhmm) {
    var partes = hhmm.split(':');
    return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
  }

  function formatoHora(hhmm) {
    var total = aMinutos(hhmm);
    var h = Math.floor(total / 60);
    var m = String(total % 60).padStart(2, '0');
    if (h === 12 && m === '00') return '12:00\u00a0m.';
    var sufijo = h < 12 ? 'a.m.' : 'p.m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + m + '\u00a0' + sufijo;
  }

  function ahoraEnColombia() {
    // Colombia está en UTC-5 todo el año (no tiene horario de verano).
    var d = new Date(Date.now() - 5 * 60 * 60 * 1000);
    return { dia: d.getUTCDay(), minutos: d.getUTCHours() * 60 + d.getUTCMinutes() };
  }

  function iniciarHorario() {
    var lista = document.querySelector('[data-horario]');
    if (!lista) return;

    var filas = {};
    Array.prototype.forEach.call(lista.querySelectorAll('[data-dia]'), function (fila) {
      filas[fila.getAttribute('data-dia')] = {
        fila: fila,
        abre: fila.getAttribute('data-abre'),
        cierra: fila.getAttribute('data-cierra')
      };
    });

    var estadoPortada = document.querySelector('[data-estado-horario]');
    var estadoDetalle = document.querySelector('[data-estado-horario-detalle]');
    var marcaHoy = crear('span', 'horario__hoy', 'Hoy');

    function actualizar() {
      var ahora = ahoraEnColombia();
      var hoy = filas[ahora.dia];
      var abierto = false;
      var texto;

      Object.keys(filas).forEach(function (k) {
        filas[k].fila.classList.remove('es-hoy');
        filas[k].fila.removeAttribute('aria-current');
      });
      if (hoy) {
        hoy.fila.classList.add('es-hoy');
        hoy.fila.setAttribute('aria-current', 'date');
        hoy.fila.firstElementChild.appendChild(marcaHoy);
      }

      if (hoy && hoy.abre && ahora.minutos >= aMinutos(hoy.abre) && ahora.minutos < aMinutos(hoy.cierra)) {
        abierto = true;
        texto = 'Abierto ahora · hasta las ' + formatoHora(hoy.cierra);
      } else if (hoy && hoy.abre && ahora.minutos < aMinutos(hoy.abre)) {
        texto = 'Cerrado ahora · abrimos hoy a las ' + formatoHora(hoy.abre);
      } else {
        for (var i = 1; i <= 7; i++) {
          var siguiente = filas[(ahora.dia + i) % 7];
          if (siguiente && siguiente.abre) {
            var cuando = i === 1 ? 'mañana' : 'el ' + DIAS[(ahora.dia + i) % 7];
            texto = 'Cerrado ahora · abrimos ' + cuando + ' a las ' + formatoHora(siguiente.abre);
            break;
          }
        }
      }
      if (!texto) return;

      if (estadoPortada) {
        var span = estadoPortada.querySelector('span');
        if (span) span.textContent = texto;
        estadoPortada.classList.toggle('esta-abierto', abierto);
      }
      if (estadoDetalle) {
        estadoDetalle.textContent = texto;
        estadoDetalle.classList.toggle('esta-abierto', abierto);
        estadoDetalle.hidden = false;
      }
    }

    actualizar();
    setInterval(actualizar, 60 * 1000);
  }

  /* ---------- Menú: se carga desde menu.json ---------- */
  var formatoPesos = null;
  try {
    formatoPesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  } catch (e) { /* navegador muy antiguo: se usa el número tal cual */ }

  function formatoPrecio(precio) {
    if (precio == null || precio === '') return '';
    if (typeof precio === 'number') return formatoPesos ? formatoPesos.format(precio) : '$' + precio;
    return String(precio);
  }

  function pintarMenu(contenedor, datos) {
    if (!datos || !Array.isArray(datos.categorias) || !datos.categorias.length) {
      throw new Error('menu.json no tiene categorías');
    }

    var aviso = document.querySelector('[data-menu-aviso]');
    if (aviso && datos.aviso) {
      aviso.textContent = datos.aviso;
      aviso.hidden = false;
    }

    contenedor.textContent = '';
    var pestanas = crear('div', 'menu__pestanas');
    pestanas.setAttribute('role', 'tablist');
    pestanas.setAttribute('aria-label', 'Categorías del menú');
    contenedor.appendChild(pestanas);

    var botones = [];
    var paneles = [];

    datos.categorias.forEach(function (cat, i) {
      var id = String(cat.id || 'categoria-' + i).replace(/[^a-z0-9-]/gi, '-');

      var boton = crear('button', 'menu__pestana', cat.nombre);
      boton.type = 'button';
      boton.id = 'pestana-' + id;
      boton.setAttribute('role', 'tab');
      boton.setAttribute('aria-controls', 'panel-' + id);
      boton.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      boton.tabIndex = i === 0 ? 0 : -1;
      pestanas.appendChild(boton);
      botones.push(boton);

      var panel = crear('div', 'menu__panel');
      panel.id = 'panel-' + id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', boton.id);
      panel.tabIndex = 0;
      panel.hidden = i !== 0;

      var portada = crear('div', 'menu__portada');
      if (cat.imagen) {
        var img = crear('img');
        img.src = cat.imagen;
        img.alt = cat.imagenAlt || '';
        img.loading = 'lazy';
        portada.appendChild(img);
      }
      var portadaTexto = crear('div', 'menu__portada-texto');
      portadaTexto.appendChild(crear('h3', null, cat.nombre));
      if (cat.descripcion) portadaTexto.appendChild(crear('p', null, cat.descripcion));
      portada.appendChild(portadaTexto);
      panel.appendChild(portada);

      var lista = crear('ul', 'platos');
      (cat.platos || []).forEach(function (plato) {
        var item = crear('li', 'plato');
        var cabecera = crear('div', 'plato__cabecera');
        cabecera.appendChild(crear('h4', 'plato__nombre', plato.nombre));
        var precio = formatoPrecio(plato.precio);
        if (precio) {
          var linea = crear('span', 'plato__linea');
          linea.setAttribute('aria-hidden', 'true');
          cabecera.appendChild(linea);
          cabecera.appendChild(crear('span', 'plato__precio', precio));
        }
        item.appendChild(cabecera);
        if (plato.descripcion) item.appendChild(crear('p', 'plato__desc', plato.descripcion));

        if (plato.ejemplo || plato.destacado) {
          var etiquetas = crear('div', 'plato__etiquetas');
          if (plato.destacado) etiquetas.appendChild(crear('span', 'etiqueta etiqueta--destacado', 'Recomendado'));
          if (plato.ejemplo) etiquetas.appendChild(crear('span', 'etiqueta etiqueta--ejemplo', 'Ejemplo'));
          item.appendChild(etiquetas);
        }
        lista.appendChild(item);
      });
      panel.appendChild(lista);
      contenedor.appendChild(panel);
      paneles.push(panel);
    });

    function seleccionar(indice, enfocar) {
      botones.forEach(function (b, i) {
        var activo = i === indice;
        b.setAttribute('aria-selected', activo ? 'true' : 'false');
        b.tabIndex = activo ? 0 : -1;
        paneles[i].hidden = !activo;
      });
      if (enfocar) botones[indice].focus();
      botones[indice].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    botones.forEach(function (b, i) {
      b.addEventListener('click', function () { seleccionar(i, false); });
      b.addEventListener('keydown', function (e) {
        var destino = null;
        if (e.key === 'ArrowRight') destino = (i + 1) % botones.length;
        if (e.key === 'ArrowLeft') destino = (i - 1 + botones.length) % botones.length;
        if (e.key === 'Home') destino = 0;
        if (e.key === 'End') destino = botones.length - 1;
        if (destino !== null) {
          e.preventDefault();
          seleccionar(destino, true);
        }
      });
    });
  }

  function iniciarMenu() {
    var contenedor = document.querySelector('[data-menu]');
    if (!contenedor) return;

    fetch('menu.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (datos) { pintarMenu(contenedor, datos); })
      .catch(function (error) {
        console.warn('No se pudo cargar menu.json. Si abriste index.html con doble clic, usa un servidor local (ver README).', error);
        contenedor.textContent = '';
        var mensaje = crear('p', 'menu__error', 'No pudimos cargar el menú en este momento. ');
        var enlace = crear('a', null, 'Escríbenos por WhatsApp');
        enlace.href = WHATSAPP_URL;
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        mensaje.appendChild(enlace);
        mensaje.appendChild(document.createTextNode(' y te lo enviamos.'));
        contenedor.appendChild(mensaje);
      });
  }

  /* ---------- Galería con vista ampliada ---------- */
  function iniciarGaleria() {
    var visor = document.querySelector('[data-visor]');
    var botones = Array.prototype.slice.call(document.querySelectorAll('[data-galeria] .galeria__boton'));
    if (!visor || !botones.length) return;

    var imagen = visor.querySelector('[data-visor-imagen]');
    var texto = visor.querySelector('[data-visor-texto]');
    var contador = visor.querySelector('[data-visor-contador]');
    var indice = 0;
    var soportaDialogo = typeof visor.showModal === 'function';

    texto.setAttribute('aria-hidden', 'true'); // el texto ya está en el alt de la imagen

    // Muestra primero una selección; el resto aparece con "Ver todas las fotos"
    var extras = Array.prototype.slice.call(document.querySelectorAll('[data-galeria] .galeria__item--extra'));
    var botonMas = document.querySelector('[data-galeria-mas]');
    if (botonMas && extras.length) {
      extras.forEach(function (li) { li.hidden = true; });
      botonMas.hidden = false;
      botonMas.addEventListener('click', function () {
        extras.forEach(function (li) { li.hidden = false; });
        botonMas.hidden = true;
        extras[0].querySelector('button').focus();
      });
    }

    botones.forEach(function (boton, i) {
      var img = boton.querySelector('img');
      boton.setAttribute('aria-label', 'Ampliar foto: ' + img.alt);
      boton.addEventListener('click', function () {
        if (!soportaDialogo) {
          window.open(img.currentSrc || img.src, '_blank', 'noopener');
          return;
        }
        abrir(i);
      });
    });

    function fotoDe(i) { return botones[i].querySelector('img'); }

    function mostrar(i) {
      indice = (i + botones.length) % botones.length;
      var img = fotoDe(indice);
      imagen.src = img.currentSrc || img.src;
      imagen.alt = img.alt;
      texto.textContent = img.alt;
      contador.textContent = (indice + 1) + ' / ' + botones.length;
      // Precarga las vecinas para que el cambio sea inmediato
      [indice + 1, indice - 1].forEach(function (j) {
        var vecina = fotoDe((j + botones.length) % botones.length);
        new Image().src = vecina.currentSrc || vecina.src;
      });
    }

    function abrir(i) {
      mostrar(i);
      document.documentElement.classList.add('visor-abierto');
      visor.showModal();
    }

    function cerrar() { visor.close(); }

    visor.addEventListener('close', function () {
      document.documentElement.classList.remove('visor-abierto');
      // Si la foto quedó oculta tras "Ver todas las fotos", el foco vuelve a ese botón
      if (botones[indice].closest('li').hidden && botonMas) botonMas.focus();
      else botones[indice].focus();
    });

    visor.querySelector('[data-visor-cerrar]').addEventListener('click', cerrar);
    visor.querySelector('[data-visor-anterior]').addEventListener('click', function () { mostrar(indice - 1); });
    visor.querySelector('[data-visor-siguiente]').addEventListener('click', function () { mostrar(indice + 1); });

    // Tocar fuera de la foto cierra
    visor.addEventListener('click', function (e) {
      if (e.target === visor || e.target.classList.contains('visor__figura')) cerrar();
    });

    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(indice + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(indice - 1); }
    });

    // Deslizar con el dedo
    var inicioX = null;
    visor.addEventListener('pointerdown', function (e) { inicioX = e.clientX; });
    visor.addEventListener('pointerup', function (e) {
      if (inicioX === null) return;
      var delta = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(delta) > 50) mostrar(indice + (delta < 0 ? 1 : -1));
    });
  }

  /* ---------- Aparición suave al hacer scroll ---------- */
  function iniciarRevelado() {
    var elementos = document.querySelectorAll('.revelar');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(elementos, function (el) { el.classList.add('es-visible'); });
      return;
    }
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('es-visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(elementos, function (el) { observador.observe(el); });
  }

  function iniciarAnio() {
    var anio = document.querySelector('[data-anio]');
    if (anio) anio.textContent = String(new Date().getFullYear());
  }

  iniciarEncabezado();
  iniciarHorario();
  iniciarMenu();
  iniciarGaleria();
  iniciarRevelado();
  iniciarAnio();
})();
