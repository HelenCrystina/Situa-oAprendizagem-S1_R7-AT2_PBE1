const express = require('express');
const clientesRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');


clientesRoutes.get('/clientes', clienteController.selecionaTodos);
clientesRoutes.post('/clientes', clienteController.incluiRegistroCliente);
clientesRoutes.put('/clientes/:id_cliente', clienteController.alterarCliente);
clientesRoutes.delete('/clientes/:id_cliente', clienteController.deletaCliente);


module.exports = { clientesRoutes };