var keyState = new Array();
var keyHandlers = [];

//initialize keystate
for(var i = 0; i < 500; i++){
	keyState[i] = false;
}

document.addEventListener('keydown',function(event){
	handleKey(true,event.keyCode)
})
document.addEventListener('keyup',function(event){
	handleKey(false,event.keyCode)
})

function handleKey(isDown, code){
	keyState[code] = isDown;
}

function checkKeyHandlers() {
	keyHandlers.forEach(function (e) {
		if(keyState[e.keyCode]) { 
			e["function"]();
			keyState[e.keyCode] = false;
		}
	});
}

//when key keyCode is pressed, run fun
function addKeyHandler(keyCode, func) {
	keyHandlers.push( 
		{
			"keyCode": keyCode,
			"function": func
		});
}

addKeyHandler(67, spawnGoomba); //'c'


