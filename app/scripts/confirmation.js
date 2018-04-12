/* global $ */
'use strict';
(function () {
  var getUrlParameter = function getUrlParameter(sParam) {
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

   $(document).ready(function(){
       var roomName = 'Tajemnica hrabiego Cromwella';
       if (getUrlParameter('roomid') === 1006) {
          $('.body').addClass('attic');
          roomName = 'Tajemnica hrabiego cromwella'
       }
       $('.js-room-name').text(roomName);
       $('.js-time').text(getUrlParameter('date') + ' godzina: ' + getUrlParameter('h'));
   });
})();
