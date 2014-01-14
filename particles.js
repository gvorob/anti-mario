particles = new Array();

particles.update = function(time){
	for(var i = 0; i < this.length; i++)
	{
		if(this[i] != null){
			this[i].update(time);
			if(this[i].isDead)
				this[i] = null;
		}
	}
}

particles.draw = function(ctx){
	for(var i = 0; i < this.length; i++)
	{
		if(this[i] != null){
			this[i].draw(ctx);
		}
	}
}

particles.add = function(part){
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
	

function particleRock(pos, vel, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.lifetime = lifetime;
	this.isDead = false;

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			this.vel.addScaledVec(time,new Vector(0,15));
			this.pos.addScaledVec(time,vel);
			if(gridData.fromVec(this.pos) == 0)
				this.isDead = true;
		}
	}
	
	this.draw = function(ctx){
		ctx.fillStyle="#505020";
		var temp = pos.clone();
		temp.scale(32);
		drawCircle(ctx,temp,3);
	}
}


function particleDust(pos, vel, size, drag, opacity, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.size = size;
	this.drag = drag;
	this.opacity = opacity;
	this.lifetime = lifetime;
	this.maxLife = lifetime;
	this.isDead = false;

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			this.vel.scale(1 - this.drag * time);
			this.pos.addScaledVec(time,vel);
			if(gridData.fromVec(this.pos) == 0)
				this.isDead = true;
		}
	}
	
	this.draw = function(ctx){
		ctx.fillStyle="rgba(80,80,32," + this.opacity * this.lifetime / this.maxLife + ")";
		var temp = pos.clone();
		temp.scale(32);
		drawCircle(ctx,temp,this.size);
	}
}


		


particles.doStomp = function(pos, speed){
	var numParts = (10 + Math.floor(speed / 3)) * (1 + 0.3 * Math.random());
	for(var i = 0; i < numParts; i++){
		var vel = new Vector(Math.random() * 2 - 1, Math.random() * -0.2);
		vel.setLength(0.6 * Math.sqrt(Math.abs(speed) - 1) * (1 + 0.5 * (Math.random() - 0.5)));
		var time = 1 * (1 + (Math.random() - 0.5));
		var size = 1 + 0.6 * speed * (1 + (Math.random() - 0.5));
		var opacity = 0.3 * (1 + (Math.random() -0.5));
		var drag = 3.8;
			
		particles.add(new particleDust(pos.clone(),vel, size, drag, opacity, time));
	}
}

particles.doRocks = function(pos, speed){
	var numParts = (2 + Math.floor(speed / 4)) * (1 + 0.3 * Math.random());
	for(var i = 0; i < numParts; i++){
		var vel = new Vector(Math.random() * 2 - 1, Math.random() * -0.7);
		vel.setLength((1/3 * Math.abs(speed) + 2) * (1 + 0.5 * (Math.random() - 0.5)));
		var time = 5 * (1 + 0.5 * (Math.random() - 0.5));
		particles.add(new particleRock(pos.clone(),vel,time));
	}
}

function particleExhaust(pos, vel, size, maxSize, drag, col, opacity, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.size = size;
	this.maxSize = maxSize;
	this.drag = drag;
	this.opacity = opacity;
	this.lifetime = lifetime;
	this.maxLife = lifetime;
	this.col = col;
	this.isDead = false;

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			this.vel.scale(1 - this.drag * time);
			this.pos.addScaledVec(time,vel);
			if(gridData.fromVec(this.pos) == 0)
				this.isDead = true;
		}
	}
	
	this.draw = function(ctx){
		var timeScale = this.lifetime / this.maxLife;

		ctx.fillStyle = this.col.createInterpolated(new color(355,355,355,0),timeScale);
		
		var temp = pos.clone();
		temp.scale(32);
		timeScale = Math.sqrt(timeScale);
		drawCircle(ctx,temp, this.maxSize + (this.size - this.maxSize) * timeScale );
	}
}

function jetpackEmitter(pos, offset){
	this.pos = pos;
	this.offset = offset;
	this.numToSpawn = 0;

	this.update = function(time){
		this.numToSpawn += time * 120;
		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var vel = new Vector(Math.random() * 0.5 - 0.25, 2.0);
			vel.setLength(randOff(8,0.2));
			var time = randOff(0.5,0.5);
			var size = randOff(6,0.5);
			var maxSize = randOff(size * 2,0.5);
			var opacity = 0.001;
			var drag = 3.5;
			var r = 255//Math.random() * 55 + 200;
			var g = Math.random() * 100 + 120;
			var col = new color(r, r * g / 255,0, 0.5);

			var temp = this.pos.clone();
			temp.addVec(this.offset);	
			particles.add(new particleExhaust(temp, vel, size / 2, maxSize, drag, col, opacity, time));
		}
	};

}



function particleWaterSpray(pos, vel, size, maxSize, drag, col, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.size = size;
	this.maxSize = maxSize;
	this.drag = drag;
	this.lifetime = lifetime;
	this.maxLife = lifetime;
	this.col = col;
	this.isDead = false;
	this.bounceX = new Vector(randOff(0.2,0.3),1);//off a wall
	this.bounceY = new Vector(randOff(0.8,0.2),0.6);//off the ground

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			this.vel.add(0,time * 25);
			this.vel.scale(1 - this.drag * time);

			var temp = this.vel.clone();
			temp.scale(time);
			this.pos.x += temp.x

			if(gridData.fromVec(this.pos) == 0){
				this.pos.x -= this.vel.x * time;
				this.vel.x *= -1;
				this.vel.multElements(this.bounceX);
			}

			this.pos.y += temp.y
				
			if(gridData.fromVec(this.pos) == 0){
				this.pos.y -= this.vel.y * time;
				this.vel.y *= -1;
				this.vel.multElements(this.bounceY);
			}
					
		}
	}
	
	this.draw = function(ctx){
		var timeScale = this.lifetime / this.maxLife;

		ctx.fillStyle = this.col.create()//this.col.createInterpolated(new color(155,155,255,0),timeScale);
		
		var temp = pos.clone();
		temp.scale(32);
		timeScale = Math.sqrt(timeScale);
		drawCircle(ctx,temp, this.maxSize + (this.size - this.maxSize) * timeScale );
	}
}


function waterSprayEmitter(){
	this.pos = new Vector();
	this.facing = false;//left
	this.numToSpawn = 0;

	this.update = function(time, pos, facing){


		this.numToSpawn += time * 100;
		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var vel = new Vector(2.0 * facing,randOff(-0.6,0.1));
			vel.setLength(randOff(15,0.2));
			var time = randOff(1.5,0.5);
			var size = randOff(16,0.5);
			var maxSize = 0//randOff(size * 2,0.5);
			var drag = 0.3;
			var g = Math.random() * 155 + 80;
			var col = new color(g,g + 20,255,randOff(0.4,0.5));

			particles.add(new particleWaterSpray(pos.clone(), vel, size / 2, maxSize, drag, col,time));
		}
	};

}

function color(r,g,b,a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;

	this.create = function(){
		return "rgba(" + Math.floor(this.r) + ", " + Math.floor(this.g) + ", " + Math.floor(this.b) + ", " + this.a + ")";
	}

	this.createInterpolated = function(end, scale){//scale is from 0 to 1, 1 is all this, 0 is all end
		var r = Math.floor(this.r * scale + end.r * (1 - scale));
		var g = Math.floor(this.g * scale + end.g * (1 - scale));
		var b = Math.floor(this.b * scale + end.b * (1 - scale));
		var a = this.a * scale + end.a * (1 - scale);
		return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
	}
}

function randOff(num, offset){return num * (1 + offset * (Math.random() * 2 - 1));}
