import { BaseController } from './BaseController.js';
import { UserModel } from '../models/UserModel.js';

export class AuthController extends BaseController {
  constructor() { super(); this.userModel = new UserModel(); }
  login = (req, res) => this.render(res, 'login', { title: 'Entrar | Ateliê MVC', error: null });

  authenticate = async (req, res, next) => {
    try {
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');
      const user = await this.userModel.findByEmail(email);
      if (!user || user.password !== password) return this.render(res, 'login', { title: 'Entrar | Ateliê MVC', error: 'E-mail ou senha inválidos.' });
      req.session.user = { id: user.id, name: user.name, email: user.email };
      return res.redirect('/produtos');
    } catch (error) { return next(error); }
  };

  logout = (req, res) => req.session.destroy(() => res.redirect('/'));
}