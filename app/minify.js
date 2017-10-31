var compressor = require('node-minify');

compressor.minify({
  compressor: 'uglifyjs',
  input: './app/index.js',
  output: './dist/simple-grid-material.min.js',
  callback: function (err, min) {}
});
