var canvas, ctx;
var player;
var screenOffset;
var pause;
var cellSize = 32;

var currentLevel = 1;

$(function() { start();});

function start(){
	setupEventHandlers();

	j_canvas = $("#canvas");
	canvas = j_canvas.get(0);
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	//setupGrid()

	canvas.addEventListener('click', function(event){
		var mClick = getCanvasClick(j_canvas, event)
		var tile = pixelCoordsToWorldCoords(mClick);
		var oldTileVal = gridData.fromVec(tile);

		gridData.setFromVec(tile, (!oldTileVal)|0);
	});
	player = new player();
	screenOffset = new Vector(0,0);

	pause = setInterval(update,20);

	loadLevelString($('#levelData').text());
}

//Returns a vector with canvas click coords
function getCanvasClick(j_canvas, event) {
	var rect = j_canvas.get(0).getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	return new Vector(x, y);
}

//Uses screenOffset and cellSize to convert
function pixelCoordsToWorldCoords(p_vec) {
	return new Vector((p_vec.x - screenOffset.x) / cellSize, (p_vec.y - screenOffset.y) / cellSize);	
}

function update(){
	screenOffset.setV(player.bounds.pos);
	screenOffset.scale(-cellSize);
	screenOffset.add(250,250);

	//'c'
	if(keyState[67]){
		//spawnSlime();
		spawnGoomba();
		keyState[67] = false;
	}


	var stepTime = 20/1000;
	player.update(stepTime);
	particles.update(stepTime);
	enemies.update(stepTime);

	draw();
}

var debugDraw = function(drawFunc) {
	debugDraw.queue = debugDraw.queue || [];
	debugDraw.queue.push(drawFunc);
}
debugDraw.queue = [];

function draw(){
			

	ctx.clearRect(0,0,canvas.width,canvas.width);
	ctx.strokeStyle="rgb(0,0,255)";
	ctx.strokeRect(0,0,500,500);
	ctx.strokeStyle="rgb(0,0,0)";
	
	ctx.translate(screenOffset.x, screenOffset.y);



	gridDraw(ctx)

	particles.draw(ctx);
	enemies.draw(ctx);
	player.draw(ctx);

	for(var i = 0; i < debugDraw.queue.length; i++) {
		debugDraw.queue[i](ctx);
	}
	debugDraw.queue = [];

	ctx.translate(screenOffset.x * -1, screenOffset.y * -1);


	ctx.fillStyle="rgb(255,0,0)";

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
	radius *= cellSize;
	context.beginPath();
	context.arc(location.x, location.y, radius, 0, 2 * Math.PI, true);
	context.fill();
	context.closePath();
}

function spawnSlime() 
	{ spawnEnemyOfType("slime", player.bounds.pos.clone()); }

function spawnGoomba() 
	{ spawnEnemyOfType("goomba", player.bounds.pos.clone()); }

//returns the string
function saveLevelString() {
	return JSON.stringify(saveLevel());
}

function loadLevelString(levelString) {
	var levelObj = JSON.parse(levelString);
	if(typeof(levelObj) != "object") 
		throw "invalid level string in loadLevelString";
	loadLevel(levelObj);
}

//returns a level object
function saveLevel() {
	var saveObj = {};
	saveObj.gridString = saveGrid();
	saveObj.playerStart = player.bounds.pos.clone();
	saveObj.enemies = {};
	enemies.forEach(function(e) {
			saveObj.enemies[e.type] = saveObj.enemies[e.type] || [];
			saveObj.enemies[e.type].push(e.bounds.pos.clone());
	});
	return saveObj;
}

function loadLevel(levelObj) {
	//Level obj should have:
	//gridString
	//playerStart (Vector pos)
	//enemies: {
	//            goomba:[ pos, pos, ... ],
	//            ...
	//         }
	
	if(typeof(levelObj.gridString) != "string")
		throw "gridString missing in loadLevel";
	if(typeof(levelObj.playerStart) != "object")
		throw "playerStart missing in loadLevel";

	loadGrid(levelObj.gridString);
	player.bounds.pos.setV(levelObj.playerStart);


	//clear old enemies
	enemies.clearAll();

	//load new enemies
	for(enemyType in levelObj.enemies) {
		var e_positionList = levelObj.enemies[enemyType];
		if(!Array.isArray(e_positionList))
			throw "enemies[" + enemyType + "] is not array";
		e_positionList.forEach(function(e_pos) 
				{ spawnEnemyOfType(enemyType, Vector.fromObj(e_pos)); }
		);
	}
}
