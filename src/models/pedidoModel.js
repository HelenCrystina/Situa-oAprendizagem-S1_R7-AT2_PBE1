const { pool } = require("../config/db");

const pedidoModel = {
  /** Retorna os pedidos cadastrados
   * Rota GET /pedidos
   * @async
   * @function selectPedidos: a consulta nos ajuda a exibir todos os valores das colunas que contém na pedidos
   * @returns
   */
  selectPedidos: async () => {
    const sql =
      `SELECT 
      p.id_pedido, 
      p.data_pedido, 
      p.tipo_entrega, 
      p.distancia, 
      p.peso_carga, 
      p.valor_base_km, 
      p.valor_base_kg, 
      c.id_cliente 
      FROM pedidos p 
      JOIN clientes c 
      ON c.id_cliente = p.id_cliente;`;
    const [rows] = await pool.query(sql);
    return rows;
  },

  /** Retorna os pedidos cadastrados e os calculos feitos 
   * Rota GET /pedidos/calculos
   * @async
   * @function selectPedidosCalculos: a consulta nos ajuda a exibir todos os valores das colunas que 
   * contém na pedidos e os calculos feitos de acordo com as informações de pedido
   * @returns
   */  selectPedidosCalculos: async () => {
    const sql =
      `SELECT 
    p.id_pedido, 
    p.data_pedido,
    p.tipo_entrega, 
    p.distancia,
    ce.valor_distancia, 
    p.peso_carga, 
    ce.valor_peso,
    ce.acrescimo,
    ce.desconto,
    ce.taxa_extra,
    ce.status_entrega,
    ce.valor_final
    FROM pedidos p 
    JOIN calculo_entregas ce
    ON ce.id_pedido = p.id_pedido;`
    const [rows] = await pool.query(sql);
    return rows;
  },

    /** Retorna os pedidos cadastrados
   * Rota GET /pedidos/:idPedido
   * @async
   * @function selectByIdPedido: faz a busca de pedidos pelo id_pedido
   * @param {*} pIdPedido : referencia o identificador do pedido
   * @returns
   */
  selectByIdPedido: async (pIdPedido) => {
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const values = [pIdPedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
    /**
   * Insere os pedidos 
   * Rota POST /pedidos
   * @async
   * @function insertPedido: a função dela é inserir valores na tabela pedidos
   * @param {*} pIdCliente : é um identificador do cliente, na tabela pedidos ela faz o papel de chave estrangeira ou conhecida também como foreign key.
   * @param {*} pTipoEntrega: é um dos parametros que ajuda a identificar se o tipo de entrega é normal ou urgente.
   * @param {*} pDistancia: é um parametro que atribui o valor da distância em km
   * @param {*} pPesoCarga: atribuimos o valor do peso da carga em kg
   * @param {*} pValorBaseKm: atribui um valor base por km
   * @param {*} pValorBaseKg: atribui um valor base por kg
   * @param {*} pDataPedido: identifica em qual data foi feita o pedido
   * @returns
   */
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
    try {
      await connection.beginTransaction();
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
      // Caso dê um problema em alguma informação que for inserida e "retorna" ao estado inicial sem nenhuma mmodificação
    } catch (error) {
      connection.rollback();
      throw error;
    }
  },
  /** Atualiza os pedidos cadastrados
   * Rota PUT /pedidos/:idPedido
   * @async
   * @function updatePedidos: atualiza os valores na tabela pedidos com os parametros abaixo
   * @param {*} tipo_entrega: é um dos parametros que ajuda a identificar se o tipo de entrega é normal ou urgente. EX: o pedido tem o tipo de entrega normal e preciso que seja urgente
   * @param {*} distancia: é um parametro que atribui o valor da distância em km. EX: a distância era 45km mais na verdade era 90km
   * @param {*} peso_carga: atribuimos o valor do peso da carga em kg. Ex: o peso da carga era 20kg mais na verdade era 10kg
   * @param {*} valor_base_kg: atribui um valor base por km, caso o valor mude
   * @param {*} valor_base_km: atribui um valor base por kg, caso o valor mude
   * @param {*} id_pedido : identifica o id do pedido
   * @returns
   */
  updatePedidos: async (tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km, id_pedido) => {
    const sql =
      `UPDATE pedidos 
    SET tipo_entrega = ?, 
    distancia = ?, 
    peso_carga = ?, 
    valor_base_kg = ?, 
    valor_base_km = ? 
    WHERE id_pedido = ?`;
    const values = [tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km, id_pedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

    /**
   * Exclui o pedido cadastrados
   * Rota DELETE /pedidos/:idPedido
   * @async
   * @function deletePedido: deleta o pedido pelo id do pedido depois do calculo entrega
   * @param {*} pIdPedido : identifica o id do pedido
   * @returns
   */
  deletePedido: async (pIdPedido) => {
    const sql = "DELETE FROM pedidos WHERE id_pedido = ? ;";
    const values = [pIdPedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
    /**
   * Exclui os calculos realizados
   * Rota DELETE /calculo_entregas/:id_pedido
   * @async
   * @function deleteCalculo: faz uma busca pelo id do pedido e apaga o calculo da tabela calculo entrega antes de apagar o pedido da tabela pedidos
   * @param {*} pIdPedido: identifica o id do pedido 
   * @returns 
   */
  deleteCalculo: async (pIdPedido) => {
    const sql = "DELETE FROM calculo_entregas WHERE id_pedido = ? ;";
    const values = [pIdPedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  }
};

module.exports = { pedidoModel };
