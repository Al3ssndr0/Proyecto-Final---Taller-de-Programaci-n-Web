/* ============================================
   MENU-SCRIPT.JS
   SaveFood
============================================ */

const API_URL = "http://localhost:3000";
const CLAVE_CARRITO = "savefood_carrito";

let carrito = [];

/* ============================================
   CARRITO
============================================ */

function cargarCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);

    if (datos) {
        carrito = JSON.parse(datos);
    } else {
        carrito = [];
    }
}

function guardarCarrito() {
    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );
}

cargarCarrito();


/* ============================================
   AGREGAR PRODUCTO
============================================ */

function agregarAlCarrito(id_producto, nombre, precio) {
    let encontrado = carrito.find(item => item.id_producto == id_producto);

    if (encontrado) {
        encontrado.cantidad++;
    } else {
        carrito.push({
            id_producto: id_producto,
            nombre: nombre,
            precio: Number(precio),
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContadorCarrito();

    alert(nombre + " agregado al carrito.");
}


/* ============================================
   CONTADOR
============================================ */

function actualizarContadorCarrito() {
    let total = 0;
    carrito.forEach(item => {
        total += item.cantidad;
    });

    const contador = document.getElementById("contador-carrito");

    if (contador) {
        contador.textContent = total;
    }
}


/* ============================================
   TOTAL
============================================ */

function calcularTotalCarrito() {
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });

    return total.toFixed(2);
}


/* ============================================
   VACIAR
============================================ */

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
}


/* ============================================
   CARGAR PRODUCTOS MYSQL
============================================ */

async function cargarProductosDesdeBD() {

    try {

        const response = await fetch(API_URL + "/productos");

        const productos = await response.json();

        crearCards(productos);

        crearTabla(productos);

    }

    catch (error) {

        console.error(error);

    }

}
/* ============================================
   CREAR TARJETAS DESDE MYSQL
============================================ */

function crearCards(productos) {

    const contenedor = document.getElementById("contenedor-menu");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        contenedor.innerHTML += `
        <article class="card">
            <img
                src="${producto.Ruta_Imagen}"
                alt="${producto.Nombre_Producto}">

            <div class="contenido">
                <h2>${producto.Nombre_Producto}</h2>
                <p class="descripcion">${producto.Descripcion}</p>

                <p class="precio-original">
                    S/ ${parseFloat(producto.Precio_Original).toFixed(2)}
                </p>

                <p class="precio-descuento">
                    S/ ${parseFloat(producto.Precio_Descuento).toFixed(2)}
                </p>

                <button
                    class="btn-animado"
                    onclick="agregarAlCarrito(
                        ${producto.ID_Producto},
                        '${producto.Nombre_Producto.replace(/'/g, "\\'")}',
                        ${producto.Precio_Descuento}
                    )">
                    Añadir al carrito
                </button>
            </div>
        </article>
        `;
    });
}


/* ============================================
   CREAR TABLA DESDE MYSQL
============================================ */

function crearTabla(productos) {
    const tabla = document.getElementById("tabla-productos");
    if (!tabla) return;
    tabla.innerHTML = "";

    productos.forEach(producto => {
        tabla.innerHTML += `
        <tr>
            <td>${producto.Nombre_Producto}</td>

            <td>${producto.Descripcion}</td>

            <td>S/ ${parseFloat(producto.Precio_Original).toFixed(2)}</td>

            <td>S/ ${parseFloat(producto.Precio_Descuento).toFixed(2)}</td>

            <td>
                <button
                    class="btn-animado btn-tabla"
                    onclick="agregarAlCarrito(
                        ${producto.ID_Producto},
                        '${producto.Nombre_Producto.replace(/'/g, "\\'")}',
                        ${producto.Precio_Descuento}
                    )">
                    Añadir
                </button>
            </td>
        </tr>
        `;
    });
}
/* ============================================
   RENDERIZAR CARRITO
============================================ */
/*
function renderizarCarrito() {

    const contenedor = document.getElementById("resumen-carrito");

    if (!contenedor) return;
    cargarCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p class="carrito-vacio">
                🛒 Tu carrito está vacío.
            </p>
        `;
        return;
    }

    let html = `
        <h3>🛒 Resumen del Pedido</h3>
        <ul class="lista-carrito">
    `;

    carrito.forEach(item => {
        html += `
            <li>
                <strong>${item.nombre}</strong>
                <br>
                Cantidad:
                ${item.cantidad}
                <br>
                Subtotal:
                S/ ${(item.precio * item.cantidad).toFixed(2)}
            </li>
        `;
    });

    html += `
        </ul>
        <hr>
        <h3>
            Total: S/ ${calcularTotalCarrito()}
        </h3>
    `;
    contenedor.innerHTML = html;
}
*/
function renderizarCarrito() {
    console.log("Paso 1: Iniciando renderizarCarrito...");

    const contenedor = document.getElementById("resumen-carrito");
    console.log("Paso 2: ¿Encontró el contenedor HTML?", contenedor);

    if (!contenedor) {
        console.error("Paso 3: ERROR. No se encontró el div 'resumen-carrito' en el HTML. Abortando.");
        return;
    }

    cargarCarrito();
    console.log("Paso 4: Platos cargados en la memoria:", carrito);

    if (carrito.length === 0) {
        console.log("Paso 5: El carrito está vacío. Mostrando mensaje.");
        contenedor.innerHTML = `
            <p class="carrito-vacio">
                🛒 Tu carrito está vacío.
            </p>
        `;
        return;
    }

    let html = `
        <h3>🛒 Resumen del Pedido</h3>
        <ul class="lista-carrito">
    `;

    carrito.forEach(item => {
        html += `
            <li>
                <strong>${item.nombre}</strong> <br>
                Cantidad: ${item.cantidad} <br>
                Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)}
            </li>
        `;
    });

    html += `
        </ul>
        <hr>
        <h3>Total: S/ ${calcularTotalCarrito()}</h3>
    `;

    contenedor.innerHTML = html;
    console.log("Paso 6: ¡Éxito! HTML inyectado en la pantalla.");
}

/* DROPDOWN CARRITO */
// Función para mostrar/ocultar el desplegable
function toggleCarritoDesplegable() {
    const dropdown = document.getElementById("dropdown-carrito");
    
    // Si estaba oculto por el estilo inline (display:none), lo quitamos
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    }

    // Ahora hacemos el toggle de la clase para la animación
    dropdown.classList.toggle("mostrar");
    
    if (dropdown.classList.contains("mostrar")) {
        renderizarDropdown(); 
    }
}

// Función para dibujar los productos en el dropdown
function renderizarDropdown() {
    const contenido = document.getElementById("contenido-dropdown");
    cargarCarrito(); // Aseguramos tener los datos frescos

    if (carrito.length === 0) {
        contenido.innerHTML = "<p>Carrito vacío</p>";
        return;
    }

    let html = "<ul>";
    carrito.forEach(item => {
        html += `<li>${item.nombre} (x${item.cantidad}) - S/ ${(item.precio * item.cantidad).toFixed(2)}</li>`;
    });
    html += "</ul>";
    html += `<p><strong>Total: S/ ${calcularTotalCarrito()}</strong></p>`;
    
    contenido.innerHTML = html;
}

/* ============================================
   OFERTAS
============================================ */

async function cargarOfertasDesdeBD() {

    try {

        const response = await fetch(API_URL + "/ofertas");

        const productos = await response.json();

        crearCards(productos);

    }

    catch (error) {

        console.error(error);

    }

}


/* ============================================
   INICIAR
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();

    if (document.getElementById("resumen-carrito")) {
        renderizarCarrito();
    }

    if (document.getElementById("contenedor-menu")) {
        cargarProductosDesdeBD();
    }

    if (document.getElementById("contenedor-ofertas")) {
        cargarOfertasDesdeBD();
    }
});