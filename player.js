var player = new Object();
player.bounds = new bounds(new Vector(5,0), new Vector(0.5,0.8));

player.bounds.onCollide = function(speed){
	particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed);
}

player.update = function(time){
	this.bounds.vel.add(0,15 * time);
	
	if(keyState[37])
		this.bounds.vel.x = -3;
	else if(keyState[39])
		this.bounds.vel.x = 3;
	else 
		this.bounds.vel.x = 0;

	if(keyState[32]){
		this.bounds.vel.y = -6.5;
		keyState[32] = false;
	}

	this.bounds.move(30/1000);
}

player.draw = function(ctx){
	ctx.fillRect(32 * this.bounds.pos.x, 32 * this.bounds.pos.y, 32 * this.bounds.size.x, 32 * this.bounds.size.y);
}
