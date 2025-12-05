const { pedidoModel } = require("../models/pedidoModel");

const pedidoController = {
  criarPedido: async (req, res) => {
    try {
      const {
        id_cliente,
        tipo_entrega,
        distancia,
        peso_carga,
        valor_base_km,
        valor_base_kg,
        data_pedido,
      } = req.body;
      if (
        !id_cliente||
        !tipo_entrega ||
        !distancia == null ||
        !peso_carga == null||
        !valor_base_km ||
        !valor_base_kg ||
        !data_pedido
      ) {
        return res
          .status(400)
          .json({ message: "Verifique os dados enviados e tente novamente" });
      }
      const resultado = await pedidoModel.insertPedido(
        id_cliente,
        tipo_entrega,
        distancia,
        peso_carga,
        valor_base_km,
        valor_base_kg,
        data_pedido
      );
      res
        .status(201)
        .json({ message: "Registro incluído com sucesso", data: resultado });
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