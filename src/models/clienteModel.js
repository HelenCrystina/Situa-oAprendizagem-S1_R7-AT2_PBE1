const { pool } = require('../config/db');

const clienteModel = {

    insertCliente: async (pNome, pEmail, pCpf) => {
        const sql = 'INSERT INTO clientes (nome_cliente, email, cpf ) VALUES (?, ?, ?);';
        const values = [pNome, pEmail, pCpf];
        const [rows] = await pool.query(sql, values);
        return rows.insertId;
    },

    selectByCpf: async (pCpf) => {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE cpf=?;', [pCpf]);
        return rows;
    },

    selectByEmail: async (pEmail) => {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE email=?;', [pEmail]);
        return rows;
    },

    insertTelefone: async (pTelefone, pIdCliente) => {
        const sql = 'INSERT INTO telefones (telefone_cliente, id_cliente) VALUES (?, ?);';
        const [rows] = await pool.query(sql, [pTelefone, pIdCliente]);
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
    }
}

module.exports = { clienteModel };
