var path = require('path');
var http = require('http');
var server = http.createServer();
var express = require('express');
var app = express();
var socketio = require('socket.io');
var chalk = require('chalk');
var db = require('./db');
var Feedback = db.model('feedback');
var bodyParser = require('body-parser');

server.on('request', app);
var io = socketio(server);

io.on('connection', function (socket) {

    console.log('A new client has connected!');
    console.log(socket.id);

    socket.on('addEmoji', function (data) {
      socket.broadcast.emit('otherEmoji',data);
    });

    socket.on('newQuestion', function (data) {
      socket.broadcast.emit('updateQuestion',data);
    });

    socket.on('disconnect', function (payload) {
      console.log('Logged off');
    });
});

server.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/getStart', function (req, res, next) {
    Feedback.findAll({where: {message: 'start'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getQuestion', function (req, res, next) {
    Feedback.findAll({where: {message: 'question'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getSlow', function (req, res, next) {
    Feedback.findAll({where: {message: 'slow'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getCode', function (req, res, next) {
    Feedback.findAll({where: {message: 'code'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getGreat', function (req, res, next) {
    Feedback.findAll({where: {message: 'great'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getChallenging', function (req, res, next) {
    Feedback.findAll({where: {message: 'challenging'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getTime', function (req, res, next) {
    Feedback.findAll({where: {message: 'time'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getStop', function (req, res, next) {
    Feedback.findAll({where: {message: 'stop'}})
    .then(function(result){
      res.json(result);
    })
});

app.get('/getSurvey', function (req, res, next) {
    Feedback.findAll({where: {question: {$ne: null}}})
    .then(function(result){
      console.log("Server result: ", result);
      res.json(result);
    })
});

app.post('/addFeedback', function(req, res, next) {
  console.log("Reached server feedback: ", req.body);
  Feedback.create(req.body)
  .then(function(result){
    res.sendStatus(200);
  })
  .catch(next);
})

app.get('/summary', function (req, res) {
    res.sendFile(path.join(__dirname, '/browser/summary.html'));
});

app.get('/instructor', function (req, res) {
    res.sendFile(path.join(__dirname, 'masterIndex.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

db.sync({force:true}).catch(function (err) {
    console.error(chalk.red(err.stack));
    process.kill(1);
});

