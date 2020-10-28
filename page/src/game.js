
if(!HTMLElement.prototype.hold){
  Object.defineProperty(HTMLElement.prototype, 'hold', {
      configurable: true,
      enumerable: false,
      writable: true,
      /**
      * @function callback　長押し判定後に行われる何かの処理
      * @int holdtime 長押し判定時間のしきい値(ミリ秒)
      */
      value: function(callback,holdtime) {
          this.addEventListener('mousedown', function (event) {
              event.preventDefault();
              callback(); //event.preventDefaultでクリック等のイベントが解除されてしまうので、要素初タッチ時にも処理を行うようcallbackを設置しておく。
              let time = 0;
              const interval = setInterval(function(){
                time += 100;
                if(time > holdtime){
                  callback();
                }
              },1);
              this.addEventListener('mouseup', function (event) {
                event.preventDefault();
                clearInterval(interval);
              });
          });
      }
  });
}

var input_key_buffer = new Array();
var button_ =new Array();
var rep="/testpage"

window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
  if(e.keyCode == 38){
    time++;
  }
  e.preventDefault();
  input_key_buffer[e.keyCode] = true;
}

window.addEventListener("keyup", handleKeyup);
function handleKeyup(e) {
  if(e.keyCode == 38){
    time = 0;
  }
  e.preventDefault();
  input_key_buffer[e.keyCode] = false;
} 

const l = document.querySelector('.left');
const r = document.querySelector('.right');
const j = document.querySelector('.jump');
l.hold(()=>{button_[0]=true;},0);
r.hold(()=>{button_[1]=true;},0);
j.hold(()=>{button_[2]=true;},0);

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");


var x = 500;
var y = 600;
var left=true;



var vy = 0;

var isJump = false;

var isGameOver = false;

var time = 0;
var time2 = 0;


var blocks = [
  { x: 0, y: 800, w: 1920, h: 32 },
  { x: 150, y: 600, w: 100, h: 32 },
  { x: 300, y: 200, w: 730, h: 32 }
];
var houses = [
  {x: 800, y: 0, w:200 , h:200,src:rep+"/images/house-01/base.png",in:false,link:"https://igc2.jp" },
]


window.addEventListener("load", update);


function update() {

  ctx.clearRect(0, 0, 1920, 960);
  var titleImage = new Image();
  titleImage.src= rep+"/images/title/base.png";
  ctx.drawImage(titleImage, 600, 300, 500, 500);

  var updatedX = x;
  var updatedY = y;

  if (isGameOver) {

    updatedY = y + vy;


    vy = vy + 1;

    if (y > 1000) {

      alert("GAME OVER");
      isGameOver = false;
      isJump = false;
      updatedX = 0;
      updatedY = 600;
      vy = 0;
    }
  } else {

    if(button_[2]){
      time2++;
    }
    else{
      time2=0;
    };

    if ((input_key_buffer[37] | button_[0]) & x>10) {
      button_[0]=false;
      updatedX = x - 4;
      left =true;
    }
    if ((input_key_buffer[38] & time<2) | (button_[2] & time2<15)) {
      vy = -14;
      isJump = true;
    }
    button_[2] = false;
    if ((input_key_buffer[39]| button_[1])& x<1900){
      button_[1]=false;
      updatedX = x + 4;
      left =false;
    }

    if (isJump) {

      updatedY = y + vy;


      vy = vy + 1;


      const blockTargetIsOn = getBlockTargrtIsOn(x, y, updatedX, updatedY);


      if (blockTargetIsOn != null) {
        updatedY = blockTargetIsOn.y - 64;
        isJump = false;
      }
    } else {

      if (getBlockTargrtIsOn(x, y, updatedX, updatedY) == null) {
        isJump = true;
        vy = 0;
      }
    }

    if (y > 1800) {

      isGameOver = true;
      updatedY = 1000;
      vy = -30;
    }
  }
  

  x = updatedX;
  y = updatedY;


  var houseImage = new Image();
  for (const house of houses ){
    houseImage.src=house.src;
    ctx.drawImage(houseImage, house.x,house.y,house.w,house.h);
    if(y>=house.y & y<=(house.y+house.h) & (x >= house.x) & x <= (house.x + house.w)){
      if(!house.in){
        newtab(house.link);
        window.location.href = ''
      }
      house.in = true;
    }
    else{
    house.in = false;
    }
  }

  var image = new Image();
  if(left){image.src = rep+"/images/c-1/base2.png";}
  else{image.src = "/testpage/images/c-1/base.png";};
  ctx.drawImage(image, x, y, 64, 64);

  var groundImage = new Image();
  groundImage.src = rep+"/images/ground-01/base.png";
  for (const block of blocks) {
    ctx.drawImage(groundImage, block.x, block.y, block.w, block.h);
  }
  


  window.requestAnimationFrame(update);
}

function getBlockTargrtIsOn(x, y, updatedX, updatedY) {
  for (const block of blocks) {
    if (y + 64 <= block.y && updatedY + 64 >= block.y) {
      if (
        (x + 64 <= block.x || x >= block.x + block.w) &&
        (updatedX + 64 <= block.x || updatedX >= block.x + block.w)
      ) {
        continue;
      }
      return block;
    }
  }
  return null;
}

function newtab(url) {
  window_A = window.open(url, "_blank");
  }