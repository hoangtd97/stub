'use strict';

const _ = require('lodash');
const { MongoRepository } = require('server/core/mongo-repository.js');

const LogSchema = MongoRepository.Schema({
  at: { type: Date, default: Date.now }
}, { strict: false });

const LogMiddleWareFactory = ({ LogRepository, name = 'logs', schema = LogSchema }) => {

  if (!LogRepository) {
    LogRepository = MongoRepository.create({ name, schema });
  }

  const log = {
    write: (req, res, next) => {
      const log = {
        request: {
          at: new Date(),
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: _.cloneDeep(req.body)
        },
        response: {
          at: null,
          status: null,
          headers: null,
          body: null
        },
        duration: null,
      };

      const origin_res_json = res.json.bind(res);
      res.json = (body) => {
        log.response.body = body;
        return origin_res_json(body);
      }

      res.on('finish', (e) => {
        log.response.at = new Date();
        log.response.status = res.statusCode;
        log.response.headers = res.getHeaders();

        log.duration = log.response.at.getTime() - log.request.at.getTime();

        LogRepository.create(log).catch(err => console.error(err));
      });

      return next();
    },
    read: async (req, res, next) => {
      const result = { total: 0, items: [] }

      const filter = { ...req.query, ...req.body };

      result.total = await LogRepository.count(filter);

      if (result.total > 0) {
        result.items = await LogRepository.find(filter).sort({ at: -1 }).lean(true);
      }

      return res.json(result);
    }
  }

  return log;
};

module.exports = { LogMiddleWareFactory };