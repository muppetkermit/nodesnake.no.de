/**
 * @author Yıldıray Mutlu
 */



var app = require('http').createServer(handler)
  , path = require("path");
var io = require('socket.io').listen(app)
  , fs = require('fs')
  , sys = require('sys')
  , World = require(__dirname + '/js/World');

io.set('log level', 1);

var port = process.env.PORT || 8002;

app.listen(port);

// console.log(process.ARGV);
// 
// console.log(process.env);

console.log("Server running on " + port);


var DEBUG = false;
var CACHE = false;
var HIGH_SCORE_NUM = 10;

var _HOST;
var port;
var index_html;
var joystick_html;



function handler (req, res) {
	
	var  readingFile = false;
	
	console.log("http request : " + req.url);
	// console.log("////////////////////////////////////\n\n REQUEST");
	// console.log(res);
	// console.log("\nREQUEST\n////////////////////////////////////");
	// headers: 
   // { host: 'localhost:8002',
   
   _HOST = _HOST || req.headers.host;
   
   // console.log(_HOST);
	
  if( req.url.indexOf(".js") > -1){
	  fs.readFile(__dirname + req.url,
	  function (err, data) {
	    if (err) {
	      res.writeHead(500);
	      return res.end('Error loading '+ req.url);
	    }
	
	    res.writeHead(200 ,{'Content-Type': 'text/javascript'});
	    res.end(data);
	  });
  }else if( req.url.indexOf(".png") > -1 || req.url.indexOf(".jpg") > -1 ){
	  fs.readFile(__dirname + req.url,
	  function (err, data) {
	    if (err) {
	      res.writeHead(500);
	      return res.end('Error loading '+ req.url);
	    }
	
	    res.writeHead(200);
	    res.end(data);
	  });
  }else if( req.url.indexOf("test__test") > -1){
	  fs.readFile(__dirname + "/test",
	  function (err, data) {
	    if (err) {
	      res.writeHead(500);
	      return res.end('Error loading /test');
	    }
	
	    res.writeHead(200, {'Content-Type': 'text/plain'});
	    res.end(data);
	  });
  }else if(req.url.indexOf(".css") > -1 ){
  	res.writeHead(200, {'Content-Type': 'text/css'});
    fs.createReadStream( path.normalize(path.join(__dirname, req.url)), {
      'flags': 'r',
      'encoding': 'binary',
      'mode': 0666,
      'bufferSize': 4 * 1024
    }).addListener("data", function(chunk){
      res.write(chunk, 'binary');
    }).addListener("close",function() {
      res.end();
    });
  }else if(req.url.indexOf("joystick") > -1 ){
  		
		joystick_html = joystick_html || (function(){
				readingFile = true;
				fs.readFile(__dirname + '/joystick.html',
					function (err, data) {
						if (err) {
				      		joystick_html = null;
				      		res.writeHead(500);
				      		return res.end('Error loading joystick.html');
						}
				
						console.log("INDEXING JOYSTICK.HTML");
						//var len = data.length;
						//console.log(len + " bytes: " + data.toString('utf8', 0, len));	
						//var s = data.toString('utf8', 0, len);
						//joystick_html = s.replace("http://localhost:8001", _HOST);
						if(CACHE)
							joystick_html = data;
			
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(data);
		  			}
  				);
			})();
		if(!readingFile){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(joystick_html);
		}
  }else{
  		
		index_html = index_html || (function(){
				readingFile = true;
				fs.readFile(__dirname + '/index_.html',
					function (err, data) {
						if (err) {
							index_html = null;
							res.writeHead(500);
							return res.end('Error loading index.html');
						}
						console.log("INDEXING INDEX.HTML");
						//var len = data.length;
						//console.log(len + " bytes: " + data.toString('utf8', 0, len));	
						//var s = data.toString('utf8', 0, len);
						//index_html = s.replace("http://localhost:8001", _HOST);
						if(CACHE)
							index_html = data
			
						res.writeHead(200, {'Content-Type': 'text/html'});
						res.end(data);
					}
				);
			})();
		if(!readingFile){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(index_html);
		}
  }
}

var socketLen = 0;
var userLen = 0;
var viewLen = 0;


var player = io
	.of('/play')
	.on('connection',function(socket){
		
		socketLen++;
		
		
		
  		socket.emit('startIT', "starter");
  		
		socket.on('newUser', function (name) {
			socket.started = true;
			userLen++;
			
			gameBoard.emit('info', {player:userLen,table:viewLen});
			
			var s = world.addUser(name);
			s.socketID = socket.id;
			s.socket = socket;
			socket.user = s;
			
			socket.emit('userdata',{self:{color:s.color , name:s.name}});
			
			if(gameInterval < 0){
				console.log("INTERVAL STARTED");
				gameInterval = setInterval(_loop,200);
				saveInterval = setInterval(saveScoresToFile,10*60*1000);
			}
			
			console.log("NEW USER ADDED : "+s.name);
		});
		
		socket.on('command', function (data) {
			console.log("COMMAND FROM USER "+socket.user.id+ " : " +data.data + " ... " + socket.user.command);
			socket.user.command = data.data;
		});
		
		socket.on('disconnect', function () {
			socketLen--;
			if(socket.started)
				userLen--;
			var n = "user";
			if(socket.user){
				world.removeUser(socket.user.id);
				n = socket.user.name;
			}
			
			console.log(n+' disconnected');
			socket.emit('disconnected', userLen);
			
			
			if(userLen == 0){
				console.log("INTERVAL STOPPED");
				clearInterval(gameInterval);
				clearInterval(saveInterval);
				saveScoresToFile();
				saveInterval = -1;
				gameInterval = -1;
			}
			//io.sockets.emit('info', socketLen);
		});
		
		
		socket.on('message', function (data) {
			console.log("message : " + data.data +" = " + data.color);
			//io.sockets.emit('message', data.data);
			gameBoard.emit('message', {data:data.data,color:data.color});
		});
			
	
	});
	
	
var gameBoard = io
		.of("/draw")
		.on("connection" , function(socket){
			//console.dir(socket);
			
			// console.log("////////////////////////////////////\n\n SCOKET");
			// console.log(socket);
			// console.log("SCOKET \n////////////////////////////////////");
	
			socketLen++;
			viewLen++;
			
			console.log("boardLog");
			
			socket.emit('startDraw', "drawStarter");

			gameBoard.emit('info', {player:userLen,table:viewLen,hs:hsSimple(true),
									dim:{width:World.SIZE_W,height:World.SIZE_H}});
			
			socket.on('message', function (data) {
				console.log("message : " + data.data);
				//io.sockets.emit('message', data.data);
				socket.broadcast.emit('message', data.data);
			});
			
			socket.on('disconnect', function () {
				socketLen--;
				viewLen--;
				console.log('table disconnected');
				//io.sockets.emit('info', socketLen);
			});
  
		});
		
// console.dir(gameBoard);
// console.log("\n\n\n\n\n\n\n..............")
// console.dir(io.sockets);


//console.dir(io);

var gameInterval = -1;
var saveInterval = -1;
var hsChanged = false;
var highScores = []; /*[	{name:"ym",score:100,socketID:123,id:-10000 , color:"#e58658"},
					{name:"ym_1",score:370,socketID:124,id:-10100, color:"#c72dee"},
					{name:"ym_2",score:320,socketID:125,id:-100010, color:"#a5d048"},
					{name:"yildiray3",score:270,socketID:126,id:-100300, color:"#8a42d3"},
					{name:"ym",score:220,socketID:127,id:-100200, color:"#e32e66"},
					{name:"ym1",score:170,socketID:128,id:-104000, color:"#f17e7e"},
					{name:"ym2",score:120,socketID:129,id:-105000, color:"#4652ef"},
					{name:"ym3",score:70,socketID:130,id:-100600, color:"#0ee3cc"},
					{name:"ym4",score:20,socketID:131,id:-100070, color:"#fc049c"}];*/
					


// fs.writeFile("test", JSON.stringify(highScores) , function(err) {
    // if(err) {
        // console.log("ERROR ::: " + err);
    // } else {
        // console.log("The file was saved!");
    // }
// });



fs.readFile('test',function (err, data) {
						if (err) {
							arr = [];
						}
						
						//console.log(len + " bytes: " + data.toString('utf8', 0, len));	
						//var s = data.toString('utf8', 0, len);
						//joystick_html = s.replace("http://localhost:8001", _HOST);
						try{
							highScores = JSON.parse(data);
						}catch(err){
							console.log("err " + err);
						}
		  			}
  				);
  				
 


var world = new World();
world.addEventListener(World.GOT_SCORE,userGotScore);


var table;

var saveScoresToFile = function(){
	fs.writeFile("test", JSON.stringify(highScores) , function(err) {
	    if(err) {
	        console.log("ERROR ::: " + err);
	    } else {
	        console.log("The file was saved!");
	    }
	});
}

var _loop = function (){
	table = world.doStep();
	//io.sockets.emit('refresh', table);
	gameBoard.emit('refresh', {table:table,hs:hsSimple(hsChanged)});
	//console.log("REFRESHED");
}

function hsSimple(b){
	if(!b) return false;
	
	var arr = []
	var len = highScores.length;
	for (var i=0; i < len && i < HIGH_SCORE_NUM; i++) {
		arr[i] = {name:highScores[i].name,score:highScores[i].score,color:highScores[i].color};
	}
	hsChanged = false;
	return arr;
}

function isOnList(e){return (e.name == this.name && e.id == this.id && e.socketID == this.socketID);}
function userGotScore(e){
	hsChanged=false;
	var len = highScores.length;
	var target = e.target;
	var score = e.target.score;
	var name = e.target.name;
	var sckt = e.target.socket;
	var c = e.target.color;	
	var socketID = e.target.socketID;
	var id = e.target.id;	
	
	if(highScores[len-1] > score) return;
	
	var obj;
	var hs;
	// filter first 10 element insert to list anyway
	var s = highScores.filter(isOnList,e.target);
	if(s.length){
		while(--len>=0){
			hs = highScores[len];
			if(target.name == hs.name && target.id == hs.id && target.socketID == hs.socketID){
				obj = highScores.splice(len,1);
				obj = obj[0];
				obj.score = score;
				break;
			}
		}
	}else{
		obj = {name:name,score:score,socketID:socketID,id:id,color:c};
	}
	
	len = highScores.length;
	if(len == 0) highScores.push(obj);
	while(--len>=0){
		if(highScores[len].score>score){
			highScores.splice(len+1,0,obj);
			break;
		}
		if(len == 0){
			highScores.unshift(obj);
		}
	}
	
	if(sckt)
		sckt.emit("score",{score:score,place:len+2});
	
	hsChanged=true;
}

function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack);
    }
  } else {
    console.log('dumpError :: argument is not an object');
  }
}

// io.sockets.on('connection', function (socket) {
//   
  // socket.emit('startIT', "starter");
//   
  // socketLen++;
  // io.sockets.emit('info', socketLen);
//   	
  // socket.on('event', function (data) {
    // //console.log(io.sockets);
  	// io.sockets.emit('event', socketLen);
  // });
//   
  // socket.on('message', function (data) {
    // console.log("message : " + data.data);
  	// //io.sockets.emit('message', data.data);
    // socket.broadcast.emit('message', data.data);
  // });
//   
//   
  // socket.on('disconnect', function () {
  	// socketLen--;
//   	
  	// var n = "user";
  	// if(socket.user){
  		// world.removeUser(socket.user.id);
  		// n = socket.user.name;
  	// }
//   	
    // console.log(n+' disconnected');
    // socket.emit('disconnected', socketLen);
//     
//     
    // if(socketLen == 0){
    	// console.log("INTERVAL STOPPED");
    	// clearInterval(gameInterval);
    	// gameInterval = -1;
    // }
    // //io.sockets.emit('info', socketLen);
  // });
//   
// });


