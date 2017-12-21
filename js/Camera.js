function Camera(container){
	container.tick = function(){
		if(p1 && p1.bitmap){
			if(!(p2 && p2.bitmap)) p2 = p1;
			var x = (p1.bitmap.x + p2.bitmap.x)/2;
			var dx = 0;
			if(Math.abs(x - canvas.width/2/SCALE) < 2){}
			else if (Math.abs(x) < canvas.width/2/SCALE){
				dx = container.x < 0 ? 1 : 0;
			}
			else{
				dx = container.x > -100 ? -1 : 0;
			}
			container.x += dx;
			p1.bitmap.x += dx;
			p2.bitmap.x += (p1!=p2) ? dx : 0;//If single plr, doesn't move both
		}
	}
	return container;
}