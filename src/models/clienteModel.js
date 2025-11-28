const { pool } = require('../config/db');

const clienteModel = {

    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },
    insertCliente: async (pNome, pEmail, pCpf) => {
        const sql = 'INSERT INTO clientes (nome_cliente, email, cpf ) VALUES (?, ?, ?);';
        const values = [pNome, pEmail, pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    insertEndereco: async (pIdCliente, pCep, pEstado, pCidade, pLogradouro, pBairro, pNumero, pComplemento) => {
        const sql = 'INSERT INTO enderecos (id_cliente, cep, estado, cidade, logradouro, bairro, numero, complemento ) VALUES (?, ?, ?, ?, ?, ?, ?);';
        const values = [pIdCliente, pCep, pEstado, pCidade, pLogradouro, pBairro, pNumero, pComplemento];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    insertTelefone: async (pIdCliente, pTelefone) => {
        const sql = 'INSERT INTO telefones (id_cliente, telefone) VALUES (?, ?);';
        const values = [pIdCliente, pTelefone];
        const [rows] = await pool.query(sql, values);
        return rows;
    }

}

module.exports = { clienteModel }