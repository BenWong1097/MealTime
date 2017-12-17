var SCALE = 2;
var canvas = document.createElement('canvas'); //Canvas object on page
canvas.width = 1200;
canvas.height = 600;
var FLOOR = canvas.height *5/6/SCALE;
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var stage = new Stage(canvas);
//Graphics
var bg = document.createElement("img");//background
bg.src = "assets/bg.png";
bg.onload = drawBg;
var bgFloor = document.createElement("img");
bgFloor.src = "assets/bgFloor.png";
bgFloor.onload = drawBg;
var drawBgCnt = 0;
function drawBg(){
	if(++drawBgCnt == 2){
		//BG
		var shape = new Shape();
		shape.graphics.clear()
			.beginBitmapFill(bg);
		shape.graphics.drawRect(0,0,canvas.width,canvas.height);
		stage.addChild(shape);
		//FLOOR
		var flr = new Shape();
		flr.graphics.clear()
			.beginBitmapFill(bgFloor);
		flr.graphics.drawRect(0,canvas.height*(5/6) / SCALE,canvas.width,canvas.height);
		stage.addChild(flr);
	}
}
//Title[View]
// var main;
// var startB;

// //Game[View]
// var player1 = new Player(1, "anita");
// var player2;
// var enemies;

// //hstu
// var data = {
// 	images: ["assets/sciGrass.png"],
// 	frames: {width:50, height:50},
// 	animations: {
// 		stand:0,
// 		run:[1,2],
// 		jump:[3,4,"run"]
// 	}
// };
// var spriteSheet = new SpriteSheet(data);
// var animation = new Sprite(spriteSheet, "run");
// //var img = new Image();
// //img.src = "assets/sciGrass.png";


var img = ["dumpling.png"];
var imgDict = {};
function init(){
	for(var i = 0; i<img.length; ++i){
		var curImg = new Image();
		imgDict[img[i]] = curImg;
		curImg.onload = handleImageLoad;
		curImg.src = "assets/" + img[i];
	}
}



//INPUT____________________________
//check for a touch-option
if ('ontouchstart' in document.documentElement){
	canvas.addEventListener('touchstart', function(e){handleKeyDown();}, false);
	canvas.addEventListener('touchend', function(e){handleKeyUp();}, false);
}
else{
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	document.onmousedown = handleKeyDown;
	document.onmouseup = handleKeyUp;
}
function handleKeyDown(e){
	console.log(e.keyCode);
	for(var i = 0; i < 4; ++i){
		if(p1.dirKey[i] == e.keyCode) p1.dir[i] = 1;
		if(p2.dirKey[i] == e.keyCode) p2.dir[i] = 1;
	}
	//do stuff
}
function handleKeyUp(e){
	//do stuff
	for(var i = 0; i < 4; ++i){
		if(p1.dirKey[i] == e.keyCode) p1.dir[i] = 0;
		if(p2.dirKey[i] == e.keyCode) p2.dir[i] = 0;
	}
}


imgLoadedCnt = 0;
function handleImageLoad(e){
	//Start when all assets loaded!
	if(++imgLoadedCnt == img.length) main();
}


//Variables__________________________________
//PLAYER1
var p1Health;
var p1 = new Player(1, "anita");

	//PLAYER2
var player2Health;
var p2 = new Player(2, "jon");

//RENDER/UPDATE
Ticker.setFPS(30);
Ticker.addListener(tick);
function tick(e){
	p1.tick();
	p2.tick();
	stage.update();
}

function main(){
	BitmapAnimation.prototype.snapToPixel = true;
	console.log(2);
	stage.setTransform(0,0,SCALE,SCALE);
	level1();
}
init();

