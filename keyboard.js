var keyState = new Array();
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
