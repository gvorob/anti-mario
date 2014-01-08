var gridData = new Array();

gridData.fromVec = function(vec){
	if(vec.x >= this.length || vec.x < 0 || vec.y >= this[0].length || vec.y < 0)
		return 0;	
	return gridData[Math.floor(vec.x)][Math.floor(vec.y)];
}


gridData.setFromVec = function(vec, n){
	if(vec.x >= this.length || vec.x < 0 || vec.y >= this[0].length || vec.y < 0)
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
	for(var i = 0; i < x; i++){
		gridData[i] = new Array()
	}	
}

function gridDraw(ctx){
	for(var i = 0; i < gridData.width; i++){
		for(var j = 0; j < gridData.height; j++){
			if(gridData[i][j] == 0)
				ctx.fillStyle="#000"		       
			else
				ctx.fillStyle="#FFF"
			ctx.strokeRect(i * 32, j * 32, 32, 32);
			ctx.fillRect(i * 32, j * 32, 32, 32);
		}
	}
}

