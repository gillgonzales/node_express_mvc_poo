import 'dotenv/config';
import { App } from './src/App.js';
import { Router } from './src/core/Router.js';
import { HomeController } from './src/controllers/HomeController.js';
import { ProductController } from './src/controllers/ProductController.js';

const app = new App();
const router = new Router();
const home = new HomeController();
const products = new ProductController();

router.get('/', home, 'index');
router.get('/produtos', products, 'index');
router.get('/produtos/novo', products, 'create');
router.post('/produtos', products, 'store');
router.get('/produtos/:id', products, 'show');
router.get('/produtos/:id/editar', products, 'edit');
router.post('/produtos/:id', products, 'update');
router.post('/produtos/:id/delete', products, 'destroy');
router.get('/api/produtos', products, 'apiIndex');
router.get('/api/products', products, 'apiIndex');
router.get('/api/produtos/:id', products, 'apiShow');

app.useRouter(router);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
});