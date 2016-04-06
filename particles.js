var Constants = Constants || {};
Constants.particles = {};
Constants.particles.scale = 0.5;
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
	

function particleBlood(pos, vel, size, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.lifetime = lifetime;
	this.isDead = false;
	this.size = size;

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			this.vel.addScaledV(time,new Vector(0,15));
			this.pos.addScaledV(time,vel);
			if(gridData.fromVec(this.pos) == 0)
				this.isDead = true;
		}
	}
	
	this.draw = function(ctx){
		var scale = Constants.particles.scale;
		ctx.fillStyle="rgba(255,20,32,0.3)";
		var temp = pos.clone();
		temp.scale(cellSize);
		drawCircle(ctx, temp, size * scale);
	}
}

particles.doBloodExplosion = function(pos, amount){
	var scale = Constants.particles.scale;

	var numParts = 50 * amount;
	for(var i = 0; i < numParts; i++){
		var vel = new Vector(Math.random() * 2 - 1, Math.random() * -0.7);
		vel.setLength(randRange(0,Math.sqrt(amount) * 10) * scale);

		var size = randOff(Math.sqrt(amount + 1), 0.2) * scale;
		var time = 5 * (1 + 0.5 * (Math.random() - 0.5));
		particles.add(new particleBlood(pos.clone(), vel, size, time));
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
			this.pos.addScaledV(time,vel);
			if(gridData.fromVec(this.pos) == 0)
				this.isDead = true;
		}
	}
	
	this.draw = function(ctx){
		ctx.fillStyle="rgba(80,80,32," + this.opacity * this.lifetime / this.maxLife + ")";
		var temp = pos.clone();
		temp.scale(cellSize);
		drawCircle(ctx,temp,this.size);
	}
}


		


particles.doStomp = function(pos, speed){
	var numParts = (10 + Math.floor(speed / 3)) * (1 + 0.3 * Math.random());
	var scale = Constants.particles.scale;

	for(var i = 0; i < numParts; i++){
		var temppos = pos.clone();
		temppos.x += (Math.random() * 2.5 - 1.25) * scale;
		var vel = new Vector(Math.random() * 2 - 1, Math.random() * -0.2);
		vel.setLength((0.8 * Math.sqrt(Math.abs(speed) - 1) * (1 + 0.5 * (Math.random() - 0.5))) * scale);
		var time = randOff(0.6, 0.5);// * (1 + (Math.random() - 0.5));
		var size = (1 + 0.3 * speed * (1 + (Math.random() - 0.5))) / 8 * scale;
		var opacity = 0.2 * (1 + (Math.random() -0.5));
		var drag = 3.8;
			
		particles.add(new particleDust(temppos, vel, size, drag, opacity, time));
	}
}


function particleExhaust(pos, vel, size, maxSize, drag, col, lifetime){
	this.pos = pos;
	this.vel = vel;
	this.size = size;
	this.maxSize = maxSize;
	this.drag = drag;
	this.lifetime = lifetime;
	this.maxLife = lifetime;
	this.col = col;
	this.isDead = false;

	this.update = function(time){
		this.lifetime -= time;
		if(this.lifetime < 0)
			this.isDead = true;
		else{
			//slow down
			this.vel.scale(1 - this.drag * time);
			//move
			this.pos.addScaledV(time,vel);

			//collide
			if(gridData.fromVec(this.pos) == 0) {
				var dir = randPosNeg();
				//move back
				this.pos.addScaledV(-time,vel)
				this.vel.rotate(dir * Math.PI / 2 * randRange(1, 1.2));
				this.pos.addScaledV(time, vel);
			}
		}
	}
	
	this.draw = function(ctx){
		var timeScale = this.lifetime / this.maxLife;

		ctx.fillStyle = this.col.createInterpolated(new color(355,355,355,0),timeScale);
		
		var temp = pos.clone();
		temp.scale(cellSize);
		timeScale = Math.sqrt(timeScale);
		drawCircle(ctx,temp, this.maxSize + (this.size - this.maxSize) * timeScale );
	}
}


function jetpackEmitter(pos, offset){
	this.pos = pos;
	this.offset = offset;
	this.numToSpawn = 0;
	this.spawnRate = 120; //particles per second
	
	var scale = Constants.particles.scale;

	this.genParams = function(vel) {
		var p = {};
		p.vel = new Vector(randRange(-0.35, 0.35) , 2.0);
		p.vel.setLength(randOff(32,0.2) * scale);
		if(vel && !vel.isNaN())
			{p.vel.addV(vel); }
		p.survivalTime = randOff(0.5,0.5);
		p.size = randOff(6/8,0.5) * scale;
		p.maxSize = randOff(p.size * 3,0.5) * scale;
		p.drag = 4.5;
		p.r = 255//Math.random() * 55 + 200;
		p.g = Math.random() * 100 + 120;
		p.col = new color(p.r, p.r * p.g / 255,0, 0.6);
		return p;
	}

	this.burst = function(x, vel) {
		var time = 20/1000;
		this.numToSpawn += x * this.spawnRate;
		var startPos = this.pos.clone();
		startPos.addV(this.offset);	

		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var p = this.genParams();
			p.vel = new Vector(randRange(-0.5, 0.5) , 2.0);
			p.vel.setLength(randOff(36, 0.4) * scale);
			if(vel && !vel.isNaN())
				{p.vel.addV(vel); }

			var pos = startPos.clone();
			//keep them from stacking up
			pos.addScaledV(0.5 * randRange(-time,time), p.vel);
			particles.add(new particleExhaust(pos, p.vel, p.size / 2, p.maxSize, p.drag, p.col, p.survivalTime));
		}
	}

	this.update = function(time, vel){
		this.numToSpawn += time * this.spawnRate;
		var startPos = this.pos.clone();
		startPos.addV(this.offset);	

		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var p = this.genParams(vel);

			var pos = startPos.clone();
			//keep them from stacking up
			pos.addScaledV(0.5 * randRange(-time,time), p.vel);
			particles.add(new particleExhaust(pos, p.vel, p.size / 2, p.maxSize, p.drag, p.col, p.survivalTime));
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

			var enemiesHere = enemies.getHere(this.pos)
			if(enemiesHere.length > 0){
				enemiesHere[0].bounds.vel.addScaledV(this.lifetime / this.maxLife / 10, this.vel );
				//enemyHere.isDead = true;
				this.isDead = true;
			}
					
		}
	}
	
	this.draw = function(ctx){
		var timeScale = this.lifetime / this.maxLife;

		ctx.fillStyle = this.col.create()//this.col.createInterpolated(new color(155,155,255,0),timeScale);
		
		var temp = pos.clone();
		temp.scale(cellSize);
		timeScale = Math.sqrt(timeScale);
		drawCircle(ctx,temp, this.maxSize + (this.size - this.maxSize) * timeScale );
	}
}


function waterSprayEmitter(){
	this.pos = new Vector(0,0);
	this.facing = false;//left
	this.numToSpawn = 0;

	this.update = function(time, pos, facing){

		var scale = Constants.particles.scale;

		this.numToSpawn += time * 100;
		for(;this.numToSpawn >= 1; this.numToSpawn--){
			var vel = new Vector(2.0 * facing,randOff(-0.6,0.1));
			vel.setLength(randOff(18,0.3) * scale);
			//vel.addV(player.bounds.vel);
			var time = randOff(1.5,0.5);
			var size = randOff(2,0.0625) * scale;
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

//inclusive random in range
function randRange(a, b) { return Math.random() * (b - a) + a; }
//scales a number randomly by 1 +/- offset
function randOff(num, offset){return randRange(num * (1 - offset), num * (1 + offset));}
//randomly gives 1 or -1
function randPosNeg() { return Math.random() > 0.5 ? 1 : -1; }
