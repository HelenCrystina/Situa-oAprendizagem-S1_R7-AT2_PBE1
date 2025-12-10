const { pedidoModel } = require("../models/pedidoModel");

const pedidoController = {
  /**
   * Retorna os pedidos cadastrados
   * Rota GET /pedidos
   * @async
   * @function selecionaTodosPedidos: permite exibir todos os pedidos que foram inseridos
   * @param {Request} req: Objeto da requisição HTTP
   * @param {Response} res: Objeto da resposta HTTP
   * @returns 
   */
  selecionaTodosPedidos: async (req, res) => {
    try {
      const resultado = await pedidoModel.selectPedidos();
      // Se caso não tiver um pedido cadastrado ele exibirá que não encontrou pedidos cadastrados
      if (resultado.length === 0) {
        return res.status(200).json({ message: "A consulta não retornou resultados" });
      }
      return res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: error.message });
    }
  },

  /**
   * Retorna os pedidos cadastrados e os calculos feitos pela trigger
   * Rota GET /pedidos
   * @async
   * @function selecionaPedidosCalculos: permite exibir todos os pedidos que foram inseridos e os calculos de acordo com os valores da tabela pedidos =.
   * @param {Request} req: Objeto da requisição HTTP
   * @param {Response} res: Objeto da resposta HTTP
   * @returns 
   */
  selecionaPedidosCalculos: async (req, res) => {
    try {
      const resultado = await pedidoModel.selectPedidosCalculos();
      if (resultado.length === 0) {
        return res.status(200).json({ message: "A consulta não retornou resultados" });
      }
      return res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: error.message });
    }
  },

  /**
 * Insere os pedidos cadastrados
   * Rota POST /pedidos
   * @async
   * @function criarPedido: permite cadastrar pedidos com os seguintes critérios vinculando o id do cliente que fez o pedido, qual é o tipo
   * da entrega se é normal ou urgente, a distancia, o peso da carga, o valor base por km, valor base por kg e data que foi feito o pedido
 * @param {Request} req: Objeto da requisição HTTP
 * @param {Response} res: Objeto da resposta HTTP
 * @returns 
 */
  criarPedido: async (req, res) => {
    try {
      const { id_cliente, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, data_pedido } = req.body;
      /*Irá realizar a verificação de cada coluna da nossa tabela que compõe o banco de dados, como verificar se é um número ou não e se aquele
      campo atribui um valor, ou seja, se está vazio*/
      if (
        !id_cliente || !tipo_entrega || !distancia || !peso_carga || !valor_base_km || !valor_base_kg || !data_pedido) {
        return res.status(400).json({ message: "Verifique os dados enviados e tente novamente" });
      }
      if (tipo_entrega !== "urgente" || tipo_entrega !== "normal") {
        return res.status(400).json({ message: "O tipo de entrega deverá ser: normal ou urgente" });
      }

      // Se todos os campos forem preenchidos, irá incluir no banco de dados.
      const resultado = await pedidoModel.insertPedido(
        id_cliente, tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, data_pedido);

      res.status(201).json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: error.message });
    }
  },

  /**
    * Altera os pedidos cadastrados
    * Rota PUT /pedidos/:idPedido
    * @async
    * @function alterarPedido: permite modificar todos os campos que desejar.
    * Exemplo: quero modificar somente o tipo de entrega, antes de modificar era normal e agora gostaria que fosse urgente
    * @param {Request} req: Objeto da requisição HTTP
    * @param {Response} res Objeto da resposta HTTP
    * @returns 
    */
  alterarPedido: async (req, res) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      const { tipo_entrega, distancia, peso_carga, valor_base_kg, valor_base_km } = req.body;

      // Verifica se o id do pedido é válido
      if (Number.isNaN(id_pedido) || id_pedido <= 0) {
        return res.status(400).json({ message: 'ID do pedido inválido' });
      }
      // Faz uma verificação se aquele id já existe, caso não exista ele nos retorna que não foi encontrado
      const pedidoAtual = await pedidoModel.selectByIdPedido(id_pedido);
      if (pedidoAtual.length === 0) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      // Verifica se o valor que vai ser alterado é o mesmo que foi atribuido na tabela ou se está vazio, caso seja ele não modifica o valor.
      // Se ele não for o mesmo ele só vai alterar o valor escolhido e restante dos valores irão permanecer os mesmos
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
    // Verifica se teve algum alteração realizado.
      if (resultUpdatePedidos.affectedRows === 1 && resultUpdatePedidos.changedRows === 0) {
        return res.status(200).json({ message: 'Nenhuma alteração foi realizada' });
      }

      return res.status(200).json({ message: 'Pedido alterado com sucesso' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
    }
  },

   /**
   * Exclui o pedido desejado e também os calculos vinculados a ele
   * Rota DELETE /pedidos/:idPedido
   * @async
   * @function excluirPedido: permite excluir o pedido que desejar e calculos vinculados a ele
   * @param {Request} req: Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns 
   */
  excluirPedido: async (req, res) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      if (!id_pedido) {
        return res.status(400).json({ message: "Forneça um ID" });
      }
      const pedidoAtual = await pedidoModel.selectByIdPedido(id_pedido);
      if (pedidoAtual.length === 0) {
        return res.status(200).json({ message: "Pedido não localizado na base de dados" });
      }
      await pedidoModel.deleteCalculo(id_pedido)
      const resultadoDelete = await pedidoModel.deletePedido(id_pedido);

      if (resultadoDelete.affectedRows === 0) {
        return res.status(200).json({ message: "Ocorreu um erro ao excluir o pedido" });
      }
      res.status(200).json({ message: "Pedido excluído com sucesso", data: resultadoDelete });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro no servidor", errorMessage: error.message });
    }
  }
};

module.exports = { pedidoController };

