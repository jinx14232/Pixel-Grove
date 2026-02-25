
export class dog{
    constructor(game, player){
        this.game= game;
        this.player= player;
        this.width= this.game.width;
        this.height= this.game.height;
        this.spriteWidth= 128;
        this.spriteHeight= 128;
        this.x= this.width- this.spriteWidth;
        this.y= this.height-this.spriteHeight- 35;
        this.dx= 0;// for skeleton
        this.skeletionDraw= false;
        this.framesX= 0;
        this.framesY= 0;
        this.maxFrames= 0;
        this.dogImg= document.querySelector('.dog');
        this.complete= false;
        this.hitCount=0;
        this.maxHit= Math.floor(Math.random()*(10-7+1)+7);
        this.states= [new idle(this), new attack(this), new vanish(this), new hit(this)];
        this.currentState= this.states[0];
        this.currentState.enter();
        if(this.currentState== this.states[0]) this.player.setState(0,0,document.querySelector('#idle'));
        //collision
        this.collisionX= this.x+ this.spriteWidth/8;
        this.collisionY=  this.y+ this.spriteHeight/1.8;
        this.collisionW= this.spriteWidth/1.8;
        this.collisionH= this.spriteHeight/2.4;
        this.danger= false;
        this.allowHit= true;
        this.speedX= 0;
        this.game.bossMsgNo= 5;
        
    }
    update(deltaTime){
        this.currentState.update(deltaTime);
        //boundary check
        if(this.dx<0-this.spriteWidth){
            this.skeletionDraw= false;
        }
        if(this.x> this.width- this.spriteWidth){
            this.x= this.width- this.spriteWidth   
        }
    }
    draw(cxt){
        this.currentState.draw(cxt);
        if(this.skeletionDraw) {
            cxt.drawImage(this.dogImg,6*this.spriteWidth,3*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.dx, this.y, this.spriteWidth, this.spriteHeight);
            this.dx-= this.game.speed;
        }
    }
    setState(stateNo){
        this.currentState.sound.pause();
        this.currentState= this.states[stateNo];
        this.currentState.enter();
        
    }
}
class state {
    constructor(dog){
        this.dog= dog;
        this.requireInterval= 150;
        this.currentInterval= 0;
    }
    update(deltaTime){
        this.dog.x-= this.dog.speedX;
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            if(this.dog.framesX>= this.dog.maxFrames) {this.dog.framesX= 0; this.complete= true}
            else this.dog.framesX++;
        }else this.currentInterval+= deltaTime;

    }
    draw(cxt){
        cxt.drawImage(this.dog.dogImg,this.dog.framesX*this.dog.spriteWidth,this.dog.framesY*this.dog.spriteHeight, this.dog.spriteWidth, this.dog.spriteHeight, this.dog.x, this.dog.y, this.dog.spriteWidth, this.dog.spriteHeight);

    }
}

class idle extends state{
    constructor(dog){
        super(dog);
        this.complete= false;
        this.sound= new Audio();
        this.sound.src= "sounds/dog_appear.mp3";
    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 0;
        this.dog.maxFrames= 5;
        this.dog.game.paused= true;
        this.complete= false;
        this.dog.speedX= 0;
        this.dog.player.setState(0,0,document.querySelector('#idle'));
        this.sound.play();
        this.sound.currentTime= 0;

    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.complete) {this.dog.setState(1); this.dog.game.paused= false; } 
    }

}
class attack extends state{
    constructor(dog){
        super(dog);
        this.sound= new Audio();
        this.sound.src= "sounds/dog_attack.mp3";
        this.sound.volume= 0.5
    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 1;
        this.dog.maxFrames= 4;
        this.dog.complete= false;
        this.dog.speedX= 1;
        this.dog.apperaence++;
        this.sound.currentTime= 1.5;
        this.sound.play();
    }
    update(deltaTime){
        super.update(deltaTime);
        
        //for vanishing after character passes the dog
        if(this.dog.x < this.dog.player.x-100 && this.dog.framesX>=3) this.dog.setState(2);
        //updateing stroke axes
        this.dog.collisionX= this.dog.x+ this.dog.spriteWidth/8;
        this.dog.collisionY=  this.dog.y+ this.dog.spriteHeight/1.8;
        this.dog.collisionW= this.dog.spriteWidth/1.8;
        this.dog.collisionH= this.dog.spriteHeight/2.4;
        //dog speed
        if(this.dog.framesX>= 2){
            this.dog.speedX+=0.6;
            if(this.dog.x < this.dog.player.x+70) {this.dog.speedX= 0;}
        }else this.dog.speedX= 0;
        //danger management
        if(this.dog.framesX>=3) this.dog.danger= true;
        else this.dog.danger= false;
        //sound
        if(this.dog.framesX== 1) this.sound.currentTime= 1.5;

    }
    draw(cxt){
        super.draw(cxt);
        cxt.strokeRect(this.dog.collisionX,this.dog.collisionY, this.dog.collisionW, this.dog.collisionH)

        
    }
}
class vanish extends state{
    constructor(dog){
        super(dog);
        this.complete= false;
        this.sound= new Audio();
        this.sound.src= "sounds/attack1.mp3";
        this.sound.volume= 0.5;

    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 3;
        this.dog.maxFrames= 6;
        this.dog.complete= false;
        this.dog.speedX= 0;
        this.sound.currentTime= 0;
        this.sound.play();

    }
    update(deltaTime){
        //some different animation then rest
            if(this.currentInterval> this.requireInterval){  
                this.currentInterval=0;
                if(this.dog.framesX>= this.dog.maxFrames) {// because super.update is not here
                    if(this.dog.hitCount== this.dog.maxHit) this.dog.complete= true;
                    else{
                        this.dog.skeletionDraw= true; 
                        this.dog.dx= this.dog.x; 
                        this.dog.x= this.dog.player.x+ Math.random()*(160-100)+100;
                        this.dog.setState(1);
                    }
                    
                }
                else this.dog.framesX++;
            }else this.currentInterval+= deltaTime;

    }

}
class hit extends state{
    constructor(dog){
        super(dog);
        this.complete= false;
        this.sound= new Audio();
        this.sound.src= "sounds/dog_hurt.mp3";
        
    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 2;
        this.dog.maxFrames= 3;
        this.complete= false;
        this.dog.speedX= 0;
        this.dog.hitCount++; //for hit track
        this.sound.currentTime= 0.2;
        this.sound.play();
    }
    update(deltaTime){
        super.update(deltaTime); 
        
        if(this.complete){
            if(this.dog.hitCount== this.dog.maxHit){
                this.dog.setState(2);
            }else{
                this.dog.setState(1);
                this.dog.allowHit= true;
            }
            
        }     
    }

}

