 /* global $ Firebase*/

'use strict';
(function () {

    var admin = {};
    admin.rooms = ['attic', 'pirates', 'garden'];
    admin.data = new Firebase('https://itsatrap.firebaseio.com/hints');

    admin.createRoom = function(name) {
        var room = {};
        room.data = admin.data.child(name);
        room.ui = {
            $section: $('.hints.' + name),
            $list: $('.hints.' + name + ' .hints-list'),
            $adhocInput: $('.hints.' + name + ' .hints-header-adhoc-text')
        }
        room.setActiveHint = function(id) {
          console.log(id);
            room.data.update({"active": id});
        }
        room.setAdhoc = function() {
            room.data.update({"active": 0, "adhoc": room.ui.$adhocInput.val()});
        }
        room.printHints = function(snapshot){
            var list = room.ui.$list;
            list.html('');
            var data = snapshot.val();
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

        room.data.on('value', room.printHints);

        return room;
    }

    admin.getHints = function(){
        var room = admin.ui.$section.data('room');
        return admin.data.child(room);
    };

    admin.setActiveHint = function(id){
        admin.getHints().update({'active': id});
    };

    admin.printHints = function(snapshot) {
        var list = admin.ui.$list;
        list.html('');
        var data = snapshot.val();
        for (var i = 0; i < data.list.length; i++) {
            var item = data.list[i],
                active = item.id === data.active ? 'active' : '',
                content = item.type === 'text' ? '<p class="hints-list-item-text">' + item.text + '</p>' : '<img class="hints-list-item-image" src="/' + item.img + '" />',
                button = '<a class="hints-list-item-button button" data-id="' + item.id + '">Set active</a>',
                el = '<li class="hints-list-item ' + active + '"> <h4 class="hints-list-item-title">' + item.name + '</h4>' + content + button + '</li>';
            list.append(el);
        }
    };

    $(document).on('ready', function(){
        for(var i = 0; i< admin.rooms.length; i++) {
            admin.createRoom(admin.rooms[i]);
        }
    });
})();
