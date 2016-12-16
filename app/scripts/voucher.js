 /* global $ */
'use strict';
(function () {

     function isMobile() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
           return true;
        }
        return false;
    }

    function checkProportions() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            proportions = windowWidth / windowHeight;

        if (proportions > 1.50 && windowWidth > 1024 && !isMobile()) {
            var fontSize = windowHeight * 0.135;
            $('body').addClass('full-page');
            $('body, .column').css('font-size', fontSize + 'px');
        } else {
            $('body').removeClass('full-page');
            $('body, .column').css('font-size', '9vw');
        }
    }


    $(document).ready(function(){
        checkProportions();

        setTimeout(function(){
            $('body').addClass('loaded');
            window.scrollTo(0, 0);
        }, 3000);

        $(window).on('resize', function(){
            checkProportions();
        });
    });
})();
