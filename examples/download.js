const chalk = require('chalk');
const request = require('./utils/request');
const ProgressBar = require('../index');

function exec() {
  // 创建 progress bar
  const b1 = new ProgressBar({
    width: 30,
    template: `CLI Progress | ${chalk.bgGreen('{completeBar}')}${chalk.bgWhite('{incompleteBar}')} | {percent}% | {value}/{total}Mb/s Chunks | Speed: {speed}Mb/s`
    // completeChar: '\u2588',
    // incompleteChar: '\u2591'
  });

  // 初始化展示内容
  b1.render(0, {
    speed: 'N/A',
    value: 0,
    total: 0
  });

  const req = request('https://examples/download')
    .on('progress', (state) => {
      b1.update(state.percent, {
        total: (state.size.total / 1048576).toFixed(2),
        value: (state.size.transferred / 1048576).toFixed(2),
        speed: (state.speed / 1048576).toFixed(2)
      });
    });
  req.download();
}

exec();
