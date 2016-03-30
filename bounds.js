function bounds(pos,size){//pos and size are vectors
	this.pos = pos;
	this.size = size;
	this.vel = new Vector(0,0);
	this.onGround = false;
}

bounds.prototype.contains = function(pos){
	return pos.x > this.pos.x && pos.y > this.pos.y && pos.x < this.pos.x + this.size.x && pos.y < this.pos.y + this.size.y;
}

bounds.prototype.getTop    = function(){return this.pos.y}
bounds.prototype.getBottom = function(){return this.pos.y + this.size.y}
bounds.prototype.getLeft   = function(){return this.pos.x}
bounds.prototype.getRight  = function(){return this.pos.x + this.size.x}

bounds.prototype.setTop    = function(n){this.pos.y = n}
bounds.prototype.setBottom = function(n){this.pos.y = n - this.size.y}
bounds.prototype.setLeft   = function(n){this.pos.x = n}
bounds.prototype.setRight  = function(n){this.pos.x = n - this.size.x}


bounds.prototype.move = function(time){
	this.onGround = false;
	var tempv = this.vel.clone();
	tempv.scale(time);
	this.pos.x += tempv.x

	var collideSpeed = 0;

	//check left, check right, check top, check bottom
	
	var tempx;
	var tempy;

	
	if(this.vel.x < 0) {
		tempx = Math.floor(this.getLeft());		
		for(tempy = Math.floor(this.getTop()); tempy <= Math.floor(this.getBottom()); tempy++) {
			if(gridData[tempx][tempy] == 0) {
				this.setLeft(Math.ceil(this.getLeft()) + 0.001);
				this.vel.x = 0;
				break;
			}
		}
	} else {
		tempx = Math.floor(this.getRight());		
		for(tempy = Math.floor(this.getTop()); tempy <= Math.floor(this.getBottom()); tempy++) {
			if(gridData[tempx][tempy] == 0) {
				this.setRight(Math.floor(this.getRight()) - 0.001);
				this.vel.x = 0;
				break;
			}
		}
	}

		
	if(this.vel.y < 0) {
		this.pos.y += tempv.y;
		tempy = Math.floor(this.getTop());		
		for(tempx = Math.floor(this.getLeft()); tempx <= Math.floor(this.getRight()); tempx++) {
			if(gridData[tempx][tempy] == 0) {
				this.setTop(Math.ceil(this.getTop()) + 0.001);
				this.vel.y = 0;
				break;
			}
		}
	} else {
		this.pos.y += tempv.y - Math.floor(tempv.y);
		tempv.y = Math.floor(tempv.y);
		do {
			tempy = Math.floor(this.getBottom());		
			for(tempx = Math.floor(this.getLeft()); tempx <= Math.floor(this.getRight()); tempx++) {
				if(gridData[tempx][tempy] == 0) {
					this.setBottom(Math.floor(this.getBottom()) - 0.001);
					collideSpeed = Math.abs(this.vel.y);
					this.vel.y = 0;
					tempv.y = -1;
					this.onGround = true;
					break;
				}
				//tempGrid[tempx][tempy] = 1;
			}
			this.pos.y++;
			tempv.y--;
		}
		while(tempv.y >= 0);
		this.pos.y--;
	}

	if(this.onCollide != null && collideSpeed > 10){
		this.onCollide(collideSpeed);
	}
		
	//add collision code later
	//
	//
}
