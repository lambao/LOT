var Room = require('./Room')

function Player(initServerSocket, initClientSocket) {
    this.serverSocket =   initServerSocket;
    this.clientSocket = initClientSocket;
    console.log('-------------------------------------------');
    console.log('Init Player');
    console.log(this.clientSocket);
    console.log('-------------------------------------------');
}

/**
 * A Player create new Room
 * @param data.roomName:string
 *        data.player1Socket:string
 */
Player.prototype.createRoom = function(data) {
    console.log(data);
    console.log('this in create room');
    console.log(this);
    var room = Room.addRoom(data);
    console.log('Player - CreateRoom - clientSocket');
    console.log(this.clientSocket);
    this.join(room.roomId);
    this.clientSocket.emit('newRoomCreated', {roomId: room.roomId, roomName: room.roomName, mySocketId: clientSocket.id});
    this.sockets.emit('updateRoomList', {roomId: room.roomId, roomName: room.roomName});
}

module.exports = Player;
//module.exports.createRoom = Player.prototype.createRoom;

//
//var Player = function(initServerSocket, initClientSocket) {
//    var serverSocket = initServerSocket,
//        clientSocket = initClientSocket,
//        game = gameLogic.GameLogic(initServerSocket, initClientSocket);
//
//    /**
//     * A Player create new Room
//     * @param data.roomName:string
//     *        data.player1Socket:string
//     */
//    var createRoom = function(data) {
//        console.log('create Room');
//    };
//
//    /**
//     * A Player join a room
//     * @param data.roomId:string
//     *        data.player2Socket:string
//     */
//    var joinRoom = function(data) {
//
//    };
//
//    return {
//        createRoom: createRoom,
//        joinRoom: joinRoom
//    }
//};
//
//module.exports = Player;

