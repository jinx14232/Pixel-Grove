class Enemy{
    constructor(){
        this.framesX= 0;
        this.framesY= 0;
        this.requireInterval= 200;
        this.currentInterval= 0;
        this.deletion= false;
        this.stunned= false;
        this.danger= true;
        this.stun= new stun(this);
        this.groundWalk= false;
    }
    update(deltaTime){
        if(this.stunned){
            this.stun.enter();
            this.speedY= 0;
            this.y= this.game.height- this.spriteH- 35;
            this.attack= true;
            this.groundWalk= true;
            this.stunned= false;
            this.stop= true;
        }
        
        this.x-= this.speedX+ this.game.speed;
        this.y+= this.speedY;
        if(this.currentInterval> this.requireInterval){
            this.currentInterval= 0;
            if(this.framesX>= this.maxFrames){
                this.framesX= 0;
            }else this.framesX++;
        }else{
            this.currentInterval+= deltaTime;
        }
        if(this.x+ this.spriteW< 0) this.deletion= true;
        if(this.y > this.game.height- this.spriteH- 35){
            this.y = this.game.height- this.spriteH- 35;
        }
         if(this.y < this.game.height/2){
            this.y = this.game.height/2;
        }
    }
    draw(cxt){
    
        cxt.strokeRect(this.x+this.spriteW/4, this.y+this.spriteH/4, this.spriteW/2, this.spriteH/2)

        cxt.drawImage(
      this.image,
      this.framesX * this.spriteW,
      0,
      this.spriteW,
      this.spriteH,
      this.x,
      this.y,
      this.spriteW,
      this.spriteH
    );
    }
}
export class mushroom extends Enemy{
    constructor(game){
        super();
        this.game= game;
        this.spriteW= 80;
        this.spriteH= 64;
        this.x= this.game.width;
        this.y= this.game.height - this.spriteH - 35;
        this.image= document.querySelector('.mushroom');
        this.speedY= 0;
        this.speedX= Math.random()*(3-1.5)+1.5;
        this.maxFrames= 7;
        this.stunImg= document.querySelector('#stunImg');
        this.maxStun= 17;
        this.stop= false;

    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.stop) this.speedX=1;
    }
}

export class bat extends Enemy{
    constructor(game){
        super();
        this.game= game;
        this.maxFrames= 7;
        this.speedX= Math.random()*(2-1)+1;
        this.speedY= 0;
        this.y= this.game.height/2 + Math.random()*(this.game.height/2)- 200;
        this.x= this.game.width;
        this.spriteW= 64;
        this.spriteH= 64;
        this.image= document.querySelector('#bat');
         this.stunImg= document.querySelector('#stunBat');
        this.maxStun= 4;
        this.attack= false;

    }
    update(deltaTime){
        super.update(deltaTime);
       
        if(this.groundWalk=== false){
            if(this.framesX>= 4 ){
             if(!this.belowGround()) this.speedY+= Math.random()*2;
             else  this.speedY*= -1;          
            }
        }   

        
    }
    belowGround(){
    return this.y>= this.game.height- this.spriteH- 35;
  }
}
class stun{
    constructor(enemy){
        this.enemy= enemy;
    }
    enter(){
        this.enemy.framesX= 0;
        this.enemy.maxFrames= this.enemy.maxStun;
        this.enemy.image= this.enemy.stunImg;
        this.enemy.requireInterval= 100;
        this.enemy.danger= false;
    }
}