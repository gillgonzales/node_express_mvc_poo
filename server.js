import 'dotenv/config';
import { App } from './src/App.js';
import { Router } from './src/core/Router.js';
import { HomeController } from './src/controllers/HomeController.js';
import { AuthController } from './src/controllers/AuthController.js';
import { ProductController } from './src/controllers/ProductController.js';

const app = new App();
const router = new Router();
const home = new HomeController();
const auth = new AuthController();
const products = new ProductController();

router.get('/', home, 'index');
router.get('/login', auth, 'login');
router.post('/login', auth, 'authenticate');
router.post('/logout', auth, 'logout');
router.get('/produtos', products, 'index');
router.post('/produtos', products, 'store');
router.post('/produtos/:id/delete', products, 'destroy');
router.get('/api/produtos', products, 'apiIndex');
router.get('/api/products', products, 'apiIndex');
router.get('/api/produtos/:id', products, 'apiShow');

app.useRouter(router);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
});