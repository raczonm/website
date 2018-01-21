 /* global $ firebase*/

'use strict';
(function () {
    var config = {
       apiKey: 'AIzaSyC-npR_tEgAs6b1cIFA-6tLne_WRbtQTTc',
       authDomain: 'its-a-trap-2.firebaseapp.com',
       databaseURL: 'https://its-a-trap-2.firebaseio.com',
       projectId: 'its-a-trap-2',
       storageBucket: 'its-a-trap-2.appspot.com',
       messagingSenderId: '506853544039'
    };
    firebase.initializeApp(config);

    var admin = {};
    admin.rooms = ['attic', 'pirates', 'garden'];
    admin.data = firebase.database();

    admin.createRoom = function(name){
        var room = {};
        room.data = admin.data.ref('hints/' + name);
        room.sectionClass = '.hints.' + name;
        room.ui = {
            $section: $(room.sectionClass),
            $list: $(room.sectionClass + ' .hints-list'),
            $adhoc: $(room.sectionClass + ' .hints-header-adhoc'),
            $adhocInput: $(room.sectionClass + ' .hints-header-adhoc-text'),
            $adhocButton: $(room.sectionClass + ' .hints-header-adhoc-button'),
            $switch: $(room.sectionClass + ' .js-start'),
            $timer: $(room.sectionClass + ' .hints-header-timer'),
            $languageSwitch: $(room.sectionClass + ' .language-switch'),
            $levels: $(room.sectionClass + ' .js-level'),
            $pause: $(room.sectionClass + ' .js-pause'),
            $pauseIcon: $(room.sectionClass + ' .js-pause-icon'),
            $clear: $(room.sectionClass + ' .js-clear'),
            $customTimeToggle: $(room.sectionClass + ' .js-custom-time i.fa-clock-o'),
            $customTimeTrigger: $(room.sectionClass + ' .js-custom-time-trigger'),
            $customTimeInner: $(room.sectionClass + ' .js-custom-time-inner'),
            $customTimeInput: $(room.sectionClass + ' .js-custom-time-input')
        };
        room.isZeroActive = true;

        room.setActiveHint = function(id){
            room.data.update({'active': id});
            room.ui.$adhoc.removeClass('active');
        };

        room.clearHint = function(){
            room.ui.$adhocInput.val('');
            room.ui.$adhoc.removeClass('active');
            room.data.update({'active': 0, 'adhoc': room.ui.$adhocInput.val()});
        };

        room.setAdhoc = function() {
            if(room.ui.$section.hasClass('running')){
                room.data.update({'active': 0, 'adhoc': room.ui.$adhocInput.val()});
                room.ui.$adhoc.addClass('active');
            }
        };

        room.setActiveLevel = function(e){
            var $item = $(e.currentTarget);
            room.ui.$levels.removeClass('active');
            room.data.update({'active_level': $item.data('level')});
            $item.addClass('active');
        };

        room.toggleSwitch = function(e){
            if ($(e.currentTarget).hasClass('on')){
                room.stopGame();
            } else {
                room.startGame();
            }
        };

        room.switchLanguage = function(){
            var newLang = room.ui.$languageSwitch.hasClass('eng') ? 'PL' : 'ENG';
            room.ui.$languageSwitch.text(newLang);
            room.ui.$languageSwitch.toggleClass('eng');
            room.data.update({'language': newLang});
        };

        room.addActiveClasses = function(){
            room.ui.$switch.addClass('on');
            room.ui.$section.addClass('running');
        };

        room.toggleCustomTime = function() {
            room.ui.$customTimeInput.val('');
            room.ui.$customTimeInner.toggleClass('active');
        };

        room.startGame = function(customTime) {
            var currentTime = Date.now();
            var timeToShow;
            if (customTime) {
                var timeLeft = (60 - customTime) * 60000;
                timeToShow = currentTime - timeLeft;
                room.timeGone = timeLeft / 1000;
            } else {
                timeToShow = currentTime;
            }
            room.ui.$adhocInput.val('');
            room.data.on('value', room.printHints);
            room.data.update({'active_level': 1, 'started': true, 'timer': timeToShow, 'active': false, 'adhoc': ''});
            room.startTimer(timeToShow);
            room.addActiveClasses();
        };

        room.restartGame = function(data){
            room.addActiveClasses();
            room.ui.$adhocInput.val(data.adhoc);

            if(data.active === 0){
                room.ui.$adhoc.addClass('active');
            }

            room.data.on('value', room.printHints);
            room.startTimer();

            if (data.language === 'ENG') {
                room.ui.$languageSwitch.addClass('eng');
                room.ui.$languageSwitch.text('ENG');
            }

            if (data.active_level !== 1) {
                room.ui.$levels.removeClass('active');
                room.ui.$levels.filter('[data-level=' + data.active_level + ']').addClass('active');
            }
        };

        room.stopGame = function(){
            clearInterval(room.timeCounter);
            room.ui.$switch.removeClass('on');
            room.ui.$section.removeClass('running');
            room.data.off('value');
            room.ui.$list.html('');
            room.timeGone = false;
            room.ui.$adhoc.removeClass('active');
            room.data.update({'paused': false, 'active': false, 'adhoc': '', 'started': false, 'timer': false, 'language': 'PL'});
            room.ui.$languageSwitch.removeClass('eng');
            room.ui.$languageSwitch.text('PL');
            room.ui.$pauseIcon.addClass('fa-pause').removeClass('fa-play');
        };

        room.startTimer = function(){
            var count = 3600 - (room.timeGone || 0),
                minus = '',
                isMinus = false;

            function timer() {
                if (count <= 0 || isMinus) {
                    count++;
                    isMinus = true;
                    minus = '-';
                } else {
                    count--;
                }
                var seconds = count % 60,
                    minutes = Math.floor(count / 60);
                minutes %= 60;
                seconds = (seconds >= 10) ? seconds : '0' + seconds;
                room.ui.$timer.html(minus + minutes + ':' + seconds); // watch for spelling
            }
            room.restartTimer = function() {
                room.timeCounter = setInterval(timer, 1000);
            };
            room.timeCounter = setInterval(timer, 1000); //1000 will  run it every 1 second
        };

        room.pause = function() {
            if (room.timeCounter) {
                clearInterval(room.timeCounter);
                room.timeCounter = false;
                room.ui.$pauseIcon.addClass('fa-play').removeClass('fa-pause');
                room.data.update({'paused': true });
            } else {
                room.restartTimer();
                room.ui.$pauseIcon.addClass('fa-pause').removeClass('fa-play');
                room.data.update({'paused': false });
            }
        };

        room.printHints = function(snapshot){
            var list = room.ui.$list;
            var data = snapshot.val();
            var isPl = data.language === 'PL' ? true : false;
            list.html('');

            admin.data.ref('hints/' + name + '/list/').orderByChild('sort').on('value', function(items) {
                items.forEach(function(el) {
                    var item = el.val();
                    var key = el.key;
                    if (item.level == 0 || item.level == data.active_level) {
                        var active = key == data.active ? 'active' : '',
                            textPrimary = isPl ? item.text : item.text_eng,
                            content = item.type === 'text' ? '<p class="hints-list-item-text">' + textPrimary + '</p>' : '<img class="hints-list-item-image" src="' + item.img + '" />',
                            el = $('<li data-id="' + key + '" class="hints-list-item ' + active + '"> <h4 class="hints-list-item-title">' + item.name + '</h4>' + content + '</li>');
                        list.append(el);
                    }
                });
            });

            list.find('li').on('click', function(){
                room.setActiveHint($(this).data('id'));
            });
        };

        room.data.once('value', function(snapshot){
            var data = snapshot.val();
            if (data && data.started) {
                room.timeGone = Math.round((Date.now() - data.timer) / 1000);
                if(room.timeGone < 3600){
                    room.restartGame(data);
                } else {
                    room.stopGame();
                }
            }
        });

        room.ui.$switch.on('click', room.toggleSwitch);
        room.ui.$languageSwitch.on('click', room.switchLanguage);
        room.ui.$adhocButton.on('click', room.setAdhoc);
        room.ui.$levels.on('click', room.setActiveLevel);
        room.ui.$pause.on('click', room.pause);
        room.ui.$clear.on('click', room.clearHint);
        room.ui.$customTimeToggle.on('click', room.toggleCustomTime);
        room.ui.$customTimeTrigger.on('click', function() {
            var customTime = room.ui.$customTimeInput.val();
            if (customTime && customTime !== 0) {
                room.stopGame();
                room.startGame(customTime);
            }
        });
        //room.ui.$clear.on('click', room.toggleCustomTime);

        return room;
    };

    $(document).on('ready', function(){
        for(var i = 0; i < admin.rooms.length; i++) {
            admin.createRoom(admin.rooms[i]);
        }
    });
})();
