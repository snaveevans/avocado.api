var app = require('./src/app');
var port = 3000;

app.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});