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
        this.dogImg= document.querySelector('.dog');
        this.complete= false;
        this.states= [new idle(this), new attack(this)];
        this.currentState= this.states[0];
        this.currentState.enter();
        if(this.currentState== this.states[0]) this.player.setState(0,0,document.querySelector('#idle'));

        
    }
    update(deltaTime){
        this.currentState.update(deltaTime);
        //boundary check
         if(this.x > this.game.width- this.spriteWidth){
            this.x = this.game.width- this.spriteW;
        }
    }
    draw(cxt){
        cxt.drawImage(this.dogImg,this.framesX*this.spriteWidth,this.framesY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth, this.spriteHeight);

    }
    setState(stateNo){
        this.currentState= this.states[stateNo];
        this.currentState.enter();
        
    }
}
class state {
    constructor(dog){
        this.dog= dog;
        this.framesX= 0;
        this.framesY= 0;
        this.maxFrames= 0;
        this.requireInterval= 150;
        this.currentInterval= 0;
        this.apperaence= 0;
        this.maxAppearence= 0;
    }
    update(deltaTime){

        this.dog.x-= this.speedX;
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            if(this.framesX>= this.maxFrames) {this.framesX= 0; this.apperaence++}
            else this.framesX++;
        }else this.currentInterval+= deltaTime;


    }
}

class idle extends state{
    constructor(dog){
        super(dog);
    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 0;
        this.dog.maxFrames= 5;
        this.dog.complete= false;
        this.apperaence= 0;
        this.maxAppearence= 1;
        this.dog.game.paused= true;
        this.speedX= 0;
    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.dog.apperaence== this.dog.maxAppearence) {this.dog.setState(1); this.dog.game.paused= false} 
    }
}
class attack extends state{
    constructor(dog){
        super(dog);
    }
    enter(){
        this.dog.framesX= 0;
        this.dog.framesY= 1;
        this.dog.maxFrames= 4;
        this.dog.complete= false;
        this.apperaence= 0;
        this.maxAppearence= 1;
        this.speedX= 0;

    }
    update(deltaTime){
        if(this.dog.framesX==0){
            if(this.dog.x > this.dog.player.x+ 100) this.dog.speedX+= 1;
            else if(this.dog.x < this.dog.player.x+ 100) this.dog.x =this.dog.player.x+ 100
            else this.dog.speedX= 0;
        }
        
        
    }
}

