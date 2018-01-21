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

    var panel = {
        config: {
            roomName: 'attic',
            listRef: 'hints/attic/list/',
            fileMeta: {
                contentType: 'image'
            }
        },
        level: false,
        type: false,
        data: firebase.database(),
        ui: {
            $list: $('.js-panel-list'),
            $newForm: $('.js-panel-add'),
            $addNewButton: $('.js-panel-add-button'),
            $typeSelect: $('.js-form-type'),
            $textInputs: $('.panel-add .textarea'),
            $fileInputs: $('.panel-add .file'),
            $title: $('.js-panel-title'),
            $levelLink: $('.js-level'),
            $typeLink: $('.js-type')
        },

        prepareHtmlNode: function(key, hint) {
            var content;
            var htmlNode;

            if (hint.type === 'text') {
                content = '<p class="panel-list-content-p">' + hint.text + '</p>\
                           <p class="panel-list-content-p">' + hint.text_eng + '</p>';
            } else {
                content = '<img src=' + hint.img + ' class="panel-list-content-img" />';
            }

            htmlNode =
                '<li class="panel-list-item" data-key=' + key + ' data-type=' + hint.type + ' data-level=' + hint.level + '>\
                    <div class="panel-list-id">'
                        + hint.level +
                        '<span class="panel-list-sort">(' + hint.sort + ')</span>\
                    </div>\
                    <div class="panel-list-content">\
                        <h4 class="panel-list-content-name">' + hint.name + '</h4>'
                        + content +
                    '</div>\
                    <div class="panel-list-nav">\
                        <a class="panel-list-button red js-delete">Usuń</a>\
                        <a class="panel-list-button blue js-edit">Edytuj</a>\
                    </div>\
                </li>';
            return htmlNode;
        },

        showHints: function(snapshot) {
            panel.ui.$list.empty();
            console.log(snapshot.val());
            snapshot.forEach(function(item) {
                panel.ui.$list.append(panel.prepareHtmlNode(item.key, item.val()));
            });
            panel.toggleVisibleClass();
        },

        toggleActiveFields: function() {
            if (panel.ui.$typeSelect.val() === 'text') {
                panel.ui.$textInputs.removeClass('hidden').attr('required', true);
                panel.ui.$fileInputs.addClass('hidden');
            } else {
              panel.ui.$fileInputs.removeClass('hidden');
              panel.ui.$textInputs.addClass('hidden').attr('required', false);
            }
        },

        toggleVisibleClass: function() {
            var items = panel.ui.$list.find('li');
            items.removeClass('visible');

            if (panel.level !== false) {
                items = items.closest('[data-level=' + panel.level + ']');
            }

            if (panel.type !== false) {
                items = items.closest('[data-type=' + panel.type + ']');
            }

            items.addClass('visible');
        },

        saveHint: function(e) {
            var data;

            e.preventDefault();

            if (panel.ui.$newForm[0].checkValidity()) {
                data = {
                    name: panel.ui.$newForm.find('.js-form-name').val(),
                    type: panel.ui.$newForm.find('.js-form-type').val(),
                    text: panel.ui.$newForm.find('.js-form-text').val(),
                    text_eng: panel.ui.$newForm.find('.js-form-text-eng').val(),
                    level: panel.ui.$newForm.find('.js-form-level').val(),
                    sort: parseInt(panel.ui.$newForm.find('.js-form-sort').val())
                };

                if (panel.ui.$typeSelect.val() === 'text') {
                    panel.finishSaveHint(data);
                } else {
                    panel.saveFile(data, panel.ui.$newForm.find('.js-form-file')[0].files[0]);
                }
            }
        },

        finishSaveHint: function(data) {
            var editKey = panel.ui.$newForm.data('key');
            if (editKey) {
                panel.data.ref(panel.config.listRef + editKey).set(data);
                panel.ui.$newForm.data('key', '');
            } else {
                panel.data.ref(panel.config.listRef).push(data);
            }
            panel.ui.$newForm.find('input, textarea').val('');
            panel.ui.$title.text('DODAJ PODPOWIEDŹ');
            panel.ui.$addNewButton.text('DODAJ');
        },

        editHint: function(e) {
            var key = $(e.currentTarget).closest('li').data('key');
            panel.ui.$title.text('EDYCJA PODPOWIEDZI');
            panel.ui.$addNewButton.text('ZMIEŃ');

            panel.data.ref(panel.config.listRef + key).once('value', function(snapshot) {
                var data = snapshot.val();
                panel.ui.$newForm.data('key', key);
                panel.ui.$newForm.find('.js-form-name').val(data.name);
                panel.ui.$newForm.find('.js-form-type').val(data.type);
                panel.ui.$newForm.find('.js-form-level').val(data.level);
                panel.ui.$newForm.find('.js-form-sort').val(data.sort);

                if (panel.ui.$typeSelect.val() === 'text') {
                    panel.ui.$newForm.find('.js-form-text').val(data.text);
                    panel.ui.$newForm.find('.js-form-text-eng').val(data.text_eng);
                } else {
                    panel.ui.$newForm.find('.js-form-file').val('').attr('data-old', data.img);
                }
                panel.toggleActiveFields();
            });
        },

        deleteHint: function(e) {
            var key = $(e.currentTarget).closest('li').data('key');
            if (window.confirm("Napewno chcesz mnie zesłać do otchłani :( ?")) {
                panel.data.ref(panel.config.listRef + key).remove();
            }
        },

        saveFile: function(data, file) {
            if (file) {
                var uploadTask = firebase.storage().ref('hints/' + panel.config.roomName + '/' + file.name).put(file, panel.config.fileMeta);

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    function(snapshot) {
                    }, function(error) {
                        console.error(error);
                    }, function() {
                        data.img = uploadTask.snapshot.downloadURL;
                        panel.finishSaveHint(data);
                });
            } else {
                data.img = panel.ui.$newForm.find('.js-form-file').attr('data-old');
                panel.finishSaveHint(data);
            }
        },

        changeActiveType: function(e) {
            panel.ui.$typeLink.removeClass('active');
            panel.type = $(e.currentTarget).data('type');
            $(e.currentTarget).addClass('active');
            panel.toggleVisibleClass();
        },

        changeActiveLevel: function(e) {
            panel.ui.$levelLink.removeClass('active');
            panel.level = $(e.currentTarget).data('level');
            $(e.currentTarget).addClass('active');
            panel.toggleVisibleClass();
        }
    };

    $(document).on('ready', function() {
        panel.toggleActiveFields();
        panel.data.ref(panel.config.listRef).orderByChild('sort').on('value', panel.showHints);
        panel.ui.$newForm.on('submit', panel.saveHint);
        panel.ui.$list.on('click', '.js-edit', panel.editHint);
        panel.ui.$list.on('click', '.js-delete', panel.deleteHint);
        panel.ui.$typeSelect.on('change', panel.toggleActiveFields);
        panel.ui.$typeLink.on('click', panel.changeActiveType);
        panel.ui.$levelLink.on('click', panel.changeActiveLevel);
    });
})();
