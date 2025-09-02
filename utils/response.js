// utils/response.js

/**
 * Enviar respuesta exitosa
 * @param {Response} res - objeto de respuesta de Express
 * @param {any} data - datos principales
 * @param {string} message - mensaje opcional
 * @param {number} statusCode - código HTTP (default 200)
 * @param {object} meta - información adicional opcional
 */
function sendSuccess(res, data = null, message = 'Operación exitosa', statusCode = 200, meta = {}) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: { timestamp: new Date().toISOString(), ...meta }
  });
}

/**
 * Enviar respuesta de error
 * @param {Response} res - objeto de respuesta de Express
 * @param {string} message - mensaje de error
 * @param {number} statusCode - código HTTP (default 500)
 * @param {object} error - objeto con detalle del error
 */
function sendError(res, message = 'Ocurrió un error', statusCode = 500, error = null) {
  res.status(statusCode).json({
    success: false,
    message,
    error,
    meta: { timestamp: new Date().toISOString() }
  });
}

module.exports = { sendSuccess, sendError };
