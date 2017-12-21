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
	stage.removeAllChildren();
	createjs.Sound.play(1, {loop:-1});
	camera = Camera(new Container());
	stage.addChild(camera);
	drawBg(camera);
	var dumplingAni = new BitmapAnimation(dumplingSS);
	initAnim(dumplingAni, "dumping", 16, 16, 16);
	var anitaAnim = new BitmapAnimation(anitaSS);
	p1.bitmap = initAnim(anitaAnim, "p1", 16, 16, 16);
	var jonAnim = new BitmapAnimation(jonSS);
	p2.bitmap = initAnim(jonAnim, "p2", 16, 16, 16);
	
}

function initAnim(anim,name,x,y,offset=0){
	anim.gotoAndPlay("idle");
	anim.name = name;
	anim.x = x;
	anim.y = y;
	anim.oX = offset;
	anim.oY = offset;
	stage.addChild(anim);
	return anim;
}