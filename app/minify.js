var compressor = require('node-minify');

compressor.minify({
  compressor: 'uglifyjs',
  input: './app/ng-simple-grid.js',
  output: './dist/ng-simple-grid.js',
  callback: function (err, min) {}
});
