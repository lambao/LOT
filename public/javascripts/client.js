;
jQuery(function($){
    'use strict';

    var IO = {
        /**
         * This is called when the page is displayed. It connects the Socket.IO client
         * to the Socket.IO server
         */
        init: function() {
            // Default connect to server serve this file
            IO.socket = io.connect();
            IO.bindEvents();
        },

        /**
         * While connected, Socket.IO will listen to the following events emitted
         * by the Socket.IO server, then run the appropriate function.
         */
        bindEvents : function() {
            IO.socket.on('connected', IO.onConnected );
            IO.socket.on('initRoomList', IO.onInitRoomList );
            IO.socket.on('newRoomCreated', IO.onNewRoomCreated );
            IO.socket.on('updateRoomList', IO.onUpdateRoomList );
            IO.socket.on('playerJoinedRoom', IO.onPlayerJoinedRoom );
            IO.socket.on('updateScore', Game.onUpdateScore);
            IO.socket.on('startGame', Game.onStartGame);
            IO.socket.on('gameOver', Game.onGameOver);
            IO.socket.on('error', IO.error );
        },

        /**
         * The client is successfully connected!
         */
        onConnected : function(data) {
            console.log('onConnected');
            console.log(IO.socket.socket.sessionid);
            // Cache a copy of the client's socket.IO session ID on the App
            Game.mySocketId = IO.socket.socket.sessionid;
            Game.myRole = 'Player';
            Game.playerName = Game.$userName.text();

            // Add user
            var user = new Object();
            user.username = Game.playerName;
            user.socket = Game.mySocketId;
            IO.socket.emit('addUser', user);

            // Welcome message from server
            console.log(data.message);
        },

        onInitRoomList : function(data) {
            var tmp = data.data;
            if (tmp != undefined) {
                var dataLength = tmp.length;
                if (dataLength > 0) {
                    for (var i=0;i<dataLength;i++)
                    {
                        var newRoomLink = $('<li><a href=\'#\'>' + tmp[i].roomName + '</a> Room id: ' + tmp[i].roomId + '</li>').bind('click',
                            { roomId: tmp[i].roomId, clientSocketId: Game.mySocketId }, function(event){
                                var sendData = new Object();
                                sendData.roomId = event.data.roomId;
                                sendData.player2Socket = event.data.clientSocketId;
                                IO.socket.emit('joinRoom', sendData);
                            });
                        $('#roomlist').append(newRoomLink);
                    }
                }
            }
        },

        /**
         * A new game has been created and a random game ID has been generated.
         * @param data {{ roomId: int, roomName:string, mySocketId: * }}
         */
        onNewRoomCreated : function(data) {
            Game.roomId  = data.roomId;
            Game.playerRole = 'Host';
            Game.numPlayersInRoom = 1;
            $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
        },


        /**
         * Update room list to all client
         * @param data { roomId: string, roomName: string }
         */
        onUpdateRoomList : function (data) {
            var newRoomLink = $('<li><a href=\'#\'>' + data.roomName + '</a> Room id: ' + data.roomId + '</li>').click(function(e) {
                var sendData = new Object();
                sendData.roomId = data.roomId;
                sendData.player2Socket = Game.mySocketId;
                IO.socket.emit('joinRoom', sendData);
            });
            $('#roomlist').append(newRoomLink);
        },

        /**
         * A player Joined Room
         * @param data.roomName:string
         *        data.roomId: string
         */
        onPlayerJoinedRoom : function(data) {
            Game.numPlayersInRoom = 2;
            Game.roomId = data.roomId;
            Game.countDown(Game.$countDown, 5, function(){
                var sData = new Object();
                sData.roomId = Game.roomId;
                sData.playerSocketId = Game.mySocketId;
                IO.socket.emit('readyGame', sData)
//                console.log('callback');
//                var clickButton = $('<button id="clickBtn">Yup</button>').click(function(e){
//                    var sData = new Object();
//                    sData.roomId = Game.roomId;
//                    sData.playerSocketId = Game.mySocketId;
//                    IO.socket.emit('readyGame', sData)
////                    IO.socket.emit('clickedButton', sData);
//                });
//                $('#gameArea').append(clickButton);
            });
        },

        /**
         * An error has occurred.
         * @param data
         */
        error : function(data) {
            alert(data.message);
        }

    };

    var Game = {

        /**
         * Room which player joined
         */
        roomId: '',

        /**
         * Player Or Host
         */
        playerRole: '',

        /**
         * Player Socket Id
         */
        playerSocketId: '',

        /**
         * Player name
         */
        playerName: '',

        /**
         * Number players in Room
         */
        numPlayersInRoom: 0,

        /**
         * This runs when the page initially loads.
         */
        init: function () {
            Game.cacheElements();
            Game.bindEvents();

            // Initialize the fastclick library
            //FastClick.attach(document.body);
        },

        cacheElements: function () {
            Game.$doc = $(document);
            Game.$roomList = $('#roomlist');
            Game.$userName = $('#username');
            Game.$roomName = $('#roomName');
            Game.$gameArea = $('#gameArea');
            Game.$countDown = $('#countDown');
            Game.$score = $('#gameScore');
            Game.$result = $('#result');
        },

        bindEvents: function() {
            Game.$doc.on('click', '#btnCreate', Game.onCreateClick);
        },

        /**
         * User create room sData.roomName:string
         */
        onCreateClick: function() {
            var sData = new Object();
            sData.roomName = Game.$roomName.val() || 'Nhao zo';
            sData.player1Socket = Game.mySocketId;
            IO.socket.emit('createRoom', sData);
            console.log('create room');
        },

        /**
         * Update Score
         * @param data.roomId, data.player1Socket, data.player1Score, data.player1Name, data.player2Socket, data.player2Score, data.player2Name
         */
        onUpdateScore: function(data) {
            Game.$score.text(data.player1Name + ' : ' + data.player1Score + ' | '  + data.player2Name + ' : ' + data.player2Score);
        },

        /**
         * Start Game
         * @param data.roomID, data.gameTime
         */
        onStartGame: function(data) {
            Game.numPlayersInRoom = 2;
            Game.roomId = data.roomId;
            var clickButton = $('<button id="clickBtn">Yup</button>').click(function(e){
                var sData = new Object();
                sData.roomId = Game.roomId;
                sData.playerSocketId = Game.mySocketId;
                IO.socket.emit('clickedButton', sData);
            });
            $('#gameArea').append(clickButton);

            Game.countDown(Game.$countDown, data.gameTime, function(){
                console.log('callback');
            });
        },


        /**
         * On Game Over
         * @param data.winner:string, data.winnerScore:int, data.isEqual
         */
        onGameOver: function(data) {
            console.log(data);
            if (data.isEqual == undefined) {
                Game.$result.text('Winner is: ' + data.winner + ' with score: ' + data.winnerScore);
            } else {
                Game.$result.text('Fucking');
            };

            IO.socket.emit('outRoom', {roomId: Game.roomId});
        },

        /**
         * CountDown to start game
         * @param $el
         * @param startTime
         * @param callback
         */
        countDown : function( $el, startTime, callback) {

            console.log(callback);
            // Display the starting time on the screen.
            $el.text(startTime);

            // console.log('Starting Countdown...');

            // Start a 1 second timer
            var timer = setInterval(countItDown,1000);

            // Decrement the displayed timer value on each 'tick'
            function countItDown(){
                startTime -= 1
                $el.text(startTime);

                if( startTime <= 0 ){
                    // console.log('Countdown Finished.');

                    // Stop the timer and do the callback.
                    clearInterval(timer);
                    callback();
                    return;
                }
            }

        }
    };

    IO.init();
    Game.init();

}($));

