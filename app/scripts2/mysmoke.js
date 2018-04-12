var canvas = document.getElementById('js_smoke');
var ctx = canvas.getContext('2d');

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var topPos = screenHeight + 200;

canvas.width = screenWidth;
canvas.height = screenHeight;


var party = smokemachine(ctx, [255, 255, 255])

party.start() // start animating

var addSmokeItem =function(positionHorizontal, isTop, timeout) {
  setTimeout(function(){
      setInterval(function() {
          party.addsmoke(
              screenWidth * positionHorizontal,
              isTop ? topPos : 0,
              10,
              8000,
              !isTop
          );
      }, 2000);
  }, timeout);
}

runSmoke = function() {
    addSmokeItem(1, false, 2000);
    addSmokeItem(1, true, 4000);
    addSmokeItem(0.8, false, 6000);
    addSmokeItem(0.6, false, 8000);
    addSmokeItem(0.8, true, 10000);
    addSmokeItem(0, true, 12000);
    addSmokeItem(0.2, true, 14000);
    addSmokeItem(0.4, false, 16000);
    addSmokeItem(0.6, true, 18000);
    addSmokeItem(0.2, false, 18000);
    addSmokeItem(0.4, true, 20000);
    addSmokeItem(0, false, 22000);


}

setTimeout(function(){
    runSmoke();
}, 1000);


// var startX = 50;
// var startY = 50;
// var endX = 100;
// var endY = 100;
// var amount = 0;
// for (var i = 1;  i < 100; i++) {
//   setTimeout(function() {
//       amount += 0.05;
//       //ctx.clearRect(100, 100, 200, 200);
//       ctx.strokeStyle = "white";
//       ctx.shadowBlur = 10;
//       ctx.shadowColor = "white";
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
//       ctx.stroke();
//   }, 10*i);
// }
