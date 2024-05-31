const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const fs = require('fs');
const database = require('./app/database/database');
const webRouter = require('./app/routes/web');

const app = express();

app.use(session({ genid: (req) => { return uuidv4(); }, secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

process.env.TZ = 'Asia/Calcutta';

database.authenticate().then(() => {
    console.log("Connection has been established");
    app.listen(process.env.PORT);
    database.sync();
    app.use(webRouter);
}).catch((err) => {
    console.log(err);
    console.log("Failed to establish connection");
});