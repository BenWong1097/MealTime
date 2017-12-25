function intro(){
	stage.removeAllChildren();
	createjs.Sound.stop();
	createjs.Sound.play(1, {loop:-1});//Play music
	level = 0;
	start = new Shape();
	var startImg = imgDict["start.png"];
	var width = startImg.width;
	var height = startImg.height;
	var x = canvas.width/2/SCALE - width/2;
	var y = canvas.height/2/SCALE - height/2;
	start.graphics.beginBitmapFill(startImg).drawRect(0,0, width, height);
	start.x = x;
	start.y = y;
	start.onClick = handleMouseEvent;//Calls level1() onClick
	start.name = "Start";
	//BG
	var bgImg = imgDict["bgIntro.png"];
	width = bgImg.width;
	height = bgImg.height;
	var bgImgShape = new Shape();//running out of good names >->
	bgImgShape.graphics.beginBitmapFill(bgImg).drawRect(0,0, width, height);
	bgImgShape.scaleX = canvas.width/width/SCALE;
	//console.log("scale",bgImgShape.scaleX, canvas.width, width);
	bgImgShape.scaleY = bgImgShape.scaleX;
	stage.addChild(bgImgShape, start);
}
function choosePlayers(){
	level = 0.5;
	stage.removeAllChildren();
	createjs.Sound.stop();
	var x1 = canvas.width/2/SCALE*1/4;//16 is W/2 of plr pic
	var x2 = canvas.width/2/SCALE*3/4;
	var y = canvas.height/2/SCALE*3/4;
	choose1 = new BitmapAnimation(anitaSS);
	choose1.x = x1;
	choose1.y = y;
	choose1.gotoAndPlay("walk_h");
	stage.addChild(choose1);
	choose2 = new BitmapAnimation(jonSS);
	choose2.x = x2;
	choose2.y = y;
	choose2.gotoAndPlay("walk");
	stage.addChild(choose2);
	//Change Characters Tooltip!
	var charTT = new Text();
	charTT.text = "Use 'A','D','<-', or '->' to Change Characters!"
	charTT.align = "center";
	charTT.x = canvas.width/SCALE/2*1/8;
	charTT.y = canvas.height/SCALE/4;
	stage.addChild(charTT);
	//Space to Start Label
	var text = new Text();
	text.text = "> Press Space to Start! <";
	text.align = "center";
	text.x = canvas.width/SCALE/2*1/4;
	text.y = canvas.height/SCALE/2;
	stage.addChild(text);
	startText = text;//global ref for tick
	//Controls Tooltip
	var controlsTT = new Text();
	controlsTT.text = "Player 1:\n\t\tMove: WASD\n\t\tAttack: F\n\nPlayer 2:\n\t\tMove: Arrow Keys\n\t\tAttack: /";
	controlsTT.x = canvas.width/SCALE/2;
	controlsTT.y = canvas.height/SCALE/4;
	stage.addChild(controlsTT);
}

function level1(plr1 = "anita", plr2 = "jon"){
	level = 1;
	stage.removeAllChildren();//Clear the screen
	createjs.Sound.stop();//Stop all sound instances
	createjs.Sound.play(2, {loop:-1});//Play music
	camera = Camera(new Container());
	stage.addChild(camera);
	drawBg(camera);//Draw BG
	//Create entities
	// var dumplingAni = new BitmapAnimation(dumplingSS);
	// initAnim(dumplingAni, "dumpling", 16, 16, 16);
	enemies[enemies.length]	= new Mob("dumpling",200);
	enemies[enemies.length] = new Mob("dumpling",50);
	enemies[enemies.length] = new Mob("springroll",200);
	enemies[enemies.length] = new Mob("springroll",250);
	enemies[enemies.length] = new Mob("eggroll",300);
	enemies[enemies.length] = new Mob("eggroll",600);
	enemies[enemies.length] = new Mob("eggroll",550);
	enemies[enemies.length] = new Mob("springroll",550);
	enemies[enemies.length] = new Mob("springroll",550);
	enemies[enemies.length] = new Mob("dumpling",650);
	enemies[enemies.length] = new Mob("eggroll",650);
	enemies[enemies.length] = new Mob("eggroll",650);
	enemies[enemies.length] = new Mob("eggroll",650);
	enemies[enemies.length] = new Mob("eggroll",650);
	//var anitaAnim = new BitmapAnimation(anitaSS);
	//p1.bitmap = initAnim(anitaAnim, "p1", 16, 16, 16);
	p1 = new Player(1,plr1);
	//var jonAnim = new BitmapAnimation(jonSS);
	//p2.bitmap = initAnim(jonAnim, "p2", 16, 16, 16);
	p2 = new Player(2,plr2);

	//Create Scoreboard
	p1Score = {};
	p2Score = {};
	p1Score.score = new Text();
	p1Score.score.x = 36;
	p1Score.score.y = 32;
	p1Score.pic = new BitmapAnimation(p1.bitmap.spriteSheet);
	p1Score.pic.x = 20;
	p1Score.pic.y = 20;
	p1Score.pic.gotoAndStop("idle");
	p2Score.score = new Text();
	p2Score.score.x = 316;
	p2Score.score.y = 32;
	p2Score.pic = new BitmapAnimation(p2.bitmap.spriteSheet);
	p2Score.pic.x = 300;
	p2Score.pic.y = 20;
	p2Score.pic.gotoAndStop("idle");
	stage.addChild(p1Score.score, p1Score.pic, p2Score.score, p2Score.pic);
	var checkFinish = function(){
		if (enemies.length <= 0	){
			gameOver = new Text();
			gameOver.text = "YOU'VE WON!";
			gameOver.color = "#EEFFEE";
			gameOver.x = canvas.width/10/SCALE*3;
			gameOver.y = canvas.height/2/SCALE;
			gameOver.scaleX = 3;
			gameOver.scaleY = 3;
			stage.addChild(gameOver);
			nextLevel = true;
		}
		else{
			setTimeout(checkFinish, 50);
		}
	}
	setTimeout(checkFinish, 50);//call checkFinish every 50ms
}

function initAnim(anim,name,x,y,offset=0,width=32,height=32){
	anim.gotoAndPlay("idle");
	anim.name = name;
	anim.x = x;
	anim.y = y;
	anim.oX = offset;
	anim.oY = offset;
	anim.width = width;
	anim.height = height;
	stage.addChild(anim);
	//HEALTHBAR
	anim.hpBar = new Shape();
	anim.hpBar.graphics.beginFill("#11FF11");
	anim.hpBar.graphics.drawRect(0,0,width,3);
	anim.hpBar.alpha = 0.5;
	anim.hpBar2 = new Shape();
	anim.hpBar2.graphics.beginFill("#115511");
	anim.hpBar2.graphics.drawRect(0,0,width,3);
	stage.addChild(anim.hpBar, anim.hpBar2);
	return anim;
}