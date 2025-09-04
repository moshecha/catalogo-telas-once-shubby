const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const imagesController = require('../controllers/imagesController');

// Configuración de Multer (subidas en /public/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });



router.get('/', imagesController.index);
router.get('/api/getAllImages', imagesController.getAllImages);
router.post('/api/upload', upload.single('image'), imagesController.upload);

module.exports = router; 

