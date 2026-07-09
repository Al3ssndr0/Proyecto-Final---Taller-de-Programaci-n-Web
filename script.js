/* ============================================
   SESIÓN 12 - Variables y selección del DOM
   =========================================== */

const loginForm = document.getElementById("loginForm");
const registroForm = document.getElementById("registroForm");

const API_URL = "http://localhost:3000";

/* ============================================
   SESIÓN 12 / 13 - Login con fetch a Node.js
   =========================================== */

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const clave = document.getElementById("clave").value.trim();

        if (usuario === "" || clave === "") {
            alert("Complete todos los campos.");
            return;
        }

        try {
            const response = await fetch(API_URL + "/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, clave })
            });
            const data = await response.json();

            if (data.success) {
                // Guardar en sessionStorage para saber quién está logueado
                sessionStorage.setItem("savefood_usuario_activo", data.usuario.nombre);
                sessionStorage.setItem("savefood_id_usuario", data.usuario.id);
                alert("¡Bienvenido " + data.usuario.nombre + "!");
                window.location.href = "index.html";
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            alert("Error al conectar con el servidor. Asegúrate de que Node.js está corriendo.");
            console.error(error);
        }
    });
}

/* ============================================
   SESIÓN 12 / 13 - Registro con fetch a Node.js
   =========================================== */

if (registroForm) {
    registroForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const usuario = document.getElementById("usuarioRegistro").value.trim();
        const clave = document.getElementById("claveRegistro").value.trim();
        const confirmar = document.getElementById("confirmarClave").value.trim();

        // Validaciones locales
        if (nombre === "" || apellido === "" || correo === "" || usuario === "" || clave === "" || confirmar === "") {
            alert("Complete todos los campos.");
            return;
        }

        if (!correo.includes("@") || !correo.includes(".")) {
            alert("Ingrese un correo válido.");
            return;
        }

        if (clave.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (clave !== confirmar) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(API_URL + "/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, correo, usuario, clave })
            });
            const data = await response.json();

            if (data.success) {
                alert(data.mensaje);
                window.location.href = "login.html";
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            console.error(error);
        }
    });
}