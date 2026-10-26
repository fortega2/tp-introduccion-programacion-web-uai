/* ==========================================================================
   filtros.js — Filtro de listas por película y por categoría
   Sirve para cualquier <form class="filtros">: su data-lista indica el id
   de la lista que filtra, y cada grupo de radios compara su valor con el
   atributo data-* del mismo nombre en cada <article> de la lista.
   Lo usan Personajes, Villanos y Blog. Sin JavaScript el formulario queda
   oculto y se ve la lista completa.
   ========================================================================== */

/* Indica si el valor elegido coincide con alguno de los valores del ítem,
   que vienen separados por espacios (por ejemplo "2002 2004 2007") */
const coincideConFiltro = (valoresDelItem, valorElegido) =>
    valorElegido === 'todas' || valoresDelItem.split(' ').includes(valorElegido);

/* Indica si un ítem cumple todos los filtros elegidos a la vez */
const cumpleFiltros = (articulo, filtrosElegidos) =>
    filtrosElegidos.every(([grupo, valor]) => coincideConFiltro(articulo.dataset[grupo] || '', valor));

/* Arma el mensaje que cuenta cuántos ítems quedaron a la vista */
const mensajeDeResultados = (visibles, total, nombrePlural) => {
    let mensaje = `Se muestran ${visibles} de ${total} ${nombrePlural}.`;

    if (visibles === 0) {
        mensaje = `No hay ${nombrePlural} que coincidan con estos filtros. Probá con otra combinación.`;
    } else if (visibles === 1) {
        mensaje = `Se muestra 1 de ${total} ${nombrePlural}.`;
    }

    return mensaje;
};

/* Muestra u oculta cada ítem de la lista según los filtros y anuncia el resultado */
const aplicarFiltros = (formulario, lista, estado) => {
    const filtrosElegidos = [...new FormData(formulario)];
    const items = [...lista.children];
    let visibles = 0;

    items.forEach((item) => {
        const cumple = cumpleFiltros(item.querySelector('article'), filtrosElegidos);

        item.hidden = !cumple;

        if (cumple) {
            visibles += 1;
        }
    });

    estado.textContent = mensajeDeResultados(visibles, items.length, formulario.dataset.plural);
};

/* Muestra un formulario de filtros y lo conecta con su lista, si existe */
const iniciarFiltro = (formulario) => {
    const lista = document.getElementById(formulario.dataset.lista);
    const estado = formulario.querySelector('.filtros__estado');

    if (lista && estado) {
        formulario.hidden = false;
        formulario.addEventListener('change', () => aplicarFiltros(formulario, lista, estado));
        // No hay nada que enviar: el filtro se aplica apenas cambia una opción
        formulario.addEventListener('submit', (evento) => evento.preventDefault());
        aplicarFiltros(formulario, lista, estado);
    }
};

/* Inicia todos los filtros de la página */
const iniciarFiltros = () => {
    document.querySelectorAll('.filtros').forEach(iniciarFiltro);
};

document.addEventListener('DOMContentLoaded', iniciarFiltros);
