 /* global $ Snap emailjs */
'use strict';
(function () {
    function prepareApp() {
        var app = {};

        app.getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

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
            splashMenu: $('.splash-menu'),
            commentsDots: $('.comments-dots-item'),
            comments: $('.comment'),
            mailAddress: $('#reply_to'),
            mailFrom: $('#from_name'),
            mailMessage: $('#message_html'),
            mailSend: $('.form-button'),
            mailHint: $('.hint'),
            promoSplash: $('.promo-splash'),
            promoBadge: $('.promo-badge'),
            closePromo: $('.promo-splash-close'),
            closeBadge: $('.promo-badge-close')
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

            this.ui.commentsDots.on('click', function(e){
                this.changeQuote($(e.currentTarget).data('id'));
            }.bind(this));

            this.ui.mailSend.on('click', function(){
                this.sendMail();
            }.bind(this));

            this.ui.closePromo.on('click', function() {
                this.ui.promoSplash.remove();
            }.bind(this));

            this.ui.closeBadge.on('click', function() {
                this.ui.promoBadge.remove();
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

            //if (proportions > 1.50 && windowWidth > 1024 && !this.isMobile()) {
            if (false) {
                var fontSize = windowHeight * 0.135;
                $('body').addClass('full-page');
                $('body, .column').css('font-size', fontSize + 'px');
                $('body').panelSnap('enable');
            } else {
                $('body').removeClass('full-page');
                $('body, .column').css('font-size', '9vw');
                $('body').panelSnap('disable');
                app.loadDefaultSVG();
            }
        };

        app.setPanelSnap = function() {
            var self = this;
            var options = {
                $menu: $('.splash-menu, .scroll-nav, .rooms-columns'),
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
                    if (panel.data('panel') === 'attic' && !panel.hasClass('jsLoaded')) {
                        app.animateAttic();
                        app.loadRoom(panel);
                    }
                    if (panel.data('panel') === 'us' && !panel.hasClass('autoplay')) {
                        app.quoteAutoplayInterval = setInterval(function(){ app.quoteAutoplay(); }, 5000);
                        panel.addClass('autoplay');
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
        };

        //comments slider
        app.changeQuote = function(id) {
            app.ui.comments.removeClass('active');
            app.ui.commentsDots.removeClass('active');
            setTimeout(function () {
                app.ui.comments.closest('[data-id="' + id + '"]').addClass('active');
                app.ui.commentsDots.closest('[data-id="' + id + '"]').addClass('active');
            }, 600);
        };
        app.quoteAutoplayInterval = false;
        app.quoteAutoplay = function(){
            var next = $('.comment.active').next().data('id');
            if(next) {
                app.changeQuote(next);
            } else {
                app.changeQuote(0);
            }
        };
        //Playing with emails
        app.sendMail = function(){
          var email = this.ui.mailAddress.val(),
              name = this.ui.mailFrom.val(),
              message = this.ui.mailMessage.val(),
              wrongEmail = document.getElementById('reply_to').validity.typeMismatch;

          if(email && name && message){
              if (wrongEmail) {
                  this.ui.mailHint.html('Proszę wpisać poprawny email.').addClass('active error');
              } else {
                  emailjs.send('itsatrap', 'template_p0dGo5kl', {'reply_to': email, 'from_name': name, 'message_html': message })
                  .then(function(response) {
                     console.log('SUCCESS. status=%d, text=%s', response.status, response.text);
                  }, function(err) {
                     console.log('FAILED. error=', err);
                     this.ui.mailHint.html('Ups coś poszlo nie tak').addClass('active warning');
                  });

                  this.ui.mailHint.html('Wiadomość została wysłana').addClass('active success');
                  this.ui.mailAddress.val('');
                  this.ui.mailFrom.val('');
                  this.ui.mailMessage.val('');
              }
          } else {
              this.ui.mailHint.html('Proszę uzupełnić wszystkie pola').addClass('active error');
          }
        };

        //Playing with SVG
        app.loadDefaultSVG = function(){
            $('.atticSvgContainer').html('');
            var animSnap = Snap;
            var svg = animSnap('.atticSvgContainer');
            animSnap.load('/images/svg/attic-icon-def.svg', function(icon){
              svg.append(icon.select('#styles'));
              svg.append(icon.select('#icon'));
              svg.append(icon.select('#text'));

              svg.select('#innerCircle').attr({mask: icon.select('#clipTriangle')});
              svg.select('#bigTriangles').attr({mask: icon.select('#clipSmallCircles')});
              svg.select('#angleLines').attr({mask: icon.select('#clipSmallCircles2')});
              svg.select('#icon').attr({mask: icon.select('#clipKey')});

            });
        };
        app.animateAttic = function() {
            $('.atticSvgContainer').html('');
            var animSnap = Snap;
            var svg = animSnap('.atticSvgContainer');
            animSnap.load('/images/svg/attic-icon.svg', function (icon){

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

        app.detectLanguage = function() {
            var isPlLanguage = (window.navigator.userLanguage || window.navigator.language) === 'pl';
            var isPlUrl = !(window.location.pathname.indexOf('en') !== -1);
            if (app.getUrlParameter('lang') !== 'true') {
                if (isPlLanguage && !isPlUrl) {
                    window.location.href = '/?lang=true';
                } else if (!isPlLanguage && isPlUrl){
                    window.location.href = '/en/?lang=true';
                }
            }
        };

        return app;
    }

    $(document).ready(function(){
        var app = prepareApp();
        app.detectLanguage();
        app.setPanelSnap();
        app.checkProportions();
        app.bindEvents();

        setTimeout(function(){
            $('body').addClass('loaded');
            window.scrollTo(0, 0);
        }, 3000);

        $(window).on('resize', function(){
            app.checkProportions();
        });
    });
})();
