const EventEmitter = require('events');

class Request extends EventEmitter {

  download() {
    let transferred = 0;
    const total = 90044871;

    const timer = setInterval(() => {
      const speed = (Math.random() * 2 + 9) * 1048576;
      transferred += speed;

      if (transferred >= total) {
        transferred = total;
        clearInterval(timer);
      }

      this.emit('progress', {
        percent: transferred / total,
        speed,
        size: {
          total,
          transferred
        }
      });
    }, 1000);
  }

}

module.exports = function () {
  return new Request();
};
