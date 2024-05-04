const express = require('express');
const url = require('url');
const path = require('path');
const webRouter = require('./app/routes/web');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));


app.listen(3000);

app.use((req, res, next) => {
    app.locals.BASE_URL = url.format({
        protocol: req.protocol,
        host: req.get('host')
    });

    next();
})

app.use(webRouter);