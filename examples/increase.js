const chalk = require('chalk');
const ProgressBar = require('../index');

const red = ProgressBar.colorize('#ff0000');
const { white } = chalk;

function exec() {
  // 创建 progress bar
  const bar = new ProgressBar({
    width: 30,
    template: `CLI Progress | ${red('{complete}')}${white('{incomplete}')} | {percent}% | {current}/{total}`,
    complete: '\u2588',
    incomplete: '\u2591'
  });

  const timer = setInterval(() => {
    bar.increase(Math.round(Math.random() * 10));
  }, 50);
  bar.on('complete', () => {
    clearInterval(timer);
  });
}

exec();
