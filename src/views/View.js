import path from 'node:path';

export class View{
     static setUp(app,dirname){app.set('views', path.join(dirname, 'views/templates')); app.set('view engine', 'ejs');}
     static render(res, view, data = {}) { return res.render(view, data); }
}