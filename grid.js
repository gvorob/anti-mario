var gridData = new Array();
var tempGrid = new Array();

gridData.fromVec = function(vec){
	if(vec.x >= this.width || vec.x < 0 || vec.y >= this.height || vec.y < 0)
		return 0;	
	return gridData[Math.floor(vec.x)][Math.floor(vec.y)];
}


gridData.setFromVec = function(vec, n){
	if(vec.x >= this.width || vec.x < 0 || vec.y >= this.height || vec.y < 0)
		return;	
	gridData[Math.floor(vec.x)][Math.floor(vec.y)] = n;
}

function forEachIn(doThis){
	for(var i = 0; i < gridData.width; i++){
		for(var j = 0; j < gridData.height; j++){
			doThis(i,j)
		}
	}
}

function setupGrid(){
	createGrid(10,10)
	forEachIn(function(i,j){
		if(j == 9 || (10 * j + i)%7 == 0)
			gridData[i][j] = 0
		else
			gridData[i][j] = 1
	})


}
	

function createGrid(x,y){
	gridData.width = x;
	gridData.height = y;
	tempGrid.width = x;
	tempGrid.height = x;
	for(var i = 0; i < x; i++){
		gridData[i] = new Array();
		tempGrid[i] = new Array();
	}	
}

function gridDraw(ctx){
	ctx.fillStyle="#558";
	ctx.fillRect(0, 0, gridData.width * cellSize, gridData.height * cellSize);

	ctx.fillStyle="#000";
	for(var i = 0; i < gridData.width; i++){
		for(var j = 0; j < gridData.height; j++){
			if(gridData[i][j] == 0)
				ctx.fillRect(i * cellSize, j * cellSize, cellSize + 1, cellSize + 1);
		}
	}
}

function resizeGrid(x, y) {
	if(!Number.isInteger(x) ||
	   !Number.isInteger(y)) 
		{throw "invalid size (" + x + ", " + y + ") in resizeGrid"; }

	gridData.length = x;

	for(var i = 0; i < x; i++){
		//Expand new Arrays
		if(i >= gridData.width) {
			gridData[i] = new Array();
			tempGrid[i] = new Array();
		} else {
			gridData[i].length = y;
			tempGrid[i].length = y;
		}
	}	

	gridData.width = x;
	gridData.height = y;

	//Set all new tiles
	forEachIn(function(i, j) { 
			if(gridData[i][j] == undefined) {
				gridData[i][j] = 0;
			}
		});
}

function saveGrid(){
	var result = "";
	result+= gridData.width + "." + gridData.height + ".";
	for(var i = 0; i < gridData.width; i++){
		for(var j = 0; j < gridData.height; j++){
			result += gridData[i][j];
		}
	}
	return result;
}
		
function loadGrid(inString){
	var result = inString.split(".");
	gridData.width = parseInt(result[0]);
	gridData.height = parseInt(result[1]);
	createGrid(gridData.width,gridData.height);
	result = result[2];
	forEachIn(function(i,j){gridData[i][j] = parseInt(result[j + i * gridData.height]);});
}
