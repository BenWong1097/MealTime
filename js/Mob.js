function Mob(bitmap){
	this.bitmap = bitmap;
	this.health = 100;
	this.velX = 0;
	this.velY = 0;
	this.speed = 2;
	this.tick = function(){
		if(this.bitmap){
			this.bitmap.x += this.velX;
			this.bitmap.y += this.velY;
		}
	};
	this.animMode = 0;
	this.direction = 1;//-1:left, 1:right
}

var FALLVEL = 9;
function Player(number, type, bitmap){
	Mob.call(this);
	Player.prototype = Object.create(Mob.prototype);
	this.number = number;//1 or 2
	this.type = type;
	this.dir = [0, 0, 0, 0];
	this.dirKey = number == 1 ? [87,65,83,68] : [38,37,40,39];
	this.jump = -5;//lower -> jump higher
	this.tick = function(){
		if(this.bitmap){
			var dx = -1*this.dir[1] + this.dir[3];
			this.velX = dx * this.speed;
			var nx = this.bitmap.x + this.velX;//new X
			if(nx > 0 && nx < canvas.width/SCALE){//Check if char won't go offscreen
				this.bitmap.x = nx;
			}
			var ny = this.bitmap.y + this.velY;//newY
			this.bitmap.y = ny > FLOOR-this.bitmap.oY ? FLOOR-this.bitmap.oY : ny;//So sprite don't fall below floor
		}
		//If it's close to -1, just make velY -1 (allows for tweening)
		if(this.velY < FALLVEL){
			this.velY -= (this.velY - FALLVEL) * 0.025;
			this.velY = Math.abs(this.velY - FALLVEL) < 0.5 ? FALLVEL : this.velY;
		}
		//Only jump if on floor
		if(this.dir[0] && this.bitmap.y == FLOOR-this.bitmap.oY){	
			this.velY = this.jump;
		}
		//ANIMATION________________________
		if(this.bitmap){
			if(this.velX > 0 && this.animMode != 0){
				this.animMode = 0;
				this.bitmap.gotoAndPlay("walk_h");
				this.direction = 1;
			}
			else if(this.velX < 0 && this.animMode != 1){
				this.animMode = 1;
				this.bitmap.gotoAndPlay("walk");
				this.direction = -1;
			}
			else if(this.velX == 0){
				if(this.direction == 1){
					if(this.bitmap.y >= FLOOR-this.bitmap.oY)
						this.bitmap.gotoAndStop("idle_h");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump_h");
				}
				else if(this.direction == -1){//direction == -1
					if(this.bitmap.y >= FLOOR-this.bitmap.oY)
						this.bitmap.gotoAndStop("idle");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump");
				}
				this.animMode = 2;
				//this.bitmap.gotoAndPlay("idle");
			}
		}
	}
}
