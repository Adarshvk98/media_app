const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const config = require('./config/config');

//create object of express to handle routes
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect database
mongoose.connect(config.database);

// Succeccfull connection
mongoose.connection.on('connected', () => {
    console.log("connected to database " + config.database);
});

// Connection error
mongoose.connection.on('error', (err) => {
    console.log("error occur while connecting to database " + err);
});

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

// Controllers
const HomeController = require('./api/homepage.controller')
app.use('/', HomeController);

const ContactController = require('./api/contact.controller')
app.use('/query', ContactController);

// Routes
app.get('/sports', (req, res) => {
    return res.render('sports', { newsList: require('./models/sports-news.json') });
});

app.get('/contact', (req, res) => {
    return res.render('contact-us', {
        error: req.query.valid ? req.query.valid : '',
        msg: req.query.msg ? req.query.msg : ''
    });
});

app.get('/about', (req, res) => {
    return res.render('about-us');
});

module.exports = app;