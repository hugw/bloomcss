/**
 * Production server
 *
 * @copyright Copyright (c) 2016, hugw.io
 * @author Hugo W - me@hugw.io
 * @license MIT
 */

/* eslint no-console: 0 */

const express = require('express');
const ejs = require('ejs');
const colors = require('colors');
const compression = require('compression');

// Define base dir path
const dir = process.cwd();

// Define default port
const port = process.env.PORT || 5000;

// Create Express instance
const app = express();

// Compress all requests using gzip
app.use(compression());

// Set default server port
app.set('port', port);

// Set default server views path
app.set('views', `${dir}/dist`);

// Serve ./dist as a static folder
app.use(express.static(`${dir}/dist`, { index: false }));

// Set template ./views engine
app.engine('html', ejs.renderFile);

// Route all requests to index.html
app.get('*', (req, res) => {
  res.render('index.html');
});

// Boot Server
app.listen(app.get('port'), () => {
  console.log(colors.green(`App running on http://localhost:${port}`));
});
