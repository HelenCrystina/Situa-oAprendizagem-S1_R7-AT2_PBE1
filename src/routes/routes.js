const express = require('express');
const router = express.Router();
const { clientesRoutes } = require('./clienteRoutes');

router.use('/', clientesRoutes);


module.exports = { router };