const http = require('http');
const { Pool } = require('pg');

const pool = new Pool();

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split('/')[2]; // /notes/1 → "1"

    // C — Create
    if (req.method === 'POST' && url.pathname === '/notes') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { title, body: text } = JSON.parse(body);
            const r = await pool.query(
                'INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING *',
                [title, text]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(r.rows[0]));
        });
        return;
    }

    // R — Read (все)
    if (req.method === 'GET' && url.pathname === '/notes') {
        const r = await pool.query('SELECT * FROM notes ORDER BY id');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r.rows));
        return;
    }

    // R — Read (один)
    if (req.method === 'GET' && id) {
        const r = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        if (r.rowCount === 0) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(r.rows[0]));
        return;
    }

    // U — Update
    if (req.method === 'PUT' && id) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { title, body: text } = JSON.parse(body);
            const r = await pool.query(
                'UPDATE notes SET title=$1, body=$2 WHERE id=$3 RETURNING *',
                [title, text, id]
            );
            if (r.rowCount === 0) { res.writeHead(404); res.end('Not found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(r.rows[0]));
        });
        return;
    }

    // D — Delete
    if (req.method === 'DELETE' && id) {
        const r = await pool.query('DELETE FROM notes WHERE id=$1 RETURNING *', [id]);
        if (r.rowCount === 0) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(204); res.end();
        return;
    }

    res.writeHead(404); res.end('Not found');
});

server.listen(8080, '0.0.0.0', () => {
    console.log('Listening on http://localhost:8080/notes');
});