//NB: TAKE INTO ACCOUTN MOVIN CAM AFFECTS OFFSET CALCULATION OF WHILE TICK LOOP
var FALLVEL = 9;
function Mob(type="dumpling", spawn=0){
	this.type = type;
	this.category = "monster";
	this.bitmap = null;
	this.health = 100;
	this.velX = 0;
	this.velY = 0;
	this.x = 30;
	this.y = 0;
	this.speed = 2;
	this.dest = 0;
	this.enroute = false;
	this.spawn = spawn;
	this.maxDist = 0;
	//--Combat--
	this.lastHit = Date.now();
	this.damage = 10;
	this.invTime = 1000;//invincibility time
	this.recoil = 1;

	this.handleCollision = function(obj){
		if(Date.now()-this.lastHit>this.invTime){
			console.log(this.category, this.category == "player");
			if(obj.category == "bullet"){
				this.hurt(obj);
				console.log(this.type,this.health);
			}
			else if(this.category == "player"){
				this.hurt(obj);
				console.log(this.type,this.health);
			}

		}
	}
	this.hurt = function(obj){
		this.bitmap.gotoAndStop("hurt");
		this.lastHit = Date.now();
		this.health -= obj.damage;
		var dir = this.bitmap.x - obj.bitmap.x;
		dir /= Math.abs(dir);
		this.velX = dir*this.recoil;
		this.velY = -1*this.recoil;
	}
	this.isInv = function(){
		return Date.now()-this.lastHit <= this.invTime;
	}
	this.tick = function(){
		if(this.velY < FALLVEL){
			this.velY -= (this.velY - FALLVEL) * 0.025;
			this.velY = Math.abs(this.velY - FALLVEL) < 0.5 ? FALLVEL : this.velY;
		}
		var ny = this.bitmap.y + this.velY;//newY
		this.bitmap.y = ny > FLOOR-this.bitmap.oY ? FLOOR-this.bitmap.oY : ny;//So sprite don't fall below floor
		//X
		var dx = 0;//Math.random()*2-1;
		if(!this.enroute){
			if(Math.random()<0.01){
				this.enroute = true;
				this.dest = Math.random()*this.maxDist*2-this.maxDist+this.spawn+camera.x;
				console.log(camera.x);
				var iterCount = 0;
				this.dest = Math.random()*this.maxDist*2-this.maxDist+this.spawn;
			}
		}
		else{
			dx = Math.abs(this.dest-this.bitmap.x)/(this.dest-this.bitmap.x);
			this.direction = dx != 0 ? dx : this.direction;
			//console.log(dx);
		}
		if(Math.abs(this.velX) > this.speed){
			this.velX = this.velX*0.95;
		}
		else{
			this.velX = dx * this.speed;
		}
		var nx = this.bitmap.x + this.velX;//new X
		//console.log("New: "+nx+"\tCur: "+this.bitmap.x);
		// if(nx > 30 && nx < canvas.width/SCALE){//Check if char won't go offscreen
			this.bitmap.x = nx;
			if(Math.abs(this.bitmap.x-this.dest)<2){
				//console.log(this.bitmap.x, this.dest);
				this.enroute = false;
			}
		// }
		//ANIMATION________________________
		if(this.bitmap){
			if(this.direction == 1 && this.animMode != 0 && this.velX != 0){
				this.animMode = 0;
				this.bitmap.gotoAndPlay("walk_h");
			}
			else if(this.direction == -1 && this.animMode != 1 && this.velX != 0){
				this.animMode = 1;
				this.bitmap.gotoAndPlay("walk");
			}
			else if(this.velX == 0){
				if(this.direction == 1){//facing right
					if(this.bitmap.y >= FLOOR-this.bitmap.oY && !this.isInv())
						this.bitmap.gotoAndStop("idle_h");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump_h");
				}
				else if(this.direction == -1){//direction == -1 (left)
					if(this.bitmap.y >= FLOOR-this.bitmap.oY && !this.isInv())
						this.bitmap.gotoAndStop("idle");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump");
				}
				this.animMode = 2;
				//this.bitmap.gotoAndPlay("idle");
			}
			//Invincibility frames
			if(Date.now()-this.lastHit <= this.invTime){
				this.bitmap.alpha *= -1;//Flicker
			}
			else{
				this.bitmap.alpha = 1;
			}
			//HP bar
			if(this.bitmap.hpBar){
				//bar1
				this.bitmap.hpBar.x = this.bitmap.x - this.bitmap.width/2;
				this.bitmap.hpBar.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar.scaleX = this.health/100;
				//bar2
				this.bitmap.hpBar2.x = this.bitmap.x + this.bitmap.width/2;
				this.bitmap.hpBar2.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar2.scaleX = (100-this.health)/100 * -1;
			}
		}
	};
	this.animMode = 0;
	this.direction = 1;//-1:left, 1:right
	if(this.type == "dumpling"){
		this.bitmap = new BitmapAnimation(dumplingSS);
		initAnim(this.bitmap, "dumpling", 16, 16, 16, width=30);
		this.speed = 0.5;
		this.maxDist = 30;
	}
	else if(this.type == "anita"){
		this.bitmap = new BitmapAnimation(anitaSS);
		initAnim(this.bitmap, "anita", 16, 16, 16, width=24);
	}
	else if(this.type == "jon"){
		this.bitmap = new BitmapAnimation(jonSS);
		initAnim(this.bitmap, "jon", 16, 16, 16, width=16);
	}

	//Only nonplayers spawn on floor!
	if(this.type != "player") this.bitmap.y = FLOOR-this.bitmap.oY;
}

function Player(number, type, bitmap){
	Mob.call(this, type);
	Player.prototype = Object.create(Mob.prototype);
	this.category = "player";
	this.number = number;//1 or 2
	this.type = type;
	this.dir = [0, 0, 0, 0];
	this.dirKey = number == 1 ? [87,65,83,68] : [38,37,40,39];
	this.jump = -5;//lower -> jump higher
	this.tick = function(){
		if(this.bitmap){
			var dx = -1*this.dir[1] + this.dir[3];
			if(Math.abs(this.velX) > this.speed){
				this.velX = this.velX*0.95;
			}
			else{
				this.velX = dx * this.speed;
			}
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
			if(this.dir[3]-this.dir[1] == 1 && this.animMode != 0){
				this.animMode = 0;
				this.bitmap.gotoAndPlay("walk_h");
				this.direction = 1;
			}
			else if(this.dir[3]-this.dir[1] == -1 && this.animMode != 1){
				this.animMode = 1;
				this.bitmap.gotoAndPlay("walk");
				this.direction = -1;
			}
			else if(this.velX == 0){
				if(this.direction == 1){//facing right
					if(this.bitmap.y >= FLOOR-this.bitmap.oY)
						this.bitmap.gotoAndStop("idle_h");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump_h");
				}
				else if(this.direction == -1){//direction == -1 (left)
					if(this.bitmap.y >= FLOOR-this.bitmap.oY)
						this.bitmap.gotoAndStop("idle");
					else if(this.velY > 0)
						this.bitmap.gotoAndStop("jump");
				}
				this.animMode = 2;
				//this.bitmap.gotoAndPlay("idle");
			}
			//Invincibility frames
			if(Date.now()-this.lastHit <= this.invTime){
				this.bitmap.alpha *= -1;//Flicker
			}
			else{
				this.bitmap.alpha = 1;
			}
			//HP bar
			if(this.bitmap.hpBar){
				//bar1
				this.bitmap.hpBar.x = this.bitmap.x - this.bitmap.width/2;
				this.bitmap.hpBar.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar.scaleX = this.health/100;
				//bar2
				this.bitmap.hpBar2.x = this.bitmap.x + this.bitmap.width/2;
				this.bitmap.hpBar2.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar2.scaleX = (100-this.health)/100 * -1;
			}
		}
	}
}
