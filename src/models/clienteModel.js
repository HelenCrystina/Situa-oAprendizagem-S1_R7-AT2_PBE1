const { pool } = require('../config/db');

const clienteModel = {

  /** Retorna os clientes cadastrados
   * Rota GET /clientes
   * @async
   * @function selectClientes: realiza uma consulta exibindo todos os valores da tabela clientes juntamente interligando as tabelas telefones e endereços para estar nos apresentando esses valores também
   * @returns 
   */
    selectClientes: async () => {
        const sql = 'SELECT c.id_cliente, c.nome_cliente, c.email, c.cpf, t.telefone_cliente, e.cep, e.estado, e.localidade, e.logradouro, e.bairro, e.numero, e.complemento FROM clientes c JOIN telefones t ON c.id_cliente = t.id_cliente JOIN enderecos e ON c.id_cliente = e.id_cliente;';
        const [rows] = await pool.query(sql);
        return rows;
    },

     /** Retorna os clientes de acordo com o id do cliente desejado
   * Rota GET /pedidos/:idCliente
   * @async
   * @function selectByIdClientes: realiza uma consulta por id_cliente
   * @param {*} pId: identificador do cliente, que é através dele que realiza a busca
   * @returns 
   */
    selectByIdClientes: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

      /**
   * Retorna os telefones cadastrados de acordo com o id do cliente desejado
   * Rota GET /clientes
   * @async
   * @function selectByIdTelefones: realiza uma consulta para exibir o telefone por id
   * @param {*} pId: identifica o cliente
   * @returns 
   */
    selectByIdTelefones: async (pId) => {
        const sql = 'SELECT * FROM telefones WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

     /**
   * Retorna os endereços cadastrados de acordo com o id do cliente desejado
   * Rota GET /clientes
   * @async
   * @function selectByIdEnderecos: realiza uma consulta para exibir o endereço por id
   * @param {*} pId: identifica o cliente
   * @returns 
   */
    selectByIdEnderecos: async (pId) => {
        const sql = 'SELECT * FROM enderecos WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

      /** Retorna o cpf do cliente 
   * Rota GET /clientes
   * @async
   * @function selectByCpf: realiza um consulta para exibir o cpf do cliente para verificar a existência
   * @param {*} pCpf: parametro onde atribui o cpf do cliente
   * @returns 
   */
    selectByCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf=?;';
        const values = [pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;

    },

     /**
   * Retorna o email do cliente 
   * Rota GET /clientes
   * @async
   * @function selectByEmail: realiza uma consulta para exibir o email do cliente para verificar a existência
   * @param {*} pEmail: parametro onde atribui o email do cliente
   * @returns 
   */
    selectByEmail: async (pEmail) => {
        const sql = 'SELECT * FROM clientes WHERE email=?;';
        const values = [pEmail]
        const [rows] = await pool.query(sql, values);
        return rows;
    },

      /**
   * Retorna o telefone do cliente 
   * Rota GET /clientes
   * @async
   * @function selectByIdTelefones: busca o telefone do cliente para verificar a existencia
   * @param {*} pTelefone: atribui um valor numérico por telefone
   * @returns 
   */
    selectByTelefone: async (pTelefone) => {
        const sql = 'SELECT * FROM telefones WHERE telefone_cliente=?;';
        const values = [pTelefone]
        const [rows] = await pool.query(sql, values);
        return rows;
    },

     /**
   * Insere clientes
   * Rota POST /clientes
   * @async
   * @function insertCliente: insere os dados do cliente para os seguintes parametros abaixo
   * @param {*} pNome: identifica o nome do cliente
   * @param {*} pEmail : identifica o email 
   * @param {*} pCpf: identifica o número do cpf
   * @returns 
   */
    insertCliente: async (pNome, pEmail, pCpf) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO clientes (nome_cliente, email, cpf ) VALUES (?, ?, ?);';
            const values = [pNome, pEmail, pCpf];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

     /**
   * Insere os telefones 
   * Rota POST /clientes
   * @async
   * @function insertTelefone: inserir os dados do cliente para o parametro pTelefone
   * @param {*} pTelefone: campo que contém o número de celular
   * @param {*} pIdCliente: o id do cliente que está relacionado aquele número de telefone
   * @returns 
   */
    insertTelefone: async (pTelefone, pIdCliente) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'INSERT INTO telefones (telefone_cliente, id_cliente) VALUES (?, ?);';
            const values = [pTelefone, pIdCliente];
            const [rows] = await pool.query(sql, values);
            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }

    },

     /**
   * Insere os endereços 
   * Rota POST /clientes
   *@async
   * @function insertEndereco: inserir os dados de endereço do cliente para os seguintes parametros abaixo
   * @param {*} pCep: número de identificação de cep
   * @param {*} pEstado: o estado em que mora
   * @param {*} pLocalidade: qual cidade vive
   * @param {*} pLogradouro: contém o nome da rua
   * @param {*} pBairro: nome do bairro
   * @param {*} pNumero: o número da casa
   * @param {*} pComplemento: fornece informações adicionais
   * @param {*} pIdCliente: o id do cliente que está relacionado ao endereço
   * @returns 
   */
   insertEndereco: async (
    pCep,
    pEstado,
    pLocalidade,
    pLogradouro,
    pBairro,
    pNumero,
    pComplemento,
    pIdCliente
  ) => {
    const sql = `
            INSERT INTO enderecos 
            (cep, estado, localidade, logradouro, bairro, numero, complemento, id_cliente)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
    const values = [
      pCep,
      pEstado,
      pLocalidade,
      pLogradouro,
      pBairro,
      pNumero,
      pComplemento,
      pIdCliente,
    ];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

     /**
   * Atualiza as informações dos clientes 
   * Rota PUT /clientes
   * @async
   * @function updateClientes: atualiza os valores dos seguintes parametros abaixo
   * @param {*} pNome: nome do cliente
   * @param {*} pCpf : identifica o número do cpf
   * @param {*} pEmail: identifica o email
   * @param {*} pId: identifica o id do clientes
   * @returns 
   */
    updateClientes: async (pNome, pCpf, pEmail, pId) => {
        const sql = 'UPDATE clientes SET nome_cliente = ?, cpf = ?, email = ? WHERE id_cliente = ?;';
        const values = [pNome, pCpf, pEmail, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

     /**Atualiza as informações do telefone do cliente 
   * Rota PUT /clientes
   * @async
   * @function updateTelefones: atualiza o número de telefone através do id
   * @param {*} pId: identifica o cliente
   * @param {*} pTelefone: campo que contém o número de celular
   * @returns 
   */
    updateTelefones: async (pId, pTelefone) => {
        const sql = 'UPDATE telefones SET telefone_cliente = ? WHERE id_cliente = ?;';
        const values = [pTelefone, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

     /**
   * Atualiza as informações de endereço do cliente 
   * Rota PUT /clientes/:idCliente
   * @async
   * @function updateEnderecos: atualiza o endereço pelo id
   * @param {*} pId: identificador do cliente
   * @param {*} pNumero : numero da residência
   * @param {*} pComplemento: fornece informações adicionais
   * @param {*} pCep: número de identificação de cep
   * @returns 
   */
    updateEnderecos: async (pId, pNumero, pComplemento, pCep) => {
        const sql = 'UPDATE enderecos SET numero = ?, complemento = ?, cep = ? WHERE id_cliente = ?;';
        const values = [pNumero, pComplemento, pCep, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

     /**
   * Deleta as informações dos clientes 
   * Rota delete /clientes/:idCliente
   * @async
   * @function deleteCliente: Deleta os valores da tabela cliente
   * @param {*} pIdCliente: identificador do cliente que será excluído
   * @returns 
   */
    deleteCliente: async (pIdCliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /** Deleta as informações do telefone do cliente 
   * @async
   * @function deleteTelefones: Deleta os valores da tabela telefone
   * @param {*} pIdCliente: identificador do cliente que será excluído
   * @returns 
   */
    deleteTelefones: async (pIdCliente) => {
        const sql = 'DELETE FROM telefones WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

      /** Deleta as informações do endereço do cliente
   * @async
   * @function deleteEnderecos: Deleta os valores da tabela enderecos
   * @param {*} pIdCliente: identificador do cliente que será excluído
   * @returns 
   */

    deleteEnderecos: async (pIdCliente) => {
        const sql = 'DELETE FROM enderecos WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /** Deleta as informações do pedido 
   * @async
   * @function deletePedido: Deleta as informações da tabela pedidos
   * @param {*} pIdCliente: identificador do cliente que será excluído
   * @returns 
   */
    deletePedidos: async (pIdCliente) => {
        const sql = 'DELETE FROM pedidos WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /** Deleta as informações dos calculos feitos pela trigger 
   * @async
   * @function deleteCalculo: Deleta os calculos da tabela calculos_entregas 
   * @param {*} pIdPedido: Indentificador que servirá para excluir os dados
   * @returns 
   */
    deleteCalculo: async (pIdPedido) => {
        const sql = `DELETE ce 
                    FROM calculo_entregas ce
                    JOIN pedidos p
                    ON p.id_pedido = ce.id_pedido
                    WHERE p.id_cliente=?;`;
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
    }


}

module.exports = { clienteModel };