/**
 * Array of online rooms
 * room.roomName
 * room.roomId
 * room.status
 * room.playersInRoom
 * room.player1Score
 * room.player2Score
 * room.player1Socket
 * room.player2Socket
 * @type {Array}
 */

var uuid = require('node-uuid');

var rooms = [];

function Room() {
    this.roomName = '';
    this.roomId = '';
    this.status = '';
    this.playersInRoom = '';
    this.player1Score = '';
    this.player1Socket = '';
    this.player2Score = '';
    this.player2Socket = '';
};

/**
 * Add new room
 * @param data.roomName:string
 *        data.player1Socket:string
 */
Room.prototype.addRoom = function(data) {
    var roomObj = new Room();
    roomObj.roomName = data.roomName;
    roomObj.roomId = uuid.v4();
    roomObj.status = 'Waiting';
    roomObj.playersInRoom = 1;
    roomObj.player1Score = 0;
    roomObj.player2Score = 0;
    roomObj.player1Socket = data.player1Socket;
    roomObj.player2Socket = 0;
    rooms.push(roomObj);
    return roomObj;
}

/**
 * Update a specific room
 * @param roomId:string
 * @param data.status:string
 *        data.playersInRoom:int
 *        data.player2Socket: string
 *        data.playerSocketId: string
 */
Room.prototype.updateRoom = function(roomId, data) {

    for (var i=0; i < rooms.length; i++) {
        if (rooms[i].roomId === roomId) {
            if (data.status != undefined) {
                rooms[i].status = data.status;
            };
            if (data.playersInRoom != undefined) {
                rooms[i].playersInRoom = data.playersInRoom;
            };
            if (data.player2Socket != undefined) {
                rooms[i].player2Socket = data.player2Socket;
            };
            if (data.playerSocketId != undefined) {
                if (rooms[i].player1Socket === data.playerSocketId) {
                    rooms[i].player1Score += 1;
                };
                if (rooms[i].player2Socket === data.playerSocketId) {
                    rooms[i].player2Score += 1;
                };
            };
            return rooms[i];
        }
    }
    return null;
};

/**
 * Delete a Room
 * @param roomId
 */
Room.prototype.deleteRoom = function(roomId){
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId === roomId) {
            rooms.splice(i, 1);
            return;
        }
    }
};

/**
 * Get all rooms
 * @returns {Array}
 */
Room.prototype.getRooms = function() {
    return rooms;
};

/*
 *  Find room by room id
 */
Room.prototype.findRoomById = function(id) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId === id) {
            return rooms[i];
        }
    }
    return null;
};

module.exports = Room;
module.exports.addRoom = Room.prototype.addRoom;
module.exports.updateRoom = Room.prototype.updateRoom;
module.exports.deleteRoom = Room.prototype.deleteRoom;
module.exports.getRooms = Room.prototype.getRooms;
module.exports.findRoomById = Room.prototype.findRoomById;

//
//var Room = function() {
//
//    /**
//     * Add new user
//     * @param data.roomName:string
//     *        data.player1Socket:string
//     */
//    var addRoom = function(data) {
//        var roomObj = new Object();
//        roomObj.roomName = data.roomName;
//        roomObj.roomId = uuid.v4();
//        roomObj.status = 'Waiting';
//        roomObj.playersInRoom = 1;
//        roomObj.player1Score = 0;
//        roomObj.player2Score = 0;
//        roomObj.player1Socket = data.player1Socket;
//        roomObj.player2Socket = 0;
//        rooms.push(roomObj);
//        return roomObj;
//    };
//
//    /**
//     * Update a specific room
//     * @param roomId:string
//     * @param data.status:string
//     *        data.playersInRoom:int
//     *        data.player2Socket: string
//     *        data.playerSocketId: string
//     */
//    var updateRoom = function(roomId, data) {
//
//        for (var i=0; i < rooms.length; i++) {
//            if (rooms[i].roomId === roomId) {
//                if (data.status != undefined) {
//                    rooms[i].status = data.status;
//                };
//                if (data.playersInRoom != undefined) {
//                    rooms[i].playersInRoom = data.playersInRoom;
//                };
//                if (data.player2Socket != undefined) {
//                    rooms[i].player2Socket = data.player2Socket;
//                };
//                if (data.playerSocketId != undefined) {
//                    if (rooms[i].player1Socket === data.playerSocketId) {
//                        rooms[i].player1Score += 1;
//                    };
//                    if (rooms[i].player2Socket === data.playerSocketId) {
//                        rooms[i].player2Score += 1;
//                    };
//                };
//                return rooms[i];
//            }
//        }
//        return null;
//    };
//
//    /**
//     * Delete a Room
//     * @param roomId
//     */
//    var deleteRoom = function(roomId){
//        for (var i = 0; i < rooms.length; i++) {
//            if (rooms[i].roomId === roomId) {
//                rooms.splice(i, 1);
//                return;
//            }
//        }
//    };
//
//    /**
//     * Get all rooms
//     * @returns {Array}
//     */
//    var getRooms = function() {
//        return rooms;
//    };
//
//    /*
//     *  Find room by room id
//     */
//    var findRoomById = function(id) {
//        for (var i = 0; i < rooms.length; i++) {
//            if (rooms[i].roomId === id) {
//                return rooms[i];
//            }
//        }
//        return null;
//    };
//
//    return {
//        addRoom: addRoom,
//        updateRoom: updateRoom,
//        getRooms: getRooms,
//        findRoomById: findRoomById
//    }
//}
//
//exports.Room = Room;