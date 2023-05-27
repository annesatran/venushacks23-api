const express = require('express');

const app = express();

// middleware
app.use('/request-type', (req, res, next) => {
    console.log('Request type: ', req.method);
    next();
  });

// gen api
app.get('/', (req, res) => {
  res.send('Success!');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));