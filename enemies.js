var Constants = Constants || {};
Constants.enemies = {
	slime: {
		size: new Vector(0.7, 0.7),
		constructor: Slime,
	},
	goomba: {
		size: new Vector(0.95,0.9),
		speed: 2,
		maxAccel: 3,
		jumpSpeed: 10,
		color: new color(100, 10, 0, 1),
		deathAnimTime: 1,
		constructor: Goomba,
	},
	gravity: 15,

};

var enemies = new Array();

//Calls callback with (enemies[i], i)
enemies.forEach = function(callback) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] != null){
			callback(this[i], i);
		}
	}
}

enemies.update = function(time){
	for(var i = 0; i < this.length; i++) {
		if(this[i] != null){
			this[i].update(time);
			if(this[i].isDead)
				this[i] = null;
		}
	}
}

enemies.draw = function(ctx) {
	this.forEach(function(e) { e.draw(ctx); });
}

enemies.add = function(part) {
	var i;
	for(i = 0; i < this.length; i++) {
		if(this[i] == null){
			this[i] = part;
			break;
		}
	}
	if(i == this.length) //was not added (need to grow)
		{this[this.length] = part;}
}

enemies.clearAll = function() {
	enemies.length = 0;
}

//get all enemies intersecting a point
//returns a list
enemies.getHere = function(pos){
	var results = [];
	this.forEach(function(e) {
			if(e.bounds.contains(pos))
				{ results.push(e); }
		});
	return results;
}

//get all enemies whose centers are within a certain distance
//returns a list
enemies.getWithinDistance = function(pos, range){
	var results = [];
	this.forEach(function(e) {
			var displacement = e.bounds.getCenter().subtractV(pos);
			if(displacement.getLength() <= range)
				{ results.push(e); }
		});
	return results;
}

//get all enemies who collide with a bounding box
//returns a list
enemies.getColliding = function(bounds){
	var results = [];
	this.forEach(function(e) {
			if(e.bounds.collidesWith(bounds))
				{ results.push(e); }
		});
	return results;
}

enemies.simpleDraw = function(ctx) {
	ctx.fillStyle = this.col.create();
	this.bounds.draw(ctx)
}

enemies.simpleUpdate = function(that, time){
	//Gravity
	that.bounds.vel.add(0, Constants.enemies.gravity * time);		
	that.bounds.moveSimple(time);
}


function Slime(bounds){
	this.bounds = bounds;
	this.type = "slime";
	this.bounds.onCollide = function(speed){
		particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed / 2);
	}

	this.jumpDelay = 1;
	this.col = new color(100,200,50,1);
	this.isDead = false;
}

Slime.prototype.draw = enemies.simpleDraw;
Slime.prototype.update = function(time){
	enemies.simpleUpdate(this, time); //handle gravity

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

//returns it
function makeEnemyOfType(e_type, pos) {
	var e_constants = Constants.enemies[e_type];
	if(e_constants == null)
		throw "no such enemy '" + e_type + "'";

	var tempBounds = new bounds(pos.clone(), e_constants.size.clone());
	return new e_constants.constructor(tempBounds);
}

//adds it
function spawnEnemyOfType(e_type, pos)
	{ enemies.add(makeEnemyOfType(e_type, pos)); }

function Goomba(bounds) {
	this.bounds = bounds;
	this.type = "goomba"
	this.col = Constants.enemies.goomba.color;
	this.dying = -1; //if >0, is in dying animation
	this.isDead = false;
	this.heading = 1;
	this.speed = Constants.enemies.goomba.speed;
	this.bounds.vel.x = this.heading * this.speed;
}

Goomba.prototype.update = function(time) {
	if(this.dying == -1) { //is alive
		this.bounds.vel.add(0, Constants.enemies.gravity * time);		
		this.bounds.moveVertical(time);

		//walk/bounce
		var collidedX = this.bounds.moveHorizontal(time);
		if(collidedX) {
			this.heading *= -1;
			this.bounds.vel.x *= -1;
		}

		var targetVelX = this.speed * this.heading;
		var accel = Constants.enemies.goomba.maxAccel * time;
		this.bounds.vel.x = u.approach(targetVelX, this.bounds.vel.x, accel);
	} else {  //is dying
		this.dying -= time;
		this.bounds.vel.add(0, Constants.enemies.gravity * time);		
		this.bounds.moveVertical(time);
		if(this.dying < 0)
			{ this.isDead = true; }
	}
}

Goomba.prototype.die = function() {
	//particles.doBloodExplosion(this.bounds.pos.clone(), 1);
	this.dying = Constants.enemies.goomba.deathAnimTime;
	
	//flatten downwards
	var oldBottom = this.bounds.getBottom();
	this.bounds.size.y *= 0.2;
	this.bounds.setBottom(oldBottom);

	//widen outwards
	var widenedBy = this.bounds.size.x * 0.5
	this.bounds.size.x += widenedBy;
	this.bounds.pos.x -= widenedBy / 2;

	this.bounds.colliding = false;
}

Goomba.prototype.draw = enemies.simpleDraw;

Goomba.prototype.jump = function() {
	if(this.bounds.onGround)
		{ this.bounds.vel.y -= Constants.enemies.goomba.jumpSpeed; }
}
