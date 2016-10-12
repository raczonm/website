 /* global $ Firebase*/
'use strict';
(function () {

    var source = new Firebase('https://itsatrap.firebaseio.com/hints/attic');

    $(document).on('ready', function(){
        var timerStarted = false;
          var timeCounter;
        function startTimer() {
            timerStarted = true;
            var timeGone = 0;
            var count = 3600 - (timeGone || 0);
            function timer() {
                count = count - 1;
                if (count <= 0) {
                    clearInterval(timeCounter);
                    timeCounter = setInterval(timerUp, 1000); //1000 will  run it every 1 second
                }
                var seconds = count % 60;
                var minutes = Math.floor(count / 60);
                minutes %= 60;
                $('.timer').html(minutes + ':' + seconds); // watch for spelling
            }
            function timerUp() {
                count = count + 1;
                var seconds = count % 60;
                var minutes = Math.floor(count / 60);
                minutes %= 60;
                $('.timer').html('-' + minutes + ':' + seconds); // watch for spelling
            }
            timeCounter = setInterval(timer, 1000); //1000 will  run it every 1 second
        }
        source.on('value', function(snapshot){
            var data = snapshot.val();
            if(data.started) {
                if(!timerStarted) {
                    startTimer();
                }
                if (data.active === 0) {
                    $('.hint-bgr').html('<p class="hint-text">' + data.adhoc + '</p>');
                } else {
                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];
                        console.log(item);
                        if(item.id === data.active) {
                            var content = (item.type === 'text') ? '<p class="hint-text">' + item.text + '</p>' : '<img class="hint-img" src="../' + item.img + '" />';
                            $('.hint-bgr').html(content);
                            return false;
                        }
                    }
                }
            } else {
                $('.hint-bgr').html('');
                timerStarted = false;
                clearInterval(timeCounter);
                $('.timer').html('60:00');
            }
        });
    });
})();
