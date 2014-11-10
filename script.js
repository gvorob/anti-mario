var canvas, ctx;
var player;
var screenOffset;
var pause;
var cellSize = 8;

function start(){
	pause = setInterval(update,30);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	//setupGrid()
	load(document.getElementById('levelData').value);

	canvas.addEventListener('click', function(event){
		var tile = new Vector((event.layerX - screenOffset.x) / cellSize, (event.layerY - screenOffset.y) / cellSize);	
		tile.x--;
		tile.y--;
		gridData.setFromVec(tile, gridData.fromVec(tile) * -1 + 1);
		console.log(tile.x + " " + tile.y);
	});
	player = new player();
	screenOffset = new Vector();
}


function update(){

		
	screenOffset.assign(player.bounds.pos);
	screenOffset.scale(-cellSize);
	screenOffset.add(250,250);

	if(keyState[67]){
		enemies.add(new Slime(new bounds(player.bounds.pos.clone(),new Vector(0.5,0.5))));
		keyState[67] = false;
	}

	player.update(30/1000);
	particles.update(30/1000);
	enemies.update(30/1000);
	draw();
}

function draw(){
			
	ctx.clearRect(0,0,canvas.width,canvas.width);
	ctx.strokeStyle="rgb(0,0,255)";
	ctx.strokeRect(0,0,500,500);
	ctx.strokeStyle="rgb(0,0,0)";
	
	ctx.translate(screenOffset.x, screenOffset.y);


	gridDraw(ctx)
	player.draw(ctx);
	enemies.draw(ctx);
	particles.draw(ctx);
	ctx.fillStyle="rgb(255,0,0)";

	ctx.translate(screenOffset.x * -1, screenOffset.y * -1);


	var count = 0
	for(var i = 0; i < particles.length;i++){if(particles[i]!=null)count++;}

	ctx.fillText("Particles: " + count, 2, 499);
	ctx.fillText("Vel: x " + player.bounds.vel.x + "; y " + player.bounds.vel.y, 2, 487);


}

function drawLine(context, startVector, changeVector){
	context.beginPath();
	context.moveTo(startVector.x, startVector.y);
	context.lineTo(startVector.x + changeVector.x, startVector.y + changeVector.y);
	context.stroke();
	context.closePath();
}

function drawCircle(context, location, radius)
{
	context.beginPath();
	context.arc(location.x, location.y, radius, 0, 2 * Math.PI, true);
	context.fill();
	context.closePath();
}

