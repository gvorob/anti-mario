var Constants = Constants || {};
{
	var tempSize = new Vector(0.7, 0.8);
	Constants.player = {
		size                : tempSize,
		movespeed           : 5,
		gravity             : 30,
		jumpspeed           : 12,
		jumpstates          : {
			NOT_PRESSED: 0,
			BUTTON:  1,
			BUTTON_IN_AIR: 2,
			},
		jetpackspeed        : 4,
		jetpackOffset       : [
			new Vector(0.1            , 0),
			new Vector(-0.1 + tempSize.x, 0),
			],
		waterCannonOffset   : [
				new Vector(-0.25 + tempSize.x, 0.4),
				new Vector( 0.25           , 0.4),
				],
	};
}

function player(){
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
	this.jetpackspeed = Constants.player.jetpackspeed;

	var s = Constants.player.jumpstates;
	this.jumpState = s.NOT_PRESSED;
	//0 is nothing pressed
	//1 is button has been pressed
	//2 is button has been pressed / in air
	this.update = function(time){
		var jumpKey = keyState[87] || keyState[38] || keyState[90];

		this.bounds.vel.add(0, this.gravity * time);
		this.bounds.vel.x = 0;	
		if(keyState[37] || keyState[65])
			this.bounds.vel.x = -1 * this.movespeed;
			
		if(keyState[39] || keyState[68])
			this.bounds.vel.x += this.movespeed;

		if(this.bounds.vel.x != 0)//sets facing
			this.facing = this.bounds.vel.x>0?1:-1;
		

		//On ground
		if(this.bounds.onGround){
			if(this.jumpState === s.BUTTON_IN_AIR)
				this.jumpState = s.NOT_PRESSED;
			if(jumpKey && this.jumpState === s.NOT_PRESSED)
			{
				this.jumpState = s.BUTTON;
				this.bounds.vel.y = -1 * this.jumpspeed;
			}
			if(!jumpKey)
				this.jumpState = 0;
		} 
		//In air
		else{
			if(!jumpKey) //Reset button
				{ this.jumpState = s.NOT_PRESSED; }
			else if(jumpKey && this.jumpState != s.BUTTON){
				this.jumpState = s.BUTTON_AIR;
				this.bounds.vel.y = -1 * this.jetpackspeed;
				this.pack.update(time);
			}
		}	

		if(keyState[88]){
			var temp = this.bounds.pos.clone();
			temp.addV(Constants.player.waterCannonOffset[this.getFacingIndex()]);
			this.waterCannon.update(time,temp,this.facing);
		}

		if(this.bounds.vel.x != 0)
			this.offset.setV(Constants.player.jetpackOffset[this.getFacingIndex()]);
		this.bounds.move(time);
	}

	//returns 0 if facing right, 1 otherwise
	this.getFacingIndex = function() 
		{return this.facing>0?0:1;}

	this.draw = function(ctx){
		ctx.fillStyle="#88F";
		ctx.fillRect(cellSize * this.bounds.pos.x, cellSize * this.bounds.pos.y, cellSize * this.bounds.size.x, cellSize * this.bounds.size.y);
	}
}
