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
            $adhocInput: $('.hints.' + name + ' .hints-header-adhoc-text'),
            $adhocButton: $('.hints.' + name + ' .hints-header-adhoc-button'),
            $switch: $('.hints.' + name + ' .hints-header-switch'),
            $timer: $('.hints.' + name + ' .hints-header-timer')
        }
        room.setActiveHint = function(id){
            room.data.update({'active': id});
        }
        room.setAdhoc = function() {
            room.data.update({'active': 0, 'adhoc': room.ui.$adhocInput.val()});
        }
        room.toggleSwitch = function(e){
            if ($(e.currentTarget).hasClass('on')){
                room.stopGame();
            } else {
                room.startGame();
            }
        }
        room.startGame = function(){
            room.ui.$switch.addClass('on');
            room.ui.$section.addClass('running');
            room.data.on('value', room.printHints);
            room.data.update({'started': true, 'timer': Date.now()});
            room.startTimer();
        },
        room.stopGame = function(){
            clearInterval(room.timeCounter);
            room.ui.$switch.removeClass('on');
            room.ui.$section.removeClass('running');
            room.data.off('value');
            room.ui.$list.html('');
            room.data.update({'active': false, 'adhoc': '', 'started': false, 'timer': false});
        },
        room.startTimer = function(){
            var count = 3600;
            room.timeCounter = setInterval(timer, 1000); //1000 will  run it every 1 second

            function timer() {
              count = count - 1;
              if (count == -1) {
                  room.stopGame();
                  return;
              }
              var seconds = count % 60;
              var minutes = Math.floor(count / 60);
              minutes %= 60;
              room.ui.$timer.html(minutes + ":" + seconds); // watch for spelling
            }
        }
        room.printHints = function(snapshot){
            var list = room.ui.$list;
            var data = snapshot.val();
            list.html('');
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i],
                    active = item.id === data.active ? 'active' : '',
                    content = item.type === 'text' ? '<p class="hints-list-item-text">' + item.text + '</p>' : '<img class="hints-list-item-image" src="/' + item.img + '" />',
                    button = '<a class="hints-list-item-button button" data-id="' + item.id + '">Set active</a>',
                    el = $('<li data-id="' + item.id + '" class="hints-list-item ' + active + '"> <h4 class="hints-list-item-title">' + item.name + '</h4>' + content + button + '</li>');
                    el.on('click', function(){room.setActiveHint($(this).data('id'))});
                list.append(el);
            }
        }


        room.ui.$switch.on('click', room.toggleSwitch);
        room.ui.$adhocButton.on('click', room.setAdhoc);

        return room;
    }

    $(document).on('ready', function(){
        for(var i = 0; i< admin.rooms.length; i++) {
            admin.createRoom(admin.rooms[i]);
        }
    });
})();
