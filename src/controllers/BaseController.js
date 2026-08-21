export class BaseController {
  render(res, view, data = {}) { return res.render(view, data); }
  json(res, data, status = 200) { return res.status(status).json(data); }
}