const express = require('express');
const pedidosRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidosRoutes.post('/pedidos', pedidoController.criarPedido);
module.exports = { pedidosRoutes };