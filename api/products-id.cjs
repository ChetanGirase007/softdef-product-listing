const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const parts = req.url.split('/').filter(Boolean); // ['api','products','id']
    const id = parts[2];
    const jsonPath = path.join(process.cwd(), 'dist', '_products.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(raw);
    const product = products.find(p => p.id === id);
    if (!product) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Product not found' }));
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(product));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
