import { Attack, Spell, Cast, Hurt, Idle } from "./bossStates.js";

export class Boss{
    constructor(game, player){
        this.game= game;
        this.player= player;
        //images 
        this.attack= [document.querySelector('.boss1'),
            document.querySelector('.boss2'),
            document.querySelector('.boss3'),
            document.querySelector('.boss4'),
            document.querySelector('.boss5'),
            document.querySelector('.boss6'),
            document.querySelector('.boss7'),
            document.querySelector('.boss8'),
            document.querySelector('.boss9'),
            document.querySelector('.boss10')
        ];
         this.spell= [document.querySelector('.spell1'),
            document.querySelector('.spell2'),
            document.querySelector('.spell3'),
            document.querySelector('.spell4'),
            document.querySelector('.spell5'),
            document.querySelector('.spell6'),
            document.querySelector('.spell7'),
            document.querySelector('.spell8'),
            document.querySelector('.spell9'),
            document.querySelector('.spell10'),
            document.querySelector('.spell11'),
            document.querySelector('.spell12'),
            document.querySelector('.spell13'),
            document.querySelector('.spell14'),
            document.querySelector('.spell15'),
            document.querySelector('.spell16'),

        ];
        this.cast= [document.querySelector('.cast1'),
            document.querySelector('.cast2'),
            document.querySelector('.cast3'),
            document.querySelector('.cast4'),
            document.querySelector('.cast5'),
            document.querySelector('.cast6'),
            document.querySelector('.cast7'),
            document.querySelector('.cast8'),
            document.querySelector('.cast9'),
        ];
        this.idle= [document.querySelector('.idle1'),
            document.querySelector('.idle2'),
            document.querySelector('.idle3'),
            document.querySelector('.idle4'),
            document.querySelector('.idle5'),
            document.querySelector('.idle6'),
            document.querySelector('.idle7'),
            document.querySelector('.idle8'),
        ];
        this.hurt=[
            document.querySelector('.hurt1'),
            document.querySelector('.hurt2'),
            document.querySelector('.hurt3'),
        ];
        this.death= [];
        this.spriteW= 420;
        this.spriteH= 279;
        this.x= this.game.width- this.spriteW;
        this.y= this.game.height- this.spriteH- 35;
        this.complete= false;
        this.danger= false;
        this.stunned= false;
        this.backup= false;
        //states
        this.options= [0,2];
        this.states= [new Attack(this, this.attack, player), new Spell(this, this.spell, player), new Cast(this, this.cast, player), new Hurt(this, this.hurt, player), new Idle(this,this.idle,player)];
        this.currentState= this.states[this.options[Math.floor(Math.random()* this.options.length)]];
        this.backupState= []; //for idle

        if(this.currentState== this.states[2]){
            this.game.bossMsgNo= 1;
            this.game.paused= true;
            this.game.speed= 0;
            this.game.player.setState(0,0,document.querySelector('#idle'));
        }else this.game.bossMsgNo= 0;
        //collision
        this.collisionX=0;
        this.collisionY=0;  
        this.collisionW=0;
        this.collisionH=0;
        //for idle collision
        this.idleX= (this.game.width- this.spriteW)+ this.spriteW/1.6;
        this.idleY= (this.game.height- this.spriteH- 35)+ this.spriteH/3.7;  
        this.idleW= this.spriteW/4;
        this.idleH= this.spriteH/1.5;
        this.hit= false;
    }
    update(deltaTime){
        this.currentState.update(deltaTime);
        if(this.backup){
            this.backupState.update(deltaTime);
        }

    }
    draw(cxt){
        this.currentState.draw(cxt);
        if(this.backup){
            this.backupState.draw(cxt);
        }
    }
    
}