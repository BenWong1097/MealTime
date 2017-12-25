//NB: TAKE INTO ACCOUTN MOVIN CAM AFFECTS OFFSET CALCULATION OF WHILE TICK LOOP
var FALLVEL = 9;
function Mob(type="dumpling", spawn=0){
	this.numDeaths = 0;
	this.type = type;
	this.category = "monster";
	this.bitmap = null;
	this.health = 100;
	this.velX = 0;
	this.velY = 0;
	this.x = 30;
	this.y = 0;
	this.speed = 2;
	this.jump = -5;//lower -> jump higher
	this.dest = 0;
	this.enroute = false;
	this.spawn = spawn;
	this.maxDist = 0;
	this.probMove = 0.01;
	//--Combat--
	this.lastHit = Date.now();
	this.damage = 10;
	this.invTime = 1000;//invincibility time
	this.recoil = 1;
	this.lastAtk = Date.now();
	this.atkDebounce = 1000;
	this.handleCollision = function(obj){
		if(Date.now()-this.lastHit>this.invTime){
			if(obj.category == "bullet"){
				this.hurt(obj);
			}
			else if(this.category == "player"){
				this.hurt(obj);
			}

		}
	}
	this.hurt = function(obj){
		this.enroute = false;
		this.probMove = 0.5;
		this.bitmap.gotoAndStop("hurt");
		this.lastHit = Date.now();
		this.health -= obj.damage;
		var dir = this.bitmap.x - obj.bitmap.x;
		dir /= Math.abs(dir);
		this.velX = dir*this.recoil;
		this.velY = -1*this.recoil;
		if(this.health <= 0){
			if(this.category == "player"){
				++this.numDeaths;
				this.health = 100;
				this.bitmap.y = 0;
			}
			else{
				this.destroy();
			}
		}
	}
	this.destroy = function(){
		var ind = enemies.indexOf(this);
		enemies.splice(ind, 1);
		stage.removeChild(this.bitmap);
		stage.removeChild(this.bitmap.hpBar);
		stage.removeChild(this.bitmap.hpBar2);
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
			if(Math.random()<this.probMove){
				this.enroute = true;
				this.dest = Math.random()*this.maxDist*2-this.maxDist+this.spawn+camera.x;
				console.log(this.spawn, this.dest);
				//var iterCount = 0;
				//this.dest = Math.random()*this.maxDist*2-this.maxDist+this.spawn;
			}
		}
		else{
			dx = Math.abs(this.dest-this.bitmap.x)/(this.dest-this.bitmap.x);
			this.direction = dx != 0 ? dx : this.direction;
		}
		if(Math.abs(this.velX) > this.speed){
			this.velX = this.velX*0.95;
		}
		else{
			this.velX = dx * this.speed;
		}
		var nx = this.bitmap.x + this.velX;//new X
		this.bitmap.x = nx;
		if(Math.abs(this.bitmap.x-this.dest)<2){
			this.enroute = false;
		}
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
				this.bitmap.hpBar.scaleX = this.bitmap.hpBar.scaleX >= 0 ? this.bitmap.hpBar.scaleX : 0;
				//bar2
				this.bitmap.hpBar2.x = this.bitmap.x + this.bitmap.width/2;
				this.bitmap.hpBar2.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar2.scaleX = (100-this.health)/100 * -1;
				this.bitmap.hpBar2.scaleX = this.bitmap.hpBar2.scaleX >= -1 ? this.bitmap.hpBar2.scaleX : -1;
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
	else if(this.type == "springroll"){
		this.bitmap = new BitmapAnimation(springrollSS);
		initAnim(this.bitmap, "springroll", 16, 16, 16, width=20);
		this.speed = 1;
		this.damage = 25;
		this.maxDist = 60;
	}
	else if(this.type == "eggroll"){
		this.bitmap = new BitmapAnimation(eggrollSS);
		initAnim(this.bitmap, "eggroll", 16, 16, 16, width=24);
		this.speed = 3;
		this.damage = 20;
		this.maxDist = 60;
	}
	else if(this.type == "anita"){
		this.bitmap = new BitmapAnimation(anitaSS);
		initAnim(this.bitmap, "anita", 16, 16, 16, width=24);
	}
	else if(this.type == "jon"){
		this.bitmap = new BitmapAnimation(jonSS);
		initAnim(this.bitmap, "jon", 16, 16, 16, width=16);
	}
	else if(this.type == "gramma"){
		this.bitmap = new BitmapAnimation(grammaSS);
		initAnim(this.bitmap, "gramma", 16, 16, 16, width=18);
		this.speed = 1.5;
	}
	else if(this.type == "gramps"){
		this.bitmap = new BitmapAnimation(grampsSS);
		initAnim(this.bitmap, "gramps", 16, 16, 16, width=18);
		this.atkDebounce = 250;
		this.speed = 1.5;
	}
	else if(this.type == "michelle"){
		this.bitmap = new BitmapAnimation(michelleSS);
		initAnim(this.bitmap, "michelle", 16, 16, 16, width=18);
		this.atkDebounce = 200;
		this.jump = -6;
		this.speed = 2.5;
	}
	this.bitmap.x = spawn;
	//Only nonplayers spawn on floor!
	if(this.type != "player") this.bitmap.y = FLOOR-this.bitmap.oY;
}

function Player(number, type, bitmap){
	Mob.call(this, type);
	Player.prototype = Object.create(Mob.prototype);
	this.category = "player";
	this.number = number;//1 or 2
	this.type = type;
	this.dir = [0, 0, 0, 0, 0];//WASDF
	this.dirKey = number == 1 ? [87,65,83,68,70] : [38,37,40,39,191];
	this.tick = function(){
		if(this.bitmap){
			var dx = -1*this.dir[1] + this.dir[3];
			if(Math.abs(this.velX) > this.speed){
				this.velX = this.velX*0.95;
			}
			else{
				this.velX = dx * this.speed;
			}
			if(Date.now()-this.lastAtk <= this.atkDebounce){
				this.velX = 0;
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
		if(this.bitmap && Date.now()-this.lastAtk > this.atkDebounce){
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
			//COMBAT
			// atk pressed and cooldown is up
			if(this.dir[4] && Date.now()-this.lastAtk > this.atkDebounce){
				//Go attack
				this.lastAtk = Date.now();
				if(this.direction == 1){
					this.bitmap.gotoAndPlay("attack_h");
				}
				else{
					this.bitmap.gotoAndPlay("attack");
				}
				//ANITA
				if(this.type == "anita"){
					var bulletImg = new Shape();
					var width = 3;
					bulletImg.graphics.beginFill("#DD1111");
					bulletImg.graphics.drawCircle(0,0,width);
					bulletImg.width = width;
					bulletImg.height = width;
					bulletImg.scaleY = 0.5;
					var bullet =  new Bullet(
						this.bitmap.x, 
						this.bitmap.y,
						width,
						this.direction,
						bulletImg,
						25,//dmg
						8,//spd
						300//dur(ms)
					);
					//bulletImg added to stage in Bullet constructor
				}
				//MICHELLE
				if(this.type == "michelle"){
					var bulletImg = new Shape();
					var width = 25;
					bulletImg.graphics.beginFill("#559ff1");
					bulletImg.graphics.drawCircle(0,0,width);
					bulletImg.alpha = 0.5;
					bulletImg.regX = 0.5;
					bulletImg.regY = 0.5;
					bulletImg.width = width;
					bulletImg.height = 2;
					bulletImg.scaleY= 2/width;
					var bullet =  new Bullet(
						this.bitmap.x+bulletImg.width/2*this.direction, 
						this.bitmap.y+5,
						width,
						this.direction,
						bulletImg,
						20,//dmg
						0.5,//spd
						100//dur(ms)
					);
					//bulletImg added to stage in Bullet constructor
				}
				//GRAMMA
				else if(this.type == "gramma"){
					var bulletImg = new Shape();
					var width = 50;
					bulletImg.graphics.beginFill("#ffec6d");
					bulletImg.graphics.drawCircle(0,0,1);
					bulletImg.alpha = 0.5;
					bulletImg.width = 1;
					bulletImg.height = 1;
					var bullet = new Bullet(
						this.bitmap.x, 
						this.bitmap.y,
						width,
						this.direction,
						bulletImg,
						75,//dmg
						0,//spd
						10000//dur(ms)
					);
					var flicker = false;
					var mamaLang = function(){
						bulletImg.alpha = 0.1 + 0.4*flicker;
						flicker = !flicker;
						bulletImg.width *= 1.5;
						bulletImg.height = bulletImg.width;
						bulletImg.scaleX = bulletImg.width/2;
						bulletImg.scaleY = bulletImg.width/2;
						if(bulletImg.width >= width){
							setTimeout(function(){
								bullet.destroy();
							},
							1000);
							return;
						}
						setTimeout(mamaLang, 80);
					}
					setTimeout(mamaLang, 100);
				}
				//GRAMPS
				else if(this.type == "gramps"){
					var bulletImg = new Shape();
					var width = 3;
					bulletImg.graphics.beginFill("#ffec6d");
					bulletImg.graphics.drawCircle(0,0,width);
					bulletImg.width = width;
					bulletImg.height = width*2;
					bulletImg.scaleY = 2;
					new Bullet(
						this.bitmap.x+this.direction*this.bitmap.width/2, 
						this.bitmap.y,
						width,
						this.direction,
						bulletImg,
						25,//dmg
						3,//spd
						100//dur(ms)
					);
					bulletImg = new Shape();
					bulletImg.graphics.beginFill("#ffec6d");
					bulletImg.graphics.drawCircle(0,0,width);
					bulletImg.width = width;
					bulletImg.height = width*2;
					bulletImg.scaleY = 2;
					new Bullet(
						this.bitmap.x-this.direction*this.bitmap.width/2, 
						this.bitmap.y,
						width,
						-1*this.direction,
						bulletImg,
						25,//dmg
						3,//spd
						100//dur(ms)
					);
					//bulletImg added to stage in Bullet constructor
				}
				//JON
				else if(this.type == "jon"){
					var bulletImg = new Shape();
					var width = 40;
					bulletImg.graphics.beginFill("#ff3333");
					bulletImg.graphics.drawRect(0,0,1,3);
					bulletImg.alpha = 0.7;
					bulletImg.width = 1;
					bulletImg.height = 3;
					bulletImg.regX = 0.5;
					var bullet = new Bullet(
						this.bitmap.x, 
						this.bitmap.y-8,
						width,
						this.direction,
						bulletImg,
						50,//dmg
						0,//spd
						10000//dur(ms)
					);
					var plr = this;
					var flicker = false;
					var laser = function(){
						bulletImg.alpha = 0.4 + 0.2*flicker;
						flicker = !flicker;
						bulletImg.width *= 1.5;
						bulletImg.scaleX = bulletImg.width;
						bulletImg.x = plr.bitmap.x+bulletImg.width/2*plr.direction;
						if(bulletImg.width >= width){
							this.alpha = 1;
							setTimeout(function(){
								bullet.destroy();
							},
							100);
							return;
						}
						setTimeout(laser, 80);
					}
					setTimeout(laser, 100);
				}
			}
		}
		if(this.bitmap){
			//HP bar
			if(this.bitmap.hpBar){
				//bar1
				this.bitmap.hpBar.x = this.bitmap.x - this.bitmap.width/2;
				this.bitmap.hpBar.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar.scaleX = this.health/100;
				this.bitmap.hpBar.scaleX = this.bitmap.hpBar.scaleX >= 0 ? this.bitmap.hpBar.scaleX : 0;
				//bar2
				this.bitmap.hpBar2.x = this.bitmap.x + this.bitmap.width/2;
				this.bitmap.hpBar2.y = this.bitmap.y + this.bitmap.height/2 + 2;
				this.bitmap.hpBar2.scaleX = (100-this.health)/100 * -1;
				this.bitmap.hpBar2.scaleX = this.bitmap.hpBar2.scaleX >= -1 ? this.bitmap.hpBar2.scaleX : -1;
			}
		}
	}
}

function Bullet(x=0,y=0, width=0,dir = 1,img = null, dmg=10,spd = 1, dur = 2000, target = "monster"){
	this.category = "bullet";
	this.dir = dir;
	this.spd = spd;
	this.dur = dur;
	this.damage = dmg;
	this.bitmap = img;
	this.bitmap.x = x;
	this.bitmap.y = y;
	this.target = target;
	this.width = width;
	this.spawnTime = Date.now();
	this.tick = function(){
		this.bitmap.x += this.dir * this.spd;
		if(Date.now()-this.spawnTime > dur){
			this.destroy();
		}
	}
	stage.addChild(this.bitmap);
	if(target == "monster"){
		bulletsE[bulletsE.length] = this;
	}
	this.handleCollision = function(obj){
		if(target=="monster" && obj.category=="monster")
			this.destroy();
	}
	this.destroy = function(){
		if(this.target == "monster"){
			var ind = bulletsE.indexOf(this);
			if(ind!=-1){
				bulletsE.splice(ind,1);
			}
			stage.removeChild(this.bitmap);
		}
	}
}