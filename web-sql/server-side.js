const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// pool = managing connections
const pool = mysql.createPool({
    connectionLimit: 10, //max num of poolsss
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'todolist'
});

// table if doesnt exist
pool.query('CREATE TABLE IF NOT EXISTS list (id INT AUTO_INCREMENT PRIMARY KEY, text VARCHAR(255) NOT NULL, checked BOOLEAN DEFAULT false);', error => {
    if (error) throw error;
    console.log('Table created or already exists');
});

app.get('/items', (req, res) => {
    pool.query('SELECT * FROM list', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// posts it into sql database
app.post('/items', (req, res) => {
    const newItem = req.body;
    console.log(newItem)
    pool.query('INSERT INTO list SET ?', newItem, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ id: results.insertId, message: 'Item added successfully' });
    });
});

app.delete('/deleteItem', (req, res) => {
    const item = req.body;
    console.log('Deleting item:', item)
    pool.query('DELETE FROM list WHERE id=?', item.id, (error, results) => {
        if (error){
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

app.post('/changeItem', (req, res) => {
    const item = req.body;
    pool.query('UPDATE list SET checked = 1 - checked WHERE id = ?', item.id, (error, results) => {
        if (error){
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Item updated successfully' });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
