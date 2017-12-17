var canvas = document.createElement('canvas'); //Canvas object on page
canvas.width = 500;
canvas.height = 250;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.wdith, canvas.height);
document.body.appendChild(canvas);
var stage = new Stage(canvas);

//Graphics
var bg;//background

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


//Variables
	//PLAYER1
var p1Health;
var p1 = new Player(1, "anita");

	//PLAYER2
var player2Health;
var p2 = new Player(2, "jon");

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
//RENDER/UPDATE
Ticker.setFPS(30);
Ticker.addListener(tick);
function tick(e){
	p1.tick();
	p2.tick();
	stage.update();
}

function main(){
	console.log(1);
	SpriteSheet.prototype.snapToPixel = true;
	BitmapAnimation.prototype.snapToPixel = true;
	var dumplingSS = new SpriteSheet({
		images: [imgDict["dumpling.png"]],
		frames: {width: 32, height: 32, regX: 16, regY: 16},
		animations:{
			walk: [0,3, "walk", 3]//4 = freq (slow by 4x)
		},
	});
	var dumplingAni = new BitmapAnimation(dumplingSS);
	dumplingAni.gotoAndPlay("walk");
	dumplingAni.name = "monster1";
	dumplingAni.direction = 90;
	dumplingAni.vX = 4;
	dumplingAni.x = 32;
	dumplingAni.y = 32;
	dumplingAni.currentFrame = 0;
	dumplingAni.scaleX = 2;
	dumplingAni.scaleY = 2;
	stage.addChild(dumplingAni);
	console.log(2);
}
init();