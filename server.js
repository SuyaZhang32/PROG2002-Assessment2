const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const concertAPI = require('./controllerAPI/api-controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/concerts', concertAPI);

app.listen(3060, () => console.log('Server up on 3060'));
