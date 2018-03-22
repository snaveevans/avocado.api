const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

var eventRouter = require('./Events/EventRouter');
app.use('/events', eventRouter);

app.listen(3000, () => console.log('Example app listening on port 3000!'))