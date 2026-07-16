/* ============================================
   SESIÓN 12 - Variables y selección del DOM
   =========================================== */

const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");
const API_URL = "http://localhost:3000";

function actualizarEstadoSesion() {
    const contenedor = document.querySelector(".accesos-usuario");
    if (!contenedor) return;

    const nombre = sessionStorage.getItem("savefood_usuario_activo");
    const loginLink = contenedor.querySelector(".btn-login");
    const registroLink = contenedor.querySelector(".btn-registro");
    const bloqueUsuario = contenedor.querySelector(".usuario-sesion");

    if (!nombre) {
        if (bloqueUsuario) {
            bloqueUsuario.remove();
        }
        if (loginLink) loginLink.style.display = "";
        if (registroLink) registroLink.style.display = "";
        return;
    }

    if (bloqueUsuario) return;

    if (loginLink) loginLink.style.display = "none";
    if (registroLink) registroLink.style.display = "none";

    const bloque = document.createElement("div");
    bloque.className = "usuario-sesion";
    bloque.innerHTML = `<span class="usuario-nombre">Hola, ${nombre}</span><button type="button" class="btn-cerrar-sesion">Cerrar sesión</button>`;

    const botonCerrar = bloque.querySelector(".btn-cerrar-sesion");
    botonCerrar.addEventListener("click", () => {
        sessionStorage.removeItem("savefood_usuario_activo");
        sessionStorage.removeItem("savefood_id_usuario");
        window.location.href = "index.html";
    });

    contenedor.appendChild(bloque);
}

function mostrarMensajeFormulario(id, mensaje, tipo) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = mensaje || "";
    elemento.className = "mensaje-form";

    if (tipo === "error") {
        elemento.classList.add("mensaje-error");
    } else if (tipo === "ok") {
        elemento.classList.add("mensaje-ok");
    }
}

function setFieldState(input, isValid, message) {
    const errorElement = document.getElementById(`error-${input.id}`);
    const shouldShow = input.dataset.tocado === "true" || input.value.trim() !== "";

    if (errorElement) {
        errorElement.textContent = shouldShow && message ? message : "";
    }

    input.classList.toggle("input-error", !isValid && shouldShow && Boolean(message));
    input.classList.toggle("input-ok", isValid && input.value.trim() !== "");
}

function marcarCampoTocado(input) {
    input.dataset.tocado = "true";
}

// === VALIDACIONES DINÁMICAS (UX MEJORADO) ===

function validarNombre(valor) {
    if (!valor) return "El nombre es obligatorio.";
    if (valor.length < 2) return "Debe tener al menos 2 caracteres.";
    
    // Busca todo lo que NO sea letras o espacios
    const invalidos = valor.match(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g);
    if (invalidos) {
        // Extrae los caracteres únicos sin repetir
        const unicos = [...new Set(invalidos)].join(" ");
        return `Caracteres no válidos detectados: ${unicos}. Usa solo letras.`;
    }
    return "";
}

function validarApellido(valor) {
    if (!valor) return "El apellido es obligatorio.";
    
    const invalidos = valor.match(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g);
    if (invalidos) {
        const unicos = [...new Set(invalidos)].join(" ");
        return `Caracteres no válidos detectados: ${unicos}. Usa solo letras.`;
    }
    return "";
}

function validarCorreo(valor) {
    if (!valor) return "El correo es obligatorio.";
    
    // 1. Primero atrapamos si escribió un símbolo rarísimo (ej. $, &, espacios)
    const invalidos = valor.match(/[^a-zA-Z0-9._%+\-@]/g);
    if (invalidos) {
        const unicos = [...new Set(invalidos)].join(" ");
        if (unicos.includes(" ")) return "El correo no puede tener espacios en blanco.";
        return `Los correos no permiten estos caracteres: ${unicos}`;
    }
    
    // 2. Luego validamos que tenga el formato correcto con el @ y el .com
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor)) {
        return "Formato incorrecto. Ejemplo válido: usuario@dominio.com";
    }
    return "";
}

function validarUsuario(valor) {
    if (!valor) return "El usuario es obligatorio.";
    if (valor.length < 4 || valor.length > 20) return "Debe tener entre 4 y 20 caracteres.";
    
    // Busca lo que NO sea letras, números, puntos o guiones bajos
    const invalidos = valor.match(/[^a-zA-Z0-9._]/g);
    if (invalidos) {
        const unicos = [...new Set(invalidos)].join(" ");
        if (unicos.includes(" ")) return "El nombre de usuario no admite espacios.";
        return `El usuario no permite: ${unicos}. Usa letras, números, puntos o guiones bajos.`;
    }
    return "";
}

function validarPassword(valor) {
    if (!valor) return "La contraseña es obligatoria.";
    if (valor.length < 8) return "Debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(valor)) return "Debe incluir al menos una mayúscula.";
    if (!/[a-z]/.test(valor)) return "Debe incluir al menos una minúscula.";
    if (!/\d/.test(valor)) return "Debe incluir al menos un número.";
    
    // Busca caracteres incompatibles (Emojis, símbolos raros, espacios)
    const invalidos = valor.match(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
    if (invalidos) {
        const unicos = [...new Set(invalidos)].join(" ");
        if (unicos.includes(" ")) {
            return "La contraseña no puede contener espacios en blanco.";
        }
        return `Caracteres no válidos detectados: ${unicos}`;
    }
    return "";
}

function validarConfirmarClave(valor, password) {
    if (!valor) return "Confirma tu contraseña.";
    if (valor !== password) return "Las contraseñas no coinciden.";
    return "";
}

function inicializarVistaPassword() {
    // dibujos SVG como texto HTML
    const svgOjoAbierto = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M12 5c-6 0-9 7-9 7s3 7 9 7 9-7 9-7-3-7-9-7Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>`;
    const svgOjoCerrado = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`;

    document.querySelectorAll(".btn-ver-password").forEach((boton) => {
        boton.addEventListener("click", () => {
            const input = document.getElementById(boton.dataset.target);
            if (!input) return;

            const mostrar = input.type === "password";
            input.type = mostrar ? "text" : "password";
            
            boton.innerHTML = mostrar ? svgOjoCerrado : svgOjoAbierto;

            input.focus();
        });
    });
}

function validarCampoLogin() {
    const usuarioInput = document.getElementById("usuario");
    const claveInput = document.getElementById("clave");
    const usuarioValido = !validarUsuario(usuarioInput.value.trim());
    const claveValida = !validarPassword(claveInput.value.trim());

    setFieldState(usuarioInput, usuarioValido, validarUsuario(usuarioInput.value.trim()));
    setFieldState(claveInput, claveValida, validarPassword(claveInput.value.trim()));

    return usuarioValido && claveValida;
}

function validarCampoRegistro() {
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const correoInput = document.getElementById("correo");
    const usuarioInput = document.getElementById("usuarioRegistro");
    const claveInput = document.getElementById("claveRegistro");
    const confirmarInput = document.getElementById("confirmarClave");

    const nombreError = validarNombre(nombreInput.value.trim());
    const apellidoError = validarApellido(apellidoInput.value.trim());
    const correoError = validarCorreo(correoInput.value.trim());
    const usuarioError = validarUsuario(usuarioInput.value.trim());
    const claveError = validarPassword(claveInput.value.trim());
    const confirmarError = validarConfirmarClave(confirmarInput.value.trim(), claveInput.value.trim());

    setFieldState(nombreInput, !nombreError, nombreError);
    setFieldState(apellidoInput, !apellidoError, apellidoError);
    setFieldState(correoInput, !correoError, correoError);
    setFieldState(usuarioInput, !usuarioError, usuarioError);
    setFieldState(claveInput, !claveError, claveError);
    setFieldState(confirmarInput, !confirmarError, confirmarError);

    return !nombreError && !apellidoError && !correoError && !usuarioError && !claveError && !confirmarError;
}

function adjuntarValidacionEnVivo() {
    ["nombre", "apellido", "correo", "usuarioRegistro", "claveRegistro", "confirmarClave", "usuario", "clave"].forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener("input", () => {
            if (input.dataset.tocado === "true") {
                if (id === "usuario" || id === "clave") {
                    validarCampoLogin();
                } else {
                    validarCampoRegistro();
                }
            }
        });

        input.addEventListener("blur", () => {
            marcarCampoTocado(input);
            if (id === "usuario" || id === "clave") {
                validarCampoLogin();
            } else {
                validarCampoRegistro();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", actualizarEstadoSesion);

// === EVENTO: LOGIN ===
if (loginForm) {
    inicializarVistaPassword();
    adjuntarValidacionEnVivo();

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        document.querySelectorAll("#loginForm input").forEach((input) => marcarCampoTocado(input));
        mostrarMensajeFormulario("mensaje-login", "", "");

        if (!validarCampoLogin()) {
            mostrarMensajeFormulario("mensaje-login", "Completa los campos correctamente para continuar.", "error");
            return;
        }

        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        try {
            const response = await fetch(API_URL + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, clave })
            });
            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem("savefood_usuario_activo", data.usuario.nombre);
                sessionStorage.setItem("savefood_id_usuario", data.usuario.id);
                mostrarMensajeFormulario("mensaje-login", `¡Bienvenido ${data.usuario.nombre}!`, "ok");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 700);
            } else {
                mostrarMensajeFormulario("mensaje-login", data.mensaje || "No se pudo iniciar sesión.", "error");
            }
        } catch (error) {
            mostrarMensajeFormulario("mensaje-login", "No se pudo conectar con el servidor. Revisa que Node.js esté corriendo.", "error");
            console.error(error);
        }
    });
}

// === EVENTO: REGISTRO ===
if (registroForm) {
    inicializarVistaPassword();
    adjuntarValidacionEnVivo();

    registroForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        document.querySelectorAll("#registroForm input").forEach((input) => marcarCampoTocado(input));
        mostrarMensajeFormulario("mensaje-registro", "", "");

        if (!validarCampoRegistro()) {
            mostrarMensajeFormulario("mensaje-registro", "Revisa los campos marcados antes de continuar.", "error");
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const usuario = document.getElementById("usuarioRegistro").value.trim();
        const clave = document.getElementById("claveRegistro").value.trim();

        try {
            const response = await fetch(API_URL + "/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, correo, usuario, clave })
            });
            const data = await response.json();

            if (data.success) {
                mostrarMensajeFormulario("mensaje-registro", data.mensaje || "Usuario registrado correctamente.", "ok");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 700);
            } else {
                mostrarMensajeFormulario("mensaje-registro", data.mensaje || "No se pudo completar el registro.", "error");
            }
        } catch (error) {
            mostrarMensajeFormulario("mensaje-registro", "No se pudo conectar con el servidor. Revisa que Node.js esté corriendo.", "error");
            console.error(error);
        }
    });
}