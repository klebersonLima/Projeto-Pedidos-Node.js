const pool = require('../database/database');

//Aqui estamos inserindo os dados
async function createOrder(req, res) {
    const client = await pool.connect();

  try {
    // Aqui estamos definindo as propriedades que conterão no meu body
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // aqui começara a query
    await client.query('BEGIN');

    // insere o pedido
    await client.query(
      'INSERT INTO "Order" (orderId, value, creationDate) VALUES ($1, $2, $3)',
      [numeroPedido, valorTotal, dataCriacao]
    );

    // insere os itens
    for (const item of items) {
      await client.query(
        'INSERT INTO Items (orderId, productId, quantity, price) VALUES ($1, $2, $3, $4)',
        [numeroPedido, item.idItem, item.quantidadeItem, item.valorItem]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Pedido e itens criados com sucesso' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido e itens' });
  } finally {
    client.release();
  }
}

// Listar pelo pedido (com itens) pelo numero do pedido
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        o.orderId, o.value, o.creationDate,
        i.productId, i.quantity, i.price
      FROM "Order" o
      LEFT JOIN Items i ON o.orderId = i.orderId
      WHERE o.orderId = $1
      ORDER BY i.productId
      `,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
}

//LIstar todos os pedidos e itens juntos
async function getAllOrders(req, res) {
  try {
    const result = await pool.query(`
      SELECT o.orderId, o.value, o.creationDate, i.productId, i.quantity, i.price
      FROM "Order" o
      LEFT JOIN Items i ON o.orderId = i.orderId
      ORDER BY o.orderId, i.productId
    `);

    //criando um objeto para poder mapear os dados
    const ordersMap = {};

    result.rows.forEach(row => {
      if (!ordersMap[row.orderid]) {
        ordersMap[row.orderid] = {
          orderId: row.orderid,
          value: row.value,
          creationDate: row.creationdate,
          items: []
        };
      }

      if (row.productid !== null) {
        ordersMap[row.orderid].items.push({
          productId: row.productid,
          quantity: row.quantity,
          price: row.price
        });
      }
    });

    res.json(Object.values(ordersMap));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
}

//Aqui estamos atualizando os dados
async function updateOrder(req, res) {
  try {
        //Pegamos o id que vem da url
    const { id } = req.params;
    // aqui os valores que vem do body
    const { value, creationDate } = req.body;
    // aqui abaixo é nossa query para fazer o update
    await pool.query(
      'UPDATE "Order" SET value = $1, creationDate = $2 WHERE orderId = $3',
      [value, creationDate, id]
    );    

    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
}
//Aqui estamos atualizando o item
async function updateItem(req, res) {
  try {
    //Pegamos o id que vem da url
    const { id } = req.params;
    // aqui os valores que vem do body
    const { quantity, price } = req.body;
        // aqui abaixo é nossa query para fazer o update
    await pool.query(
      'UPDATE Items SET quantity = $1, price = $2 WHERE productId = $3',
      [quantity, price, id]
    );

    res.json({ message: 'Item atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
}


// Deletar pedido e itens
async function deleteOrder(req, res) {
  try {
    //Pegamos o id que vem da url
    const { id } = req.params;
    // É necessario deletarmos os dois porque é um one to many com constraint
    await pool.query('DELETE FROM Items WHERE orderId = $1', [id]);
    await pool.query('DELETE FROM "Order" WHERE orderId = $1', [id]);
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
}
//Deleta o item
async function deletaItem(req, res) {
  try {
    //Pegamos o id que vem da url
    const { id } = req.params;
    // Deletar somente o item
    await pool.query('DELETE FROM Items WHERE productId = $1', [id]);
    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
}

module.exports = {
  createOrder,
  updateOrder,
  updateItem,
  getAllOrders,
  getOrderById,
  deleteOrder,
  deletaItem,
};
