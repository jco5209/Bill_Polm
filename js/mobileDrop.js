(function() {
	var i = 0;

	$(".navButton").click(function(e) {
		e.stopPropagation();
		if($(".navPanel").hasClass("navPanel-visible") == false) {
			$(".navPanel").toggleClass("navPanel-visible");
		}
	});

	$("body, header, #main, footer").click(function() {
		if($(".navPanel").hasClass("navPanel-visible") == true) {
			$(".navPanel").toggleClass("navPanel-visible");
		}
	});

	$(document).ready(function() {
		var $windowSize = $(window).width();
		if($windowSize < 965) {
			$(".galleryButton").click(function(e) {
			e.stopPropagation();
			$(".galleryPanel").slideDown("fast");
			i++;
			});
		}
	});
	
	$(document).ready(function() {
		var $windowSize = $(window).width();
		if($windowSize < 965) {
			$("body, header, #main, footer").click(function() {
				if(i != 0) {
					$(".galleryPanel").slideUp("fast");
					i = 0;
				}
			});
		}
	});

	var $nav;

	for(var i = 0; i < $("#nav a").length; i++) {
		$nav = $("#nav a:eq("+[i]+")").clone();
		$(".navPanel nav").append($nav);
	}	
})()
