window.onload = function() {
	//FastClick.attach(document.body); // to remove delays on clicked links on touch ebabled devices
	// getPrice("dollars", "cents");
};
// to remove delays on clicked links on touch ebabled devices
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

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
