//Colando um token fixo para fazer a validação
// em um sistem mais robusto podemos fazer o login e retornar um token para acesso
const TOKEN_ESPERADO = '2e9531a894104fa312ed3ad302833b386c78c7516f6b7097d18ccc1f2b095041';

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenQuery = req.query.token;

  let token = null;

  if (authHeader) {
    const parts = authHeader.split(' ');
    token = parts[1];
  } else if (tokenQuery) {
    token = tokenQuery;
  } else {
    return res.status(401).json({ error: 'Token não informado' });
  }

  if (token !== TOKEN_ESPERADO) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  next();
}


module.exports = { verificarToken };
