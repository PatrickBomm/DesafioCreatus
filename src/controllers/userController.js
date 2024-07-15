const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.loginUser = async (req, res) => {
    try {
        const token = await userService.authenticate(req.body.email, req.body.password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserById(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        await userService.deleteUserById(req.params.id);
        res.status(204).send();  // No Content response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateUserReport = async (req, res) => {
    try {
        const format = req.query.format || 'pdf';

        const reportData = await userService.generateReport(format);
        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment('report.csv');
            res.send(reportData);
        } else {
            res.header('Content-Type', 'application/pdf');
            res.attachment('report.pdf');
            res.send(reportData);
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar o relatório: ' + error.message });
    }
};