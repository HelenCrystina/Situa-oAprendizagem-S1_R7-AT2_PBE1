const express = require('express');
const router = express.Router();
const { clientesRoutes } = require('./clienteRoutes');
const { pedidosRoutes } = require('./pedidoRoutes');

router.use('/', clientesRoutes);
router.use('/', pedidosRoutes);


module.exports = { router };