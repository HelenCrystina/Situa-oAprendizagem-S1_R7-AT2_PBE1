const { pool } = require('../config/db');

const clienteModel = {

    selectClientes: async () => {
        const sql = 'SELECT c.id_cliente, c.nome_cliente, c.email, c.cpf, t.telefone_cliente, e.cep, e.estado, e.localidade, e.logradouro, e.bairro, e.numero, e.complemento FROM clientes c JOIN telefones t ON c.id_cliente = t.id_cliente JOIN enderecos e ON c.id_cliente = e.id_cliente;';
        const [rows] = await pool.query(sql);
        return rows;
    },
    selectByIdClientes: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    selectByIdTelefones: async (pId) => {
        const sql = 'SELECT * FROM telefones WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    selectByIdEnderecos: async (pId) => {
        const sql = 'SELECT * FROM enderecos WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    selectByCpf: async (pCpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf=?;';
        const values = [pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;

    },
    selectByEmail: async (pEmail) => {
        const sql = 'SELECT * FROM clientes WHERE email=?;';
        const values = [pEmail]
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    selectByTelefone: async (pTelefone) => {
        const sql = 'SELECT * FROM telefones WHERE telefone_cliente=?;';
        const values = [pTelefone]
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    insertCliente: async (pNome, pEmail, pCpf) => {
        const sql = 'INSERT INTO clientes (nome_cliente, email, cpf ) VALUES (?, ?, ?);';
        const values = [pNome, pEmail, pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    insertTelefone: async (pTelefone, pIdCliente) => {
        const sql = 'INSERT INTO telefones (telefone_cliente, id_cliente) VALUES (?, ?);';
        const values = [pTelefone, pIdCliente];
        const [rows] = await pool.query(sql, values );
        return rows;
    },
    insertEndereco: async (pCep, pEstado, pLocalidade, pLogradouro, pBairro, pNumero, pComplemento, pIdCliente) => {
        const sql = `
            INSERT INTO enderecos 
            (cep, estado, localidade, logradouro, bairro, numero, complemento, id_cliente)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [pCep, pEstado, pLocalidade, pLogradouro, pBairro, pNumero, pComplemento, pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    updateClientes: async (pNome, pCpf, pEmail, pId) => {
        const sql = 'UPDATE clientes SET nome_cliente = ?, cpf = ?, email = ? WHERE id_cliente = ?;';
        const values = [pNome, pCpf, pEmail, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    updateTelefones: async (pId, pTelefone) => {
        const sql = 'UPDATE telefones SET telefone_cliente = ? WHERE id_cliente = ?;';
        const values = [pTelefone, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    updateEnderecos: async (pId, pNumero, pComplemento, pCep) => {
        const sql = 'UPDATE enderecos SET numero = ?, complemento = ?, cep = ? WHERE id_cliente = ?;';
        const values = [pNumero, pComplemento, pCep, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    deleteCliente: async (pIdCliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },    
    deleteTelefones: async (pIdCliente) => {
        const sql = 'DELETE FROM telefones WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    deleteEnderecos: async (pIdCliente) => {
        const sql = 'DELETE FROM enderecos WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    deletePedidos: async (pIdCliente) => {
        const sql = 'DELETE FROM pedidos WHERE id_cliente = ?;';
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    
    
}

module.exports = { clienteModel };