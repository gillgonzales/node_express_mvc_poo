import { BaseController } from './BaseController.js';
import { ProductModel } from '../models/ProductModel.js';
import { View } from '../views/View.js';

export class HomeController extends BaseController {
  constructor() { super(); this.productModel = new ProductModel(); }

  index = async (req, res, next) => {
    try {
      const products = await this.productModel.findAll();
      return View.render(res, 'home', { title: 'Projeto MVC', products });
    } catch (error) { return next(error); }
  };
}