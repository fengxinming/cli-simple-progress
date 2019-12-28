const ProgressBar = require('../index');

function exec() {
  // 创建 progress bar
  const bar = new ProgressBar({
    width: 30,
    template: 'CLI Progress | {complete}{incomplete} | {percent}% | {current}/{total}',
    complete: '=',
    incomplete: '-'
  });

  const timer = setInterval(() => {
    bar.progress(Math.random() / 2);
  }, 50);
  bar.on('complete', () => {
    clearInterval(timer);
  });
}

exec();
