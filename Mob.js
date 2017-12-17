function Mob(){
	this.health = 100;
	this.vel = 1;
	this.motion = 0;//-1 -> left, 0 stand, 1 -> right
	this.tick = function(){
		this.x += motion * this.vel;
	};
	//this.img = img;
}

function Player(number, type){
	Mob.call(this);//inherit Mob
	Player.prototype = Object.create(Mob.prototype);//inherit methods
	this.number = number;//1 or 2
	this.type = type;
	this.dir = [0, 0, 0, 0];
	this.dirKey = number == 1 ? [87,65,83,68] : [38,37,40,39];
	this.vel = 5;
	this.tick = function(){
		var dx = this.dir[1] + this.dir[3];
		//this.image.x += dx;
	}
}
