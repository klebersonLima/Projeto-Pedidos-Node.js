//AQUI ESTAMOS COM OS DADOS DE CONEXÃO DO BANCO DE DADOS
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Pedidos',   
  user: 'postgres',     
  password: '12345678',
});

module.exports = pool;