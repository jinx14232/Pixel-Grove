
class state{
    constructor(images, player){
        this.frames= images;
        this.requireInterval = 100;
        this.currentInterval = 0;
        this.currentImg=0;
        this.player= player;
        this.apperance= 0;    
        this.maxApperance= 0;

    }
    update(deltaTime){
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            if(this.currentImg== this.frames.length-1){
                this.apperance++;
                this.complete= true; // one appearence
                this.boss.x= this.player.x- this.boss.spriteW/3; //for attack and spell
            }

            if(this.currentImg>= this.dangerStart && this.currentImg<= this.dangerEnd ) 
                this.boss.danger= true;
            else 
                this.boss.danger= false;

        }else this.currentInterval+= deltaTime;
        //boundry check
        if(this.boss.x > this.boss.game.width- this.boss.spriteW){
            this.boss.x = this.boss.game.width- this.boss.spriteW;
        }
    }
    draw(cxt){
        cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.x, this.boss.y, this.boss.spriteW, this.boss.spriteH);
    }
}

export class Attack extends state{
    constructor(boss, images, player){
        super(images, player);
        this.boss= boss;
        this.dangerStart= 4;
        this.dangerEnd= 7;
        this.sound= new Audio();
        this.sound.src= "sounds/attack1.mp3";
        this.sound.volume= 0.6;
        this.sound2= new Audio();
        this.sound2.src= "sounds/monster_attack.wav";
        this.sound2.volume= 0.6;

    }
    
    enter(){
        this.boss.game.bossMsgNo= 0;
        this.sound.play();
        this.sound2.play();
        this.apperance= 0;
        this.maxApperance= Math.floor(Math.random()*(10- 5+1)+5);
    }
    update(deltaTime){
        super.update(deltaTime);

        if(this.currentImg== 2){ 
            this.sound.currentTime= 0;
            this.sound2.currentTime= 0;
            this.sound.play();
            this.sound2.play();
        } 
        this.boss.collisionX= this.boss.x+this.boss.spriteW/7;
        this.boss.collisionY= this.boss.y+ this.boss.spriteH/2;  
        this.boss.collisionW= this.boss.spriteW/1.7;
        this.boss.collisionH= this.boss.spriteH/2;
        
        if(this.apperance === this.maxApperance){
            this.boss.setState(6);
        }
        // if(this.boss.stunned){
        //     this.danger= false
        //     this.boss.currentState= this.boss.states[3];
        // }
    }
    draw(cxt){
        super.draw(cxt);
        cxt.strokeRect(this.boss.collisionX, this.boss.collisionY, this.boss.collisionW, this.boss.collisionH)
    }

}
export class Spell extends state{ //current state
    constructor(boss, images, player){
        super(images, player);
        this.boss= boss;
        this.dangerStart= 6;
        this.dangerEnd= 12;
        this.sound= new Audio();
        this.sound.src= "sounds/lightning.mp3";
        this.sound.volume= 0.7;
        this.complete= false; //for onr appearence
        
    }
    enter(){
        this.boss.game.bossMsgNo= 1;
        this.sound.play();
        this.apperance= 0;
        this.maxApperance= Math.floor(Math.random()*(10- 5+1)+5);
    }
    update(deltaTime){
        super.update(deltaTime);

        this.boss.collisionX= this.boss.x+this.boss.spriteW/2.5;
        this.boss.collisionY= this.boss.y+ this.boss.spriteH/2;  
        this.boss.collisionW= this.boss.spriteW/6;
        this.boss.collisionH= this.boss.spriteH/2;

        if(this.currentImg== 3) this.sound.currentTime= 0;
        if(this.apperance === this.maxApperance){
            // this.boss.backupState= this.boss.states[6];
            // this.boss.backupState.enter();
            this.boss.backup= false;
            this.boss.x= this.boss.game.width- this.boss.spriteW;
            this.boss.setState(6)

        }
    }
    draw(cxt){
        super.draw(cxt);
        cxt.strokeRect(this.boss.collisionX, this.boss.collisionY, this.boss.collisionW, this.boss.collisionH)

    }

}

export class Cast extends state{
    constructor(boss, images, player){
        super(images, player);
        this.boss= boss;
        this.sound= new Audio();
        this.sound.src= "sounds/cast.mp3";

    }
    enter(){
        this.sound.play();
        this.sound.currentTime= 0;
        this.requireInterval = 200;
        this.boss.game.paused= true;        
        this.apperance= 0;
        this.maxApperance= 1;
        this.boss.game.player.setState(0,0,document.querySelector('#idle'));

    }
    update(deltaTime){
        super.update(deltaTime);

        if(this.apperance === this.maxApperance){
            this.boss.game.paused= false;
            this.boss.x= this.player.x- this.boss.spriteW/3;
            this.boss.setState(1);
            this.boss.backupState= this.boss.states[4];
            this.boss.backupState.enter();
            this.boss.backup= true;
        }
    }
    draw(cxt){
        super.draw(cxt);
    }

}
export class Hurt extends state{
    constructor(boss, images, player){
        super(images, player);
        this.boss= boss;
        this.sound= new Audio();
        this.sound.src= "sounds/monster_attack.wav";
        this.sound.volume= 0.6;

    }
    enter(){
        this.apperance= 0;    
        this.maxApperance= 1;
        this.boss.allowHit= false;
        this.requireInterval= 200;
        this.sound.play();
        this.sound.currentTime= 0;
    }
    update(deltaTime){
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            if(this.currentImg== this.frames.length-1) this.apperance++;
        }else this.currentInterval+= deltaTime;
                
        if(this.apperance === this.maxApperance){
            this.sound.pause();
            //allow hit is set true when player attack action is complete in player
            this.boss.allowHit= true;
            this.boss.backupState= this.boss.states[4];
            this.boss.backupState.enter();
        }
    }
    draw(cxt){
        cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.game.width- this.boss.spriteW, this.boss.y, this.boss.spriteW, this.boss.spriteH);
    }

}
export class Idle{
    constructor(boss, images){
        this.frames= images;
        this.boss= boss;
        this.currentInterval= 0;
        this.requireInterval= 0;
        this.currentImg= 0;
    }
    enter(){
        this.requireInterval= 100;
    }
    update(deltaTime){
        
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            
        }else this.currentInterval+= deltaTime;
        //idle , hurt both ends with spells
    }
    draw(cxt){
        cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.game.width- this.boss.spriteW, this.boss.y, this.boss.spriteW, this.boss.spriteH);
        cxt.strokeRect(this.boss.idleX, this.boss.idleY, this.boss.idleW, this.boss.idleH)

    }

}

export class Appear{
    constructor(boss, images){
        this.frames= images;
        this.currentInterval = 0;
        this.boss= boss;
        this.sound= new Audio();
        this.sound.src= "sounds/emerge.mp3";
        this.frame= 0; //replacement of currentimg
        this.requireInterval = 0;
    }
    enter(){
        this.frame= this.frames.length-1; //replacement of currentimg
        this.requireInterval = 200;
        this.boss.game.paused= true;
        this.boss.player.setState(0,0,document.querySelector('#idle'));
        this.sound.play();
        this.currentTime= 0;
    }
    update(deltaTime){
        if(this.currentInterval> this.requireInterval){  
            
            this.currentInterval=0;
            console.log(this.frame)
            if(this.frame> 0){
                this.frame--;
                this.sound.currentTime++;
            }else{
                this.boss.game.paused= false;
                this.boss.setState(this.boss.options[Math.floor(Math.random()* this.boss.options.length)]);
            }
            
        }else this.currentInterval+= deltaTime;
    }
    draw(cxt){
        cxt.drawImage(this.frames[this.frame],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.game.width- this.boss.spriteW, this.boss.y, this.boss.spriteW, this.boss.spriteH);

    }

}
export class Vanish{
    constructor(boss, images, player){
        this.frames= images;
        this.player = player;
        this.currentInterval = 0;
        this.boss= boss;
        this.currentImg= 0;
        this.requireInterval = 0;
        this.sound= new Audio();
        this.sound.currentTime= 0.6;
        this.sound.src= "sounds/vanish.mp3";
    }
    enter(){
        this.requireInterval = 100;
        this.player.currentState.sound.pause();
        this.boss.game.paused= true;
        this.sound.currentTime= 0.6;
        this.sound.play();
        this.player.setState(0,0,document.querySelector('#idle'));

    }
    update(deltaTime){
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            if(this.currentImg== this.frames.length-1){
                this.boss.complete= true;
                this.boss.game.paused= false;
            }
        }else this.currentInterval+= deltaTime;
    }
    draw(cxt){
        if(this.boss.backup)
            cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.game.width- this.boss.spriteW, this.boss.y, this.boss.spriteW, this.boss.spriteH);
        else     
            cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.x, this.boss.y, this.boss.spriteW, this.boss.spriteH);

    }

}

