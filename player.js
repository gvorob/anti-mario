var player = new Object();
player.bounds = new bounds(new Vector(5,0), new Vector(0.5,0.8));

player.update = function(){
	this.bounds.vel.add(0,0.5);
	
	if(keyState[37])
		this.bounds.vel.x = -2;
	else if(keyState[39])
		this.bounds.vel.x = 2;
	else 
		this.bounds.vel.x = 0;

	if(keyState[32]){
		this.bounds.vel.y = -8;
		keyState[32] = false;
	}

	this.bounds.move(30/1000);
}

player.draw = function(ctx){
	ctx.fillRect(32 * this.bounds.pos.x, 32 * this.bounds.pos.y, 32 * this.bounds.size.x, 32 * this.bounds.size.y);
}
