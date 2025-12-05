const { pool } = require("../config/db");

const pedidoModel = {
  insertPedido: async (
    pIdCliente,
    pTipoEntrega,
    pDistancia,
    pPesoCarga,
    pValorBaseKm,
    pValorBaseKg,
    pDataPedido
  ) => {
    const connection = await pool.getConnection();
    // se der certo ele cai no commit e se não ele vai pro rollback -> observação
    try {
      await connection.beginTransaction();
      // insert 1 - tabela pedidos
      const sqlPedido =
        "INSERT INTO pedidos(id_cliente, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, data_pedido) VALUES (?,?,?,?,?,?,?);";
      const valuesPedido = [
        pIdCliente,
        pTipoEntrega,
        pDistancia,
        pPesoCarga,
        pValorBaseKm,
        pValorBaseKg,
        pDataPedido,
      ];
      const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);
      connection.commit();
      return { rowsPedido };
    } catch (error) {
      connection.rollback();
      throw error;
    }
  },
};

module.exports = { pedidoModel };