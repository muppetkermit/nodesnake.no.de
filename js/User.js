/**
 * @author Yıldıray Mutlu
 */


exports = module.exports = User;



var Snake = require(__dirname + '/Snake')
	,YMEvent = require(__dirname + '/YMEvent')
	,World = require(__dirname + '/World');



User.ID = 1;
User.DIED = "DIED_";
User.prototype = new YMEvent();
User.prototype.constructor = User;


function User (name){
	
	YMEvent.call(this);

	this.command = 0;
	this.score = 0;
	
	this.id = User.ID++;
	this.socketID = 0;
	this.socket = null;
	this.isDead = false;
	
	if(!name) name = "User_"+this.id;
	this.name = name;
	this.color = 'rgba('+World.randInt(0,255)+','+World.randInt(0,255)+','+150+',0.8)';
	this.snake = new Snake(World.randInt(0,World.SIZE_W),World.randInt(0,World.SIZE_H),5,1,this.id);
	this.length = function (){return this.snake.length};
	
	this.doStep = function ($dir){
		// this.snake.doStep($dir);
		//console.log(this.name +" USER_"+this.id + "   command : " + this.command);
		this.snake.doStep(this.command);
	}
	
	this.die = function (){
		console.log("DIE : " + this.id);
		this.dispatchEvent({type:User.DIED,target:this});
	}
	
	this.addScore = function(n){
		this.score += n;
		console.log(this.name + " score : " + this.score);
		this.snake.addTail();
	}
	
}

