var indexhtml = 

'<!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8>
<meta name="viewport" content="width=620">
<title>Node - Snake World</title>
<link rel="stylesheet" href="css/html5demos.css">
<body>	
<script src="/socket.io/socket.io.js"></script>
<section id="wrapper">
    <header>
      <h1></h1>
    </header>

<style>
#chat { width: 97%; }
.them { font-weight: bold; }
.them:before { content: "them "; color: #bbb; font-size: 14px; }
.you { font-style: italic; }
.you:before { content: "you "; color: #bbb; font-size: 14px; font-weight: bold; }
#log {
  overflow: auto;
  max-height: 300px;
  list-style: none;
  padding: 0;
/*  margin: 0;*/
}

#log li {
  border-top: 1px solid #ccc;
  margin: 0;
  padding: 10px 0;
}
</style>
<article>
  <form>
    <input type="text" id="chat" placeholder="type and press enter to chat" />
    
  </form>
  <p id="status">Not connected</p>
  <p>Player: <span id="playing">0</span>  , Table: <span id="displaying">0</span></p>
  <ul id="log"></ul>
  <div id="highScores">
  	
  </div>
</article>
<script>
  
var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent("on" + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();
// 
// 
  var displaying = document.getElementById("displaying"),
  	playing = document.getElementById("playing"),
    log = document.getElementById("log"),
    chat = document.getElementById("chat"),
    form = chat.form,
    conn = {},
    highScores = document.getElementById("highScores"),
    state = document.getElementById("status");
    
  function log_(s){
  	log.innerHTML = "<li class=\"them\">" + s.replace(/[<>&]/g, function (m) { return entities[m]; }) + "</li>" + log.innerHTML;
  }
  
  function connected_(s){
  	//player:userLen,table:viewLen
  	displaying.innerHTML = s.table;
  	playing.innerHTML = s.player;
  	
  }
  
  function highScores_(arr){
  	if(!arr) return;
  	highScores.innerHTML = "";
  	var len = arr.length
  	while(--len >= 0) {
		highScores.innerHTML = "<li class='you'>" +(len+1) +"."+ arr[len].name+" :"+ arr[len].score + "</li>" + highScores.innerHTML;
  	};
  }
  
  
  addEvent(form, "submit", function (event) {
    event.preventDefault();
    // if we"re connected
    var s = chat.value.replace(/[<>&]/g, function (m) { return entities[m]; });
    console.log(s);
    sendData(s);
    log.innerHTML = "<li class=\"you\">" + s + "</li>" + log.innerHTML;
    chat.value = "";
    
  });
  
</script>

<canvas id="canvas"></canvas>


<script src="js/Render.js"></script>


<script>
	
    var d = window.document,
    w = d.width,
    h = d.height;
    
    var canvas = d.getElementById("canvas");
    
    canvas.width = 625;
    canvas.height = 625;
    
    if(!canvas)
    	canvas = d.body.appendChild(d.createElement("canvas"));
    context = canvas.getContext( "2d" );
    
    
	// var world = new World(context);
	// console.log("------");
	// world.doStep(0);
	//world.toTable();
	
	
	// addEvent(document, "keydown" , function(e){
		// //console.log("event " + e.keyCode);
		// world.doStep(e.keyCode-37);
	// });
	
	
	var renderer = new Renderer();
	
	function renderData(table){
		renderer.render(context,table);
	}
	
	
</script>

<script>

  var socket = io.connect("http://192.168.1.124:8001/draw");
  socket.on("startDraw", function (data) {
    console.log(data);

    socket.on("message", function (msg) {
    	console.log(msg);
      	log_(msg);
    });
    
    socket.on("user disconnected", function (msg) {
    	console.log(msg);
      	connected_(msg);
    });
        
    socket.on("info", function (msg) {
    	console.log(msg);
      	connected_(msg);
    	highScores_(msg.hs);
    });
    
    socket.on("refresh", function (data) {
    	//console.log(table);
    	//{table:table,hs:hsSimple}
    	renderData(data.table);
    	highScores_(data.hs);
    	
    });
    
  });
  
  function sendData(s){
    socket.emit("message", { data : s});
  }
  
  
</script>



</body>
</html>';
