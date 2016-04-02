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

enemies.draw = function(ctx) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] != null)
			{this[i].draw(ctx);}
	}
}

enemies.add = function(part) {
	var i;
	for(i = 0; i < this.length && i != -1; i++) {
		if(this[i] == null){
			this[i] = part;
			i = -2;
		}
	}
	if(i != -1) //was not added (need to grow)
		{this[this.length] = part;}
}

//get all enemies intersecting a point
enemies.getHere = function(pos){
	for(var i = 0; i < this.length; i++){
		if(this[i] != null)
			if(this[i].bounds.contains(pos))
				return this[i];
	}
	return null;
}

function Slime(bounds){
	this.bounds = bounds;
	this.bounds.onCollide = function(speed){
		particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed / 2);
	}

	this.vel = 0;
	this.jumpDelay = 1;
	this.col = new color(100,200,50,1);
	this.isDead = false;
}

Slime.prototype.update = function(time){
	//Gravity
	this.bounds.vel.add(0, 25 * time);		

	this.bounds.move(time);

	//handle jumping/jumping AI
	if(!this.bounds.onGround)
		{ this.jumpDelay = -1; }
	else{//on the ground, counting down
		if(this.jumpDelay == -1)
			{ this.jumpDelay = randOff(1,0.2); }
		this.jumpDelay -= time;
		this.bounds.vel.x -= time * this.bounds.vel.x * 0.9;
		if(this.jumpDelay < 0){
			this.jump();
			this.jumpDelay = -1;
		}
	}
}

Slime.prototype.jump = function(){
	this.bounds.vel.set(Math.random()>0.5?-1:1, randOff(-10,0.2));
	this.bounds.vel.x *= Math.random() + 1.5
}

Slime.prototype.draw = function(ctx){
	ctx.fillStyle = this.col.create();
	debug = this.bounds
	ctx.fillRect(this.bounds.pos.x * cellSize,this.bounds.pos.y * cellSize, this.bounds.size.x * cellSize,this.bounds.size.y * cellSize);
}
