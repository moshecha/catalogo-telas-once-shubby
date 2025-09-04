require('dotenv').config(); // Carga variables del .env
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const randToken = require('rand-token');
const { Sequelize, DataTypes } = require('sequelize');

// --- CONFIGURACIÓN BÁSICA ---
const app = express();
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

// hooooo
// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- STATIC FILES ---
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// --- DATABASE (PostgreSQL + Sequelize) ---
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST || 'localhost',
//   dialect: 'postgres',
//   logging: false
// });

// // --- MODELOS EJEMPLO ---
// const Producto = sequelize.define('Producto', {
//   nombre: { type: DataTypes.STRING, allowNull: false },
//   precio: { type: DataTypes.FLOAT, allowNull: false },
//   imagenes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false }
// });

// --- SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
});

// --- MULTER (Subida de imágenes) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- RUTAS EJEMPLO ---



// Obtener productos

const { sendSuccess, sendError } = require('./utils/response');

app.get('/productos', async (req, res) => {
  try {
    // const productos = await Producto.findAll();
    sendSuccess(res, [], 'Productos obtenidos correctamente', 200, { count: 0 });
  } catch (err) {
    sendError(res, 'Error al obtener productos', 500, err.message);
  }
});


// Crear producto con imágenes
app.post('/productos', upload.array('imagenes', 5), async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const imagenes = req.files.map(file => `/public/uploads/${file.filename}`);
    // const producto = await Producto.create({ nombre, precio, imagenes });
    res.json(producto||'');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INICIAR SERVIDOR ---
// sequelize.sync().then(() => {
//   server.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
//   });
// }).catch(err => {
//   console.error('Error al conectar con la DB:', err);
// });

// Rutas
const rutasMain = require('./src/routes/mainRoutes');
app.use('/', rutasMain);


  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });