function setupEventHandlers() {
	$("#playbutton").click(function() {
		$(this).toggleClass("on");
	});

	$("#editbutton").click(function() {
		$(this).toggleClass("on");
	});
}
