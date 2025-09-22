// Copy _products.json to dist after build for Vercel compatibility
import { copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(process.cwd(), 'server', '_products.json');
const dest = path.join(process.cwd(), 'dist', '_products.json');

copyFileSync(src, dest);
console.log('Copied _products.json to dist/ for Vercel deployment.');
