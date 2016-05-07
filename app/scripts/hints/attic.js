 /* global $ Firebase*/
'use strict';
(function () {

    var source = new Firebase('https://itsatrap.firebaseio.com/hints/attic');

    $(document).on('ready', function(){
        source.on('value', function(snapshot){
            var data = snapshot.val();
            for (var i = 0; i < data.list.length; i++) {
                var item = data.list[i];
                if(item.id === data.active) {
                    $('.hint-bgr').html('<p class="hint-text">' + item.text + '</p>');
                    return false;
                }
            }
        });
    });
})();
