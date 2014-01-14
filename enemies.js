var enemies = new Array();

enemies.update = function(time){
	for(var i = 0; i < this.length; i++)
	{
		if(this[i] != null){
			this[i].update(time);
			if(this[i].isDead)
				this[i] = null;
		}
	}
}

enemies.draw = function(ctx){
	for(var i = 0; i < this.length; i++)
	{
		if(this[i] != null){
			this[i].draw(ctx);
		}
	}
}

enemies.add = function(part){
	var i;
	for(i = 0; i < this.length && i != -1; i++)
	{
		if(this[i] == null){
			this[i] = part;
			i = -2;
		}
	}
	if(i != -1){//was not added
		this[this.length] = part;
	}
}

function Slime(bounds){
	this.bounds = bounds;

	
	this.bounds.onCollide = function(speed){
		particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed);
	}

	this.vel = 0;
	this.jumpDelay = 1;
	this.col = new color(100,200,50,1);
}

Slime.prototype.update = function(time){
	this.bounds.vel.add(0,25 * time);		

	this.bounds.move(time);

	if(this.bounds.onGround && this.jumpDelay == -1){
		jumpDelay = 1;
	}
	else if(!this.bounds.onGround){
		jumpDelay = -1;
	}
	else{//on the ground, counting down
		jumpDelay -= time
		if(jumpDelay < 0){
			this.jump();
			jumpDelay = -1;
		}
	}

}

Slime.prototype.jump = function(){
	this.bounds.vel.set(1,-10);
}

Slime.prototype.isDead = function(){
	return false;
}

Slime.prototype.draw = function(ctx){
	ctx.fillStyle = this.col.create();
	ctx.fillRect(this.bounds.pos.x,this.bounds.pos.y,this.bounds.size.x,this.bounds.y);
	console.log("agh");
}
