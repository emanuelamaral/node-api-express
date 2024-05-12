const jwt = require("jsonwebtoken");

const isAuthorized = (req, res, next) => {
    // Obter o token
    const { authorization } = req.headers;

    if(!authorization) 
        return res.status(403).json({message: "Sem token"});

    // Validar o token
    jwt.verify(authorization, process.env.JWT_SECRET, (err, decoded) => {
        console.log(decoded);
        
        //Se ocorrer um erro na decodificação do token
        if(err) return res.status(401).json({ message: "Token inválido"});

        req.userId = decoded.id; // Insere os dados do token na requisição
        return next(); // Chama o próximo nó de execução da requisição
    });
};

module.exports = isAuthorized;