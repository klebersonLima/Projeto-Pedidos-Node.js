const express = require('express');
const ordersRoutes = require('./routes/pedidos.routes'); 

const app = express();
app.use(express.json());

app.use('/api', ordersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
