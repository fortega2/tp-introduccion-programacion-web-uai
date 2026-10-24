/* ==========================================================================
   tema.js — Modo oscuro con la elección guardada en localStorage
   Este archivo se carga en el <head> SIN defer a propósito: así aplica el
   tema guardado antes de que se pinte la página y no hay un destello del
   tema equivocado. El botón se conecta recién cuando el DOM está listo.
   Si el usuario nunca eligió, manda la preferencia de su sistema (CSS).
   ========================================================================== */

/* Clave con la que se guarda la elección del usuario */
const CLAVE_TEMA = 'tema';

/* Lee el tema guardado; devuelve null si no hay o si el navegador
   bloquea el almacenamiento (modo privado, cookies deshabilitadas) */
const leerTemaGuardado = () => {
    let tema = null;

    try {
        tema = localStorage.getItem(CLAVE_TEMA);
    } catch (error) {
        tema = null;
    }

    return tema;
};

/* Guarda la elección; si el navegador no lo permite, el tema igual
   cambia, solo que no se recuerda en la próxima visita */
const guardarTema = (tema) => {
    try {
        localStorage.setItem(CLAVE_TEMA, tema);
    } catch (error) {
        console.info('No se pudo guardar el tema elegido en este navegador.');
    }
};

/* Aplica un tema ("claro" u "oscuro") sobre <html> */
const aplicarTema = (tema) => {
    document.documentElement.dataset.tema = tema;
};

/* Averigua qué tema se está viendo: el elegido o, si no hay, el del sistema */
const temaActual = () => {
    let tema = document.documentElement.dataset.tema;

    if (!tema && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        tema = 'oscuro';
    } else if (!tema) {
        tema = 'claro';
    }

    return tema;
};

/* Refleja en el botón si el modo oscuro está activo */
const actualizarBoton = (boton) => {
    boton.setAttribute('aria-pressed', String(temaActual() === 'oscuro'));
};

/* Pasa al tema contrario, lo guarda y actualiza el botón */
const alternarTema = (boton) => {
    let nuevoTema = 'oscuro';

    if (temaActual() === 'oscuro') {
        nuevoTema = 'claro';
    }

    aplicarTema(nuevoTema);
    guardarTema(nuevoTema);
    actualizarBoton(boton);
};

/* Muestra y conecta el botón del tema, si la página lo tiene */
const iniciarBotonTema = () => {
    const boton = document.querySelector('.boton-tema');

    if (boton) {
        boton.hidden = false;
        actualizarBoton(boton);
        boton.addEventListener('click', () => alternarTema(boton));
    }
};

/* Se ejecuta enseguida: aplica el tema guardado antes de pintar */
const temaGuardado = leerTemaGuardado();

if (temaGuardado === 'claro' || temaGuardado === 'oscuro') {
    aplicarTema(temaGuardado);
}

document.addEventListener('DOMContentLoaded', iniciarBotonTema);
