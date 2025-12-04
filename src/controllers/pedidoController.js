const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    incluiRegistroPedido: async (req, res) => {
        try {
            const { data_pedido, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, fk_id_entrega, fk_id_clientes} = req.body;

            const resultado = await pedidoModel.insertPedido();
            
            return res.status(201).json({ message: 'Registro incluído com sucesso', data: dados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
}

module.exports = { pedidoController }
