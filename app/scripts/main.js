 /* global $ */
'use strict';
(function () {
    function prepareApp() {
        var app = {};

        app.ui = {
            body: $('body'),
            scrollNav: $('.scroll-nav'),
            snapNext: $('.scroll-nav-down'),
            snapPrev: $('.scroll-nav-up'),
            menuLink: $('.toggle-menu'),
            fixedBookLink: $('.fixed-navs-item.book-now'),
            fixedNavs: $('.fixed-navs'),
            splashMenu: $('.splash-menu')
        };

        app.bindEvents = function() {
            this.ui.menuLink.on('click', function() {
                this.ui.menuLink.toggleClass('active');
                this.ui.body.toggleClass('with-splash');
            }.bind(this));

            this.ui.splashMenu.on('click', 'a', function() {
                  this.ui.menuLink.removeClass('with-splash');
                  this.ui.body.removeClass('with-splash');
            }.bind(this));
        };

        app.checkProportions = function() {
            var windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                proportions = windowWidth / windowHeight;

            if (proportions > 1.50) {
                var fontSize = windowHeight * 0.135;
                $('body, .column').css('font-size', fontSize + 'px');
            }
        };

        app.setPanelSnap = function() {
            var self = this;
            var options = {
                $menu: $('.splash-menu, .scroll-nav'),
                menuSelector: '[data-panel]',
                navigation: {
                    buttons: {
                        $nextButton: self.ui.snapNext,
                        $prevButton: self.ui.snapPrev
                    }
                },
                panelSelector: '.panel',
                namespace: '.panelSnap',
                onSnapStart: function() {
                    self.ui.fixedNavs.removeClass('visible');
                },
                onSnapFinish: function(panel) {
                    self.ui.fixedNavs.addClass('visible');

                    if (panel.data('nav-class') === 'dark'){
                        self.ui.fixedNavs.addClass('dark');
                    } else {
                        self.ui.fixedNavs.removeClass('dark');
                    }
                },
                directionThreshold: 30,
                slideSpeed: 300
            };

            $('body').panelSnap(options);
        };

        return app;
    }

    $(document).ready(function(){
        var app = prepareApp();
        app.checkProportions();
        app.setPanelSnap();
        app.bindEvents();
        console.log('no kurwsa maćććć@!!!!!! gówno');
        //console.log("ia");
        // setTimeout(function(){
        //     console.log("ia");
        //     $('body').addClass('loaded');
        // }, 300);

        $(window).on('resize', function(){
            app.checkProportions();

        });
    });
})();
