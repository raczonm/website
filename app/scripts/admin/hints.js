 /* global $ Firebase*/

'use strict';
(function () {

    var admin = {};
    admin.rooms = ['attic', 'pirates', 'garden'];
    admin.data = new Firebase('https://itsatrap.firebaseio.com/hints');

    admin.createRoom = function(name){
        var room = {};
        room.data = admin.data.child(name);
        room.ui = {
            $section: $('.hints.' + name),
            $list: $('.hints.' + name + ' .hints-list'),
            $adhoc: $('.hints.' + name + ' .hints-header-adhoc'),
            $adhocInput: $('.hints.' + name + ' .hints-header-adhoc-text'),
            $adhocButton: $('.hints.' + name + ' .hints-header-adhoc-button'),
            $switch: $('.hints.' + name + ' .hints-header-switch'),
            $timer: $('.hints.' + name + ' .hints-header-timer'),
            $languageSwitch: $('.hints.' + name + ' .hints-footer-language-button')
        };
        room.setActiveHint = function(id){
            room.data.update({'active': id});
            room.ui.$adhoc.removeClass('active');
        };
        room.setAdhoc = function() {
            if(room.ui.$section.hasClass('running')){
                room.data.update({'active': 0, 'adhoc': room.ui.$adhocInput.val()});
                room.ui.$adhoc.addClass('active');
            }
        };
        room.toggleSwitch = function(e){
            if ($(e.currentTarget).hasClass('on')){
                room.stopGame();
            } else {
                room.startGame();
            }
        };
        room.switchLanguage = function(){
            var newLang = room.ui.$languageSwitch.hasClass('eng') ? 'pl' : 'eng';
            room.ui.$languageSwitch.toggleClass('eng');
            room.data.update({'language': newLang});
        };
        room.startGame = function(){
            room.ui.$switch.addClass('on');
            room.ui.$section.addClass('running');
            room.ui.$adhocInput.val('');
            room.data.on('value', room.printHints);
            room.data.update({'started': true, 'timer': Date.now(), 'active': false, 'adhoc': ''});
            room.startTimer();
        };
        room.restartGame = function(data){
            room.ui.$switch.addClass('on');
            room.ui.$section.addClass('running');
            room.ui.$adhocInput.val(data.adhoc);
            if(data.active === 0){
                room.ui.$adhoc.addClass('active');
            }
            room.data.on('value', room.printHints);
            room.startTimer();
            if (data.language === 'eng') {
                room.ui.$languageSwitch.addClass('eng');
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
            room.data.update({'active': false, 'adhoc': '', 'started': false, 'timer': false, 'language': 'pl'});
            room.ui.$languageSwitch.removeClass('eng');
        };
        room.startTimer = function(){
            var count = 10 - (room.timeGone || 0);
            function timer() {
                count = count - 1;
                if (count <= 0) {
                  console.log('?');
                    clearInterval(room.timeCounter);
                    room.timeCounter = setInterval(timerUp, 1000); //1000 will  run it every 1 second
                }
                var seconds = count % 60;
                var minutes = Math.floor(count / 60);
                minutes %= 60;
                room.ui.$timer.html(minutes + ':' + seconds); // watch for spelling
            }
            function timerUp() {
                count = count + 1;
                var seconds = count % 60;
                var minutes = Math.floor(count / 60);
                minutes %= 60;
                room.ui.$timer.html('-' + minutes + ':' + seconds); // watch for spelling
            }

            room.timeCounter = setInterval(timer, 1000); //1000 will  run it every 1 second
        };
        room.printHints = function(snapshot){
            var list = room.ui.$list;
            var data = snapshot.val();
            list.html('');
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i],
                    active = item.id === data.active ? 'active' : '',
                    isPl = data.language === 'pl' ? true : false,
                    textPrimary = isPl ? item.text : item.text_eng,
                    textSmall = isPl ? item.text_eng : item.text,
                    content = item.type === 'text' ? '<p class="hints-list-item-text">' + textPrimary + '<span class="hints-list-item-text-small">' + textSmall + '</span></p>' : '<img class="hints-list-item-image" src="/' + item.img + '" />',
                    button = '<a class="hints-list-item-button button" data-id="' + item.id + '">Set active</a>',
                    el = $('<li data-id="' + item.id + '" class="hints-list-item ' + active + '"> <h4 class="hints-list-item-title">' + item.name + '</h4>' + content + button + '</li>');

                // UNCOMMENT THIS WHEN READY
                list.append(el);
            }
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

        return room;
    };

    $(document).on('ready', function(){
        for(var i = 0; i < admin.rooms.length; i++) {
            admin.createRoom(admin.rooms[i]);
        }
    });
})();
