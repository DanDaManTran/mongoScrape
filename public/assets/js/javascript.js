$(document).ready(function() {
	//call back function to grab data from the url. I used call back so it can wait for the result to return before the modal pops up
	function getNews (cb){
		$.get("/news").done(function(result){

			cb(result);
		});
	}

	function getNotes (id, cb){
		$.get("/notes/"+ id).done(function(result){

			cb(result);
		});
	}


	$("#scrapeBtn").on("click", function(){
		getNews( function(result){
			$("#number").text(result.length);
			$("#subBod").empty();

			$.each(result, function(index, value) {
				let headline = value.headline;
				let url = value.url;
				let indexNum = index +1;

				var article = `<div class="eachArt"><h3>${indexNum}. ${headline}<span><button data-head="${headline}" data-url="${url}" class="btn artBtn">Save Article</button></span></h3><a class="artLink" href="${url}">Link</a></div>`;

				$("#subBod").append(article);
			});

			$(".artBtn").on("click", function(){
				var artObj = {
					headline: $(this).attr("data-head"),
					url: $(this).attr("data-url")
				}

				$.post("/saving", artObj).done(function (result) {});
			});

			$("#myModal").modal();
		});
	});

	$(".noteModal").on("click", function(){
		var id = $(this).attr("data-id");
		$("#savedNotes").empty();

		getNotes(id, function(result){
			$("#noteTitle").text(result[0].headline + " notes");
			$("#addNote").attr("data-id", result[0]._id);

			if(!result[0].note){
				$("#savedNotes").append(`<h5 class="notes">They are no saved notes.</h5>`)
			} else if (result[0].note){
				$.each(result[0].note, function(index, value){
					let eachNote = value;
					let id = result[0]._id;

					var notes = `<h5 class="notes">${eachNote}<span><button class="btn xBtn" data-id="${id}" data-index="${index}">X</button></span></h5>`;

					$("#savedNotes").append(notes);
				});
			}

			$("#viewNotes").modal();
		});
	});

	$("#addNote").on("click", function() {
		var noteIn = $("#noteInput").val();
		var id =  $(this).attr("data-id");
		$("#noteInput").val("");
		$.post("/addNotes/" + id, {note: noteIn}).done(function (result){});
	});

	$(".delNote").on("click", function() {
		var id = $(this).attr("data-id");

		$.post("/delArt/" + id).done(function(result){
			if(result){
				location.reload();
			}
		});
	});

	$(document).on("click", ".xBtn", function() {
		var id = $(this).attr("data-id");
		var index = $(this).attr("data-index");

		$.post("/delNote/" + id + "/" + index).done(function(result){
			if(result){
				location.reload();
			}
		});
	});
});
