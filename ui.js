var UI = function() {
	var currentlyDrawing = -1; //what tile am I drawing with my mouse
	var j_canvas;
	var modes;
	var mode; //key into modes

	init = function() {
		j_canvas = $("#canvas");
		var bod = $("body");

		var editHandlers = [
			{ 
				element: j_canvas,
				event: "mousedown",
				func: function(event){
					var mClick = getCanvasClick(j_canvas, event)
					var tile   = pixelCoordsToWorldCoords(mClick);
					var oldTileVal = gridData.fromVec(tile);
					currentlyDrawing = (!oldTileVal)|0;
					gridData.setFromVec(tile, currentlyDrawing);
				}
			},
			{
				element: j_canvas,
				event: "mousemove",
				func: function(event){
					if(currentlyDrawing == -1) { return;}

					var mClick = getCanvasClick(j_canvas, event)
					var tile   = pixelCoordsToWorldCoords(mClick);
					gridData.setFromVec(tile, currentlyDrawing);
				}
			},
			{
				element: bod,
				event: "mouseup",
				func: function(event){
					currentlyDrawing = -1;
				}
			}
		];

		var clickJumpHandlers = [
			{
				element: j_canvas,
				event: "click",
				func: function(event) {
					var mClick = getCanvasClick(j_canvas, event)
					var wClick = pixelCoordsToWorldCoords(mClick);
					doClickJump(wClick);
				}
			}
		]

		modes = {
			EDIT:       {handlers: editHandlers},
			NO_CLICK:   {handlers: [] },
			CLICK_JUMP: {handlers: clickJumpHandlers},
		};


		setMode("EDIT");
	}

	setMode = function(newMode) {
		if(typeof newMode != "string")
			{ throw "Modes must be strings (in setMode)"; }
		if(!(newMode in modes))
			{ throw "No such UI mode: " + newMode; }
		//remove all old handlers
		if(mode in modes) {
			modes[mode].handlers.forEach(function(e) {
				e.element.off(e.event, e.func);
			});
		}

		mode = newMode;

		//add new handlers
		modes[mode].handlers.forEach(function(e) {
			var h = e.element.on(e.event, e.func);
		});
	}

	//Returns a vector with canvas click coords
	getCanvasClick = function(j_canvas, event) {
		var rect = j_canvas.get(0).getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		return new Vector(x, y);
	}

	//Uses screenOffset and cellSize to convert
	pixelCoordsToWorldCoords = function(p_vec) {
		return new Vector((p_vec.x - screenOffset.x) / cellSize, (p_vec.y - screenOffset.y) / cellSize);	
	}
	

	//===================
	//Publicizing members

	var returnObj =  {
		init: init,
	}
	Object.defineProperty(returnObj, "mode", 
		{ 
			enumerable: true,
			get: function() {return mode;},
			set: setMode,
		});
	Object.defineProperty(returnObj, "modes", 
		{ 
			enumerable: true,
			get: function() {return modes;},
		});

	return returnObj;
}();
