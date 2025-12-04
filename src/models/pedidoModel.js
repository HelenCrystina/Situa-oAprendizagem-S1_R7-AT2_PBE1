const { pool } = require('../config/db');

const pedidoModel = {
    insertPedido: async (pDataPedido, pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente) => {
        const sql = 'INSERT INTO pedidos (data_pedido, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, id_cliente ) VALUES (?, ?, ?, ?, ?, ?, ?);';
        const values = [pDataPedido, pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    }

}

module.exports = { pedidoModel }