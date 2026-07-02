/* ============================================
   SESIÓN 12 - Arreglos (Carrito de compras)
   =========================================== */

// Clave para guardar en sessionStorage
const CLAVE_CARRITO = "savefood_carrito";

/* ============================================
   SESIÓN 12 - Cargar carrito desde sessionStorage
   =========================================== */

function cargarCarrito() {
    const datos = sessionStorage.getItem(CLAVE_CARRITO);
    if (datos) {
        carrito = JSON.parse(datos);
    } else {
        carrito = [];
    }
}

// Cargar el carrito al iniciar el script
cargarCarrito();

/* ============================================
   SESIÓN 12 - Guardar carrito en sessionStorage
   =========================================== */

function guardarCarrito() {
    sessionStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

/* ============================================
   SESIÓN 11 - Función para agregar productos
   =========================================== */

function agregarAlCarrito(nombre, precio) {
    // Buscar si el producto ya está en el carrito
    let productoExistente = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre === nombre) {
            productoExistente = carrito[i];
            break;
        }
    }

    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregarlo nuevo
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Guardar en sessionStorage
    guardarCarrito();

    // Actualizar el contador visual
    actualizarContadorCarrito();

    // Mostrar mensaje de confirmación
    alert(nombre + " añadido al carrito.");
}

/* ============================================
   SESIÓN 13 - Actualizar contador en el DOM
   =========================================== */

function actualizarContadorCarrito() {
    let totalItems = 0;

    for (let i = 0; i < carrito.length; i++) {
        totalItems = totalItems + carrito[i].cantidad;
    }

    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = totalItems;
    }
}

/* ============================================
   SESIÓN 12 - Calcular total del carrito
   =========================================== */

function calcularTotalCarrito() {
    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        total = total + (carrito[i].precio * carrito[i].cantidad);
    }

    return total.toFixed(2);
}

/* ============================================
   SESIÓN 13 - Renderizar carrito en form_pedido.html
   =========================================== */

function renderizarCarrito() {
    const contenedor = document.getElementById("resumen-carrito");

    if (!contenedor) {
        return;
    }

    // Recargar desde sessionStorage por si hubo cambios en otra pestaña (opcional)
    cargarCarrito();

    if (carrito.length === 0) {
        contenedor.classList.remove("visible");
        contenedor.innerHTML = `
            <p class="carrito-vacio">
                🛒 Tu carrito está vacío. 
                <a href="menu.html">Explora nuestro menú</a> para agregar productos.
            </p>
        `;
        return;
    }

    contenedor.classList.add("visible");

    let html = `
        <h3>🧾 Resumen de tu pedido</h3>
        <ul class="lista-carrito">
    `;

    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        html += `
            <li class="item-carrito">
                <span class="item-nombre">${item.nombre}</span>
                <span class="item-cantidad">x${item.cantidad}</span>
                <span class="item-precio">S/ ${subtotal}</span>
            </li>
        `;
    }

    const total = calcularTotalCarrito();
    html += `
        </ul>
        <div class="total-carrito">
            <strong>Total a pagar:</strong> S/ ${total}
        </div>
        <p class="carrito-nota">
            ⚡ Completa el formulario para confirmar tu pedido.
        </p>
    `;

    contenedor.innerHTML = html;
}

/* ============================================
   SESIÓN 11 - Vaciar carrito (después de pedido)
   =========================================== */

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();

    const contenedor = document.getElementById("resumen-carrito");
    if (contenedor) {
        renderizarCarrito();
    }
}

/* ============================================
   SESIÓN 13 - Inicializar contador al cargar la página
   =========================================== */

document.addEventListener("DOMContentLoaded", function() {
    // Cargar carrito desde sessionStorage
    cargarCarrito();
    actualizarContadorCarrito();

    // Si estamos en form_pedido.html, renderizar el carrito
    const resumen = document.getElementById("resumen-carrito");
    if (resumen) {
        renderizarCarrito();
    }
});