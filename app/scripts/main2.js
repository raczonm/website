 /* global $ */
'use strict';
(function () {
    function prepareApp() {
        var app = {};

        app.isMobile = function() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
               return true;
            }
            return false;
        };

        app.ui = {
            body: $('body'),
            scrollNav: $('.scroll-nav'),
            snapNext: $('.scroll-nav-down'),
            snapPrev: $('.scroll-nav-up'),
            menuLink: $('.toggle-menu'),
            bookLink: $('.book-now'),
            fixedBookLink: $('.fixed-navs-item.book-now'),
            fixedNavs: $('.fixed-navs'),
            splashMenu: $('.splash-menu')
        };

        app.bindEvents = function() {
            this.ui.bookLink.on('click', function() {
                this.ui.menuLink.removeClass('active');
                this.ui.body.addClass('with-splash-book');
                this.ui.fixedNavs.addClass('hidden');
            }.bind(this));

            this.ui.menuLink.on('click', function() {
                this.ui.menuLink.toggleClass('active');
                this.ui.body.toggleClass('with-splash-menu').removeClass('with-splash-book');
            }.bind(this));

            this.ui.splashMenu.on('click', 'a', function() {
                  this.ui.menuLink.removeClass('active');
                  this.ui.body.removeClass('with-splash-menu');
            }.bind(this));
        };

        app.closeBooking = function(){
            this.ui.body.removeClass('with-splash-book');
            this.ui.fixedNavs.removeClass('hidden');
        };

        app.checkProportions = function() {
            var windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                proportions = windowWidth / windowHeight;

            if (proportions > 1.50 && windowWidth > 1024 && !this.isMobile()) {
                var fontSize = windowHeight * 0.135;
                $('body').addClass('full-page');
                $('body, .column').css('font-size', fontSize + 'px');
                $('body').panelSnap('enable');
            } else {
                $('body').removeClass('full-page');
                $('body, .column').css('font-size', '9vw');
                $('body').panelSnap('disable');
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

        app.booking = new TimekitBooking();
        app.bookingConfig = {
            name: 'Strych - Rezerwacja',
            email: 'itsatrapescape@gmail.com',
            apiToken: '3D7sVhBPvB9X2iXcpEgQ0KtnGJhMJ6Dz',
            calendar: '43c56a63-1886-423d-ad3f-6d9ea02241df',
            avatar: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            timekitFindTime: {
                filters: {
                    and: [
                        { 'specific_time': {'start': 13, 'end': 23} }
                    ]
                },
                future: '6 months',
                length: '1 hours, 30 minutes',
                ignore_all_day_events: true // eslint-disable-line no-use-before-define
            },
            fullCalendar: {
                businessHours: false,
                height: 'auto',
                contentHeight: 'auto',
                minTime: '13:00:00',
                maxTime: '23:00:00',
                timeFormat: 'H:mm',
                dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
                dayNamesShort: ['NIE', 'PON', 'WT', 'ŚR', 'CZW', 'PT', 'SOB'],
                monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipies', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
                monthNamesShort: [ 'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
                views: {
                   agenda: {
                       columnFormat: 'ddd \n DD MMM'
                   }
                },
                firstDay: '1',
                nowIndicator: false,
                customButtons: {
                    closeButton: {
                        text: 'Zamknij',
                        click: function() {
                            app.closeBooking();
                        }
                    }

                },
                header: {
                   right: 'today, prev, next, closeButton'
                }
            },
            localization: {
                showTimezoneHelper: false, // Should the timezone difference helper (bottom) be shown?
            }
        };

        return app;
    }

    $(document).ready(function(){

        var app = prepareApp();
        app.setPanelSnap();
        app.checkProportions();
        app.bindEvents();
        app.booking.init(app.bookingConfig);

        setTimeout(function(){
            $('body').addClass('loaded');
        }, 3000);

        $(window).on('resize', function(){
            //$('body').removeClass('loaded');
            app.checkProportions();
            // setTimeout(function(){
            //     $('body').addClass('loaded');
            // }, 3000);
        });
    });
})();
