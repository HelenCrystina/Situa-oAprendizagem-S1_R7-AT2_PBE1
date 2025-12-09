const { pedidoModel } = require("../models/pedidoModel");

const pedidoController = {
  selecionaTodosPedidos: async (req, res) => {
    try {
      const resultado = await pedidoModel.selectPedidos();
      if (resultado.length === 0) {
        return res.status(200).json({ message: "A consulta não retornou resultados" });
      }
      return res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Ocorreu um erro no servidor",errorMessage: error.message});
    }
  },

  criarPedido: async (req, res) => {
    try {
      const {id_cliente, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, data_pedido} = req.body;
      if (
        !id_cliente ||!tipo_entrega ||!distancia == null ||!peso_carga == null ||!valor_base_km ||!valor_base_kg ||!data_pedido
      ) {
        return res.status(400).json({ message: "Verifique os dados enviados e tente novamente" });
      }
      const resultado = await pedidoModel.insertPedido(
        id_cliente, tipo_entrega,distancia, peso_carga, valor_base_km, valor_base_kg, data_pedido );

      res.status(201).json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Ocorreu um erro no servidor",errorMessage: error.message});
    }
  },
  alterarPedido: async (req, res) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      const { tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km } = req.body;
  
      if (Number.isNaN(id_pedido) || id_pedido <= 0) {
        return res.status(400).json({ message: 'ID do pedido inválido' });
      }
  
      const pedidoAtual = await pedidoModel.selectItemByIdPedido(id_pedido);
      if (pedidoAtual.length === 0) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      console.log(pedidoAtual);

      const novoTipoEntrega = tipo_entrega ?? pedidoAtual[0].tipo_entrega;
      const novaDistancia = distancia ?? pedidoAtual[0].distancia;
      const novoPesoCarga = peso_carga ?? pedidoAtual[0].peso_carga;
      const novoValorBaseKg = valor_base_kg ?? pedidoAtual[0].valor_base_kg;
      const novoValorBaseKm = valor_base_km ?? pedidoAtual[0].valor_base_km;
  
      const resultUpdatePedidos = await pedidoModel.updatePedidos(
        novoTipoEntrega,
        novaDistancia,
        novoPesoCarga,
        novoValorBaseKg,
        novoValorBaseKm,
        id_pedido
      );
  
      if (resultUpdatePedidos.affectedRows === 1 && resultUpdatePedidos.changedRows === 0) {
        return res.status(200).json({ message: 'Nenhuma alteração foi realizada' });
      }
  
      return res.status(200).json({ message: 'Pedido alterado com sucesso' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },
  excluirPedido: async (req, res) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      if (!id_pedido) {
        return res.status(400).json({ message: "Forneça um identificador válido" });
      }
      const pedidoSelecionado = await pedidoModel.selectItemByIdPedido(id_pedido);
      if (pedidoSelecionado.length === 0) {
        return res
          .status(200)
          .json({ message: "Pedido não localizado na base de dados" });
      }
      const resultadoDelete = await pedidoModel.deleteItem(id_pedido);

      if (resultadoDelete.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: "Ocorreu um erro ao excluir o pedido" });
      }
      res.status(200).json({
        message: "Pedido excluído com sucesso",
        data: resultadoDelete,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
};

module.exports = { pedidoController };

