import { BaseController } from './BaseController.js';
import { ProductModel } from '../models/ProductModel.js';

export class ProductController extends BaseController {
  constructor() { super(); this.productModel = new ProductModel(); }

  requireAuth(req, res) {
    if (!req.session.user) {
      this.render(res, 'login', { title: 'Entrar | Projeto MVC', error: 'Entre para gerenciar os produtos.' });
      return false;
    }
    return true;
  }

  index = async (req, res, next) => {
    if (!this.requireAuth(req, res)) return;
    try {
      const products = await this.productModel.findAll();
      return this.render(res, 'products', { title: 'Produtos | Projeto MVC', products, user: req.session.user, queryError: req.query.error });
    } catch (error) { return next(error); }
  };

  store = async (req, res, next) => {
    if (!this.requireAuth(req, res)) return;
    try {
      const name = String(req.body.name || '').trim();
      const description = String(req.body.description || '').trim();
      const price = Number(req.body.price);
      if (!name || !Number.isFinite(price) || price < 0) return res.redirect('/produtos?error=Dados+inválidos');
      await this.productModel.create({ name, description, price });
      return res.redirect('/produtos');
    } catch (error) { return next(error); }
  };

  destroy = async (req, res, next) => {
    if (!this.requireAuth(req, res)) return;
    try { await this.productModel.delete(Number(req.params.id)); return res.redirect('/produtos'); }
    catch (error) { return next(error); }
  };

  apiIndex = async (req, res, next) => {
    try { return this.json(res, { data: await this.productModel.findAll() }); }
    catch (error) { return next(error); }
  };

  apiShow = async (req, res, next) => {
    try {
      const product = await this.productModel.findById(Number(req.params.id));
      return product ? this.json(res, { data: product }) : this.json(res, { message: 'Produto não encontrado.' }, 404);
    } catch (error) { return next(error); }
  };
}