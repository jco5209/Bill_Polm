(function(){
	
	//LightBox

	var $overlay = $("<div class='overlay'></div>");
	var $image = $("<img>");
	var $captionTitle = $("<p></p>");
	var $fullSize = $("<a href=''>Full Size</a>");

	$("body").append($overlay);
	$overlay.append($image);
	$overlay.append($captionTitle);
	$overlay.append($fullSize);

	$(document).ready(function() {
		var $windowSize = $(window).width();
		if($windowSize > 480) {
			$(document.body).on("click", ".image", function(e) {
				e.preventDefault();
				var $imageLocation = $(this).children("img").attr("src");
				$image.attr("src", $imageLocation);
				$overlay.show();
				var $captionTitleLoc = $(this).siblings("h3").text();
				$fullSize.attr("href", $imageLocation)
				$captionTitle.text($captionTitleLoc);
				$captionTitle.css({
					"color" : "#fff",
					"font-size" : "1.5em"
				});
			});
		}
	});

	$overlay.click(function() {
		$overlay.hide();
	});

	//Mobile drop-down functionality

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
	
	//.gallerySelected add/remove - h1 text dynamic update

	var $gallerySelected = $(".gallerySelected").children("a").text();

	$("#galleryOne h1").text($gallerySelected);

	$(".galleryPanel nav ul li").click(function() {
		$(this).siblings().removeClass("gallerySelected");
		$(this).addClass("gallerySelected");
		$gallerySelected = $(".gallerySelected").children("a").text();
		$("#galleryOne h1").text($gallerySelected);
		var $articleArr = [];
		$articleArr.push($(".gallery").children("article"));
		if($articleArr[0].length > 6) {
			for(var i = 0; i < $articleArr[0].length - 6; i++) {
			$articleArr = [];
			$articleArr.push($(".gallery").children("article"));
			$articleArr[0][6].remove();
			}
		}
		$ajax(albumAPI(), albumAJAX)
	});

	//Ajax

	function album() {
			if($gallerySelected == 'WaterColor') {
				return 'SXM95'
			} else if ($gallerySelected == 'Chinese') {
				return '4Nbs9'
			} else if ($gallerySelected == 'Acrylic') {
				return 'hIqYe'
			}
		};

	function albumAPI() {
		return "https://api.imgur.com/3/album/" + album() + "/images";	
	}

	var $ajax = function(url, callback) {
		$.ajax({
			url : url,
			headers : {
				'Authorization' : 'Client-ID db9c88305d19543'
			},
			type : 'GET',
			dataType : 'json',
			asynchronous : 'true',
			 error : function(jqXHR,status,error) {
			 	//console.log(jqXHR);
			 },
			success : callback
		});	//end first $.ajax	
	}

	var albumAJAX = function (data, statusText, jqXHR) {
		var miscAPI = [
			[],	//[0]Votes API
			[],	//[1]Image ID
			[],	//[2]Heart Span
			[],	//[3]Comments API
			[]	//[4]Comments Span
		];
		$.each(data.data, function(i, data) {
			if(i > 5) {
				$(".gallery").append($("<article><a href='' class='image'><img src='' alt=''></a><br><h3></h3><br><a href='#'><i class='fa fa-eye fa-lg'><span></span></i><i class='fa fa-heart fa-lg'><span></span></i><i class='fa fa-comment-o fa-lg'><span></span></i></a></article>"));
			};			
			var $galImage = $(".gallery > article > .image > img");
			var $galAnchor = $(".gallery > article > .image");
			var $galTitle = $(".gallery > article > h3");
			var $galEye = $(".gallery > article > a > .fa-eye");	
			var $galID = data.id;
			$galImage.eq(i).attr("src", data.link);
			$galTitle.eq(i).text(data.title);
			$galAnchor.eq(i).attr("href", data.link);
			$galEye.eq(i).parent("a").attr("href", "https://imgur.com/gallery/" + $galID);
			$galEye.eq(i).children("span").text(data.views);
			miscAPI[0].push("https://api.imgur.com/3/gallery/" + $galID + "/votes");
			miscAPI[1].push($galID);
			miscAPI[2].push($(".gallery > article > a > .fa-heart").eq(i));
			miscAPI[3].push("https://api.imgur.com/3/gallery/" + $galID + "/comments");
			miscAPI[4].push($(".gallery > article > a > .fa-comment-o").eq(i));
			console.log(data);
		});
			votesAJAX(miscAPI);
			commentsAJAX(miscAPI);
	}

	var votesAJAX = function (miscAPI, call) {
		for(var i = 0; i < miscAPI[0].length; i++) {
			$ajax(miscAPI[0][i], votesCall);
		}

		function votesCall(data, statusText, jqXHR) {
			console.log(this.url);
			for(var i = 0; i < miscAPI[0].length; i++) {
				if(this.url.indexOf(miscAPI[1][i]) != -1) {
					miscAPI[2][i].children("span").text(data.data.ups);
				}
			}
		}
	}

	var commentsAJAX = function (miscAPI, call) {
		for(var i = 0; i < miscAPI[3].length; i++) {
			$ajax(miscAPI[3][i], commentsCall);
		}

		function commentsCall(data, statusText, jqXHR) {
			for(var i = 0; i < miscAPI[0].length; i++) {
				if(this.url.indexOf(miscAPI[1][i]) != -1) {
					miscAPI[4][i].children("span").text(data.data.length);
				}
			}
		}
	}

	if($("body").hasClass("galleryPage")) {
		$(document).ready($ajax(albumAPI(), albumAJAX));
	}

	//Mobile menu dynamic update from #nav

	var $nav;

	for(var i = 0; i < $("#nav a").length; i++) {
		$nav = $("#nav a:eq("+[i]+")").clone();
		$(".navPanel nav").append($nav);
	}

})()
