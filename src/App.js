import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { View } from './views/View.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export class App {
  constructor() { this.app = express(); this.setupMiddlewares(); this.setupViews(); }
  setupMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(session({ secret: process.env.SESSION_SECRET || 'development-secret', resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', maxAge: 86400000 } }));
    this.app.use(express.static(path.join(dirname, '../public')));
  }
  setupViews() { View.setUp(this.app,dirname) }
  useRouter(router) {
    this.app.use(router.getRouter());
    this.app.use((error, req, res, next) => { console.error(error); return res.status(500).render('error', { title: 'Erro | Ateliê MVC' }); });
  }
  listen(port, callback) { return this.app.listen(port, callback); }
}