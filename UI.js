export class UI{
    constructor(game){
        this.game= game;
        
        //life
        this.heartH= 35;
        this.heartW= 35;
        this.heartX= this.game.width- this.heartW/2;
        this.heartY= this.game.height/2+ Math.random()*(this.game.height/2-100);
        this.heart= document.querySelector('.heart');
        //lifeBar
        this.lifebar= document.querySelector('.lifebar');
        this.framesY= 12;
        //chances
        this.chances= document.querySelector('.heart');
        //shield animation
        this.shieldY=0;
        this.removeShield= false;
        this.shieldInterval= 20;
        this.shieldTime= 200;
        this.lifeReduction= false;
        this.timer= 0;
        this.border= document.querySelector('.border');
        this.shieldHealthImg= document.querySelector('.shieldHealth');
    }
    draw(cxt){
        if(this.framesY== 0) this.framesY=1;
        else if(this.framesY> 12) this.framesY= 12;
        cxt.font= "bold 20px Poppins";
        cxt.fillText('ISADORA',13, this.game.height/8.5);
        cxt.save();
        cxt.fillStyle= 'white'
        cxt.fillText('ISADORA',10, this.game.height/9);
        cxt.restore();
        for(let i= 0; i< this.game.lives; i++){
            cxt.drawImage(this.chances,0,0,51,51, 35*i+5,this.game.height/5,35,35);
        }
        if(this.game.lives== 0)cxt.drawImage(this.border,0,0,51,51,10,this.game.height/5,35,35);

        cxt.drawImage(this.lifebar,0,this.framesY*32,384,32, 0,this.game.height/8,384,32);
        
        if(this.game.shieldHealthDisplay){
            cxt.drawImage(this.shieldHealthImg,0,this.shieldY* 32,384,32,this.game.width/2- 384/2, this.game.height/2 ,384,32);
        }
        if(this.game.healthDisplay) {
            cxt.strokeRect(this.heartX, this.heartY, this.heartW,this.heartH)
            cxt.drawImage(this.heart,0,0,51,51,this.heartX,this.heartY,this.heartW,this.heartH);
            this.heartX-= this.game.speed+1;
        }

        if(this.game.displayBossMsg){
            cxt.save();
            cxt.fillStyle= 'white';
            cxt.font= "15px Poppins";

            cxt.fillText(this.game.messages[this.game.bossMsgNo],10, this.game.height/3.3);
            cxt.restore();
        }

        if(this.game.displayMsg){
            cxt.save();
            cxt.fillStyle= 'white';
            cxt.font= "15px Poppins";
            if(this.game.displayBossMsg) cxt.fillText(this.game.messages[this.game.msgNo],10, this.game.height/3);
            else cxt.fillText(this.game.messages[this.game.msgNo],10, this.game.height/3.3);
            cxt.restore();
        }


    }
    update(deltaTime){
        if(!this.lifeReduction){
            if(this.timer> this.shieldInterval){
                if(this.shieldY>= 12) {this.shieldY= 12; this.lifeReduction= true}
                else this.shieldY++;
                this.timer= 0;
            }else this.timer+=deltaTime;
        }else{
            if(this.timer> this.shieldTime){
                if(this.shieldY== 0) {
                    this.removeShield= true;
                }
                else this.shieldY--;
                this.timer= 0;
            }else this.timer+=deltaTime;
        }
    }
}