 /* global $ Firebase*/
'use strict';
(function () {

    var source = new Firebase('https://itsatrap.firebaseio.com/hints/attic');

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
                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];
                        if(item.id === data.active) {
                            var text = data.language === 'PL' ? item.text : item.text_eng,
                                content = (item.type === 'text') ? '<p class="hint-text">' + text + '</p>' : '<img class="hint-img" src="../' + item.img + '" />';
                            $('.hint-bgr').html(content);
                            return false;
                        }
                    }
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
