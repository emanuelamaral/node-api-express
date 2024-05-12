// Imports
const express = require('express');
const router = express.Router();
const User = require('../model/User');
const jwt = require("jsonwebtoken");

const timeout = 3600;

// Função para gerar um Token JWT
const generateToken = (params = {}, timeout = 3600) => {
    return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: timeout });
}

// Rotas
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    // Verificar se o usuário existe no DB
    const user = await User.findOne({ email, password });

    // Verificar credenciais do usuário
    if(!user) 
        return res.status(400).json({ message: "Credenciais inválidas "});

    const now = new Date();
    // Gerar o token JWT
    const resposta = {
        token: generateToken( { id: user.id }),
        user,
        loggedId: now,
        expiresIn: new Date(now.getTime() + timeout * 1000)
    }

    // Devolver a resposta ao cliente
    return res.json(resposta);
})

//Export
module.exports = router;