const jwt = require("jsonwebtoken");

const isAuthorized = (req, res, next) => {
    // Obter o token
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({ message: "Sem token" });
    }

    // O token é geralmente enviado no formato "Bearer <token>"
    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Formato de token inválido" });
    }

    // Validar o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.userId = decoded.id; 
        return next();
    });
};

module.exports = isAuthorized;
