/* ==========================================================================
   galeria.js — Lightbox de la galería de escenas de cada película
   Cada miniatura enlaza a la imagen grande. Con JavaScript, el enlace abre
   la escena en un <dialog> modal: showModal() deja el foco dentro del
   diálogo y lo cierra con Escape. Las flechas del teclado pasan de escena,
   y al cerrar el foco vuelve a la miniatura que lo abrió.
   Sin JavaScript, el enlace abre la imagen grande como siempre.
   ========================================================================== */

/* Ícono SVG de los botones del lightbox, a partir del trazo de su dibujo */
const iconoLightbox = (trazo) => `
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <path d="${trazo}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

/* Crea el diálogo del lightbox (uno solo por página) y lo agrega al <body> */
const crearLightbox = () => {
    const dialogo = document.createElement('dialog');

    dialogo.className = 'lightbox';
    dialogo.setAttribute('aria-labelledby', 'lightbox-epigrafe');
    dialogo.innerHTML = `
        <button class="lightbox__boton lightbox__boton--cerrar" type="button" aria-label="Cerrar" autofocus>
            ${iconoLightbox('M6 6l12 12M18 6L6 18')}
        </button>
        <figure class="lightbox__figura">
            <div class="lightbox__escena">
                <img class="lightbox__imagen" alt="" width="1280" height="720">
                <button class="lightbox__boton lightbox__boton--anterior" type="button" aria-label="Escena anterior">
                    ${iconoLightbox('M15 5l-7 7 7 7')}
                </button>
                <button class="lightbox__boton lightbox__boton--siguiente" type="button" aria-label="Escena siguiente">
                    ${iconoLightbox('M9 5l7 7-7 7')}
                </button>
            </div>
            <figcaption class="lightbox__epigrafe" id="lightbox-epigrafe"></figcaption>
        </figure>
        <p class="lightbox__contador" aria-live="polite"></p>`;
    document.body.append(dialogo);

    return dialogo;
};

/* Muestra en el lightbox la escena de la miniatura indicada */
const mostrarEscena = (dialogo, enlaces, indice) => {
    const enlace = enlaces[indice];
    const miniatura = enlace.querySelector('img');
    const epigrafe = enlace.closest('figure').querySelector('figcaption');
    const imagen = dialogo.querySelector('.lightbox__imagen');

    imagen.src = enlace.href;
    imagen.alt = miniatura.alt;
    dialogo.querySelector('.lightbox__epigrafe').textContent = epigrafe.textContent;
    dialogo.querySelector('.lightbox__contador').textContent = `Escena ${indice + 1} de ${enlaces.length}`;
    dialogo.dataset.indice = String(indice);
};

/* Pasa a la escena anterior (paso -1) o siguiente (paso 1); de la última vuelve a la primera */
const moverEscena = (dialogo, enlaces, paso) => {
    const total = enlaces.length;
    const indiceActual = Number(dialogo.dataset.indice);

    mostrarEscena(dialogo, enlaces, (indiceActual + paso + total) % total);
};

/* Abre el lightbox en la escena de la miniatura clickeada, en vez de ir al archivo */
const abrirLightbox = (evento, dialogo, enlaces, indice) => {
    evento.preventDefault();
    dialogo.dataset.origen = String(indice);
    mostrarEscena(dialogo, enlaces, indice);
    dialogo.showModal();
};

/* Con las flechas izquierda y derecha se cambia de escena */
const navegarConTeclado = (evento, dialogo, enlaces) => {
    if (evento.key === 'ArrowLeft') {
        moverEscena(dialogo, enlaces, -1);
    } else if (evento.key === 'ArrowRight') {
        moverEscena(dialogo, enlaces, 1);
    }
};

/* Un click sobre el fondo oscuro (fuera de la escena) cierra el lightbox */
const cerrarAlTocarFondo = (evento, dialogo) => {
    if (evento.target === dialogo) {
        dialogo.close();
    }
};

/* Conecta los botones y el teclado del lightbox */
const conectarLightbox = (dialogo, enlaces) => {
    const anterior = dialogo.querySelector('.lightbox__boton--anterior');
    const siguiente = dialogo.querySelector('.lightbox__boton--siguiente');

    // Con una sola escena no hay a dónde moverse
    anterior.hidden = enlaces.length < 2;
    siguiente.hidden = enlaces.length < 2;

    anterior.addEventListener('click', () => moverEscena(dialogo, enlaces, -1));
    siguiente.addEventListener('click', () => moverEscena(dialogo, enlaces, 1));
    dialogo.querySelector('.lightbox__boton--cerrar').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('keydown', (evento) => navegarConTeclado(evento, dialogo, enlaces));
    dialogo.addEventListener('click', (evento) => cerrarAlTocarFondo(evento, dialogo));
    // Al cerrar, el foco vuelve a la miniatura que abrió el lightbox
    dialogo.addEventListener('close', () => enlaces[Number(dialogo.dataset.origen)].focus());
};

/* Arma el lightbox y lo conecta con las miniaturas, si la página tiene galería */
const iniciarGaleria = () => {
    const enlaces = [...document.querySelectorAll('.galeria__enlace')];

    if (enlaces.length > 0) {
        const dialogo = crearLightbox();

        conectarLightbox(dialogo, enlaces);
        enlaces.forEach((enlace, indice) => {
            enlace.addEventListener('click', (evento) => abrirLightbox(evento, dialogo, enlaces, indice));
        });
    }
};

document.addEventListener('DOMContentLoaded', iniciarGaleria);
