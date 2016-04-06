var canvas, ctx;
var player;
var screenOffset;
var pause;
var cellSize = 64;

var editMode = false;
var cripplePlayer = false;

var currentLevel;

var Constants = Constants || {};
{
	Constants.misc = {
		clickJumpRange: 1,
	};
}

$(function() { start();});

function start(){
	setupEventHandlers();

	j_canvas = $("#canvas");
	canvas = j_canvas.get(0);
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	//setupGrid()

	UI.init();
	UI.mode = "CLICK_JUMP";

	screenOffset = new Vector(0,0);

	pause = setInterval(update,20);

	loadLevelByNumber(0);
}


function update(){
	checkKeyHandlers();

	screenOffset.setV(player.bounds.pos);
	screenOffset.scale(-cellSize);
	screenOffset.add(600,400);


	var stepTime = 20/1000;
	player.update(stepTime);
	particles.update(stepTime);
	
	if(!editMode)
		{ enemies.update(stepTime); }

	draw();
}

var debugDraw = function(drawFunc) {
	debugDraw.queue = debugDraw.queue || [];
	debugDraw.queue.push(drawFunc);
}
debugDraw.queue = [];

function draw(){
	//clear screen		
	ctx.clearRect(0, 0, canvas.width, canvas.width);
	ctx.strokeStyle = "rgb(0,0,0)";
	
	ctx.translate(screenOffset.x, screenOffset.y);

	//Draw game
	gridDraw(ctx)
	enemies.draw(ctx);
	player.draw(ctx);
	particles.draw(ctx);

	//Draw debug things
	for(var i = 0; i < debugDraw.queue.length; i++) {
		debugDraw.queue[i](ctx);
	}
	debugDraw.queue = [];

	if(UI.mode == "CLICK_JUMP") {
		ctx.fillStyle = "rgba(100,20,0,0.2)";
		drawCircle(ctx, UI.lastWorldMousePos.clone().scale(cellSize), Constants.misc.clickJumpRange);
	}

	ctx.translate(screenOffset.x * -1, screenOffset.y * -1);


	//==============
	//Debugging
	ctx.fillStyle="rgb(255,0,0)";
	var count = 0
	
	//count particles
	for(var i = 0; i < particles.length;i++)
		{if(particles[i]!=null)count++;}

	//Write debug text
	ctx.fillText("Particles: " + count, 2, 499);
	ctx.fillText("Vel: x " + player.bounds.vel.x + "; y " + player.bounds.vel.y, 2, 487);

}

function setEditMode(val) {
	if(val) {
		UI.mode = "EDIT";
	} else {
		UI.mode = "CLICK_JUMP";
	}
	editMode = val;
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

function doClickJump(loc) {
	var e = enemies.getWithinDistance(
			UI.lastWorldMousePos, 
			Constants.misc.clickJumpRange);
	e.forEach(function(e) {
		if("jump" in e) 
			{ e.jump(); }
		});
}

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
	player = new Player();
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

//loads levelData[n], sets currentLevel
function loadLevelByNumber(n) {
	if(
		!Number.isInteger(n) ||
		n < 0 ||
		n >= levelData.length
	) { throw "No such level: " + n; }
		
	loadLevel(levelData[n]);   
	currentLevel = n;
}

//goes to currentLevel + delta
function changeLevelDelta(delta) {
	var newLevel = currentLevel + delta;
	if(!Number.isInteger(newLevel)) 
		{ throw "invalid delta in changeLevelDelta"; }
	
	if(newLevel < 0 || newLevel >= levelData.length)
		{ console.log("no more levels"); return; }

	loadLevelByNumber(newLevel);
}

function reloadLevel() 
	{ loadLevelByNumber(currentLevel); }


