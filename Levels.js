function level1(){
	//DUMPLING
	var dumplingSS = new SpriteSheet({
		images: [imgDict["dumpling.png"]],
		frames: {width: 32, height: 32, regX: 16, regY: 16},
		animations:{
			walk: [0,3, "walk", 3]//4 = freq (slow by 4x)
		},
	});
	SpriteSheetUtils.addFlippedFrames(dumplingSS, true, false, false);
	var dumplingAni = new BitmapAnimation(dumplingSS);
	dumplingAni.gotoAndPlay("walk");
	dumplingAni.name = "monster1";
	dumplingAni.direction = 90;
	dumplingAni.vX = 4;
	dumplingAni.x = 16;
	dumplingAni.y = 16;
	dumplingAni.oX = 16;
	dumplingAni.oY = 16;
	dumplingAni.currentFrame = 0;
	stage.addChild(dumplingAni);
	p1.bitmap = dumplingAni;
}