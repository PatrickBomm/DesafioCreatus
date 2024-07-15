const authorizeLevel = (requiredLevel) => {
    return (req, res, next) => {
        if (!req.user || req.user.level < requiredLevel) {
            return res.status(403).json({ message: 'Acesso negado. Permissões insuficientes.' });
        }
        next();
    };
};

module.exports = authorizeLevel;
