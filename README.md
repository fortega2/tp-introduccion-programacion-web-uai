# Spider-Man: la trilogía de Sam Raimi

Sitio web informativo sobre la trilogía original de Spider-Man dirigida por Sam Raimi y protagonizada por Tobey Maguire: *Spider-Man* (2002), *Spider-Man 2* (2004) y *Spider-Man 3* (2007).

Trabajo práctico de **Introducción a la Programación Web** (Licenciatura en Gestión de Tecnología Informática, UAI).

- **Autor:** Facundo Ernesto Ortega
- **Publicado en:** <https://spiderman-trilogia.sonuserver.com/>

## Objetivo

Brindar información completa y organizada sobre la trilogía: fichas de las tres películas, personajes y villanos, una línea de tiempo de la saga, curiosidades de producción, su legado en el cine de superhéroes y un espacio de reseñas, en un formato accesible y pensado para fans.

## Tecnologías

- **HTML5** semántico.
- **CSS3**: custom properties, Flexbox, Grid y media queries. Tipografías de Google Fonts.
- **JavaScript** puro (ES6+), sin librerías ni frameworks.
- Sin backend ni paso de build: los archivos se sirven tal cual.

## Estructura

```
/
├── index.html              Inicio
├── sobre-la-trilogia.html  Contexto y datos generales
├── spider-man-2002.html    Ficha de Spider-Man (2002)
├── spider-man-2-2004.html  Ficha de Spider-Man 2 (2004)
├── spider-man-3-2007.html  Ficha de Spider-Man 3 (2007)
├── personajes.html         Perfiles de los personajes principales
├── villanos.html           Análisis de los villanos
├── linea-de-tiempo.html    Cronología interactiva
├── curiosidades.html       Detrás de escena
├── legado.html             Influencia en el género
├── blog.html               Reseñas y opiniones
├── contacto.html           Formulario de contacto
├── manifest.json           Manifiesto de la web app (PWA)
├── favicon.ico / .svg      Íconos de la pestaña
├── css/
│   ├── estilos.css         Hoja principal (variables, base y componentes compartidos)
│   ├── linea-de-tiempo.css Solo línea de tiempo
│   ├── blog.css            Solo blog
│   ├── quiz.css            Solo curiosidades (quiz)
│   └── contacto.css        Solo contacto (formulario)
├── js/                     Un archivo por funcionalidad
│   ├── tema.js             Modo oscuro (sin defer, para aplicarlo antes de pintar)
│   ├── navegacion.js       Menú hamburguesa
│   ├── volver-arriba.js    Botón "volver arriba"
│   ├── filtros.js          Filtros de personajes, villanos y blog
│   ├── linea-de-tiempo.js  Acordeón de la línea de tiempo
│   ├── galeria.js          Lightbox de las galerías
│   ├── quiz.js             Quiz de curiosidades
│   └── validacion-formulario.js  Validación del formulario de contacto
└── images/                 Imágenes optimizadas (< 200 KB c/u)
```

## Funcionalidades JavaScript

Cada página carga solo los scripts que usa. Sin JavaScript el contenido se sigue viendo completo: los controles que lo necesitan (filtros, quiz, botones del menú y del tema) arrancan ocultos y el script los muestra.

| Funcionalidad | Páginas | Archivo |
|---|---|---|
| Menú hamburguesa en mobile, que se cierra con Escape | Todas | `navegacion.js` |
| Modo oscuro con la elección guardada en `localStorage` | Todas | `tema.js` |
| Botón "volver arriba" con scroll suave | Todas | `volver-arriba.js` |
| Filtros por película y categoría, con el conteo de resultados anunciado | Personajes, Villanos, Blog | `filtros.js` |
| Acordeón de eventos, con un botón para desplegar o plegar todos | Línea de tiempo | `linea-de-tiempo.js` |
| Lightbox de escenas (`<dialog>`), con flechas del teclado y Escape | Las tres películas | `galeria.js` |
| Quiz de 8 preguntas con corrección, explicación y puntaje | Curiosidades | `quiz.js` |
| Validación del formulario con mensajes por campo y envío simulado | Contacto | `validacion-formulario.js` |

## Cómo verlo localmente

Desde la raíz del proyecto:

```sh
python -m http.server 8000
```

Y abrir <http://localhost:8000/>. No conviene abrir los archivos con `file://`, porque algunas funciones del navegador (como el manifiesto) no funcionan así.

## Publicación y rendimiento

El sitio se sirve con [Caddy](https://caddyserver.com/), que tiene HTTPS automático y comprime cada respuesta con gzip o zstd. Esa compresión cubre el criterio de CSS y JS comprimidos. Por eso los fuentes del repositorio quedan legibles y comentados, sin minificar.

## Fuentes

- **Imágenes de las películas** (pósters, escenas y retratos de personajes): [The Movie Database (TMDB)](https://www.themoviedb.org/), en las páginas de imágenes de *Spider-Man* (2002), *Spider-Man 2* (2004), *Spider-Man 3* (2007) y *Spider-Man: No Way Home* (2021). Se recortaron y se convirtieron a WebP con ImageMagick.
- **Logo, favicon e imagen para compartir:** diseño propio (una telaraña en SVG).
- **Datos** (fichas técnicas, fechas, presupuestos y recaudaciones): [Wikipedia](https://es.wikipedia.org/wiki/Trilog%C3%ADa_de_Spider-Man) y [Box Office Mojo](https://www.boxofficemojo.com/). Como las fuentes no coinciden al millón, los montos están redondeados.
