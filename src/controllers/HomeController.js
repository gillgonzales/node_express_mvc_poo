import { BaseController } from './BaseController.js';
import { ProductModel } from '../models/ProductModel.js';

export class HomeController extends BaseController {
  constructor() { super(); this.productModel = new ProductModel(); }

  index = async (req, res, next) => {
    try {
      const products = await this.productModel.findAll();
      return this.render(res, 'home', { title: 'Projeto MVC', products, user: req.session.user });
    } catch (error) { return next(error); }
  };
}