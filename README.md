# cli-simple-progress

[![npm package](https://nodei.co/npm/cli-simple-progress.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/cli-simple-progress)

> Simple to use progress-bar for command-line/terminal applications

[![NPM version](https://img.shields.io/npm/v/cli-simple-progress.svg?style=flat)](https://npmjs.org/package/cli-simple-progress)
[![NPM Downloads](https://img.shields.io/npm/dm/cli-simple-progress.svg?style=flat)](https://npmjs.org/package/cli-simple-progress)

## Installation

```bash
$ npm install cli-simple-progress
```

## Usage

increase(value[, tokens])

```js
const bar = new ProgressBar({
  width: 30,
  template: `CLI Progress | ${chalk.green('{complete}')}${chalk.white('{incomplete}')} | {percent}% | {current}/{total}`,
  complete: '\u2588',
  incomplete: '\u2591'
});

const timer = setInterval(() => {
  bar.increase(Math.round(Math.random() * 10));
}, 50);
bar.on('complete', () => {
  clearInterval(timer);
});
```

progress(decimal[, tokens])

```js
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
```

ratio(decimal[, tokens])

```js
const bar = new ProgressBar({
  width: 30,
  template: 'CLI Progress | {complete}{incomplete} | {percent}% | {current}/{total}Mb/s Chunks | Speed: {speed}Mb/s',
  complete: '\u2588',
  incomplete: '\u2591'
});

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
```

update(value[, tokens])

```js
const bar = new ProgressBar({
  width: 30,
  template: `CLI Progress | ${chalk.bgGreen('{complete}')}${chalk.bgWhite('{incomplete}')} | {percent}% | {current}/{total}`,
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
```

### Options

These are keys in the options object you can pass to the progress bar along with `total` as seen in the example above.

* `current` - current completed value defaulting to `0`
* `total` - total number of ticks to complete defaulting to `100`
* `width` - the displayed width of the progress bar defaulting to `20`
* `stream` - the output stream defaulting to `process.stdout`
* `clear` - option to clear the bar on completion defaulting to `false`
* `complete` - completion character defaulting to `" "`
* `incomplete` - incomplete character defaulting to `" "`
* `template` - a template string defaulting to \``${chalk.bgGreen('{complete}')}${chalk.bgWhite('{incomplete}')} {percent}%`\`
* `done` - option to persist the logged output. Useful if you want to start a new log session below the current one. defaulting to `true`
* `showCursor` - option to show the cursor. Useful if a CLI accepts input from a user. defaulting to `false`

### Tokens

These are tokens you can use in the template of your progress bar.

* `{complete}` the complete progress bar
* `{incomplete}` the incomplete progress bar
* `{current}` current tick number
* `{total}` total ticks
* `{percent}` completion percentage

### Custom Tokens

You can define custom tokens by adding a {'name': value} object parameter to your method (update(), ratio(), increase(), progress(), etc.) calls.

```js
const bar = new ProgressBar(':current: :token1 :token2', { total: 3 })
bar.update(1, {
  'token1': "Hello",
  'token2': "World!"
});

bar.done();

bar.update(3, {
  'token1': "Goodbye",
  'token2': "World!"
});
```

The above example would result in the output below.

```bash
1: Hello World!
3: Goodbye World!
```

## Examples

* [render](/examples/sample)
* [increase value](/examples/increase)
* [increase ratio](/examples/progress)
* [update ratio](/examples/ratio)
* [update value](/examples/update)

## License

MIT