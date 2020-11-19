'use strict';

const _ = require('lodash');

const common = {
  SimpleID() {
    const num_id = (Date.now() * 10000) + Math.round(10000 * Math.random());
    const raw_string_id = num_id.toString(16);
    const id = raw_string_id.toUpperCase();
    return id;
  },
  merge(object, ...sources) {
    for (let source of sources) {
      object = _.mergeWith(object, source, (value, srcValue) => {
        if (Array.isArray(srcValue)) {
          return srcValue;
        }
        if (Array.isArray(value) && !Array.isArray(srcValue)) {
          return srcValue;
        }
      })
    }
    return object;
  },
  parseQuery({ query, defaults = { page: 1, limit: 20, fields: '' }, maxLimit = 1000 }) {
    let { page = 1, limit = 20, fields, ...filter } = { ...defaults, ...query };

    page = Number(page);
    limit = Math.min(Number(limit), maxLimit);
    let skip = (page - 1) * limit;

    return { page, skip, limit, filter, fields };
  }
};

module.exports = common;