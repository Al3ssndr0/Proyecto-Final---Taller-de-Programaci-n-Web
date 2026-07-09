// ============================================
// SERVER.JS - SAVEFOOD BACKEND
// Node.js + Express + MySQL
// ============================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;


// MIDDLEWARES
app.use(cors());
app.use(express.json());


// ============================================
// CONEXIÓN MYSQL
// ============================================

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '14082003',
    database: 'savefood_db',
    port: 3306
});


db.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err.message);
        return;
    }

    console.log('✅ Conectado a MySQL (savefood_db)');
});


// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req, res) => {
    res.send('🚀 Backend SaveFood funcionando correctamente');
});


// ============================================
// TEST MYSQL
// ============================================

app.get('/test-db', (req, res) => {

    db.query(
        'SELECT 1 + 1 AS resultado',
        (err, result) => {

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                mensaje: 'Conexión exitosa',
                resultado: result[0].resultado
            });
        }
    );

});


// ============================================
// REGISTRO
// ============================================

app.post('/registrar', (req, res) => {
    const {
        nombre,
        apellido,
        correo,
        usuario,
        clave
    } = req.body;

    if(!nombre || !apellido || !correo || !usuario || !clave){

        return res.json({
            success:false,
            mensaje:'Complete todos los campos'
        });

    }

    const verificar = `
        SELECT ID_Usuario 
        FROM USUARIO
        WHERE Username = ? OR Correo = ?
    `;

    db.query(
        verificar,
        [usuario, correo],
        (err, result)=>{
            if(err){
                return res.json({
                    success:false,
                    mensaje:err.message
                });
            }
            if(result.length > 0){
                return res.json({
                    success:false,
                    mensaje:'Usuario o correo ya registrado'
                });
            }

            const insertar = `
                INSERT INTO USUARIO
                (
                    Nombre,
                    Apellido,
                    Correo,
                    Username,
                    Contrasena
                )
                VALUES(?,?,?,?,?)
            `;

            db.query(
                insertar,
                [
                    nombre,
                    apellido,
                    correo,
                    usuario,
                    clave
                ],
                (err)=>{
                    if(err){
                        return res.json({
                            success:false,
                            mensaje:err.message
                        });
                    }
                    res.json({
                        success:true,
                        mensaje:'Usuario registrado correctamente'
                    });
                }
            );
        }
    );
});



// ============================================
// LOGIN
// ============================================

app.post('/login',(req,res)=>{
    const {
        usuario,
        clave
    } = req.body;

    const sql = `
        SELECT *
        FROM USUARIO
        WHERE Username = ?
    `;

    db.query(
        sql,
        [usuario],
        (err,result)=>{
            if(err){
                return res.json({
                    success:false,
                    mensaje:err.message
                });
            }

            if(result.length === 0){
                return res.json({
                    success:false,
                    mensaje:'Usuario no encontrado'
                });
            }

            const user = result[0];

            if(user.Contrasena === clave){
                res.json({
                    success:true,
                    usuario:{
                        id:user.ID_Usuario,
                        nombre:user.Nombre,
                        username:user.Username
                    }
                });
            }else{
                res.json({
                    success:false,
                    mensaje:'Contraseña incorrecta'
                });
            }
        }
    );
});



// ============================================
// PRODUCTOS
// ============================================

app.get('/productos',(req,res)=>{
    const sql = `
        SELECT 
            p.*,
            r.Nombre_Restaurante
        FROM PRODUCTO p
        INNER JOIN RESTAURANTE r
        ON p.ID_Restaurante = r.ID_Restaurante
        WHERE p.Indicador_Urgencia IS NULL
        ORDER BY p.ID_Producto
    `;

    db.query(
        sql,
        (err,result)=>{
            if(err){
                return res.status(500).json({
                    error:err.message
                });
            }
            res.json(result);
        }
    );
});



// ============================================
// OFERTAS
// ============================================

app.get('/ofertas',(req,res)=>{
    const sql = `
        SELECT 
            p.*, r.Nombre_Restaurante
        FROM PRODUCTO p
        INNER JOIN RESTAURANTE r
        ON p.ID_Restaurante = r.ID_Restaurante
        WHERE p.Indicador_Urgencia IS NOT NULL
        ORDER BY p.ID_Producto
    `;

    db.query(
        sql,
        (err,result)=>{
            if(err){
                return res.status(500).json({
                    error:err.message
                });
            }
            res.json(result);
        }
    );
});



// ============================================
// PEDIDOS - POST
// ============================================

app.post('/pedido',(req,res)=>{
    const {
        id_usuario,
        nombre,
        correo,
        telefono,
        direccion,
        cantidad_personas,
        notas,
        total,
        productos
    } = req.body;

    const sqlPedido = `
        INSERT INTO PEDIDO
        (
            ID_Usuario,
            Nombre_Cliente_Form,
            Correo_Form,
            Telefono_Form,
            Direccion_Entrega,
            Cantidad_Personas,
            Notas_Especiales,
            Total_Pagar
        )
        VALUES(?,?,?,?,?,?,?,?)
    `;

    db.query(
        sqlPedido,
        [
            id_usuario,
            nombre,
            correo,
            telefono,
            direccion,
            cantidad_personas,
            notas,
            total
        ],

        (err,result)=>{
            if(err){
                return res.json({
                    success:false,
                    mensaje:err.message
                });
            }

            const idPedido = result.insertId;

            const detalle = `

                INSERT INTO DETALLE_PEDIDO

                (
                    ID_Pedido,
                    ID_Producto,
                    Cantidad,
                    Subtotal
                )

                VALUES ?

            `;

            const valores = productos.map(producto=>[
                idPedido,
                producto.id_producto,
                producto.cantidad,
                producto.subtotal
            ]);

            db.query(
                detalle,
                [valores],
                (err)=>{

                    if(err){
                        return res.json({
                            success:false,
                            mensaje:err.message
                        });
                    }
                    res.json({
                        success:true,
                        mensaje:'Pedido registrado correctamente',
                        idPedido
                    });
                }
            );
        }
    );
});

// ============================================
// PEDIDOS - GET
// ============================================
app.get('/pedidos/:id_usuario', (req, res) => {
    const idUsuario = req.params.id_usuario;
    
    // Consulta para obtener pedidos y concatenar productos
    const sql = `
        SELECT p.ID_Pedido, p.Nombre_Cliente_Form, p.Total_Pagar, p.Estado, 
               GROUP_CONCAT(pr.Nombre_Producto SEPARATOR ', ') as Productos,
               SUM(d.Cantidad) as Cantidad_Total
        FROM PEDIDO p
        JOIN DETALLE_PEDIDO d ON p.ID_Pedido = d.ID_Pedido
        JOIN PRODUCTO pr ON d.ID_Producto = pr.ID_Producto
        WHERE p.ID_Usuario = ?
        GROUP BY p.ID_Pedido
        ORDER BY p.Fecha_Pedido DESC
    `;

    db.query(sql, [idUsuario], (err, result) => {
        if (err) {
            console.error("Error en consulta de pedidos:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(port,()=>{

    console.log(
        `🚀 Servidor corriendo en http://localhost:${port}`
    );

});