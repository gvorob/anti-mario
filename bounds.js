function bounds(pos,size){//pos and size are vectors
	this.pos = pos;
	this.size = size;
	this.vel = new Vector(0,0);
	this.onGround = false;

	this.getTop = function(){return pos.y}
	this.getBottom = function(){return pos.y + size.y}
	this.getLeft = function(){return pos.x}
	this.getRight = function(){return pos.x + size.x}
	
	this.setTop = function(n){pos.y = n}
	this.setBottom = function(n){pos.y = n - size.y}
	this.setLeft = function(n){pos.x = n}
	this.setRight = function(n){pos.x = n - size.x}

	this.move = function(time){
		this.onGround = false;
		var temp = this.vel.clone();
		temp.scale(time);
		this.pos.x += temp.x

		var collideSpeed = 0;

		if(gridData[Math.floor(this.getLeft())][Math.floor(this.getTop())] == 0 || gridData[Math.floor(this.getLeft())][Math.floor(this.getBottom())] == 0){
			this.setLeft(Math.ceil(this.getLeft()) + 0.001);
			this.vel.x = 0;
		}

		if(gridData[Math.floor(this.getRight())][Math.floor(this.getTop())] == 0 || gridData[Math.floor(this.getRight())][Math.floor(this.getBottom())] == 0){
			this.setRight(Math.floor(this.getRight()) - 0.001);
			this.vel.x = 0;
		}


		this.pos.y += temp.y
			
		if(gridData[Math.floor(this.getLeft())][Math.floor(this.getTop())] == 0 || gridData[Math.floor(this.getRight())][Math.floor(this.getTop())] == 0){
			this.setTop(Math.ceil(this.getTop()) + 0.001);
			this.vel.y = 0;
		}

		
		if(gridData[Math.floor(this.getLeft())][Math.floor(this.getBottom())] == 0 || gridData[Math.floor(this.getRight())][Math.floor(this.getBottom())] == 0){
			this.setBottom(Math.floor(this.getBottom()) - 0.001);
			collideSpeed = Math.abs(this.vel.y);
			this.vel.y = 0;
			this.onGround = true;
		}

		if(this.onCollide != null && collideSpeed > 3){
			this.onCollide(collideSpeed);
		}
			
		//add collision code later
		//
		//
	}

	this.contains = function(pos){
		return pos.x > this.pos.x && pos.y > this.pos.y && pos.x < this.pos.x + this.size.x && pos.y < this.pos.y + this.size.y;
	}


}
