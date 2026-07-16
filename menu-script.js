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

function agregarAlCarrito(id_producto, nombre, precio, stock_disponible) {
    let encontrado = carrito.find(item => item.id_producto == id_producto);

    if (encontrado) {
        if (encontrado.cantidad < stock_disponible) {
            encontrado.cantidad++;
            alert("Añadiste otra unidad de " + nombre);
        } else {
            alert("⚠️ Lo sentimos, solo hay " + stock_disponible + " unidades disponibles en stock.");
            return;
        }
    } else {
        if (stock_disponible > 0) {
            carrito.push({
                id_producto: id_producto,
                nombre: nombre,
                precio: Number(precio),
                cantidad: 1,
                stock: stock_disponible // Guardamos el límite de stock en memoria
            });
            alert(nombre + " agregado al carrito.");
        } else {
            alert("Producto agotado.");
            return;
        }
    }

    guardarCarrito();
    actualizarContadorCarrito();
    
    // Actualizar visualmente si los menús están abiertos
    if (document.getElementById("dropdown-carrito") && document.getElementById("dropdown-carrito").classList.contains("mostrar")) {
        renderizarDropdown();
    }
    if (document.getElementById("resumen-carrito")) {
        renderizarCarrito();
    }
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
            <img src="${producto.Ruta_Imagen}" alt="${producto.Nombre_Producto}">
            <div class="contenido">
                <h2>${producto.Nombre_Producto}</h2>
                <p class="descripcion">${producto.Descripcion}</p>
                <p class="precio-original">S/ ${parseFloat(producto.Precio_Original).toFixed(2)}</p>
                <p class="precio-descuento">S/ ${parseFloat(producto.Precio_Descuento).toFixed(2)}</p>
                
                <p style="color: #e65c00; font-weight: bold; font-size: 14px; margin-bottom: 10px;">
                    📦 Stock disponible: ${producto.Stock}
                </p>

                <button
                    class="btn-animado"
                    onclick="agregarAlCarrito(
                        ${producto.ID_Producto},
                        '${producto.Nombre_Producto.replace(/'/g, "\\'")}',
                        ${producto.Precio_Descuento},
                        ${producto.Stock}
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
                <span style="font-size: 12px; color: #777;">(Stock: ${producto.Stock})</span><br>
                <button
                    class="btn-animado btn-tabla"
                    onclick="agregarAlCarrito(
                        ${producto.ID_Producto},
                        '${producto.Nombre_Producto.replace(/'/g, "\\'")}',
                        ${producto.Precio_Descuento},
                        ${producto.Stock}
                    )">
                    Añadir
                </button>
            </td>
        </tr>
        `;
    });
}

// Renderizar Carrito
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
            <li style="margin-bottom: 10px;">
                <strong>${item.nombre}</strong> <br>
                Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)} <br>
                
                <div class="control-cantidad">
                    <button type="button" onclick="disminuirCantidad(${item.id_producto})">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" onclick="aumentarCantidad(${item.id_producto})">+</button>
                </div>
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
        html += `
            <li style="margin-bottom: 10px;">
                <strong>${item.nombre}</strong> <br>
                Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)} <br>
                
                <div class="control-cantidad">
                    <button type="button" onclick="disminuirCantidad(${item.id_producto})">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" onclick="aumentarCantidad(${item.id_producto})">+</button>
                </div>
            </li>
        `;
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
        
        // Usamos la nueva función especializada en ofertas
        crearCardsOfertas(productos);
    } catch (error) {
        console.error("Error al cargar ofertas:", error);
    }
}

function crearCardsOfertas(productos) {
    const contenedor = document.getElementById("contenedor-ofertas");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; color: #666;'>No hay ofertas flash en este momento.</p>";
        return;
    }

    productos.forEach(producto => {
        const textoUrgencia = producto.Indicador_Urgencia;
        let claseUrgencia = "indicador-urgencia";
        if (textoUrgencia && (textoUrgencia.includes("🔥") || textoUrgencia.toLowerCase().includes("minuto"))) {
            claseUrgencia += " urgencia-alta";
        }

        contenedor.innerHTML += `
            <article class="tarjeta-oferta">
                <div class="${claseUrgencia}">${textoUrgencia}</div>
                <div class="oferta-contenido">
                    <h3 class="producto-nombre">${producto.Nombre_Producto}</h3>
                    <p class="producto-restaurante">${producto.Nombre_Restaurante}</p>
                    <div class="producto-precios">
                        <span class="precio-original">S/ ${parseFloat(producto.Precio_Original).toFixed(2)}</span>
                        <span class="precio-descuento">S/ ${parseFloat(producto.Precio_Descuento).toFixed(2)}</span>
                    </div>
                    
                    <p style="color: #e65c00; font-weight: bold; font-size: 14px; margin-top: 5px; margin-bottom: 10px;">
                        📦 Stock: ${producto.Stock}
                    </p>

                    <button class="btn-primario btn-ancho-completo"
                            onclick="agregarAlCarrito(
                                ${producto.ID_Producto},
                                '${producto.Nombre_Producto.replace(/'/g, "\\'")}',
                                ${producto.Precio_Descuento},
                                ${producto.Stock}
                            )">
                        Añadir al Pedido
                    </button>
                </div>
            </article>
        `;
    });
}

// Gestión de la cantidad de productos a pedir
function aumentarCantidad(id) {
    let item = carrito.find(p => p.id_producto == id);
    if (item) {
        if (item.cantidad < item.stock) {
            item.cantidad++;
            actualizarVistasCarrito();
        } else {
            alert("⚠️ Límite de stock alcanzado.");
        }
    }
}

function disminuirCantidad(id) {
    let item = carrito.find(p => p.id_producto == id);
    if (item) {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            // Si la cantidad llega a 0, lo eliminamos del carrito
            carrito = carrito.filter(p => p.id_producto != id);
        }
        actualizarVistasCarrito();
    }
}

// Función auxiliar para no repetir código
function actualizarVistasCarrito() {
    guardarCarrito();
    actualizarContadorCarrito();
    if (document.getElementById("dropdown-carrito") && document.getElementById("dropdown-carrito").classList.contains("mostrar")) renderizarDropdown();
    if (document.getElementById("resumen-carrito")) renderizarCarrito();
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