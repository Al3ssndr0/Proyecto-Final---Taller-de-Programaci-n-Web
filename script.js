/* ============================================
   SESIÓN 12 - Variables y selección del DOM
   =========================================== */

const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");

/* ============================================
   SESIÓN 12 / SESIÓN 13 - Validación de Login
   =========================================== */

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        // SESIÓN 12 - Estructura de control (if)
        if (usuario === "" || clave === "") {
            alert("Complete todos los campos.");
            return;
        }

        alert("¡Bienvenido a SaveFood!");
        window.location.href = "index.html";
    });
}

/* ============================================
   SESIÓN 12 / SESIÓN 13 - Validación de Registro
   =========================================== */

if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const usuario = document.getElementById("usuarioRegistro").value.trim();
        const clave = document.getElementById("claveRegistro").value.trim();
        const confirmar = document.getElementById("confirmarClave").value.trim();

        // SESIÓN 12 - Validación de campos vacíos
        if (
            nombre === "" ||
            apellido === "" ||
            correo === "" ||
            usuario === "" ||
            clave === "" ||
            confirmar === ""
        ) {
            alert("Complete todos los campos.");
            return;
        }

        // SESIÓN 12 - Validación de correo (includes)
        if (!correo.includes("@") || !correo.includes(".")) {
            alert("Ingrese un correo válido.");
            return;
        }

        // SESIÓN 12 - Longitud mínima de contraseña
        if (clave.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // SESIÓN 12 - Comparación de contraseñas
        if (clave !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        alert("Usuario registrado correctamente.");
        window.location.href = "login.html";
    });
}