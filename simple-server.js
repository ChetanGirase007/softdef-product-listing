import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.join(process.cwd(), 'dist');
const PRODUCTS_FILE = path.join(DIST, '_products.json');

function contentType(file) {
  if (file.endsWith('.js')) return 'application/javascript';
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.html')) return 'text/html';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.json')) return 'application/json';
  return 'application/octet-stream';
}

async function serveStatic(req, res) {
  try {
    let reqPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    // Serve assets under /assets and /attached_assets
    if (reqPath === '/' || !reqPath.startsWith('/assets') && !reqPath.startsWith('/attached_assets') && !reqPath.includes('.')) {
      const index = path.join(DIST, 'index.html');
      const data = await fs.readFile(index);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
      return;
    }

    const filePath = path.join(DIST, reqPath.replace(/^\//, ''));
    const stat = await fs.stat(filePath);
    if (stat.isFile()) {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
      return;
    }
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split('/').filter(Boolean); // ['api','products', 'id']
  try {
    if (parts[1] === 'products' && req.method === 'GET') {
      const productsRaw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
      const products = JSON.parse(productsRaw);
      if (parts.length === 2) {
        // /api/products
        const q = url.searchParams;
        // minimal: return all products and total
        return resResponse(res, 200, { products, total: products.length });
      } else if (parts.length === 3) {
        const id = parts[2];
        const product = products.find(p => p.id === id);
        if (!product) return resResponse(res, 404, { message: 'Product not found' });
        return resResponse(res, 200, product);
      }
    }
    if (parts[1] === 'filters' && req.method === 'GET') {
      const productsRaw = await fs.readFile(PRODUCTS_FILE, 'utf-8');
      const products = JSON.parse(productsRaw);
      const brands = new Map();
      const colors = new Map();
      for (const product of products) {
        if (product.brand) brands.set(product.brand, (brands.get(product.brand)||0)+1);
        if (product.colors && Array.isArray(product.colors)) {
          for (const c of product.colors) colors.set(c, (colors.get(c)||0)+1);
        }
      }
      const filterData = {
        brands: Array.from(brands.entries()).map(([name,count])=>({name,count})),
        colors: Array.from(colors.entries()).map(([name,count])=>({name,count})),
      };
      return resResponse(res, 200, filterData);
    }
    return resResponse(res, 404, { message: 'Not found' });
  } catch (err) {
    console.error(err);
    return resResponse(res, 500, { message: 'Internal server error' });
  }
}

function resResponse(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.url && req.url.startsWith('/api')) {
    return handleApi(req, res);
  }
  return serveStatic(req, res);
});

const port = parseInt(process.env.PORT || '5000', 10);
server.listen(port, () => console.log(`Simple server listening on http://localhost:${port}`));
