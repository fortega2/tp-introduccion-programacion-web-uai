/* ==========================================================================
   linea-de-tiempo.js — Acordeón de los eventos de la línea de tiempo
   El título de cada evento pasa a ser un botón que despliega o pliega su
   detalle (patrón de acordeón de WAI-ARIA: el botón va dentro del <h3>).
   Un botón general despliega o pliega todos a la vez.
   Sin JavaScript los eventos se ven completos.
   ========================================================================== */

/* Abre o cierra un evento y deja aria-expanded sincronizado */
const cambiarEstadoEvento = ({ boton, detalle }, abrir) => {
    boton.setAttribute('aria-expanded', String(abrir));
    detalle.hidden = !abrir;
};

/* Indica si un evento está desplegado en este momento */
const eventoEstaAbierto = ({ boton }) => boton.getAttribute('aria-expanded') === 'true';

/* Indica si todos los eventos están desplegados */
const todosLosEventosAbiertos = (eventos) => eventos.every(eventoEstaAbierto);

/* Pone en el botón general la acción que va a hacer el próximo click */
const actualizarControlEventos = (control, eventos) => {
    let texto = 'Desplegar todos los eventos';

    if (todosLosEventosAbiertos(eventos)) {
        texto = 'Plegar todos los eventos';
    }

    control.textContent = texto;
};

/* Indica si un evento tiene título y detalle, que es lo que necesita el acordeón */
const eventoEsDesplegable = (evento) =>
    evento.querySelector('h3') !== null && evento.querySelector('.evento__detalle') !== null;

/* Mete el texto del título en un botón que controla el detalle, y deja el evento plegado.
   Devuelve el par botón/detalle con el que trabaja el resto del acordeón */
const prepararEvento = (evento, indice) => {
    const titulo = evento.querySelector('h3');
    const detalle = evento.querySelector('.evento__detalle');
    const boton = document.createElement('button');
    const parEvento = { boton, detalle };

    detalle.id = `evento-detalle-${indice + 1}`;
    boton.type = 'button';
    boton.className = 'evento__boton';
    boton.setAttribute('aria-controls', detalle.id);
    boton.append(...titulo.childNodes);
    titulo.append(boton);
    cambiarEstadoEvento(parEvento, false);

    return parEvento;
};

/* Despliega o pliega un evento y actualiza el botón general */
const alternarEvento = (parEvento, eventos, control) => {
    cambiarEstadoEvento(parEvento, !eventoEstaAbierto(parEvento));

    if (control) {
        actualizarControlEventos(control, eventos);
    }
};

/* Si están todos desplegados los pliega; si no, despliega todos */
const alternarTodosLosEventos = (eventos, control) => {
    const abrir = !todosLosEventosAbiertos(eventos);

    eventos.forEach((parEvento) => cambiarEstadoEvento(parEvento, abrir));
    actualizarControlEventos(control, eventos);
};

/* Arma el acordeón y conecta los botones, si la página tiene eventos */
const iniciarLineaDeTiempo = () => {
    const eventos = [...document.querySelectorAll('.evento')].filter(eventoEsDesplegable).map(prepararEvento);
    const control = document.querySelector('.linea-tiempo__control');

    if (eventos.length > 0) {
        eventos.forEach((parEvento) => {
            parEvento.boton.addEventListener('click', () => alternarEvento(parEvento, eventos, control));
        });
    }

    if (eventos.length > 0 && control) {
        control.hidden = false;
        actualizarControlEventos(control, eventos);
        control.addEventListener('click', () => alternarTodosLosEventos(eventos, control));
    }
};

document.addEventListener('DOMContentLoaded', iniciarLineaDeTiempo);
