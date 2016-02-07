function prepareApp() {
    var app = {};

    app.checkProportions = function() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            proportions = windowWidth/windowHeight;

        if (proportions > 1.50) {
            var fontSize = windowHeight * 0.135;
            $('body, .column').css('font-size', fontSize+'px');
        }
    }

    app.setPanelSnap = function(){
        var options = {
           $menu: $('.scroll-nav'),
           menuSelector: '.scroll-nav-top, scroll-nav-bottom',
           navigation: {
                buttons: {
                    $nextButton: $('.scroll-nav-up'),
                    $prevButton: $('.scroll-nav-down')
                }
           },
           panelSelector: '.panel',
           namespace: '.panelSnap',
           onSnapStart: function(){},
           onSnapFinish: function(){},
           directionThreshold: 30,
           slideSpeed: 300
        }

        $('body').panelSnap(options);
    }

    return app;
};

$(document).ready(function(){
    var app = prepareApp();
    app.checkProportions();
    app.setPanelSnap();

    $(window).on('resize', function(){
        app.checkProportions();

    });
})
