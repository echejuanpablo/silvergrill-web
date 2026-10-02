# Silver Grill & Bar · propuesta de página web

Página de una sola sección (*landing page*) para **Silver Grill & Bar**, restaurante bar de parrilla y cócteles en Pereira. Es una **propuesta de muestra** para presentarle al dueño: está lista para publicarse, pero todavía tiene el menú de ejemplo y la etiqueta `noindex` (Google no la muestra mientras sea una propuesta).

- HTML, CSS y JavaScript sin frameworks. No hay nada que instalar ni compilar.
- Diseñada primero para celular, porque la mayoría de las visitas llegarán desde Instagram o WhatsApp.
- Acción principal: **reservar por WhatsApp**, con el mensaje ya escrito: *"Hola, quiero reservar una mesa en Silver Grill & Bar"*.

## Archivos

```
index.html        → la página (textos, secciones, horario, datos para Google)
menu.json         → el menú: categorías, platos y precios (se edita sin tocar el diseño)
css/estilos.css   → colores, tipografías y diseño
js/main.js        → menú por pestañas, galería ampliada, "abierto/cerrado ahora", menú del celular
imagenes/         → fotos, logo, ícono de la pestaña e imagen para compartir en redes
```

## Ver la página en tu computador

El menú se carga desde `menu.json`, y los navegadores bloquean esa lectura si abres `index.html` con doble clic. Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
python3 -m http.server 8000
```

Luego entra a <http://localhost:8000> en el navegador. En GitHub Pages funciona sin hacer nada de esto.

## Publicar en GitHub Pages (gratis)

1. Une esta rama con `main` (o usa directamente la rama donde está la página).
2. En GitHub, entra al repositorio → **Settings** → **Pages**.
3. En **Build and deployment** elige **Source: Deploy from a branch**.
4. En **Branch** elige `main` y la carpeta `/ (root)`. Pulsa **Save**.
5. Espera uno o dos minutos. La página quedará en:
   **https://echejuanpablo.github.io/silvergrill-web/**

> Si más adelante usas un dominio propio (por ejemplo `silvergrillbar.com`), busca y reemplaza `https://echejuanpablo.github.io/silvergrill-web/` en `index.html`. Esa dirección aparece en la etiqueta *canonical*, en la vista previa para redes (*og:*) y en los datos estructurados.

### Cuando el dueño apruebe la página

En `index.html` **quita esta línea** (está al principio, con un comentario encima):

```html
<meta name="robots" content="noindex">
```

Mientras esté ahí, Google no muestra la página en sus resultados. Después de quitarla, conviene registrar la página en [Google Search Console](https://search.google.com/search-console) y agregarla como sitio web en el perfil de Google del negocio y en la biografía de Instagram.

## Cómo editar el menú

Todo el menú está en `menu.json`. Cada categoría tiene este formato:

```json
{
  "id": "parrilla",
  "nombre": "Parrilla",
  "descripcion": "Cortes y carnes a las brasas, para disfrutar sin afán.",
  "imagen": "imagenes/carne-parrilla.jpg",
  "imagenAlt": "Cortes de carne dorándose sobre la parrilla",
  "platos": [
    {
      "nombre": "Punta de anca (300 g)",
      "descripcion": "Corte jugoso a la brasa con papa criolla y chimichurri.",
      "precio": 48000,
      "ejemplo": true,
      "destacado": true
    }
  ]
}
```

| Campo | Para qué sirve |
| --- | --- |
| `id` | Nombre interno, sin espacios ni tildes (`parrilla`, `cocteles`…). |
| `nombre` | Nombre que se ve en la pestaña. |
| `descripcion` | Frase corta bajo el nombre de la categoría (opcional). |
| `imagen` / `imagenAlt` | Foto de la categoría y su descripción para personas ciegas (opcional). |
| `precio` | Número **sin puntos ni signo** (`48000` se muestra como `$ 48.000`). También acepta texto, como `"Según temporada"`. Si lo borras, no se muestra precio. |
| `ejemplo` | `true` muestra la etiqueta **"Ejemplo"**. Bórralo o pon `false` cuando el plato sea real. |
| `destacado` | `true` muestra la etiqueta **"Recomendado"** (opcional). |

- El orden de las pestañas y de los platos es el mismo del archivo.
- Para agregar una categoría, copia un bloque completo `{ … }` y sepáralo del anterior con una coma.
- El texto `"aviso"` del principio es el recuadro amarillo que dice que el menú es de ejemplo. Cuando el menú sea real, **borra esa línea** (o déjala vacía: `"aviso": ""`) y el recuadro desaparece.
- Cuidado con las comas y las comillas: si el archivo queda mal escrito, la página muestra "No pudimos cargar el menú". Puedes revisarlo pegándolo en <https://jsonlint.com>.

## Cómo cambiar el horario

El horario aparece en varios sitios de `index.html`; si cambia, actualízalos todos:

1. **Sección "Horario"**: la lista con `data-dia`. Los atributos `data-abre` y `data-cierra` (formato 24 h, por ejemplo `23:30`) son los que usa la página para resaltar el día de hoy y decir si está *abierto ahora*. Un día sin esos atributos se considera cerrado.
2. **Datos para Google** (`application/ld+json`, en el `<head>`): `openingHoursSpecification`.
3. Textos sueltos: el aviso de la portada ("Martes a domingo desde las 12:00 m."), la tarjeta "Sin afán" de la sección de citas y el pie de página.

## Fotos

Las fotos se recortaron de capturas de pantalla de Instagram y Google Maps, sin incluir partes de la interfaz de esas aplicaciones. Por eso **todas son de baja resolución** (unos 350 px de ancho). Sirven para la muestra, pero en un celular moderno o en computador se ven algo borrosas.

| Archivo | Tamaño | Dónde se usa | Estado |
| --- | --- | --- | --- |
| `ambiente-noche-luces-verdes.jpg` | 347×463 | Portada, galería | ⚠️ Pedir foto original al dueño (es la más importante) |
| `coctel-rosado.jpg` | 347×420 | Portada, menú (Cócteles), galería | ⚠️ Pedir foto original al dueño |
| `plato-carne-coctel.jpg` | 346×419 | Portada, galería | ⚠️ Pedir foto original al dueño |
| `barra-noche-lamparas.jpg` | 347×463 | Sobre nosotros, galería | ⚠️ Pedir foto original al dueño |
| `letrero-neon-silver.jpg` | 347×342 | Sobre nosotros, galería | ⚠️ Pedir foto original al dueño |
| `pareja-jardin.jpg` | 347×454 | Ideal para tu cita, galería | ⚠️ Pedir foto original al dueño |
| `neon-y-nos-vamos.jpg` | 346×342 | Ideal para tu cita, galería | ⚠️ Pedir foto original al dueño |
| `carne-parrilla.jpg` | 347×302 | Menú (Parrilla), galería | ⚠️ Pedir foto original al dueño (recortada para quitar un botón de Instagram) |
| `barra-grifo-cerveza.jpg` | 346×463 | Menú (Bebidas), galería | ⚠️ Pedir foto original al dueño |
| `cocina-abierta.jpg` | 347×463 | Menú (Entradas), galería | ⚠️ Pedir foto original al dueño |
| `interior-cortinas.jpg` | 446×182 | Galería | ⚠️ Pedir foto original al dueño (la de peor calidad: viene de la ficha de Google Maps) |
| `jardin-noche.jpg` | 347×342 | Galería | ⚠️ Pedir foto original al dueño |
| `barra-sillas-mimbre.jpg` | 347×463 | Galería | ⚠️ Pedir foto original al dueño |
| `terraza-noche.jpg` | 347×463 | Galería | ⚠️ Pedir foto original al dueño |
| `terraza-plantas.jpg` | 347×454 | Galería | ⚠️ Pedir foto original al dueño |
| `terraza-bar-atardecer.jpg` | 346×454 | Galería | ⚠️ Pedir foto original al dueño |
| `jardin-atardecer.jpg` | 346×463 | Galería | ⚠️ Pedir foto original al dueño |
| `logo-silver.png` | 192×192 | Encabezado, pie, ícono | ⚠️ Pedir el logo original (ideal en vector: SVG, AI o PDF) |
| `compartir.jpg` | 1200×630 | Vista previa al compartir el enlace en WhatsApp o redes | Hecha con las fotos de arriba; rehacerla con las originales |
| `favicon-32.png` | 32×32 | Ícono de la pestaña del navegador | Sale del logo |

Para cambiar una foto, reemplaza el archivo en `imagenes/` **con el mismo nombre** y la página la toma sola. Si la foto nueva es más grande, mejor: la página la ajusta. Conviene que pese menos de 300 KB (puedes comprimirla en <https://squoosh.app>). Si cambias el tamaño o la proporción, actualiza también `width` y `height` de esa imagen en `index.html`.

## Datos pendientes por confirmar con el dueño

- [ ] **Menú real**: platos, descripciones y precios. Hoy todo el menú es de ejemplo y está marcado así.
- [ ] **Fotos originales** en buena resolución, sobre todo la de portada (ver tabla de arriba), y el **logo** en alta calidad.
- [ ] **Permiso de imagen**: varias fotos muestran clientes que se pueden reconocer (por ejemplo `pareja-jardin.jpg`, `terraza-noche.jpg`). Confirmar que el negocio puede usarlas en su página o cambiarlas.
- [ ] **Nombre en Google Maps**: la ficha con el mismo teléfono aparece como **"LA ESTACION SILVER"** (3,8 ★, 20 opiniones). Confirmar si es la misma y, si es así, sugerir cambiarle el nombre a "Silver Grill & Bar" en el Perfil de Empresa de Google.
- [ ] **Ubicación del mapa**: se usó el código de la ficha de Google (Plus Code `R66H+6W Pereira`, coordenadas 4.81056, -75.77019). Confirmar que el pin cae en la entrada correcta.
- [ ] **Horario**: la biografía de Instagram dice "Lunes a Domingo desde las 12pm", pero el horario que nos dieron indica **lunes cerrado**. Confirmar cuál es el correcto y actualizar Instagram para que coincida.
- [ ] **WhatsApp**: confirmar que el +57 317 511 2492 tiene WhatsApp activo y que alguien responde las reservas (ideal con WhatsApp Business y un mensaje de bienvenida).
- [ ] **Nombre del mall de comidas** donde está el local, para mencionarlo en la dirección. Confirmar también la frase "camino a Cerritos" de la sección *Sobre nosotros*.
- [ ] **Celebraciones**: la página dice "¿Celebran algo especial? Cuéntanoslo al reservar". Confirmar si ofrecen algo para fechas especiales (decoración, postre, mesa preferencial) para mencionarlo, o ajustar la frase.
- [ ] **Letrero "Silver Soda & Bar"**: aparece en una foto de Instagram (no se usó en la página). Confirmar si es otra marca o un nombre anterior.
- [ ] **Rango de precios** (por ejemplo "$$"), para agregarlo a los datos de Google (`priceRange`).
- [ ] **Otros datos opcionales**: medios de pago, parqueadero, si admiten mascotas, partidos en vivo y música/DJ (Instagram los menciona; no se incluyeron para mantener el enfoque en citas).
- [ ] **Dominio propio** (opcional), si el dueño quiere una dirección como `silvergrillbar.com` en vez de la de GitHub.

## Lista final antes de lanzar

- [ ] Menú real cargado en `menu.json`, sin `"ejemplo": true` y sin `"aviso"`.
- [ ] Fotos y logo originales en `imagenes/`.
- [ ] Datos pendientes confirmados (arriba).
- [ ] Quitar `<meta name="robots" content="noindex">` de `index.html`.
- [ ] Probar en un celular: botón de WhatsApp, "Cómo llegar" e Instagram.
- [ ] Poner el enlace en la biografía de Instagram y en la ficha de Google.

## Notas técnicas

- **SEO local**: título y descripción, vista previa para redes (Open Graph) y datos estructurados `Restaurant` de schema.org con dirección, coordenadas, horario, teléfono e Instagram.
- **Mapa**: inserción de Google Maps sin clave de API. El botón "Cómo llegar" abre la ruta en Google Maps (o en la app, desde el celular).
- **Abierto/cerrado ahora**: se calcula con la hora de Colombia (UTC−5), sin importar la zona horaria del teléfono del visitante.
- **Accesibilidad**: textos alternativos en todas las fotos, contraste alto, botones de al menos 44 px, navegación con teclado (pestañas del menú con flechas, galería con flechas y Esc), enlace para saltar al contenido y animaciones desactivadas si el visitante pidió reducir movimiento.
- **Tipografías**: Cormorant Garamond (títulos) y Manrope (texto), desde Google Fonts.
