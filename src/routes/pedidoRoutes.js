const express = require('express');
const pedidosRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidosRoutes.get("/pedidos", pedidoController.selecionaTodosPedidos)
pedidosRoutes.post('/pedidos', pedidoController.criarPedido);
pedidosRoutes.put('/pedidos/:id_pedido', pedidoController.alterarPedido);
pedidosRoutes.delete('/pedidos/:id_pedido', pedidoController.excluirPedido);

module.exports = { pedidosRoutes };