function Vector(x,y){
	this.x = x;
	this.y = y;
}

Vector.prototype.getLength = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.scale = function(a){
	this.x *= a;
	this.y *= a;
}

Vector.prototype.setLength = function(len){
	this.scale(len / this.getLength());
	if(this.getLength() == Infinity){
		this.set(0,0);
	}
}

Vector.prototype.assign = function(otherVect){
	this.x = otherVect.x;
	this.y = otherVect.y;
}

Vector.prototype.set = function(x,y){
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function(x,y){
	this.x += x;
	this.y += y;
}

Vector.prototype.addVec = function(other){
	this.x += other.x;
	this.y += other.y;
}

Vector.prototype.addScaledVec = function(scale,other){
	this.x += other.x * scale;
	this.y += other.y * scale;
}

Vector.prototype.clone = function(){
	return new Vector(this.x,this.y);
}
