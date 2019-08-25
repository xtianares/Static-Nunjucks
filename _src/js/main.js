// dismissanble alert boxes
$(document).ready(function() {
    $(".alert-dismissible .close").click( function () {
        $(this).closest(".alert").slideUp(100);
    })
});

// scroll to top button
$(document).ready(function() {
	$("body").append('<span id="back_top"></span>');
	$(window).scroll(function() {
		if ($(this).scrollTop() > 250) {
			$('#back_top').fadeIn(700);
		} else {
			$('#back_top').fadeOut(500);
		}
	});
	$('#back_top').click(function(event) {
		$('html, body').animate({scrollTop: 0}, 250);
		event.preventDefault();
	})
});

// to make sure that the body's bottom margin is equal the height of the sticky footer
$(function() {
    var wWidth = $(window).width();
    // var headH = $("#header-wrapper .navbar").css("height");
    var footH = $("#footer-wrap").css("height");
    // $("body").css( "padding-top", headH );
    $("body").css( "padding-bottom", footH );
    $(window).resize(function() {
        // var headH = $("#header-wrapper .navbar").css("height")
        var footH = $("#footer-wrap").css("height")
        if( wWidth != $(window).width() ) {
            // $("body").css( "padding-top", headH );
            $("body").css( "padding-bottom", footH );
        }
    });
});

// $('.accordion').collapse();

// sidebar menu show/hide funciton
$(function() {
    $('.sidebar-toggler').click(function(){
        $('html').toggleClass('show-sidebar');
        $(this).toggleClass('show');
        $('#dashboard-wrap').toggleClass('show-sidebar');
        $('.dashboard-sidebar').toggleClass('show');
    });
    var wWidth = $(window).width();
    $(window).resize(function() {
        if( wWidth != $(window).width() ) {
            $('html').removeClass('show-sidebar');
            $('.sidebar-toggler').removeClass('show');
            $('#dashboard-wrap').removeClass('show-sidebar');
            $('.dashboard-sidebar').removeClass('show');
        }
        wWidth = $(window).width();
    });
    $(document).click(function(event) {
        if (!$(event.target).closest(".dashboard-sidebar").length && !$(event.target).closest(".sidebar-toggler").length) {
            if ($(".sidebar-toggler").hasClass("show")) {
                // console.log(event.target);
                $('html').removeClass('show-sidebar');
                $('.sidebar-toggler').removeClass('show');
                $('#dashboard-wrap').removeClass('show-sidebar');
                $('.dashboard-sidebar').removeClass('show');
            }
        }
    });
    if ( wWidth <= 768 ) {
        var lastScrollTop = 0;
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           if (st > lastScrollTop){
               // downscroll code
               $('.navbar ').fadeOut(700);
           } else {
              // upscroll code
              $('.navbar ').fadeIn(700);
           }
           lastScrollTop = st;
        });
    }
    function adjustCollapseView(){
        var wWidth = $(window).width();
        if(wWidth >= "992"){
            $("#order-summary-box .card-header[data-toggle]").attr("data-toggle","");
            $("#order-summary-box .collapse").addClass("show").css("height","auto")
        } else {
            $("#order-summary-box .card-header[data-toggle]").attr("data-toggle","collapse");
            $("#order-summary-box .collapse").removeClass("show").css("height","0")
        }
    }
    adjustCollapseView();
    $(window).on("resize", function(){
        adjustCollapseView();
    });

});
