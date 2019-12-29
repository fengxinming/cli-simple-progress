const chalk = require('chalk');
const ProgressBar = require('../index');

function exec() {
  // 创建 progress bar
  const bar = new ProgressBar({
    width: 30,
    template: `CLI Progress | ${chalk.bgCyan('{complete}')}${chalk.bgWhite('{incomplete}')} | {percent}% | {current}/{total}`,
    complete: ' ',
    incomplete: ' '
  });

  let value = 0;
  const timer = setInterval(() => {
    value += Math.round(Math.random() * 10);
    bar.update(value);
  }, 50);
  bar.on('complete', () => {
    clearInterval(timer);
  });
}

exec();
