function prepareApp() {
    var app = {};

    app.checkProportions = function() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            proportions = windowWidth/windowHeight;

        if (proportions > 1.50) {
            console.log("yuyu");
            var fontSize = windowHeight * 0.135;
            $('body, .column').css('font-size', fontSize+'px');
        }
        console.log(proportions);
    }

    app.setPanelSnap = function(){
      console.log("A")
        var options = {
           $menu: false,
           menuSelector: 'a',
           panelSelector: 'header, section, footer',
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
