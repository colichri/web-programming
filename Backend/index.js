// require node version>=14.0 to run the app,
// because we use optional chaining etc...
const express = require('express');
const { version } = require('./package.json');

const { PORT = 3000, NODE_ENV } = process.env;

const app = express();


// routes
app.use('/', routes);

// routes with authorization
app.use('/auth/', authUser, routes);

app.get('*', (req, res) => {
  res.status(404).send('not found!');
});

// start listening
app.listen(PORT, () => {
  console.info(`[Node][${NODE_ENV}] App v${version} running on PORT ${PORT}`);
});
