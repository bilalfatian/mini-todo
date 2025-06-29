const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// URL du service utilisateurs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service';

// Configuration PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'task-postgres',
    database: process.env.DB_NAME || 'taskdb',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Initialiser la table
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                user_id INTEGER NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

initDB();

// Routes tâches
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { title, userId } = req.body;
        
        // Vérifier que l'utilisateur existe
        const userResponse = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
        
        const result = await pool.query(
            'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
            [title, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(400).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Task service running on port ${PORT}`);
});