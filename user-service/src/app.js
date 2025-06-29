const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes utilisateurs
app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]);
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = { id: id, name: 'User' + id, email: `user${id}@example.com` };
    res.json(user);
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: Date.now(), name, email };
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});