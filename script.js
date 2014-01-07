var canvas, ctx;

function start(){
	setInterval(update,30);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	setupGrid()

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
