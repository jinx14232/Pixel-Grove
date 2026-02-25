
class state{
    constructor(images, player){
        this.frames= images;
        this.requireInterval = 100;
        this.currentInterval = 0;
        this.currentImg=0;
        this.counter= 0;
        this.player= player;

    }
    update(deltaTime){

        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            if(this.currentImg== this.frames.length-1){
                this.apperance++;
                this.boss.x= this.player.x- this.boss.spriteW/3;
            }
            if(this.currentImg>= this.dangerStart && this.currentImg<= this.dangerEnd ) this.boss.danger= true;
            else this.boss.danger= false;
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
        //not for every move
        this.apperance= 0;    
        this.maxApperance= 10;
        this.dangerStart= 4;
        this.dangerEnd= 7;

    }
    update(deltaTime){
        super.update(deltaTime)

        this.boss.collisionX= this.boss.x+this.boss.spriteW/7;
        this.boss.collisionY= this.boss.y+ this.boss.spriteH/2;  
        this.boss.collisionW= this.boss.spriteW/1.7;
        this.boss.collisionH= this.boss.spriteH/2;
        if(this.apperance === this.maxApperance){
            this.apperance=0;
            this.boss.complete= true;
        }
        if(this.boss.stunned){
            this.danger= false
            this.boss.currentState= this.boss.states[3];
        }
    }
    draw(cxt){
        super.draw(cxt);
        cxt.strokeRect(this.boss.collisionX, this.boss.collisionY, this.boss.collisionW, this.boss.collisionH)
    }

}
export class Spell extends state{
    constructor(boss, images, player){
        super(images, player);
        this.player= player;
        this.boss= boss;
        //not for every move
        this.apperance= 0;    
        this.maxApperance= 10;
        this.dangerStart= 6;
        this.dangerEnd= 12;
        
    }
    update(deltaTime){
        super.update(deltaTime);

        this.boss.collisionX= this.boss.x+this.boss.spriteW/2.5;
        this.boss.collisionY= this.boss.y+ this.boss.spriteH/2;  
        this.boss.collisionW= this.boss.spriteW/6;
        this.boss.collisionH= this.boss.spriteH/2;
        
        if(this.apperance === this.maxApperance){
            this.apperance=0;
            this.boss.complete= true;
            this.boss.backup= false;
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
        this.player= player;
        this.boss= boss;
        //not for every move
        this.apperance= 0;    
        this.maxApperance= 1;
        this.requireInterval = 200;        

    }
    update(deltaTime){
        super.update(deltaTime);

        if(this.apperance === this.maxApperance){
            this.apperance=0;
            this.boss.game.paused= false;
            this.boss.x= this.player.x- this.boss.spriteW/3;
            this.boss.currentState= this.boss.states[1];
            this.boss.backupState= this.boss.states[4];
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
        this.player= player;
        this.boss= boss;
        //not for every move
        this.apperance= 0;    
        this.maxApperance= 1;
        this.boss.hit= true;
    }
    update(deltaTime){
        if(this.currentInterval> this.requireInterval){  
            this.currentInterval=0;
            this.currentImg= (this.currentImg+ 1) % this.frames.length;
            if(this.currentImg== this.frames.length-1) this.apperance++;
        }else this.currentInterval+= deltaTime;
        
        
        if(this.apperance === this.maxApperance){
            this.apperance=0;
            this.boss.stunned= false;
            this.boss.hit= false;
            this.boss.backupState= this.boss.states[4];
        }
    }
    draw(cxt){
        cxt.drawImage(this.frames[this.currentImg],0,0, this.boss.spriteW, this.boss.spriteH, this.boss.game.width- this.boss.spriteW, this.boss.y, this.boss.spriteW, this.boss.spriteH);
    }

}
export class Idle extends state{
    constructor(boss, images, player){
        super(images, player);
        this.player= player;
        this.boss= boss;
        //not for every move
        this.apperance= 0;    
        this.maxApperance= 10;
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

