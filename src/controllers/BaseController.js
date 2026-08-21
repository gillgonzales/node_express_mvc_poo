export class BaseController { 
  json(res, data, status = 200) { return res.status(status).json(data); }
}