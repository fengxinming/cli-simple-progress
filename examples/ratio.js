const request = require('./utils/request');
const ProgressBar = require('../index');

function exec() {
  // 创建 progress bar
  const bar = new ProgressBar({
    width: 30
  });

  // 初始化展示内容
  bar.render(0, {
    speed: 'N/A',
    current: 0,
    total: 0
  });

  const req = request('https://examples/download');

  req.on('progress', (state) => {
    bar.ratio(state.percent, {
      total: (state.size.total / 1048576).toFixed(2),
      current: (state.size.transferred / 1048576).toFixed(2),
      speed: (state.speed / 1048576).toFixed(2)
    });
  });
}

exec();
