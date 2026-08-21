import express from 'express';

export class Router {
  constructor() { this.expressRouter = express.Router(); }
  register(method, path, controller, action) { this.expressRouter[method](path, (req, res, next) => controller[action](req, res, next)); }
  get(path, controller, action) { this.register('get', path, controller, action); }
  post(path, controller, action) { this.register('post', path, controller, action); }
  getRouter() { return this.expressRouter; }
}