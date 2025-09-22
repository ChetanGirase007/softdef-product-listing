const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const jsonPath = path.join(process.cwd(), 'dist', '_products.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(raw);
    const brands = new Map();
    const colors = new Map();
    for (const p of products) {
      if (p.brand) brands.set(p.brand, (brands.get(p.brand) || 0) + 1);
      if (p.colors && Array.isArray(p.colors)) {
        for (const c of p.colors) colors.set(c, (colors.get(c) || 0) + 1);
      }
    }
    const filterData = {
      brands: Array.from(brands.entries()).map(([name, count]) => ({ name, count })),
      colors: Array.from(colors.entries()).map(([name, count]) => ({ name, count })),
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(filterData));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};
