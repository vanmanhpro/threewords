const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');

const homeRouter = require('./modules/home');
const userRouter = require('./modules/user');
const imageRouter = require('./modules/image');
const logRouter = require('./modules/log');
const wordRouter = require('./modules/word');
const uploadRouter = require('./modules/upload');
const notiRouter = require('./modules/noti');

const config = require('./config.json');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({defaultLayout: 'header'}));

mongoose.connect(config.connectionString, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('connect success');
	}
});

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.use('/log', logRouter);
app.use('/word', wordRouter)
app.use('/upload', uploadRouter)
app.use('/noti', notiRouter)

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || config.port;

app.listen(port, () => {
	console.log("Your work is online at " + port);
});
