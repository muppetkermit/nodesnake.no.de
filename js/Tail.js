/**
 * @author Yıldıray Mutlu
 */

var World = require(__dirname + '/World');
exports = module.exports = Tail;
	
	
function Tail($x,$y,$tail,$user){
	var x = $x,
		y = $y;
	this.isHead = false;
	this.tail = $tail;
	this.user = $user;
		
	this._getNext = function (){
		return tail;
	}
	
	this.getXY = function (){
		// console.log(x,":",y+"=",$x,":",$y);
		return {x:x,y:y};
	}
	
	this.movePos = function($x,$y){
		x = $x;
		y = $y;
		//console.log('tail ' + x , y);
	}
	
	this.moveDir = function($dir){
		
		var pos = Tail.dirXY(x,y,$dir);
		
		//console.log("///////////////////// \n\n"+pos+"\n\n "+ $dir + "\n///////////////////");
		if(pos){
			x = pos.x;
			y = pos.y;
			//console.log('head ' + x , y);
			return true;
		}else{
			return false;
		}
	}
	
};

Tail.dirXY = function ($x,$y,$dir){
	switch($dir){
		case 0:
			$x--;
		break;
		case 1:
			$y--;
		break;
		case 2:
			$x++;
		break;
		case 3:
			$y++;
		break;
	}
	return {x:($x+World.SIZE_W)%World.SIZE_W,y:($y+World.SIZE_H)%World.SIZE_H};
};

