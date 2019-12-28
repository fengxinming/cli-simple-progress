'use strict';

const EventEmitter = require('events');
const chalk = require('chalk');
const log = require('log-update');

class ProgressBar extends EventEmitter {

  constructor(options) {
    super();

    options = typeof options === 'number'
      ? { total: options }
      : (options || {});

    if (!options.stream) {
      options.stream = process.stdout;
    }

    this.reset(options);
  }

  clear() {
    this._render.clear();
  }

  done() {
    this._render.done();
  }

  reset(options) {
    options = options || {};

    this._template = options.template || `${chalk.bgGreen('{complete}')}${chalk.bgWhite('{incomplete}')} {percent}%`;
    this._complete = options.complete || ' ';
    this._incomplete = options.incomplete || ' ';
    this._clear = options.clear || false;
    this._done = options.done || true;
    this._total = options.total || 100;
    this._width = options.width || 20;
    this._current = options.current || 0;
    this._lastDraw = '';

    const { stream } = options;
    if (stream) {
      this._render = log.create(stream, {
        showCursor: options.showCursor || false
      });
    }
  }

  get current() {
    return this._current;
  }

  progress(decimalIncrement, tokens) {
    this.update((this._current + decimalIncrement * this._total) >>> 0, tokens);
  }

  increase(increment, tokens) {
    this.update(this._current + (increment || 1), tokens);
  }

  ratio(decimal, tokens) {
    this.render((decimal * this._total) >>> 0, tokens);
  }

  update(value, tokens) {
    this.render(value, tokens);

    // 完成
    if (this._current === this._total) {
      if (this._clear) {
        this.clear();
      }
      if (this._done) {
        this.done();
      }
      this.emit('complete');
    }
  }

  render(value, tokens) {
    const { _current, _total } = this;
    if (value >= _total) {
      value = _total;
      if (value === _current) {
        return;
      }
    }

    this._current = value;
    let ratio = value / _total;
    ratio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;

    const { _complete, _incomplete, _template, _width } = this;
    const completeWidth = (_width * ratio) >>> 0;
    const complete = _complete.repeat(completeWidth);
    const incomplete = _incomplete.repeat(_width - completeWidth);
    let content = _template
      .replace('{complete}', complete)
      .replace('{incomplete}', incomplete)
      .replace('{percent}', (ratio * 100) >>> 0);

    if (tokens && typeof tokens === 'object') {
      if (tokens.total === undefined) {
        tokens.total = _total;
      }
      if (tokens.current === undefined) {
        tokens.current = value;
      }
      Object.keys(tokens).forEach(function (key) {
        content = content.replace(`{${key}}`, tokens[key]);
      });
    } else {
      content = content
        .replace('{total}', _total)
        .replace('{current}', value);
    }

    if (content !== this._lastDraw) {
      this._render(content);
      this._lastDraw = content;
    }
  }

}

ProgressBar.log = log;

module.exports = ProgressBar;
