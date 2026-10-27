/* ==========================================================================
   validacion-formulario.js — Validación del formulario de contacto
   Valida cada campo cuando se modifica y vuelve a validarlo mientras se
   corrige. Al enviar, si hay errores los resume y lleva el foco al
   primero; si no, simula el envío (el sitio no tiene servidor) y muestra
   un mensaje de confirmación.
   Los errores se asocian a su campo con aria-describedby y aria-invalid.
   ========================================================================== */

/* Límites de los campos (los mismos que minlength/maxlength en el HTML) */
const MINIMO_NOMBRE = 2;
const MINIMO_MENSAJE = 20;
const MAXIMO_MENSAJE = 1000;

/* Cuánto tarda el envío simulado, en milisegundos */
const DEMORA_ENVIO = 800;

/* Algo@algo.algo: sin espacios, con una sola arroba y un dominio con punto */
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- Reglas: cada una recibe el campo y devuelve el mensaje
   de error, o un texto vacío si el valor es válido ---------- */

const validarNombre = (campo) => {
    const valor = campo.value.trim();
    let error = '';

    if (valor === '') {
        error = 'Escribí tu nombre.';
    } else if (valor.length < MINIMO_NOMBRE) {
        error = `El nombre tiene que tener al menos ${MINIMO_NOMBRE} letras.`;
    }

    return error;
};

const validarEmail = (campo) => {
    const valor = campo.value.trim();
    let error = '';

    if (valor === '') {
        error = 'Escribí tu email para que podamos responderte.';
    } else if (!PATRON_EMAIL.test(valor)) {
        error = 'Revisá el email: tiene que tener el formato nombre@correo.com.';
    }

    return error;
};

const validarMotivo = (campo) => {
    let error = '';

    if (campo.value === '') {
        error = 'Elegí el motivo de tu mensaje.';
    }

    return error;
};

const validarMensaje = (campo) => {
    const largo = campo.value.trim().length;
    let error = '';

    if (largo === 0) {
        error = 'Escribí tu mensaje.';
    } else if (largo < MINIMO_MENSAJE) {
        error = `El mensaje es muy corto: tiene ${largo} caracteres y el mínimo es ${MINIMO_MENSAJE}.`;
    } else if (largo > MAXIMO_MENSAJE) {
        error = `El mensaje es muy largo: tiene ${largo} caracteres y el máximo es ${MAXIMO_MENSAJE}.`;
    }

    return error;
};

const validarAceptacion = (campo) => {
    let error = '';

    if (!campo.checked) {
        error = 'Para enviar el mensaje tenés que aceptar el uso de tus datos.';
    }

    return error;
};

/* Qué regla corresponde a cada campo, según su atributo name */
const REGLAS_FORMULARIO = {
    nombre: validarNombre,
    email: validarEmail,
    motivo: validarMotivo,
    mensaje: validarMensaje,
    acepto: validarAceptacion,
};

/* ---------- Validación y envío ---------- */

/* Muestra (o borra) el error de un campo y sincroniza aria-invalid */
const mostrarErrorCampo = (campo, mensaje) => {
    document.getElementById(`error-${campo.name}`).textContent = mensaje;
    campo.setAttribute('aria-invalid', String(mensaje !== ''));
};

/* Valida un campo con su regla. Devuelve true si es válido */
const validarCampo = (campo) => {
    const mensaje = REGLAS_FORMULARIO[campo.name](campo);

    mostrarErrorCampo(campo, mensaje);

    return mensaje === '';
};

/* Mientras el usuario corrige un campo con error, se revalida en cada tecla
   para que el mensaje desaparezca apenas el valor es válido */
const revalidarSiTieneError = (campo) => {
    if (campo.getAttribute('aria-invalid') === 'true') {
        validarCampo(campo);
    }
};

/* Arma el resumen de errores que se anuncia al intentar enviar */
const mensajeDeErrores = (cantidad) => {
    let mensaje = `No se pudo enviar: revisá los ${cantidad} campos marcados con error.`;

    if (cantidad === 1) {
        mensaje = 'No se pudo enviar: revisá el campo marcado con error.';
    }

    return mensaje;
};

/* Deja el formulario vacío y sin marcas de error */
const limpiarFormulario = (formulario, campos) => {
    formulario.reset();
    campos.forEach((campo) => campo.removeAttribute('aria-invalid'));
};

/* Simula el envío: bloquea el botón un momento, después confirma y limpia el formulario */
const simularEnvio = (formulario, campos, boton, confirmacion) => {
    const nombre = formulario.elements.nombre.value.trim();

    boton.disabled = true;
    boton.textContent = 'Enviando…';

    setTimeout(() => {
        limpiarFormulario(formulario, campos);
        boton.disabled = false;
        boton.textContent = 'Enviar mensaje';
        confirmacion.textContent = `¡Gracias, ${nombre}! Tu mensaje se envió correctamente. (Es un envío simulado: este sitio no tiene servidor).`;
        confirmacion.focus();
    }, DEMORA_ENVIO);
};

/* Al enviar: valida todos los campos y, según el resultado, avisa o simula el envío */
const enviarFormulario = (evento, formulario, campos, aviso, boton, confirmacion) => {
    // Primero se validan todos, así cada campo con error queda marcado
    const validos = campos.map(validarCampo);
    const invalidos = campos.filter((campo, indice) => !validos[indice]);

    evento.preventDefault();
    confirmacion.textContent = '';

    if (invalidos.length > 0) {
        aviso.textContent = mensajeDeErrores(invalidos.length);
        invalidos[0].focus();
    } else {
        aviso.textContent = '';
        simularEnvio(formulario, campos, boton, confirmacion);
    }
};

/* Conecta la validación con el formulario de contacto, si la página lo tiene */
const iniciarFormulario = () => {
    const formulario = document.querySelector('.formulario');
    const aviso = document.querySelector('.formulario__aviso');
    const boton = document.querySelector('.formulario__enviar');
    const confirmacion = document.querySelector('.formulario__confirmacion');

    if (formulario && aviso && boton && confirmacion) {
        const campos = [...formulario.elements].filter((elemento) => elemento.name in REGLAS_FORMULARIO);

        // La validación la hace este script, con mensajes propios en español
        formulario.noValidate = true;

        campos.forEach((campo) => {
            campo.addEventListener('change', () => validarCampo(campo));
            campo.addEventListener('input', () => revalidarSiTieneError(campo));
        });
        formulario.addEventListener('submit', (evento) => enviarFormulario(evento, formulario, campos, aviso, boton, confirmacion));
    }
};

document.addEventListener('DOMContentLoaded', iniciarFormulario);
