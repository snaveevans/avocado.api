var app = require('./server/app');
var port = 3000;

app.listen(port, function () {
  console.log(`Express server listening on port ${port}`); // eslint-disable-line
});