/**
 * @author Yıldıray Mutlu
 */


//var User = require(__dirname + '/User');

exports = module.exports = Snake;

var World = require(__dirname + '/World');
var Tail = require(__dirname + '/Tail');

	
function Snake ($x,$y,$len,$dir,$user){
	
	var dir = $dir;
	
	this.length = $len;
	this.user = $user;
	
	this.head = null;
	this.end = null;
	
	this.getHead = function (){
		return this.head;
	}
	
	this.doStep = function($dir){
		dir = (dir + $dir + 4) % 4;
		
		var c = this.head;
		var t = c.tail;
		var pos = c.getXY();
		var prevP = c.getXY();
		var moved = c.moveDir(dir);
		//TODO: add moved state for rest of nodes
		//console.log("movedmovedmovedmoved " + moved);
		while(t){
			pos = t.getXY();
			t.movePos(prevP.x,prevP.y);
			c = t;
			prevP = pos;
			t = c.tail;
		}
		
	}
	
	this.createSnake = function($x,$y,$len,$dir,$user){
		
		this.head = new Tail($x,$y,null,$user);
		
		this.head.isHead = true;
		//var s = new Snake($x,$y);
		var t = null;
		var c = this.head;
		var pos = null;
		// // //
		//console.log('head ' + $x,$y);
		
		for(var i=0;i<$len;i++){
			pos = c.getXY();
			pos = Tail.dirXY(pos.x,pos.y,$dir);
			// // // 
			//console.log('tail ' + pos.x,pos.y);
			t = new Tail(pos.x,pos.y,null,$user);
			c.tail = t;
			c = t;
		}
		this.end = c;
	}
	
	this.addTail = function(){
		var pos = this.end.getXY();
		pos = Tail.dirXY(pos.x,pos.y,$dir);
		// // // 
		//console.log('tail ' + pos.x,pos.y);
		var t = new Tail(pos.x,pos.y,null,this.user);
		this.end.tail = t;
		this.end = t;
	}
	
	
	this.createSnake($x,$y,$len,$dir,$user);

	
};

// function dirXY($x,$y,$dir){
	// //console.log("///////////////////// \n "+ $dir + "\n///////////////////");
	// switch($dir){
		// case 0:
			// $x--;
		// break;
		// case 1:
			// $y--;
		// break;
		// case 2:
			// $x++;
		// break;
		// case 3:
			// $y++;
		// break;
	// }
	// return {x:($x+World.SIZE_W)%World.SIZE_W,y:($y+World.SIZE_H)%World.SIZE_H};
// };


