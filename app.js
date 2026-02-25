import{ Player } from './player.js';
import{ Input } from './input.js';
import{ bg } from './bg.js'
import { mushroom, bat } from './enemy.js';
import { Boss } from './boss.js';
import {UI} from './UI.js';
import {dog}from './dog.js';

window.addEventListener('load',()=>{

let canvas= document.querySelector('#canvas');
let cxt= canvas.getContext('2d');
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;


class Game{
    constructor(width, height){
        this.speed= 0;
        this.width= width;
        this.height= height;
        this.messages= ['. He\'s vulnerable, just roll !!!', '. Now\'s your chance, dodge and attack !!','. Careful! that might be deadly next time..','GAME OVER','You\'r Dead'];
        this.bossMsgNo= 0;
        this.msgNo= 2;
        this.displayBossMsg= false;
        this.displayMsg= false;
        this.input= new Input();
        this.background= new bg(this);
        this.player= new Player(this);
        this.UI= new UI(this);
        this.lives= 3;
        this.healthDisplay= false;  
        this.chance= false;
        this.enemies= [];
        this.enemyTimer= 0;
        this.enemyInterval= Math.random()*500+1000;
        this.bossInterval= 1100;
        this.timer= 0;
        this.boss= [];
        this.arrival= false;
        this.paused= false;
        this.gameOver= false;
        this.shieldHealthDisplay= false;
        this.externalChange= false;
       
    }
    update(deltaTime){

        this.timer++;
        this.background.update();
        this.player.update(deltaTime, this.input.keys);
        if(this.enemyTimer> this.enemyInterval && this.timer< this.bossInterval && this.arrival== false){
            this.enemyTimer= 0;
            this.addEnemy();
        }else if(this.enemyTimer> this.enemyInterval && this.timer> this.boss){
            // this.boss.push(new Boss(this, this.player));
            this.boss.push(new dog(this));

            this.arrival =true;
        }else
            this.enemyTimer+= deltaTime;
        this.enemies.forEach(enemy=>{
            enemy.update(deltaTime);
            this.enemies= this.enemies.filter(enemy=> !enemy.deletion)
        });
         if(this.arrival){
            this.displayBossMsg= true;
            this.player.boundary= 200;
            this.boss[0].update(deltaTime);
            if(this.boss[0].complete){
                this.arrival= false;
                this.boss= [];
                this.timer= 0;
                this.addHealth();
                this.displayBossMsg= false;
                this.player.boundary= this.player.spriteW;
            }
        }
        if(this.paused){
            this.speed=0;
            this.shieldHealthDisplay= false;
            this.UI.lifeReduction= false; 
            this.UI.shieldY= 0;
            this.UI.removeShield= false;
            this.displayBossMsg= false;
            this.player.allowHit= true;

        }
        if(this.UI.framesY== 1 && this.lives>0){ //check for fall state
            this.chance= true;
            // this.player.hit= false;
            //for some reason gameover cant be true here so its in player 
        }else if(this.UI.framesY== 0)  this.player.setState(6,0,document.querySelector('#die'));
        if(this.chance){ //activate fall state
            this.msgNo= 2;
            this.displayMsg= true;
            this.player.allowHit= false;
            this.player.setState(11,0,document.querySelector('#fall'));
            this.lives--;
            this.UI.framesY+=2;
            this.chance= false;
        }
        
        //shield animation
        if(this.shieldHealthDisplay) this.UI. update(deltaTime);
        if(this.player.currentState== this.player.states[9]){
            this.shieldHealthDisplay= true;
        }
        if(this.UI.removeShield || this.externalChange){
            this.shieldHealthDisplay= false;
            this.UI.lifeReduction= false; 
            this.UI.shieldY= 0;
            this.UI.removeShield= false;
            if(!this.externalChange)this.player.setState(0,0,document.querySelector('#idle'))
            this.externalChange= false;
        }


    }
    draw(cxt){
        this.background.draw(cxt);
        this.UI.draw(cxt);            
        this.player.draw(cxt);
        this.enemies.forEach(enemy=>{
            enemy.draw(cxt);
        });
        if(this.arrival){
            this.boss.forEach(boss=>{
            boss.draw(cxt)
        })
        }
        
    }
    addEnemy(){
        
            if(Math.random()> 0.5){
                if(Math.floor(Math.random()*10) % 2=== 0){
                   this.enemies.push(new bat(this));
                }
            }else{
                if(Math.floor(Math.random()*10) % 2=== 0){
                   this.enemies.push(new mushroom(this));
                }
            }
        
    }
    addHealth(){
        if((Math.random().toFixed(1)== 0.3 ||Math.random().toFixed(1)== 0.7 ||Math.random().toFixed(1)== 0.5) && this.lives<5) this.healthDisplay= true;
    }
    
}

let game= new Game(canvas.width, canvas.height);
let lastTime= 0;
console.log(game);

function animate(timeStand){
    cxt.clearRect(0,0,canvas.width,canvas.height);
    cxt.strokeStyle= 'rgba(0,0,0,0)';
    let deltaTime= timeStand- lastTime;
    lastTime= timeStand; 
    game.update(deltaTime);
    game.draw(cxt);

    if(!game.gameOver)requestAnimationFrame(animate);
}
animate(0);

});