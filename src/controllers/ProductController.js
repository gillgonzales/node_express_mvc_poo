import { BaseController } from './BaseController.js';
import { ProductModel } from '../models/ProductModel.js';
import { View } from '../views/View.js';

export class ProductController extends BaseController {
  constructor() {
    super();
    this.productModel = new ProductModel();
  }

  index = async (req, res, next) => {
    try {
      const products = await this.productModel.findAll();
      return View.render(res, 'products/index', { title: 'Produtos | Projeto MVC', products, queryError: req.query.error });
    } catch (error) { return next(error); }
  };

  create = (req, res) => View.render(res, 'products/form', { title: 'Novo produto | Projeto MVC', product: {}, formAction: '/produtos', formTitle: 'Novo produto', error: null });

  store = async (req, res, next) => {
    try {
      const product = this.attributesFromRequest(req);
      const error = this.validate(product);
      if (error) return View.render(res, 'products/form', { title: 'Novo produto | Projeto MVC', product, formAction: '/produtos', formTitle: 'Novo produto', error });
      await this.productModel.create(product);
      return res.redirect('/produtos');
    } catch (error) { return next(error); }
  };

  show = async (req, res, next) => {
    try {
      const product = await this.productModel.findById(this.idFromRequest(req));
      if (!product) return res.status(404).render('error', { title: 'Produto não encontrado | Projeto MVC', message: 'Produto não encontrado.' });
      return View.render(res, 'products/show', { title: `${product.name} | Projeto MVC`, product });
    } catch (error) { return next(error); }
  };

  edit = async (req, res, next) => {
    try {
      const product = await this.productModel.findById(this.idFromRequest(req));
      if (!product) return res.status(404).render('error', { title: 'Produto não encontrado | Projeto MVC', message: 'Produto não encontrado.' });
      return View.render(res, 'products/form', { title: 'Editar produto | Projeto MVC', product, formAction: `/produtos/${product.id}`, formTitle: 'Editar produto', error: null });
    } catch (error) { return next(error); }
  };

  update = async (req, res, next) => {
    try {
      const id = this.idFromRequest(req);
      const product = { id, ...this.attributesFromRequest(req) };
      const error = this.validate(product);
      if (error) return View.render(res, 'products/form', { title: 'Editar produto | Projeto MVC', product, formAction: `/produtos/${id}`, formTitle: 'Editar produto', error });
      const updated = await this.productModel.update(id, this.attributesFromRequest(req));
      if (!updated) return res.status(404).render('error', { title: 'Produto não encontrado | Projeto MVC', message: 'Produto não encontrado.' });
      return res.redirect(`/produtos/${id}`);
    } catch (error) { return next(error); }
  };

  destroy = async (req, res, next) => {
    try { await this.productModel.delete(this.idFromRequest(req)); return res.redirect('/produtos'); }
    catch (error) { return next(error); }
  };

  apiIndex = async (req, res, next) => {
    try { return this.json(res, { data: await this.productModel.findAll() }); }
    catch (error) { return next(error); }
  };

  apiShow = async (req, res, next) => {
    try {
      const product = await this.productModel.findById(this.idFromRequest(req));
      return product ? this.json(res, { data: product }) : this.json(res, { message: 'Produto não encontrado.' }, 404);
    } catch (error) { return next(error); }
  };

  attributesFromRequest(req) {
    return { name: String(req.body.name || '').trim(), description: String(req.body.description || '').trim(), price: Number(req.body.price) };
  }

  validate(product) {
    if (!product.name) return 'O nome é obrigatório.';
    if (!Number.isFinite(product.price) || product.price < 0) return 'Informe um preço válido.';
    return null;
  }

  idFromRequest(req) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) throw new Error('Identificador de produto inválido.');
    return id;
  }
}
