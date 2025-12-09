const { pool } = require("../config/db");

const pedidoModel = {
  selectPedidos: async () => {
    const sql =
      "SELECT p.id_pedido, p.data_pedido, p.tipo_entrega, p.distancia, p.peso_carga, p.valor_base_km, p.valor_base_kg, c.id_cliente FROM pedidos p JOIN clientes c ON c.id_cliente = p.id_cliente;";
    const [rows] = await pool.query(sql);
    return rows;
  },
  selectItemByIdPedido: async (pIdPedido) => {
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const values = [pIdPedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
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
  updatePedidos: async (tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km, id_pedido) => {
    const sql = `UPDATE pedidos SET tipo_entrega = ?, distancia = ?, peso_carga = ?, valor_base_kg = ?, valor_base_km = ? WHERE id_pedido = ?`;
    const values = [tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km, id_pedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  
  
  deleteItem: async (pIdPedido) => {
    const sql = "DELETE FROM pedidos WHERE id_pedido = ? ;";
    const values = [pIdPedido];
    const [rows] = await pool.query(sql, values);
    // Tabela pedidos é atualizada com a TRIGGER :trg_atualiza_valor_pedido_after_delete
    return rows;
  },
};

module.exports = { pedidoModel };
