var cellSize = 8;

function player(){
	this.bounds = new bounds(new Vector(2,1), new Vector(2.5,4.5));

	this.bounds.onCollide = function(speed){
		particles.doStomp(new Vector(this.pos.x + this.size.x / 2, this.getBottom() - 0.1), speed);
	}

	this.offset = new Vector(-0.1,0.8);
	this.pack = new jetpackEmitter(this.bounds.pos, this.offset);
	this.waterCannon = new waterSprayEmitter();
	this.facing = 1;

	this.movespeed = 12;
	this.gravity = 50;
	this.jumpspeed = 17;
	this.jetpackspeed = 8;


	this.jumpState = 0;
	//0 is nothing pressed
	//1 is button has been pressed
	//2 is button has been pressed in air
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
		


		if(this.bounds.onGround){
			if(this.jumpState == 2)
				this.jumpState = 1;
			if(jumpKey && this.jumpState == 0)
			{
				this.jumpState = 1;
				this.bounds.vel.y = -1 * this.jumpspeed;
			}
			if(!jumpKey)
				this.jumpState = 0;
		}
		else{
			if(!jumpKey){
				this.jumpState = 0;
			}
			else if(jumpKey && this.jumpState != 1){
				this.jumpState = 2;
				this.bounds.vel.y = -1 * this.jetpackspeed;
				this.pack.update(time);
			}
		}	

		if(keyState[88]){
			var temp = this.bounds.pos.clone();
			temp.add(0.25,0.4);
			this.waterCannon.update(time,temp,this.facing);
		}

		if(this.bounds.vel.x != 0)
			this.offset.x = this.facing>0?-0.1:2.6;
		this.bounds.move(time);
	}

	this.draw = function(ctx){
		ctx.fillStyle="#88F";
		ctx.fillRect(cellSize * this.bounds.pos.x, cellSize * this.bounds.pos.y, cellSize * this.bounds.size.x, cellSize * this.bounds.size.y);
	}
}
