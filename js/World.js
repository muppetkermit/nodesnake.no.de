


exports = module.exports = World;


var User = require(__dirname + '/User')
	,YMEvent = require(__dirname + '/YMEvent');


World.SIZE_W = 44;
World.SIZE_H = 20;
World.SQ = World.SIZE_W*World.SIZE_H;
World.FoodScore = 50;
World.DestScore = 100;

World.GOT_SCORE = "gotScore";

World.prototype = new YMEvent();
World.prototype.constructor = World;
	
World.randInt = function(a,b){
	return parseInt(Math.random() * (b-a)) + a;
}

function World(){

	YMEvent.call(this);

	var  w_W = World.SIZE_W
		,w_H = World.SIZE_H;
	
	
	var users = [];
	var food = null;
	this.table = [];
	var that = this;
	
	//var renderer = new Renderer();
	
	this.resetTable = function (){
		for (var i=0; i < w_H; i++) {
			this.table[i] = [];
			for (var j=0; j < w_W; j++) {
			  this.table[i][j] = {};
			};
		};
	}
	
	this.addUser = function (name){
		var s = new User(name);
		users.push(s);
		s.addEventListener(User.DIED,userDied);
		return s;
	}
	
	function userDied(e){
		console.log("USER DIED ....::::::....\n"+e.type+"\n"+e.target.id+"\n"+this.id+"\n");
	}
	
	this.removeUser = function(id){
		for (var i=0; i < users.length; i++) {
			if(users[i].id == id){
				users.splice(i,1);
			}
		};
	}
	
	this.toTable = function(){
		this.resetTable();
		var t;
		var xy;
		var user;
		var isHead;
		for (var i=0; i < users.length; i++) {
			user = users[i];
			t = user.snake.head;
			while(t){
				xy = t.getXY();
				//console.log(xy.x+ ","+xy.y+  + this.table.length + " : " + this.table[i].length);
				if(this.table[xy.y][xy.x].node)
					this.table[xy.y][xy.x].node.push(t);
				else
					this.table[xy.y][xy.x].node = [t];
				this.table[xy.y][xy.x].color = user.color;
				t = t.tail;
			}
		};
		
		didGotPoint(this.table);
		
		for (var j=0; j < this.table.length; j++) {
		  for (var k=0; k < this.table[j].length; k++) {
			whoIsDead(this.table[j][k].node);
		  };
		};
	};
	
	this.doStep = function(n){
		for (var i=0; i < users.length; i++) {
			user = users[i].doStep(n);
		};
		this.toTable();
		//renderer.render(context,table);
		return simpleTableD(this.table);
	}
	
	function simpleTable(table){
		var arr = [];
		for (var i=0; i < table.length; i++) {
			arr[i] = [];
		  for (var j=0; j < table[i].length; j++) {
		  	arr[i][j] = null;
		  	if(table[i][j].color){
		  		arr[i][j] = {color:table[i][j].color , isHead:getHeadsTails(table[i][j].node).heads.length};
			}
			if(table[i][j].food){
		  		arr[i][j] = {food:true};
			}
		  };
		};
		return arr;
	}
	
	
	function simpleTableD(table){
		var arr = [];
		for (var i=0; i < table.length; i++) {
		  for (var j=0; j < table[i].length; j++) {
		  	if(table[i][j].color){
		  		arr.push({color:table[i][j].color , isHead:getHeadsTails(table[i][j].node).heads.length,x:i,y:j});
			}
			if(table[i][j].food){
				arr.push({food:true , x:i, y:j})
			}
		  };
		};
		return arr;
	}
	
	
	function addFood(table){
		if(food){
			table[food.x][food.y].food = food;
		}else{
			var a = World.randInt(0,World.SIZE_H),
				b = World.randInt(0,World.SIZE_W);
			var cc = 0;
			while(table[a][b].node && (++cc < World.SQ)){
				a = World.randInt(0,World.SIZE_H),
				b = World.randInt(0,World.SIZE_W);
			}
			food = {x:a,y:b};
			table[a][b].food = food;
		}
	}
	
	function didGotPoint(table){
		if(food){
			var ht = getHeadsTails(table[food.x][food.y].node);
			
			if(ht && ht.heads.length == 1){
				var d = users.filter(findUser,ht.heads[0].user);
				d[0].addScore(World.FoodScore);
				that.dispatchEvent({type:World.GOT_SCORE,target:d[0]});
				food = false;
			}
			addFood(table);
		}else{
			addFood(table);
		}
	}
	
	function whoIsDead(nodes){
		var ht = getHeadsTails(nodes);
		
		if(!ht) return;
		
		var heads = ht.heads;
		var tails = ht.tails;
		
		if(tails.length > 0 && heads.length > 0){
			for (var j=0; j < heads.length; j++) {
				var d = users.filter(findUser,heads[j].user);
			  	d[0].die();
			};
		}
		
	}
	
	function getHeadsTails(nodes){
		if(!nodes) return null;
		
		var heads = [];
		var tails = [];
		for (var i=0; i < nodes.length; i++) {
			if(nodes[i].isHead)
				heads.push(nodes[i]);
			else
				tails.push(nodes[i]);
		}
		return {heads:heads , tails:tails};
	}
	
	function findUser(element,index,array){
		return (this == element.id);
	}
}
