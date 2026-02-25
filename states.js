export class idle{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "breath.mp3";
        this.sound.loop= true;
    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 3;
        this.player.allowHit= true;
        this.sound.currentTime= 0;
        this.sound.play();
    }
    inputHandler(key){
        if((key.includes('ArrowLeft')||key.includes('ArrowRight')) && this.player.game.paused== false){
            // this.sound.pause();
            this.player.setState(1,0.6, document.querySelector('#walk'));
        }else if(key.includes('Shift') && !this.player.game.paused){
            // this.sound.pause();
            this.player.setState(2,3,document.querySelector('#roll'));
        }else if(key.includes('ArrowUp')){
            // this.sound.pause();
            this.player.setState(4,0.6,document.querySelector('#jump'));
        }else if(key.includes('Control')){
            // this.sound.pause();
            this.player.setState(5,0,document.querySelector('#shield') );
        }else if(key.includes('Enter')){
            // this.sound.pause();
            this.player.setState(7,0,attackState() );
        }else if(key.includes(' ')&& this.player.revival){
            // this.sound.pause();
            this.player.setState(10,0, document.querySelector('#revive') );
        }
    }
}
export class walk{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "walk.wav";
        this.sound.loop= true;
    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 6;
        this.sound.play();
        this.sound.currentTime= 0;
    }
    inputHandler(key){

        if(key.includes('ArrowDown')){
            this.player.setState(0,0,document.querySelector('#idle'));
            // this.sound.pause();
        }else if(key.includes('Shift')){
            // this.sound.pause();
            this.player.setState(2,3, document.querySelector('#roll'));
        }else if(key.includes('ArrowUp')){
            // this.sound.pause();
            this.player.setState(4,0.6,document.querySelector('#jump'));
        }else if(key.includes('Control')){
            // this.sound.pause();
            this.player.setState(5,0,document.querySelector('#shield') );
        }else if(key.includes('Enter')){
            // this.sound.pause();
            this.player.setState(7,0, attackState());
        }else if(key.includes(' ')&& this.player.revival){
            // this.sound.pause();
            this.player.setState(10,0, document.querySelector('#revive') );
        }


    }
}
export class roll{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "roll.wav";
    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 9;
        this.speedX=2;
        this.sound.play();
        this.sound.currentTime= 0;
    }
    inputHandler(key){
        if(this.player.x< this.player.game.width/2)this.speedX+= 0.1;
        this.player.x+= this.speedX;
        if(this.player.complete){
            // this.sound.pause();
            this.player.setState(0,0,document.querySelector('#idle') );
        }
    }
}
export class land{
    constructor(player){
        this.player= player;
        this.sound= new Audio();

    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 3;
    }
    inputHandler(key){
        if(this.player.complete){
            this.player.setState(0,0,document.querySelector('#idle'));

        }
    }
}
export class fall{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "falling.wav";
        this.sound.volume= 0.7;
    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 3;
        this.sound.play();
    }
    inputHandler(key){
        if(this.player.complete){
            this.player.setState(12,0,document.querySelector('#fallStay') );

        }
    }
}
export class fallStay{
    constructor(player){
        this.player= player;
        this.appearence= 0;
        this.sound= new Audio();

    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 2;
    }
    inputHandler(key){
        if(this.player.complete){
            this.appearence++;

            if(this.appearence== 5){
                this.appearence=0;
                this.player.allowHit= true;
                this.player.game.displayMsg= false;
                this.player.setState(0,0,document.querySelector('#idle') );
            }
            else 
                this.player.setState(12,0,document.querySelector('#fallStay') );

        }
    }
}
export class jump{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "jump.mp3";
    }
    enter(){
        this.player.complete= false;
        this.sound.play();
        this.sound.currentTime= 0;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 5;
        if(this.player.onGround()) this.player.vy-= 20;
    }
    inputHandler(key){
        if(this.player.onGround()){
            // this.sound.pause();
            this.player.setState(3,0,document.querySelector('#land') );

        }
    }
}
let i= 0;
export class shield{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "shield.mp3";

    }
    enter(){
        this.sound.play();
        this.sound.currentTime= 0;
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 5;
    }
    inputHandler(key){
        if(this.player.complete){
            this.sound.pause();
            this.player.setState(9,0, document.querySelector('#hold'));

        }
         
    }
}
export class dead{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
    }
    enter(){
        this.player.complete= false;
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.maxFrames= 5;
    }
    inputHandler(key){
        if(this.player.complete){
        }
    }
}
export class attack{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "attack.wav";
        this.sound.volume= 0.7;
    }
    enter(){
        this.player.framesX= 0;
        this.player.framesY= 0;
        this.player.complete= false;
        if(this.player.image.id== "attack4") this.player.maxFrames= 4;
        else this.player.maxFrames= 5;
        this.sound.play();
        this.sound.currentTime= 0;
    }
    inputHandler(key){
         if(this.player.complete){
            // this.sound.pause();
            this.player.setState(0,0,document.querySelector('#idle'));
        }
    }
}

export class hurt{
    constructor(player){
        this.player= player;
         this.sound= new Audio();
        this.sound.src= "player_hurt.wav";
        this.sound.volume= 0.7;
    }
    enter(){
            this.player.complete= false;
            this.player.framesX= 0;
            this.player.framesY= 0;
            this.player.maxFrames= 3;
            this.sound.play();
            this.sound.currentTime= 0;
    
    }
    inputHandler(key){
       
            if(this.player.complete){
                this.player.allowHit= true;
                // this.sound.pause();
                this.player.setState(0,0, document.querySelector('#idle'));

            }
         
    }
}
export class hold{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
    }
    enter(){
            this.player.complete= false;
            this.player.framesX= 0;
            this.player.framesY= 0;
            this.player.maxFrames= 3;
    
    }
    inputHandler(key){
            if(this.player.complete){
                this.player.setState(9,0, document.querySelector('#hold'));
            }else if(this.player.complete ){
                this.player.game.externalChange= true;
                this.player.setState(0,0, document.querySelector('#idle'));
            }else if(key.includes('ArrowDown')){
                this.player.game.externalChange= true;
            this.player.setState(0,0,document.querySelector('#idle'));
        }else if(key.includes('Shift')){
            this.player.game.externalChange= true;
            this.player.setState(2,3, document.querySelector('#roll'));
        }else if(key.includes('ArrowUp')){
            this.player.game.externalChange= true;
            this.player.setState(4,0.6,document.querySelector('#jump'));
        }else if(key.includes('Enter')){
            this.player.game.externalChange= true;
            this.player.setState(7,0, attackState());
        }else if(key.includes('ArrowLeft')||key.includes('ArrowRight')){
            this.player.game.externalChange= true;
            this.player.setState(1,0.6, document.querySelector('#walk'));
        }else if(key.includes(' ') && this.player.revival){
          this.player.game.externalChange= true;   
          this.player.setState(10,0, document.querySelector('#revive') );
        }
    }
}
export class revive{
    constructor(player){
        this.player= player;
        this.sound= new Audio();
        this.sound.src= "gulp.mp3";
    }
    enter(){
            this.player.complete= false;
            this.player.framesX= 0;
            this.player.framesY= 0;
            this.player.maxFrames= 6;
            this.sound.play();
            this.sound.currentTime= 0;
    
    }
    inputHandler(key){
            if(this.player.complete){
                this.player.setState(0,0, document.querySelector('#idle1'));
            }
         
    }
}

function attackState(x){
    if(Math.random()< 0.5 ) return document.querySelector('#attack2');
    else if(Math.random()> 0.7)  return document.querySelector('#attack1');
    else return document.querySelector('#attack4');
}
