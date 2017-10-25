// for active menu highlighting
(function(){
	var a = document.getElementById('nav').getElementsByTagName("a");
	if (window.location.href.substr(location.href.length - 1, 1) == '/') {
		var loc = window.location.href + 'index.html';
	} else {
		var loc = window.location.href;
	}
	for(var i=0; i < a.length; i++) {
		if (a[i].href == loc) {
			a[i].className='active';
		}
	}
})();
// Toggle menu for mobile devices using jQuery //
$("#nav > ul, #nav div > ul").before("<span id='menutoggle'><span>Menu</span></span>");
$(document).ready(function() {
    $("#menutoggle").click(function(event) {
        $(this).toggleClass("active");
        $(this).next("ul").stop().slideToggle(150);
        $("#nav span.submenu, #nav ul.submenu").removeClass("active");
        event.preventDefault();
    });
    $("#nav span.submenu").click(function(event) {
        if ($("#menutoggle").is(":visible")) {
            $(this).toggleClass("active");
            $(this).next("ul").slideToggle(150).toggleClass("active");
        }
        /*
        if ($("html").hasClass("touch") && $("#menutoggle").is(":hidden")) {
            if (!$(this).hasClass("active")) {
                $("#nav span.submenu").removeClass("active hover").next("ul.drop").removeClass("active");
                $(this).addClass("active hover").next("ul.drop").addClass("active");
            } else
            if ($(this).hasClass("active")) {
                $(this).removeClass("active hover").next("ul.drop").removeClass("active");
            }
        }
        */
        event.preventDefault();
    });
    /*
    if ($("html").hasClass("touch")) {
        $(window).bind("orientationchange", function() {
            if ($("#menutoggle, #nav span.submenu, #nav ul.submenu").hasClass("active")) {
                $("#nav ul").slideUp(100);
            }
            $("#menutoggle, #nav span.submenu, #nav ul.submenu").removeClass("active hover");
        });
    }
    */
    var wWidth = $(window).width();
    $(window).resize(function() {
        if (wWidth != $(window).width()) {
            if ($("#menutoggle, #nav span.submenu, #nav ul.submenu").hasClass("active")) {
                $("#nav ul.submenu").slideUp(100);
            }
            if (!$("#menutoggle").is(":hidden")) {
                $("#nav ul").slideUp(100);
                $("#nav ul").focus().blur()
            }
            $("#menutoggle, #nav span.submenu, #nav ul.submenu").removeClass("active hover");
        }
    });
    $(document).click(function(event) {
        if (!$(event.target).closest("#menutoggle, #nav ul").length) {
            if ($("#menutoggle, #nav span.submenu, #nav ul.submenu").hasClass("active")) {
                if ($("#menutoggle").hasClass("active")) {
                    $("#nav ul").slideUp(150);
                }
                $("#nav ul.submenu").slideUp(150);
            }
            $("#menutoggle, #nav span.submenu, #nav ul.submenu").removeClass("active hover");
        }
    });
    // Dropdown Select
    $(".dropdown_list li ul.drop").css({ display: "none", left: "-999em;" });
    $(".dropdown_list span.dropdown").click(function() {
        if ($(this).next("ul.drop").is(":hidden")) {
            $(".dropdown_list span.dropdown").removeClass("active").next("ul.drop").slideUp(100);
            $(this).toggleClass("active").next("ul.drop").slideDown(100).css({ display: "block", left: "0" });
        } else
        if ($(this).next("ul.drop").is(":visible")) {
            $(this).removeClass("active").next("ul.drop").slideUp(100).css({ left: "-999em;" });
        }
        //return false;
    });
    $(document).click(function(event) {
        if (!$(event.target).closest(".dropdown_list span.dropdown").length) {
            $(".dropdown_list ul.drop").slideUp(100);
            $(".dropdown_list span.dropdown").removeClass("active");
        }
    });
});
