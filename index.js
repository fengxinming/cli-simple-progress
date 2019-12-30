'use strict';

const EventEmitter = require('events');
const chalk = require('chalk');
const log = require('log-update');

class ProgressBar extends EventEmitter {

  /**
   * 进度条
   *
   * @constructor
   * @param {(number|Object)} [options={}] - 初始化配置
   */
  constructor(options) {
    super();

    options = typeof options === 'number'
      ? { total: options }
      : (options || {});

    if (!options.stream) {
      options.stream = process.stdout;
    }

    this.options = options;
    this.reset();
  }

  /**
   * 清除进度条
   */
  clear() {
    this._render.clear();
    return this;
  }

  /**
   * 标记换行输出
   */
  done() {
    this._render.done();
    return this;
  }

  /**
   * 重置到初始化配置
   * @param {Object=} options - 参数对象
   */
  reset(options) {
    options = Object.assign({}, this.options, options);

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
    return this;
  }

  /**
   * 当前进度值
   */
  get current() {
    return this._current;
  }

  /**
   * 递增百分比进度
   * @param {number} decimal - 百分比小数
   * @param {Object=} tokens - 用于替换模板中的占位符
   */
  progress(decimal, tokens) {
    return this.update((this._current + decimal * this._total) >>> 0, tokens);
  }

  /**
   * 递增进度值
   * @param {number} increment - 进度累加值
   * @param {Object=} tokens - 用于替换模板中的占位符
   */
  increase(increment, tokens) {
    return this.update(this._current + (increment || 1), tokens);
  }

  /**
   * 设置百分比进度
   * @param {number} decimal - 百分比小数
   * @param {Object=} tokens - 用于替换模板中的占位符
   */
  ratio(decimal, tokens) {
    return this.update((decimal * this._total) >>> 0, tokens);
  }

  /**
   * 设置进度值
   * @param {number} value - 进度值
   * @param {Object=} tokens - 用于替换模板中的占位符
   */
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

    return this;
  }

  /**
   * 实际渲染方法
   * @param {number} value - 进度值
   * @param {Object=} tokens - 用于替换模板中的占位符
   */
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

    return this;
  }

}

/**
 * @type {Function}
 */
ProgressBar.log = log;

/**
 * 获取颜色处理函数
 *
 * @param {string} color - 颜色名称或者十六进制值
 * @returns {Function}
 */
ProgressBar.colorize = function (color) {
  return color[0] === '#'
    ? chalk.hex(color)
    : chalk[color] || chalk.keyword(color);
};

module.exports = ProgressBar;
