const fs = require('fs');
const path = require('path');

module.exports = {
  index: async (req, res) => {
    res.render('images/images', {});
  },

  getAllImages: async (req, res) => {
    const uploadDir = path.resolve(__dirname, '../../public/uploads');

    let files = [];
    if (fs.existsSync(uploadDir)) {
      files = fs.readdirSync(uploadDir).map(file => `/public/uploads/${file}`);
    }

    res.json({
      success: true,
      message: 'Imágenes enviadas!',
      data: files,
      meta: {
        count: files.length,
        timestamp: new Date().toISOString()
      }
    });
  },

  upload: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se subió ninguna imagen'
      });
    }

    res.json({
      success: true,
      message: 'Imagen subida!',
      data: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
        
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  }
};
