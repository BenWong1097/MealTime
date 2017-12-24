function intro(){
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
	start.onClick = handleMouseEvent;
	start.name = "Start";
	stage.addChild(start);
	//level1();
}
function level1(){
	level = 1;
	stage.removeAllChildren();//Clear the screen
	//createjs.Sound.play(1, {loop:-1});//Play music
	camera = Camera(new Container());
	stage.addChild(camera);
	drawBg(camera);//Draw BG
	//Create entities
	// var dumplingAni = new BitmapAnimation(dumplingSS);
	// initAnim(dumplingAni, "dumpling", 16, 16, 16);
	var dumpling = new Mob("dumpling",200);
	enemies[enemies.length]	= dumpling;
	dumpling.bitmap.x = 200;
	enemies[1] = new Mob("dumpling",50);
	enemies[1].bitmap.x = 50;
	enemies[2] = new Mob("dumpling",650);
	enemies[2].bitmap.x = 650;
	//var anitaAnim = new BitmapAnimation(anitaSS);
	//p1.bitmap = initAnim(anitaAnim, "p1", 16, 16, 16);
	p1 = new Player(1,"anita");
	//var jonAnim = new BitmapAnimation(jonSS);
	//p2.bitmap = initAnim(jonAnim, "p2", 16, 16, 16);
	p2 = new Player(2,"jon");
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