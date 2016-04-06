var Constants = Constants || {};
{
	var tempSize = new Vector(0.7, 0.8);
	Constants.player = {
		size                : tempSize,
		movespeed           : 5,
		gravity             : 30,
		jumpspeed           : 15,
		bouncespeed         : 10,
		jumpstates          : {
			NOT_PRESSED: 0,
			BUTTON:  1,
			BUTTON_IN_AIR: 2,
			},
		jetpackspeed        : 4,
		jetpackburst        : 0.4,
		jetpackburstspeed   : -12,
		jetpackOffset       : [
			new Vector(-0.05            , 0),
			new Vector(0.05 + tempSize.x, 0),
			],
		waterCannonOffset   : [
				new Vector(-0.25 + tempSize.x, 0.4),
				new Vector( 0.25           , 0.4),
				],
	};
}

var Player;
{ //Player declaration scope
var s = Constants.player.jumpstates;

Player = function(){
	this.bounds = new bounds(new Vector(2,1), Constants.player.size.clone());

	this.bounds.onCollide = function(speed){
		particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed);
	}

	this.offset = Constants.player.jetpackOffset[0].clone();
	this.pack = new jetpackEmitter(this.bounds.pos, this.offset);
	this.waterCannon = new waterSprayEmitter();
	this.facing = 1;

	this.movespeed    = Constants.player.movespeed;
	this.gravity      = Constants.player.gravity;
	this.jumpspeed    = Constants.player.jumpspeed;
	this.bouncespeed  = Constants.player.bouncespeed;
	this.jetpackspeed = Constants.player.jetpackspeed;

	this.jetMode = "physics";

	this.jumpState = s.NOT_PRESSED;
	this.isDead = false;
}

Player.prototype.update = function(time){
	if(this.isDead) { return true; }

	//Get gravitied
	this.bounds.vel.add(0, this.gravity * time);
	this.bounds.vel.x = 0;	
	
	//Move left/right
	if(keyState[37] || keyState[65])
		this.bounds.vel.x = -1 * this.movespeed;
	if(keyState[39] || keyState[68])
		this.bounds.vel.x += this.movespeed;

	//Update facing (for jetpack mount point)
	if(this.bounds.vel.x != 0) {
		this.facing = this.bounds.vel.x>0?1:-1;
		this.offset.setV(Constants.player.jetpackOffset[this.getFacingIndex()]);
	}

	//Move by velocity
	this.bounds.moveSimple(time);

	//handle enemy collisions
	if(!editMode)
		{ this.handleCollisions(time); }

	//Handle Jump input
	var jumpKeyState = keyState[87] || keyState[38] || keyState[90];
	this.handleJumping(jumpKeyState, time);

	//Handle water cannon input
	if(keyState[88]){ //'x'
		var temp = this.bounds.pos.clone();
		temp.addV(Constants.player.waterCannonOffset[this.getFacingIndex()]);
		this.waterCannon.update(time,temp,this.facing);
	}
}

Player.prototype.handleCollisions = function(time) {
	var that = this;
	var collidedEnemies = enemies.getColliding(this.bounds);

	/*
	debugDraw(function(ctx) {
			ctx.fillStyle="#2B2";
			for(var i = 0; i < collidedEnemies.length; i++) {
				collidedEnemies[i].bounds.draw(ctx);
			}
		});
	*/
	//check all enemies to see if we collide with any
	
	if(collidedEnemies.length != 0) {
		//If there is, check velocity and stuff to see
		//Whether you hit from the top or sides
		var amDead = false;
		collidedEnemies.forEach(function (el, i, arr) {
				//If landed on top
				if(that.bounds.checkCollidedTop(el.bounds)) {
					if(el.die) //kill it
						el.die();
				} else {
					amDead = true;
				}
			});

		//bounce
		this.bounds.vel.y = -1 * this.bouncespeed;

		if(amDead)
			{ this.die(); }
	}
}

Player.prototype.handleJumping = function(jumpKeyState, time) {
	//Handle jump (On ground)
	if(this.bounds.onGround){
		//reset keys
		if(this.jumpState === s.BUTTON_IN_AIR)
			this.jumpState = s.NOT_PRESSED;
		if(!jumpKeyState)
			{ this.jumpState = s.NOT_PRESSED; }

		//Do normal jump
		else if(jumpKeyState && this.jumpState === s.NOT_PRESSED) {
			this.jumpState = s.BUTTON;
			this.bounds.vel.y = -1 * this.jumpspeed;
		}
	} 

	//Handle jump (In air)
	else{
		if(!jumpKeyState) //Reset button
			{ this.jumpState = s.NOT_PRESSED; }

		//do jetpack, unless is normal jump and not yet been released
		else if(jumpKeyState && this.jumpState != s.BUTTON){
			if(this.jumpState === s.NOT_PRESSED) //if just started
				{ this.jet[this.jetMode].startJet(time, this); }
			this.jumpState = s.BUTTON_AIR;
			this.jet[this.jetMode].doJet(time, this);
		}
	}	
}

Player.prototype.jet = {
	physics: {},
	game:    {},
};

{ //Player.prototype.jet scope
	var j = Player.prototype.jet;
	
	j.startGraphics = function(time, that) {
		that.pack.burst(Constants.player.jetpackburst, that.bounds.vel); 
	}

	j.doGraphics = function(time, that) {
		that.pack.update(time, that.bounds.vel);
	}

	j.game.startJet = function(time, that) {
		that.bounds.vel.y = Constants.player.jetpackburstspeed + that.jetpackspeed;
		j.startGraphics(time,that);
	}

	j.game.doJet = function(time, that) {
		that.bounds.vel.y = Math.min(that.bounds.vel.y, -1 * that.jetpackspeed);
		j.doGraphics(time, that);
	}

	j.physics.startJet = function(time, that) {
		//that.bounds.vel.y = Constants.player.jetpackburstspeed + that.jetpackspeed;
		j.startGraphics(time,that);
	}

	j.physics.doJet = function(time, that) {
		var TTW = 2;
		var vMax = -that.jetpackspeed * 1.3;
		var g = Constants.player.gravity;
		var accel = ((TTW - 1) * g / vMax) * that.bounds.vel.y - (g * TTW);
		that.bounds.vel.y += accel * time;
		j.doGraphics(time, that);
	}

} //end jet scope

//returns 0 if facing right, 1 otherwise
Player.prototype.getFacingIndex = function() 
	{return this.facing>0?0:1;}

Player.prototype.draw = function(ctx){
	if(this.isDead) { return true; }
	ctx.fillStyle="#88F";
	this.bounds.draw(ctx);
}

Player.prototype.die = function(){
	particles.doBloodExplosion(this.bounds.pos.clone(), 3);
	this.isDead = true;
}

}//End player declaration scope
