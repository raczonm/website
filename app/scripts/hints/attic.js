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

    var source = firebase.database().ref('hints/attic');

    $(document).on('ready', function(){
        var timerStarted = false,
            timeCounter,
            restartTimer,
            isPaused,
            timeGone;

        function startTimer() {
            timerStarted = true;
            var minus = '',
                isMinus = false,
                count = 3600 - (timeGone || 0);

            function timer() {
                if (count <= 0 || isMinus) {
                    count++;
                    minus = '-';
                    isMinus = true;
                } else {
                    count--;
                }
                var seconds = count % 60,
                    minutes = Math.floor(count / 60);
                minutes %= 60;
                seconds = (seconds >= 10) ? seconds : '0' + seconds;
                $('.timer').html(minus + minutes + ':' + seconds); // watch for spelling
            }
            restartTimer = function() {
                timeCounter = setInterval(timer, 1000);
            };
            timeCounter = setInterval(timer, 1000); //1000 will  run it every 1 second
        }

        source.on('value', function(snapshot){
            var data = snapshot.val();
            if(data.started) {
                if(!timerStarted) {
                    timeGone = Math.round((Date.now() - data.timer) / 1000);
                    startTimer();
                }
                if(data.paused) {
                    clearInterval(timeCounter);
                    isPaused = true;
                }
                if(!data.paused && isPaused) {
                    restartTimer();
                    isPaused = false;
                }
                if (data.active === 0) {
                    $('.hint-bgr').html('<p class="hint-text">' + data.adhoc + '</p>');
                } else {
                    $.each(data.list, function(key, item) {
                        if (key == data.active) {
                            var text = data.language === 'PL' ? item.text : item.text_eng,
                                content = (item.type === 'text') ? '<p class="hint-text">' + text + '</p>' : '<img class="hint-img" src="' + item.img + '" />';
                            $('.hint-bgr').html(content);
                            return false;
                        }
                    });
                }
            } else {
                $('.hint-bgr').html('');
                timerStarted = false;
                isPaused = false;
                clearInterval(timeCounter);
                $('.timer').html('60:00');
            }
        });
    });
})();
