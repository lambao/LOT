/**
 * Array of online users
 * user.name
 * user.socketId
 * @type {Array}
 */
var users = [];

function User(username, socketId) {
    this.name = username;
    this.socketId = socketId;
};

/**
 * Add new user
 * @param data.username:string
 *        data.socket:string
 */
User.prototype.addUser = function(data) {
    var userObj = new User(data.username, data.socket);
    users.push(userObj);
};

/**
 * Remove user
 * @param userSocketId
 */
User.prototype.removeUser = function(userSocketId) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].socketId === userSocketId) {
            users.splice(i, 1);
            return;
        }
    }
};

/**
 * Find user by socket id
 * @param socketId
 * @returns {*}
 */
User.prototype.findUserBySocket = function(socketId) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].socketId === socketId) {
            return users[i];
        }
    }
    return null;
};

//
//var User = function() {
//
//    /**
//     * Add new user
//     * @param data.username:string
//     *        data.socket:string
//     */
//    var addUser = function(data) {
//        var userObj = new Object();
//        userObj.name = data.username;
//        userObj.socketId = data.socket;
//        users.push(userObj);
//    };
//
//    /**
//     * Remove user
//     * @param userSocketId
//     */
//    var removeUser = function(userSocketId) {
//        for (var i = 0; i < users.length; i++) {
//            if (users[i].socketId === userSocketId) {
//                users.splice(i, 1);
//                return;
//            }
//        }
//    };
//
//    /**
//     * Fin user by socket id
//     * @param socketId
//     * @returns {*}
//     */
//    var findUserBySocket = function(socketId) {
//        for (var i = 0; i < users.length; i++) {
//            if (users[i].socketId === socketId) {
//                return users[i];
//            }
//        }
//        return null;
//    };
//
//    return {
//        addUser: addUser,
//        removeUser: removeUser,
//        findUserBySocket: findUserBySocket
//    }
//}

module.exports = User;
module.exports.addUser = User.prototype.addUser;
module.exports.removeUser = User.prototype.removeUser;
module.exports.findUserBySocket = User.prototype.findUserBySocket;