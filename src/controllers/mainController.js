
const { sendSuccess, sendError } = require('../../utils/response');


module.exports = {
        index: async(req, res) => {
            // Home
            res.json({ 
                success: true,
                message: 'API Catalogo Telas Once Shubby funcionando!' ,
                data: {},
                meta: {
                  count: 0,
                  timestamp: new Date().toISOString()
                }
            });
        },

}