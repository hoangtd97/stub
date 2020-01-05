'use strict';

const _ = require('lodash');

const common = {
  SimpleID() {
    return `${Date.now()}${_.padStart(Math.ceil(Math.random() * 10000), 4, '0')}`;
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
  }
};

module.exports = common;