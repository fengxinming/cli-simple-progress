'use strict';

const EventEmitter = require('events');
const chalk = require('chalk');
const log = require('log-update');

class ProgressBar extends EventEmitter {

  constructor(options) {
    super();

    options = options || {};
    if (!options.stream) {
      options.stream = process.stdout;
    }
    this._initOptions(options);
    this._lastPos = 0;
    this._lastContent = '';
  }

  _initOptions(options) {
    if (!this.options) {
      this.options = Object.assign({}, ProgressBar.defaults);
    }
    Object.assign(this.options, options);
    const { stream, showCursor } = this.options;
    if (stream) {
      this._render = log.create(stream, {
        showCursor: !!showCursor
      });
      delete this.options.stream;
    }
  }

  clear() {
    this._render.clear();
  }

  done() {
    this._render.done();
  }

  render(len, tokens) {
    const { options, _lastPos } = this;
    const { width } = options;
    if (len >= width) {
      len = width;
      if (len === _lastPos) {
        return;
      }
    }

    this._lastPos = len;
    const { completeChar, incompleteChar, template } = options;
    const complete = completeChar.repeat(len);
    const incomplete = incompleteChar.repeat(width - len);
    const content = format(
      template
        .replace('{completeBar}', complete)
        .replace('{incompleteBar}', incomplete)
        .replace('{percent}', Math.round(len * 100 / width))
      ,
      tokens
    );
    if (content !== this._lastContent) {
      this._render(content);
      this._lastContent = content;
    }

    // 完成
    if (len === width) {
      if (options.clear) {
        this.clear();
      }
      if (options.done) {
        this.done();
      }
      this.emit('complete');
    }
  }

  reset(opts) {
    this._lastPos = 0;
    this._lastContent = '';
    this._initOptions(opts);
  }

  update(ratio, tokens) {
    const len = Math.floor(ratio * this.options.width);
    this.render(len, tokens);
  }

}

function format(template, tokens) {
  if (tokens && typeof tokens === 'object') {
    Object.keys(tokens).forEach(function (key) {
      template = template.replace(`{${key}}`, tokens[key]);
    });
  }
  return template;
}

// 默认配置
ProgressBar.defaults = {
  width: 20,
  template: `${chalk.bgGreen('{completeBar}')}${chalk.bgWhite('{incompleteBar}')} {percent}%`,
  completeChar: ' ',
  incompleteChar: ' ',
  clear: false,
  done: true
};

ProgressBar.log = log;

module.exports = ProgressBar;
