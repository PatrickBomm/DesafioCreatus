const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Ler o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // Verificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;
