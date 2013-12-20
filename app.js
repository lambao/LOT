/**
 * App Config
 */
APP_CONFIG = require('./app/config/GameConfig');

/**
 * Game Server module
 */

var GameServer = require('./app/GameServer');

var Login = require('./app/service/Login')

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socket = require('socket.io');
var util = require('util');

var app = express();



// all environments
// Using cookie parse for session
app.use(express.cookieParser());

app.use(express.session({secret: '1234567890QWERTY'}));

// Using body parse
app.use(express.bodyParser());

// Turn down the logging activity
app.use(express.logger('debug'));
//app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// Configuration for Express routes
app.configure(function() {
    // Service for signup
    app.post('/signup', Login.login);
    // Game homepage
    app.get('/game', Login.afterLogin);
    // Create room
    app.get('/creategame', routes.index)
});


var webServer = http.createServer(app).listen(APP_CONFIG.CONNECT_CONFIG.SERVER_PORT, function(){
    util.log('WebServer init at ' + APP_CONFIG.CONNECT_CONFIG.SERVER_HOST + ":" + APP_CONFIG.CONNECT_CONFIG.SERVER_PORT);
});

var socketServer = socket.listen(webServer);

socketServer.sockets.on('connection', function(client_socket){
    console.log('onConnection');
    console.log(this);
    util.log('A client connected: ' + client_socket.id );
    var gameServer = new GameServer(socketServer, client_socket);
    gameServer.welcomeMessage();
    gameServer.initRoomList();
    gameServer.bindEvent();

//    var gameServer = GameServer.GameServer(socketServer, client_socket);
//    gameServer.welcomeMessage();
//    gameServer.initRoomList();
//    gameServer.bindEvent();
});