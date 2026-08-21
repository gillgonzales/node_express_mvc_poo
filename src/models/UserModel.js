import { BaseModel } from './BaseModel.js';

export class UserModel extends BaseModel {
  async findByEmail(email) {
    const result = await this.query('SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0] || null;
  }
}