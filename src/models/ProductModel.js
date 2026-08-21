import { BaseModel } from './BaseModel.js';

export class ProductModel extends BaseModel {
  constructor() {
    super({ table: 'products', primary: 'id' });
  }
}