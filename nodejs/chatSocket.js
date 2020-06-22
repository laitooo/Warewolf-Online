var api = require('./myNetwork');
var utils = require('./utils');



exports.createSocket = function(con,id){

	var nsp = io.of('/chats/chat' + id);
	console.log('chat socket created  with id : ' + id);

	nsp.on('connection', function (socket) {

		console.log('user connected')

		socket.on('join', function(userNickname) {
			console.log(userNickname +" : has joined the chat "  );
		    socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
		    api.loadChatMessages(con, id, function(messages) {
		    	socket.emit('loadChatMessages',messages);
		    })
		})

		socket.on('sendMessage', (senderNickname, senderId, messageContent, messageTime) => {
			console.log(senderNickname+" : " +messageContent)
			api.addChatMessage(con, 
				{idchat:id, sender:senderId, content:messageContent, time:messageTime},
				function(id) {
					
				});
		    socket.broadcast.emit('message', messageContent )
		})

		socket.on('disconnect', function() {
		    console.log('some user' +' has left ')
		    socket.broadcast.emit( "userdisconnect" ,' user has left')
		})

	});

};