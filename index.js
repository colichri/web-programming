const express = require('express');
const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
