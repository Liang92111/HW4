const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const db = new sqlite3.Database('oil_prices.db');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/oil_prices', (req, res) => {
    const year = req.query.year;
    let query = 'SELECT * FROM oil_prices';
    let params = [];
    if (year) {
        query += ' WHERE years = ?';
        params.push(year);
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
