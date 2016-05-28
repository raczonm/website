 /* global $ Snap */
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
                onSnapStart: function() {},
                onSnapFinish: function(panel) {
                    if (panel.data('panel') == 'attic' && !panel.hasClass('jsLoaded')) {
                        app.animateAttic();
                        app.loadRoom(panel);
                    }
               },
                directionThreshold: 30,
                slideSpeed: 300
            };

            $('body').panelSnap(options);
        };

        //AnimateRoom
        app.loadRoom = function(panel) {
            panel.addClass('jsLoaded');
            setTimeout(function(){
                setTimeout(function(){ panel.find('.room-section-svg-wrapper').addClass('loaded'); }, 100);
                setTimeout(function(){ panel.find('.room-section-header').addClass('loaded'); }, 800);
                setTimeout(function(){ panel.find('.room-column:eq(0)').addClass('loaded'); }, 1700);
                setTimeout(function(){ panel.find('.room-column:eq(1)').addClass('loaded'); }, 2000);
                setTimeout(function(){ panel.find('.room-column:eq(2)').addClass('loaded'); }, 2300);

                setTimeout(function(){ panel.find('.room-paragraph').addClass('loaded'); }, 3100);
                setTimeout(function(){ panel.find('.button').addClass('loaded'); }, 3700);
            }, 4000);
        }

        //Playing with SVG
        app.animateAttic = function() {
            var animSnap = Snap;
            var svg = animSnap('.atticSvgContainer');
            animSnap.load('/images/svg/attic-icon.svg', function (icon){
                //debugger;
                svg.append(icon.select('#styles'));
                svg.append(icon.select('#icon'));
                svg.append(icon.select('#text'));

                svg.select('#innerCircle').attr({mask: icon.select('#clipTriangle')});
                svg.select('#bigTriangles').attr({mask: icon.select('#clipSmallCircles')});
                svg.select('#angleLines').attr({mask: icon.select('#clipSmallCircles2')});
                svg.select('#icon').attr({mask: icon.select('#clipKey')});

                setTimeout(function(){
                    svg.select('#outerCircle').animate({'stroke-dashoffset': 0}, 5250);
                    setTimeout(function(){ svg.select('#bigLine1').animate({'stroke-dashoffset': 0}, 1500); }, 750);
                    setTimeout(function(){ svg.select('#bigLine2').animate({'stroke-dashoffset': 0}, 1500); }, 1500);
                    setTimeout(function(){ svg.select('#bigLine3').animate({'stroke-dashoffset': 0}, 1500); }, 2250);

                    setTimeout(function(){ svg.select('#bigLine4').animate({'stroke-dashoffset': 0}, 1500); }, 750);
                    setTimeout(function(){ svg.select('#bigLine5').animate({'stroke-dashoffset': 0}, 1500); }, 1500);
                    setTimeout(function(){ svg.select('#bigLine6').animate({'stroke-dashoffset': 0}, 1500); }, 2250);

                    setTimeout(function(){svg.select('#innerCircle').animate({'stroke-dashoffset': 0}, 2250); }, 1500);

                    setTimeout(function(){svg.select('#angleLine1').animate({'stroke-dashoffset': 0}, 750); }, 3000);
                    setTimeout(function(){svg.select('#angleLine2').animate({'stroke-dashoffset': 0}, 750); }, 3000);
                    setTimeout(function(){svg.select('#angleLine3').animate({'stroke-dashoffset': 0}, 750); }, 3000);

                    setTimeout(function(){svg.select('#smallCircle2').animate({'stroke-dashoffset': 0}, 450); }, 1125);
                    setTimeout(function(){svg.select('#smallCircle5').animate({'stroke-dashoffset': 0}, 450); }, 1125);
                    setTimeout(function(){svg.select('#smallCircle1').animate({'stroke-dashoffset': 0}, 450); }, 1875);
                    setTimeout(function(){svg.select('#smallCircle4').animate({'stroke-dashoffset': 0}, 450); }, 1875);
                    setTimeout(function(){svg.select('#smallCircle3').animate({'stroke-dashoffset': 0}, 450); }, 2625);
                    setTimeout(function(){svg.select('#smallCircle6').animate({'stroke-dashoffset': 0}, 450); }, 2625);

                    setTimeout(function(){svg.select('#smallLine2').animate({'stroke-dashoffset': 0}, 1500); }, 1425);
                    setTimeout(function(){svg.select('#smallLine5').animate({'stroke-dashoffset': 0}, 1500); }, 1425);
                    setTimeout(function(){svg.select('#smallLine3').animate({'stroke-dashoffset': 0}, 1500); }, 2125);
                    setTimeout(function(){svg.select('#smallLine4').animate({'stroke-dashoffset': 0}, 1500); }, 2125);
                    setTimeout(function(){svg.select('#smallLine1').animate({'stroke-dashoffset': 0}, 1500); }, 2925);
                    setTimeout(function(){svg.select('#smallLine6').animate({'stroke-dashoffset': 0}, 1500); }, 2925);

                    setTimeout(function(){svg.select('#middleCircle').animate({'stroke-dashoffset': 0}, 450); }, 2250);
                    setTimeout(function(){svg.select('#key').animate({'opacity': 1}, 1000); }, 3000);
                    setTimeout(function(){svg.select('#clipKeyPath').animate({'opacity': 1}, 500); }, 3000);
                    setTimeout(function(){svg.select('#textBgr').animate({'opacity': 1}, 500); }, 3500);
                    setTimeout(function(){svg.select('#text').animate({'opacity': 1}, 500); }, 3700);

                }, 100);
            });
        };

        //app.booking = new TimekitBooking();
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
                length: '1 hours, 30 minutes'
              //  ignore_all_day_events: true // eslint-disable-line no-use-before-define
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
                showTimezoneHelper: false // Should the timezone difference helper (bottom) be shown?
            }
        };

        return app;
    }

    $(document).ready(function(){
        var app = prepareApp();
        app.setPanelSnap();
        app.checkProportions();
        app.bindEvents();
        //app.booking.init(app.bookingConfig);

        setTimeout(function(){
            $('body').addClass('loaded');
            window.scrollTo(0,0)
        }, 3000);

        $(window).on('resize', function(){
            app.checkProportions();
        });
    });
})();
