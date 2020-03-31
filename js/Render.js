/**
 * @author Yıldıray Mutlu
 */

Renderer.boxW = 17;
Renderer.boxH = 17;
function Renderer(){
	
	var box_W = Renderer.boxW;
	var box_H = Renderer.boxH;
	
	this.render = function(context,$table){
		context.save();
		context.setTransform(1,0,0,1,0,0);
		// Will always clear the right space
		context.clearRect(0,0,context.canvas.width,context.canvas.height);
		context.restore();
	
		var c;
		var f = false;
		for (var i=0; i < $table.length; i++) {
			for (var j=0; j < $table[i].length; j++) {
				if(!$table[i][j]) continue;
				c = $table[i][j].color;
				if(c){
					x = i * box_W; y = j * box_H;
					if($table[i][j].isHead > 0){
						c = c.substr(0,c.lastIndexOf(",")+1)+"1)";
					}
				    context.fillStyle = c;
				    context.fillRect(y, x , box_W , box_H);
				}
				
				if(f === false){
					f = $table[i][j].food;
					if(f){
						x = i * box_W + box_W/4; y = j * box_H + box_W/4;
					    context.fillStyle = '#f80';
					    context.fillRect(y, x , box_W-box_W/2 , box_H-box_W/2);
					}else{
						f = false;
					}
				}
				
			};
		}
	};
	this.renderD = function(context,$table){
		context.save();
		context.setTransform(1,0,0,1,0,0);
		// Will always clear the right space
		context.clearRect(0,0,context.canvas.width,context.canvas.height);
		context.restore();
	
		var c;
		var f = false;
		for (var i=0; i < $table.length; i++) {
				c = $table[i].color;
				if(c){
					x = $table[i].x * box_W; y = $table[i].y * box_H;
					if($table[i].isHead > 0){
						c = c.substr(0,c.lastIndexOf(",")+1)+"1)";
					}
				    context.fillStyle = c;
				    context.fillRect(y, x , box_W , box_H);
				}
				
				if(f === false){
					f = $table[i].food;
					if(f){
						x = $table[i].x * box_W + box_W/4; y = $table[i].y * box_H + box_W/4;
					    context.fillStyle = '#f80';
					    context.fillRect(y, x , box_W-box_W/2 , box_H-box_W/2);
					}else{
						f = false;
					}
				}
		}
	};
	
	//TODO:
	/*
	 * 
	 * draw background here and cache it
	 * 
	 * 
	 */
    
}
