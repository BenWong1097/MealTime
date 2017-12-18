//Graphics______________________________________
var SCALE = 2;
var canvas = document.createElement('canvas'); //Canvas object on page
canvas.width = 1200;
canvas.height = 600;
var FLOOR = canvas.height *5/6/SCALE;
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var stage = new Stage(canvas);
var camera = Camera(new Container());
var bg = document.createElement("img");//background
bg.src = "assets/bg.png";
bg.onload = function(){++drawBgCnt;};
var bgFloor = document.createElement("img");
bgFloor.src = "assets/bgFloor.png";
bgFloor.onload = function(){++drawBgCnt;};
var drawBgCnt = 0;
function drawBg(container){
	while(drawBgCnt < 2) console.log("Loading BG assets...");
	//BG
	var shape = new Shape();
	shape.graphics.clear()
		.beginBitmapFill(bg);
	shape.graphics.drawRect(0,0,canvas.width,canvas.height);
	container.addChild(shape);
	//FLOOR
	var flr = new Shape();
	flr.graphics.clear()
		.beginBitmapFill(bgFloor);
	flr.graphics.drawRect(0,canvas.height*(5/6) / SCALE,canvas.width,canvas.height);
	container.addChild(flr);
}

//	Load in image assets//
var img = ["dumpling.png","anita.png"];
var imgDict = {};
function init(){
	console.log(img);	
	initMusic();
	for(var i = 0; i<img.length; ++i){
		var curImg = new Image();
		imgDict[img[i]] = curImg;
		curImg.onload = handleImageLoad;
		curImg.src = "assets/" + img[i];
	}
	var last = 0;
	function loading(){//Check if all assets done loading.
		console.log(".");
		var soundRd = soundCnt==sounds.length;
		var imgRd = imgLoadedCnt == img.length;
		var SSRd = SSdone;
		console.log("last",last);
		if(last == 3){
			main();//LAUNCH
			return;
		}
		if(last!= (soundRd + imgRd + SSRd)){
			last = soundRd + imgRd + SSRd;
			console.log("Loading: "+last+"/3");
		}
		setTimeout(loading, 10);
	};
	loading();
}
//	Load Spritesheets//
var dumplingSS, anitaSS;
var SSdone = false;
function loadSpriteSheets(){
	//DUMPLING
	dumplingSS = new SpriteSheet({
		images: [imgDict["dumpling.png"]],
		frames: {width: 32, height: 32, regX: 16, regY: 16},
		animations:{
			walk: [0,3, "walk", 3],//4 = freq (slow by 4x)
			idle: 4,
			hurt: [5,5, "idle"]
		},
	});
	SpriteSheetUtils.addFlippedFrames(dumplingSS, true, false, false);
	//ANITA
	anitaSS = new SpriteSheet({
		images: [imgDict["anita.png"]],
		frames: {width: 32, height: 32, regX: 16, regY: 16},
		animations:{
			walk: [1,4, "walk", 3],//4 = freq (slow by 4x)
			idle: 0,
			jump: 5
			//hurt: [5,5, "idle"]
		},
	});
	SpriteSheetUtils.addFlippedFrames(anitaSS, true, false, false);
	SSdone = true;
}


//INPUT_______________________________________
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
	if(++imgLoadedCnt == img.length){
		loadSpriteSheets();
	}
}

//MUSIC________________________________________
var bgMusic = SoundJS.play("assets/sounds/bg.mp3");
var soundCnt = 0;
var sounds = [
	{
		src: "bg.mp3", id: 1
	}
];
function initMusic(){
	var assetsPath = "/assets/sounds/";
	createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this));
	createjs.Sound.registerSounds(sounds, assetsPath);
}
function soundLoaded(e){
	++soundCnt;
	if(e.id == 1){
		//createjs.Sound.play(e.id, {loop:-1});//hstu
	}
}

//Variables______________________________________
//PLAYER1
var p1Health;
var p1 = new Player(1, "anita");

	//PLAYER2
var player2Health;
var p2 = new Player(2, "jon");

//RENDER/UPDATE___________________________________
Ticker.setFPS(30);
Ticker.addListener(tick);
function tick(e){
	p1.tick();
	p2.tick();
	camera.tick();
	stage.update();
}


//MAIN____________________________________________
function main(){
	BitmapAnimation.prototype.snapToPixel = true;
	stage.setTransform(0,0,SCALE,SCALE);
	// createjs.Sound.play(1, {loop:-1});
	level1();
}
console.log(img);
init();
