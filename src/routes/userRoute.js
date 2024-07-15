const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeLevel = require('../middleware/levelMiddleware');

// Rota para criação de usuario
router.post('/users', userController.createUser);

// Rota para login de usuários
router.post('/login', userController.loginUser);

// Rota para geração de relatório de usuários
router.get('/users/report', authMiddleware, authorizeLevel(4), userController.generateUserReport);

// Rota para listar todos os usuários
router.get('/users', userController.listUsers);

// Rota para obter um usuário específico por ID
router.get('/users/:id', userController.getUserById);

// Rota para atualizar um usuário por ID
router.put('/users/:id', userController.updateUserById);

// Rota para exclusão (desativação) de um usuário por ID
router.delete('/users/:id', userController.deleteUserById);

module.exports = router;
