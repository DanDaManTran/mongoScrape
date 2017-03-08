$(document).ready(function() {
	$("#scrapeBtn").on("click", function(){
		$.get("/news").done(function(result){});
		$("#myModal").modal("toggle");
	});
});
