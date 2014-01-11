var canvas, ctx;
var player
var pause

function start(){
	pause = setInterval(update,30);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	//setupGrid()
	load(document.getElementById('levelData').value);

	canvas.addEventListener('click', function(event){
		var tile = new Vector(event.offsetX / 32, event.offsetY / 32);	
		gridData.setFromVec(tile, gridData.fromVec(tile) * -1 + 1);
		console.log(tile.x + " " + tile.y);
	});
	player = new player();
}


function update(){
	player.update(30/1000);
	particles.update(30/1000)
	draw();
}

function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.width);
	ctx.strokeStyle="rgb(0,0,0)";
	ctx.strokeRect(0,0,500,500);
	
	gridDraw(ctx)
	player.draw(ctx);
	particles.draw(ctx);
	ctx.fillStyle="rgb(255,0,0)";

	var count = 0
	for(var i = 0; i < particles.length;i++){if(particles[i]!=null)count++;}
	ctx.fillText("Particles: " + count, 2, 500);
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

