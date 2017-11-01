var compressor = require('node-minify'),
  replace = require('replace'),
  version = require('../version');

compressor.minify({
  compressor: 'uglifyjs',
  input: './app/ng-simple-grid.js',
  output: './dist/ng-simple-grid.js',
  callback: function (err, min) {}
});

replace({
  regex: '"version": "' + version.current + '"',
  replacement: '"version": "' + version.new + '"',
  paths: ['package.json'],
  recursive: true,
  silent: true,
});

replace({
  regex: version.current,
  replacement: version.new,
  paths: ['README.md', 'version.js'],
  recursive: true,
  silent: true,
});
