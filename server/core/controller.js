'use strict';

function Controller(f) {
  return async function(req, res, next) {
    try {
      await f(req, res, next);
    }
    catch(error) {
      return next(error);
    }
  }
}

module.exports = { Controller };