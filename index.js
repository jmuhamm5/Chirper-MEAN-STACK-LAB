const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const blogs = require('./routes/blogs')(router);
const env = require('./env');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useMongoClient: true })
    .catch((err) => {
      if(err) {
        console.log('Could NOT connect to database.', err);
      } else {
        //console.log(config.secret);
        console.log('Connected to database: ' + config.db);
      }
    });

// Middleware
var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
