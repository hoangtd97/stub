'use strict';

const _ = require('lodash');
const path = require('path');
const stringify = require('json-stringify-safe');

//-------------------- [START] Reactions -----------------------//
const REACTION = {
  LOG : 'LOG',
  FIX_DATA : 'FIX_DATA',
  RETRY : 'RETRY',
  RETRY_LATER : 'RETRY_LATER',
  SEND_QUEUE : 'SEND_QUEUE',
  FINISH : 'FINISH',
  TERMINATE : 'TERMINATE',
  EXIT_PROCESS : 'EXIT_PROCESS',
  CONTACT_ADMIN : 'CONTACT_ADMIN',
  REQUEST_GRANT_PERMISSION : 'REQUEST_GRANT_PERMISSION',
};
//-------------------- [END] Reactions -----------------------//

//-------------------- [START] Errors -----------------------//

class ERR extends Error {
  constructor(props) {
    super();
    if (props) { Object.assign(this, props) }

    this.code = this.code || ERR.CODE;
  }

  /**
   * Log error, auto add stack trace
   * @param {object} error 
   * @return {object} error, with stack trace
   */
  static log(error) {
    if(typeof error == 'string') error = new ERR({message: error});
    if (!(error.stack && error.stack.length > 0)) {
      error.stack = new Error().stack;
    }
    const view = logServerError(error);
    return view;
  }

  static stringify(error) {
    return stringify(ServerView(error));
  }

  log() {
    const view = logServerError(this);
    return view;
  }

  serverView() {
    return ServerView(this);
  }

  clientView() {
    return ClientView(this);
  }

  static get CODE () {
    return 'ERR';
  }
}


class ERR_SERVER_FAILED extends ERR {
  constructor(origin_error) {
    super();
    this.code        = 'ERR_SERVER_FAILED';
    this.id          = String(Date.now());
    this.reactions   = [REACTION.CONTACT_ADMIN];
    this.origin_error = ServerView(origin_error);
    this.message     = `Server failed, please contact admin. Error ID : ${this.id}`;
  }

  static get CODE () {
    return 'ERR_SERVER_FAILED';
  }

  ClientView() {
    return _.pick(this, ['code', 'id', 'reactions', 'message']);
  }
} 

class SIG_FINISH extends Error {
  constructor(result) {
    super('Finish');
    this.result    = result;
    this.code      = 'SIG_FINISH';
    this.reactions = [REACTION.FINISH];
  }

  static get CODE () {
    return 'SIG_FINISH';
  }
}

class SIG_TERMINATE extends Error {
  constructor(reason) {
    super('Finish');
    this.reason    = reason;
    this.code      = 'SIG_TERMINATE';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'SIG_TERMINATE';
  }
}

class SIG_MIS_CONDITION extends Error {
  constructor(condition) {
    super('Mis condition');
    this.condition = condition;
    this.code      = 'SIG_MIS_CONDITION';
    this.reactions = [REACTION.TERMINATE];
  }

  static get CODE () {
    return 'SIG_MIS_CONDITION';
  }
}

class SIG_RETRY extends Error {
  constructor(data) {
    super('Retry');
    this.data      = data;
    this.code      = 'SIG_RETRY';
    this.reactions = [REACTION.RETRY];
  }

  static get CODE () {
    return 'SIG_RETRY';
  }
}

//-------------------- [START] Utils -----------------------//

/**
 * Convert object with hidden properties like getter, setter, prototypes to full plain object,
 * so their properties will includes in stringified string
 * 
 * @param {object} obj 
 * @param {string[]} hiddenProps getter, setter, prototypes
 * 
 * @return {object}
 */
function toFullPlainObject({ obj, includesProperties = [], excludeProperties = [], ignoreValues = [undefined, ''] }) {
  let res = Object.assign({}, obj);

  for (let prop of includesProperties) {
    if (!ignoreValues.includes(obj[prop])) {
      res[prop] = obj[prop];
    }
  }

  for (let prop of excludeProperties) [
    delete res[prop]
  ]

  return res;
}

function ClientView(error) {
  let view = error;
  
  if (error && typeof error === 'object') {
    view = typeof error.ClientView === 'function' ? error.ClientView() : toFullPlainObject({ 
      obj: error, 
      includesProperties: ['message'], 
      excludeProperties: ['stack', 'flows', 'context', 'logs'] 
    });

    view = SubErrorView({ view, GenView : ClientView });
  }

  return view;
}

function ServerView(error) {
  let view = error;

  if (error && typeof error === 'object') {
    view = typeof error.ServerView === 'function' ? error.ServerView() : toFullPlainObject({ 
      obj: error, 
      includesProperties: ['message', 'stack'], 
    });

    view = SubErrorView({ view });  
  }

  return view;
}

/**
 * @note this method mutate view
 */
function SubErrorView({ view, sub_keys = ['error', 'err', 'origin_error'], GenView = ServerView }) {
  if (view && typeof view === 'object') {
    for (let sub of sub_keys) {
      if (view[sub] && typeof view[sub] === 'object') {
        view[sub] = GenView(view[sub]);
      }
    }
  }
  return view;
}

function logServerError(error) {
  const view = ServerView(error);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(stringify(view, null, 2))
  }
  else {
    console.log(stringify(view));
  }

  return view;
}

//-------------------- [END] Utils -----------------------//


module.exports = {
  ClientView, ServerView, logServerError,
  REACTION,
  ERR,
  ERR_SERVER_FAILED,
  SIG_FINISH,
  SIG_RETRY,
  SIG_TERMINATE,
  SIG_MIS_CONDITION,
};