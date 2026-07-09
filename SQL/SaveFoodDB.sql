-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS savefood_db;
USE savefood_db;

-- ========================================================
-- 2. CREATE TABLES (Estructura corregida para MySQL)
-- ========================================================

CREATE TABLE USUARIO (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(40) NOT NULL,
    Apellido VARCHAR(40) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Username VARCHAR(30) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE RESTAURANTE (
    ID_Restaurante INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Restaurante VARCHAR(100) NOT NULL
);

CREATE TABLE PRODUCTO (
    ID_Producto INT AUTO_INCREMENT PRIMARY KEY,
    ID_Restaurante INT,
    Nombre_Producto VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio_Original DECIMAL(10,2) NOT NULL,
    Precio_Descuento DECIMAL(10,2) NOT NULL,
    Ruta_Imagen VARCHAR(255) NOT NULL,
    Indicador_Urgencia VARCHAR(50),
    Tipo VARCHAR(30) NOT NULL,
    FOREIGN KEY (ID_Restaurante) REFERENCES RESTAURANTE(ID_Restaurante) ON DELETE CASCADE
);

CREATE TABLE PEDIDO (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_Usuario INT,
    Nombre_Cliente_Form VARCHAR(100) NOT NULL,
    Correo_Form VARCHAR(100) NOT NULL,
    Telefono_Form VARCHAR(15) NOT NULL,
    Direccion_Entrega VARCHAR(150) NOT NULL,
    Cantidad_Personas INT NOT NULL DEFAULT 1,
    Notas_Especiales TEXT,
    Total_Pagar DECIMAL(10,2) NOT NULL,
    Estado VARCHAR(20) DEFAULT 'Preparando',
    Fecha_Pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (ID_Usuario) REFERENCES USUARIO(ID_Usuario) ON DELETE SET NULL
);

CREATE TABLE DETALLE_PEDIDO (
    ID_Detalle INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT,
    ID_Producto INT,
    Cantidad INT NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ID_Pedido) REFERENCES PEDIDO(ID_Pedido) ON DELETE CASCADE,
    FOREIGN KEY (ID_Producto) REFERENCES PRODUCTO(ID_Producto) ON DELETE CASCADE
);

-- ========================================================
-- 3. INSERCIONES DE PRUEBA
-- ========================================================

-- Inserción de Restaurantes Categorizados
INSERT INTO RESTAURANTE (Nombre_Restaurante) VALUES 
('Pollería El Carbón'),       
('Sazón Criolla'),            
('Pastelería Dulce Pecado'),  
('Taquería Los Cuates'),      
('Burger Factory'),           
('Sakura Sushi Bar'),         
('Trattoria Bella Italia'),   
('El Puerto Marino'),         
('Verde & Fresco');

-- Inserción de Productos
INSERT INTO PRODUCTO (ID_Restaurante, Nombre_Producto, Descripcion, Precio_Original, Precio_Descuento, Ruta_Imagen, Indicador_Urgencia, Tipo) VALUES 
(4, 'Tacos al Pastor', 'Deliciosos tacos mexicanos con carne marinada, cebolla y cilantro fresco.', 18.00, 14.90, 'resources/tacos.png', NULL, 'mixto'),
(5, 'Burger Clásica', 'Hamburguesa artesanal con queso cheddar, vegetales frescos y papas fritas.', 15.50, 11.99, 'resources/burger.png', NULL, 'mixto'),
(6, 'Muestra de Sushi', 'Sushi premium con salmón, aguacate y salsa especial.', 22.00, 18.00, 'resources/sushi.png', NULL, 'mixto'),
(7, 'Pasta Alfredo', 'Fettuccine en cremosa salsa de parmesano y mantequilla.', 24.00, 18.50, 'resources/pasta.png', NULL, 'mixto'),
(7, 'Pizza Margarita', 'Masa artesanal con salsa de tomate, mozzarella y albahaca.', 28.00, 22.00, 'resources/pizza.png', NULL, 'mixto'),
(9, 'Ensalada César', 'Lechuga romana, pollo a la plancha, crutones y aderezo César.', 16.00, 11.90, 'resources/ensalada.png', NULL, 'mixto'),
(8, 'Ceviche Mixto', 'Fresco pescado y mariscos marinados en jugo de limón, con cebolla, ají y cilantro.', 32.00, 24.00, 'resources/ceviche.png', NULL, 'mixto'),
(2, 'Arroz con Pollo', 'Tiernos trozos de pollo con arroz verde, acompañado de ensalada y ají.', 22.00, 16.50, 'resources/arroz_pollo.png', NULL, 'mixto'),
(2, 'Lomo Saltado', 'Salteado de carne de res con cebolla, tomate y papas fritas, servido con arroz.', 26.00, 19.90, 'resources/lomo_saltado.png', NULL, 'mixto'),
(2, 'Ají de Gallina', 'Cremoso guiso de gallina deshilachada con ají amarillo y nueces, acompañado de arroz.', 20.00, 15.00, 'resources/aji_gallina.png', NULL, 'mixto'),
(2, 'Causa Rellena', 'Capas de papa amarilla rellenas con pollo o atún, con palta y huevo.', 18.00, 13.50, 'resources/causa.png', NULL, 'mixto'),
(1, 'Pollo a la Brasa', 'Jugoso pollo asado al estilo brasa, con papas fritas y ensalada fresca.', 60.00, 50.00, 'resources/pollo_brasa.png', NULL, 'mixto'),
(1, 'Pack Familiar: Pollo a la Brasa', 'Oferta flash de pollo a la brasa.', 65.00, 30.00, 'resources/pollo_brasa.png', '⏳ ¡Últimas 2 unidades!', 'mixto'),
(2, 'Menú Ejecutivo: Lomo Saltado', 'Oferta flash de lomo saltado.', 18.00, 8.00, 'resources/lomo_saltado.png', '🔥 ¡Vence en 45 minutos!', 'mixto'),
(3, 'Caja Sorpresa de Postres', 'Caja sorpresa dulce.', 25.00, 10.00, 'resources/logo_full.svg', '⏳ ¡Última unidad!', 'postre');