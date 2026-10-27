/* ==========================================================================
   quiz.js — Quiz de opción múltiple sobre la trilogía (Curiosidades)
   Cada pregunta es un <fieldset> con su respuesta en data-correcta.
   Al enviar, si faltan respuestas avisa cuáles; si están todas, corrige
   cada pregunta, muestra la explicación y el puntaje final.
   Sin JavaScript el quiz queda oculto, porque no se podría corregir.
   ========================================================================== */

/* Devuelve las preguntas que todavía no tienen una opción elegida */
const preguntasSinResponder = (preguntas) =>
    preguntas.filter((pregunta) => pregunta.querySelector('input:checked') === null);

/* Devuelve el texto de la opción con el valor indicado dentro de una pregunta */
const textoDeOpcion = (pregunta, valor) => {
    const opcion = pregunta.querySelector(`input[value="${valor}"]`);

    return pregunta.querySelector(`label[for="${opcion.id}"]`).textContent;
};

/* Marca una pregunta como correcta o incorrecta, con texto además del color,
   y muestra su explicación. Devuelve true si se acertó */
const corregirPregunta = (pregunta) => {
    const correcta = pregunta.dataset.correcta;
    const elegida = pregunta.querySelector('input:checked').value;
    const acerto = elegida === correcta;
    const correccion = pregunta.querySelector('.quiz__correccion');

    if (acerto) {
        correccion.textContent = 'Correcto.';
    } else {
        correccion.textContent = `Incorrecto. La respuesta era: ${textoDeOpcion(pregunta, correcta)}.`;
    }

    pregunta.classList.toggle('quiz__pregunta--correcta', acerto);
    pregunta.classList.toggle('quiz__pregunta--incorrecta', !acerto);
    correccion.hidden = false;
    pregunta.querySelector('.quiz__explicacion').hidden = false;

    return acerto;
};

/* Elige un comentario según la proporción de respuestas correctas */
const comentarioSegunPuntaje = (aciertos, total) => {
    let comentario = 'Un gran poder conlleva una gran responsabilidad… de repasar. ¡Probá de nuevo!';

    if (aciertos === total) {
        comentario = '¡Perfecto! Sabés todo sobre la trilogía.';
    } else if (aciertos >= total * 0.6) {
        comentario = '¡Muy bien! Conocés la saga casi de memoria.';
    } else if (aciertos >= total * 0.3) {
        comentario = 'Nada mal. Repasá las curiosidades y volvé a intentarlo.';
    }

    return comentario;
};

/* Arma el aviso de cuántas preguntas faltan responder */
const mensajeDeFaltantes = (cantidad) => {
    let mensaje = `Te faltan responder ${cantidad} preguntas. Completalas para ver tu resultado.`;

    if (cantidad === 1) {
        mensaje = 'Te falta responder 1 pregunta. Completala para ver tu resultado.';
    }

    return mensaje;
};

/* Avisa que faltan respuestas y lleva el foco a la primera sin responder */
const avisarPreguntasFaltantes = (resultado, faltantes) => {
    resultado.textContent = mensajeDeFaltantes(faltantes.length);
    resultado.classList.add('quiz__resultado--aviso');
    faltantes[0].querySelector('input').focus();
};

/* Corrige todas las preguntas, muestra el puntaje y lleva el foco al resultado */
const mostrarPuntaje = (preguntas, resultado, reintentar) => {
    const aciertos = preguntas.map(corregirPregunta).filter((acerto) => acerto).length;

    resultado.textContent = `Acertaste ${aciertos} de ${preguntas.length}. ${comentarioSegunPuntaje(aciertos, preguntas.length)}`;
    resultado.classList.remove('quiz__resultado--aviso');
    reintentar.hidden = false;
    resultado.focus();
};

/* Al enviar el quiz: si faltan respuestas avisa, y si no, corrige */
const corregirQuiz = (evento, preguntas, resultado, reintentar) => {
    const faltantes = preguntasSinResponder(preguntas);

    evento.preventDefault();

    if (faltantes.length > 0) {
        avisarPreguntasFaltantes(resultado, faltantes);
    } else {
        mostrarPuntaje(preguntas, resultado, reintentar);
    }
};

/* Saca las marcas de corrección de todas las preguntas y vuelve el foco a la primera
   (el formulario ya desmarca las opciones solo, porque el botón es type="reset") */
const reiniciarQuiz = (preguntas, resultado, reintentar) => {
    preguntas.forEach((pregunta) => {
        pregunta.classList.remove('quiz__pregunta--correcta', 'quiz__pregunta--incorrecta');
        pregunta.querySelector('.quiz__correccion').hidden = true;
        pregunta.querySelector('.quiz__explicacion').hidden = true;
    });

    resultado.textContent = '';
    reintentar.hidden = true;
    preguntas[0].querySelector('input').focus();
};

/* Muestra el quiz y conecta el envío y el reinicio, si la página lo tiene */
const iniciarQuiz = () => {
    const seccion = document.getElementById('quiz');
    const formulario = document.querySelector('.quiz');
    const resultado = document.querySelector('.quiz__resultado');
    const reintentar = document.querySelector('.quiz__reintentar');

    if (seccion && formulario && resultado && reintentar) {
        const preguntas = [...formulario.querySelectorAll('.quiz__pregunta')];

        seccion.hidden = false;
        formulario.addEventListener('submit', (evento) => corregirQuiz(evento, preguntas, resultado, reintentar));
        formulario.addEventListener('reset', () => reiniciarQuiz(preguntas, resultado, reintentar));
    }
};

document.addEventListener('DOMContentLoaded', iniciarQuiz);
