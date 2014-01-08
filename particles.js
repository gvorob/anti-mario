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
