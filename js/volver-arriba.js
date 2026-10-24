/* ==========================================================================
   volver-arriba.js — Botón para volver al principio de la página
   Aparece cuando se bajó más de una pantalla y sube con scroll suave,
   salvo que el usuario haya pedido menos movimiento en su sistema.
   ========================================================================== */

/* Desde cuántos píxeles de scroll se muestra el botón */
const DISTANCIA_PARA_MOSTRAR = 400;

/* Muestra el botón solo cuando la página está lo bastante abajo */
const actualizarVisibilidad = (boton) => {
    boton.hidden = window.scrollY < DISTANCIA_PARA_MOSTRAR;
};

/* Elige scroll suave o instantáneo según la preferencia del usuario */
const tipoDeScroll = () => {
    let tipo = 'smooth';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        tipo = 'auto';
    }

    return tipo;
};

/* Sube al principio y deja el foco en el primer enlace del encabezado,
   para que el teclado siga desde arriba */
const volverArriba = () => {
    const marca = document.querySelector('.marca');

    window.scrollTo({ top: 0, behavior: tipoDeScroll() });

    if (marca) {
        marca.focus({ preventScroll: true });
    }
};

/* Conecta el botón con el scroll, si la página lo tiene */
const iniciarVolverArriba = () => {
    const boton = document.querySelector('.volver-arriba');

    if (boton) {
        actualizarVisibilidad(boton);
        window.addEventListener('scroll', () => actualizarVisibilidad(boton), { passive: true });
        boton.addEventListener('click', volverArriba);
    }
};

document.addEventListener('DOMContentLoaded', iniciarVolverArriba);
