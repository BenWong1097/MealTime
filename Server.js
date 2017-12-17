var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Make the views folder static when client requests pages
app.use(express.static('.'));

io.on('connection', function(socket){
	console.log('Connection.');
});

http.listen(8081, function(){

});
//connection.end();
exports = app;