var Room = require('./service/Room');
var User = require('./service/User');
var Player = require('./service/Player');

function GameServer(iniServerSocket, initClientSocket) {
    this.serverSocket = iniServerSocket;
    this.clientSocket = initClientSocket;
//    this.player = new Player(iniServerSocket, initClientSocket);
};

GameServer.prototype.welcomeMessage = function() {
    this.clientSocket.emit('connected', {message: 'You are connected'});
}

GameServer.prototype.initRoomList = function() {
    this.clientSocket.emit('initRoomList', {data: Room.getRooms});
}

GameServer.prototype.bindEvent = function(){
    var player = new Player(this.serverSocket, this.clientSocket);
    console.log('player in Game server');
    console.log(player);
    this.clientSocket.on('addUser', User.addUser);

    this.clientSocket.on('createRoom', player.createRoom);
};

module.exports = GameServer;
//module.exports.welcomeMessage = GameServer.prototype.welcomeMessage;
//module.exports.initRoomList = GameServer.prototype.initRoomList;
//module.exports.bindEvent = GameServer.prototype.bindEvent;

//
//var GameServer = function(iniServerSocket, initClientSocket){
//    var serverSocket = iniServerSocket,
//        clientSocket = initClientSocket,
//        player = Player.Player(iniServerSocket, initClientSocket);
//
//    var welcomeMessage = function(){
//        clientSocket.emit('connected', {message: 'You are connected'});
//    };
//
//    var initRoomList = function() {
//        clientSocket.emit('initRoomList', {data: Room.getRooms});
//    }
//
//    var bindEvent = function(){
//        clientSocket.on('addUser', User.addUser);
//        clientSocket.on('createRoom', player.createRoom);
//        clientSocket.on('joinRoom', player.joinRoom);
//    };
//
//    return {
//        welcomeMessage: welcomeMessage,
//        initRoomList: initRoomList,
//        bindEvent: bindEvent
//    }
//};
//
//exports.GameServer = GameServer;