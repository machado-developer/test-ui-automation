const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
  console.log(`Authenticating request: ${req.method} ${req.url}`);

  const token = req.cookies?.token;
  console.log(`Token from cookie: `, req.cookies);

  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authenticate;