const express = require('express');
const clientesRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clientesRoutes.post('/clientes', clienteController.incluiRegistroCliente);
module.exports = { clientesRoutes };