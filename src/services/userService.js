const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const { parse } = require('json2csv');
const PDFDocument = require('pdfkit');
const bcrypt = require('bcryptjs');

// Criação de usuário
exports.createUser = async (userData) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        userData.dtStart = new Date();

        const user = new User(userData);
        await user.save();

        return {
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                level: user.level,
                dtStart: user.dtStart
            }
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Autenticação de usuário e geração de JWT
exports.authenticate = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Senha inválida');
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, level: user.level },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

// Busca todos os usuários ativos
exports.getAllUsers = async () => {
    try {
        const users = await User.find({ active: true }).select('_id name email level dtStart dtUpdate active');
        return users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            dtStart: user.dtStart,
            dtUpdate: user.dtUpdate
        }));
    } catch (error) {
        console.error('Error fetching all active users:', error);
        throw error;
    }
};

// Busca de usuário por ID
exports.getUserById = async (id) => {
    try {
        const user = await User.findOne({ _id: id, active: true }).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            dtStart: user.dtStart,
            dtUpdate: user.dtUpdate
        };
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

// Atualização de usuário por ID
exports.updateUserById = async (id, userData) => {
    try {
        // Remover dtStart do userData para garantir que ele não seja atualizado
        if (userData.dtStart) {
            delete userData.dtStart;
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id, active: true },
            userData,
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('Usuário não encontrado ou não ativo');
        }

        return {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            level: updatedUser.level,
            dtStart: updatedUser.dtStart,
            dtUpdate: updatedUser.dtUpdate
        };
    } catch (error) {
        console.error('Error updating user by ID:', error);
        throw error;
    }
};

// Geração de relatório em PDF ou CSV
exports.generateReport = async (format) => {
    const users = await User.find().select('_id name email level dtStart dtEnd dtUpdate active');

    if (format === 'csv') {
        return parse(users, { fields: ['_id', 'name', 'email', 'level', 'dtStart', 'dtEnd', 'dtUpdate', 'active'] });
    } else { // Geração de PDF
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            return pdfData;
        });

        doc.fontSize(12).text('Relatório de Usuários', { underline: true });
        users.forEach(user => {
            doc.moveDown().fontSize(10).text(`ID: ${user._id}`);
            doc.text(`Nome: ${user.name}`);
            doc.text(`Email: ${user.email}`);
            doc.text(`Nível: ${user.level}`);
            doc.text(`Data de Início: ${user.dtStart}`);
            if (user.dtEnd) doc.text(`Data de Término: ${user.dtEnd}`);
            doc.text(`Última Atualização: ${user.dtUpdate}`);
            doc.text(`Ativo: ${user.active ? 'Sim' : 'Não'}`);
            doc.moveDown();
        });
        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
};
