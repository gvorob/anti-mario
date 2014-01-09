particles = new Array();

particles.update = function(time){
	for(var i = 0; i < particles.length; i++)
	{
		if(particles[i] != null){
			particles[i].update(time);
			if(particles[i].isDead)
				particles[i] = null;
		}
	}
}

particles.draw = function(ctx){
	for(var i = 0; i < particles.length; i++)
	{
		if(particles[i] != null){
			particles[i].draw(ctx);
		}
	}
}

particles.add = function(part){
	var i;
	for(i = 0; i < particles.length && i != -1; i++)
	{
		if(particles[i] == null){
			particles[i] = part;
			i = -2;
		}
	}
	if(i != -1){//was not added
		particles[particles.length] = part;
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
		debug = this.col.createInterpolated(new color(255,255,255,0),timeScale);

		ctx.fillStyle = this.col.createInterpolated(new color(255,255,255,0),timeScale);
		
		var temp = pos.clone();
		temp.scale(32);
		timeScale = Math.sqrt(timeScale);
		drawCircle(ctx,temp, this.maxSize + (this.size - this.maxSize) * timeScale );
	}
}

var debug

function jetpackEmitter(pos, offset){
	this.pos = pos;
	this.offset = offset;
	this.numToSpawn = 0;

	this.update = function(time){
		this.numToSpawn += time * 40;
		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var vel = new Vector(Math.random() * 0.5 - 0.25, 2);
			vel.setLength(randOff(8,0.5));
			var time = randOff(1,0.5);
			var size = randOff(7,0.5);
			var maxSize = randOff(size * 3,0.5);
			var opacity = randOff(0.3,0.5);
			var drag = 2.8;
			var r = Math.random() * 55 + 200;
			var g = Math.random() * 255;
			var col = new color(r, r * g / 255,0, 1);

			var temp = this.pos.clone();
			temp.addVec(this.offset);	
			particles.add(new particleExhaust(temp, vel, size / 2, maxSize, drag, col, opacity, time));
		}
	};

}

function color(r,g,b,a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;

	this.create = function(){
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
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
