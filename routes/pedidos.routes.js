const express = require('express');
//mapeando as rotas
const {
  createOrder,
  updateOrder,
  updateItem,
  getAllOrders,
  getOrderById,
  deleteOrder,
  deletaItem,
} = require('../controller/pedidos.controller');
const { verificarToken } = require('../Token/token');

const router = express.Router();

router.use(verificarToken);
router.post('/orders', createOrder);        // inserir
router.put('/orders/:id', updateOrder);     // atualizar
router.put('/orders/item/:id', updateItem);     // atualizar item
router.get('/orders/all', getAllOrders);        // lista todos
router.get('/orders/:id', getOrderById);    // lista pelo pedido
router.delete('/orders/:id', deleteOrder);  // deletar
router.delete('/orders/item/:id', deletaItem);  // deletar item

module.exports = router;
