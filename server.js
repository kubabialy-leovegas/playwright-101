// Tiny demo server for the Playwright workshop. No dependencies needed.
// Serves the static files in ./app and one fake API endpoint: GET /api/products
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const APP_DIR = path.join(__dirname, 'app');

const PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', category: 'electronics', price: 19.99 },
  { id: 2, name: 'Mechanical Keyboard', category: 'electronics', price: 89.0 },
  { id: 3, name: 'Coffee Mug', category: 'home', price: 7.5 },
  { id: 4, name: 'Desk Lamp', category: 'home', price: 24.0 },
  { id: 5, name: 'Running Shoes', category: 'sports', price: 64.99 },
];

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/api/products') {
      // Artificial delay so we can talk about auto-waiting.
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(PRODUCTS));
      }, 800);
      return;
    }

    const file = path.join(APP_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    if (!file.startsWith(APP_DIR) || !fs.existsSync(file)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Demo shop running at http://localhost:${PORT}`));
