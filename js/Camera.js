function Camera(container,size=-600){
	container.tick = function(){
		if(p1 && p1.bitmap){
			if(!(p2 && p2.bitmap)) p2 = p1;
			var x = (p1.bitmap.x + p2.bitmap.x)/2;
			var dx = 0;
			if(Math.abs(x - canvas.width/2/SCALE) < 2){}
			else if (Math.abs(x) < canvas.width/2/SCALE){
				dx = container.x < 0 ? 2 : 0;
			}
			else{
				dx = container.x > size ? -2 : 0;
			}
			container.x += dx;
			p1.bitmap.x += dx;
			p2.bitmap.x += (p1!=p2) ? dx : 0;//If single plr, doesn't move both
			for(var i=0; i<enemies.length; ++i){
				enemies[i].bitmap.x += dx;
			}
		}
	}
	return container;
}