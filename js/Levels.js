function level1(){
	createjs.Sound.play(1, {loop:-1});
	camera = Camera(new Container());
	stage.addChild(camera);
	drawBg(camera);
	var dumplingAni = new BitmapAnimation(dumplingSS);
	initAnim(dumplingAni, "dumping", 16, 16, 16);
	var anitaAnim = new BitmapAnimation(anitaSS);
	p1.bitmap = initAnim(anitaAnim, "p1", 16, 16, 16);
	var dumpAnim2 = new BitmapAnimation(dumplingSS);
	p2.bitmap = initAnim(dumpAnim2, "p2", 16, 16, 16);
	
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