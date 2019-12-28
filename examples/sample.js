const ProgressBar = require('../index');

function exec() {
  // 创建 progress bar
  const bar = new ProgressBar({
    template: '{current}: {token1} {token2}',
    total: 3
  });
  bar.render(1, {
    token1: 'Hello',
    token2: 'World!'
  });
  bar.done();
  bar.render(3, {
    token1: 'Goodbye',
    token2: 'World!'
  });
}

exec();
