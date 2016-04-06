function bounds(pos,size){//pos and size are vectors
	this.pos = pos;
	this.size = size;
	this.colliding = true;
	this.vel = new Vector(0,0);
	this.onGround = false;
}

bounds.prototype.contains = function(pos){
	return pos.x > this.pos.x && 
	       pos.y > this.pos.y && 
		   pos.x < this.pos.x + this.size.x && 
		   pos.y < this.pos.y + this.size.y;
}

//check if collides with other bounding box
bounds.prototype.collidesWith = function(other) {
	if(!this.colliding || !other.colliding) { return; }

	var missedX = this.getRight() < other.getLeft() ||
	              this.getLeft() > other.getRight();

	var missedY = this.getTop() > other.getBottom() ||
	              this.getBottom() < other.getTop();

	return !missedX && !missedY;
}

//checks if this hit other box from top (false if from side or bot)
//Assumes that they collide
bounds.prototype.checkCollidedTop = function(other) {
	var relVel = this.vel.clone().subtractV(other.vel);

	if(relVel.y < 0) { return false; } //came in from below

	var my_corner;
	var ot_corner; //other corner

	if(relVel.x > 0) { //I'm going to the right
		ot_corner = other.getTopLeft();
		my_corner = this.getBottomRight();
	} else {           //I'm going to the left
		ot_corner = other.getTopRight();
		my_corner = this.getBottomLeft();
	}

	//my_corner is inside 'other'
	//cD is displacement from ot_corner to my_corner
	var cornerDisplacement = my_corner.subtractV(ot_corner);


	//if relVel is angled down more than cornerDisplacement,
	//then we came in from above
	
	//Make them go left to right
	relVel.x = Math.abs(relVel.x);
	cornerDisplacement.x = Math.abs(cornerDisplacement.x);

	//check for vertical vectors
	var epsilon = 0.0001
	if(cornerDisplacement.x < epsilon) { return false; } //just barely grazed the side
	if(relVel.x < epsilon) { return true; } //came in vertically

	//normalize
	cornerDisplacement.setLength(1);
	relVel.setLength(1);


	//console.log(relVel.getSlope(), cornerDisplacement.getSlope());


	return cornerDisplacement.getSlope() < relVel.getSlope();
}

bounds.prototype.getTop    = function(){return this.pos.y}
bounds.prototype.getBottom = function(){return this.pos.y + this.size.y}
bounds.prototype.getLeft   = function(){return this.pos.x}
bounds.prototype.getRight  = function(){return this.pos.x + this.size.x}

bounds.prototype.getTopRight    = function(){return new Vector(this.getRight(), this.getTop()   ); }
bounds.prototype.getBottomRight = function(){return new Vector(this.getRight(), this.getBottom()); }
bounds.prototype.getTopLeft     = function(){return new Vector(this.getLeft() , this.getTop()   ); }
bounds.prototype.getBottomLeft  = function(){return new Vector(this.getLeft() , this.getBottom()); }

bounds.prototype.setTop    = function(n){this.pos.y = n}
bounds.prototype.setBottom = function(n){this.pos.y = n - this.size.y}
bounds.prototype.setLeft   = function(n){this.pos.x = n}
bounds.prototype.setRight  = function(n){this.pos.x = n - this.size.x}

bounds.prototype.draw = function(ctx) {
	ctx.fillRect(cellSize * this.pos.x, cellSize * this.pos.y, cellSize * this.size.x, cellSize * this.size.y);
}

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
