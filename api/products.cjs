const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const jsonPath = path.join(process.cwd(), 'dist', '_products.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(raw);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ products, total: products.length }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
