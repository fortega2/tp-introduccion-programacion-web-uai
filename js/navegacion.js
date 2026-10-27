/* ==========================================================================
   navegacion.js — Menú hamburguesa de la navegación principal
   En mobile el menú arranca cerrado y se abre con el botón "Menú".
   Sin JavaScript el botón queda oculto y el menú se ve completo.
   El menú ya arranca colapsado por CSS gracias a la clase "con-js" que
   pone tema.js en <html>; este script solo muestra el botón y lo conecta.
   ========================================================================== */

/* Abre o cierra el menú y deja aria-expanded sincronizado */
const cambiarEstadoMenu = (boton, navegacion, abrir) => {
    boton.setAttribute('aria-expanded', String(abrir));
    navegacion.classList.toggle('navegacion--abierta', abrir);
};

/* Indica si el menú está abierto en este momento */
const menuEstaAbierto = (boton) => boton.getAttribute('aria-expanded') === 'true';

/* Alterna el menú cada vez que se pulsa el botón */
const alternarMenu = (boton, navegacion) => {
    cambiarEstadoMenu(boton, navegacion, !menuEstaAbierto(boton));
};

/* Con Escape se cierra el menú abierto y el foco vuelve al botón */
const cerrarMenuConEscape = (evento, boton, navegacion) => {
    if (evento.key === 'Escape' && menuEstaAbierto(boton)) {
        cambiarEstadoMenu(boton, navegacion, false);
        boton.focus();
    }
};

/* Conecta el botón y el teclado con la navegación, si la página tiene menú */
const iniciarMenu = () => {
    const boton = document.querySelector('.boton-menu');
    const navegacion = document.querySelector('.navegacion');

    if (boton && navegacion) {
        boton.hidden = false;

        boton.addEventListener('click', () => alternarMenu(boton, navegacion));
        document.addEventListener('keydown', (evento) => cerrarMenuConEscape(evento, boton, navegacion));
    }
};

document.addEventListener('DOMContentLoaded', iniciarMenu);
