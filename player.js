import{idle, walk ,roll, land, jump, shield, dead, attack, hurt, hold, revive, fall, fallStay} from './states.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.spriteW = 100;
    this.spriteH = 64;
    this.x = 0;
    this.y = this.game.height - this.spriteH- 35;
    this.boundary= this.spriteW;
    this.framesX = 0;
    this.framesY = 0;
    this.maxFrames = 0;
    this.vy=0;
    this.weight=1;
    this.revival = false;
    this.image = document.querySelector("#idle");
    //animation
    this.requireInterval = 100;
    this.currentInterval = 0;
    //states
    this.states= [new idle(this), new walk(this),new roll(this), new land(this),new jump(this), new shield(this),new dead(this), new attack(this), new hurt(this), new hold(this), new revive(this), new fall(this), new fallStay(this)];
    this.currentState= this.states[0];
    this.currentState.enter();
    this.complete= false;
    this.allowHit= true;
    //shield sound
    this.sound= new Audio();
    this.sound.src= "sounds/shield_touch.mp3";
    //for making attack frame
    this.attackNo3= false;

  }
  update(deltaTime, key) {

    this.checkCollision();
    this.currentState.inputHandler(key);
    if(this.game.lives== 0 || this.game.UI.framesY== 12) this.revival= false;
    else this.revival= true;

    if (key.includes("ArrowLeft")) {

      if(this.currentState!= this.states[6] && this.currentState!= this.states[10] && this.currentState!= this.states[12] && !this.game.paused) this.x-= 6;

    } else if (key.includes("ArrowRight")) {

      if(this.currentState== this.states[6] || this.currentState== this.states[8] || this.currentState== this.states[10] || this.currentState== this.states[12] || this.game.paused) this.x+= 0;
      else this.x+= 6;

    } 

    this.y+= this.vy;
    if(!this.onGround()) this.vy+= this.weight;
    else this.vy= 0;

    if (this.currentInterval > this.requireInterval) {
      this.currentInterval = 0;
      
        if (this.framesX >= this.maxFrames) {
            this.framesX = 0;
            this.complete= true;
          } else {
            this.framesX++;
          }
        if(this.currentState== this.states[6] && this.framesX== 5) {this.game.gameOver= true;}
    } else {
      this.currentInterval += deltaTime;
    }

    //set boundary
    if(this.x < 0){
      this.x= 0;
    }
    if(this.x > this.game.width- this.boundary){
      this.x= this.game.width- this.boundary;
    }

  }
  draw(cxt) {
    cxt.strokeRect(this.x+ this.spriteW/4, this.y, this.spriteW/2, this.spriteH)
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
  onGround(){
    return this.y>= this.game.height- this.spriteH- 35;
  }
  
  setState(stateNumber, speed, image){
    this.image= image;
    this.currentState.sound.pause();
    if(!this.game.paused) this.game.speed= speed;
    this.currentState= this.states[stateNumber];
    if(stateNumber== 10){ // for lives
      this.game.lives--;
      this.game.UI.framesY++;
    } 
   
    this.currentState.enter();
  }
  checkCollision(){
    //for enemies
    this.game.enemies.forEach(enemy=>{
      if(
        enemy.x< this.x+ this.spriteW &&
        enemy.x+ enemy.spriteW > this.x &&
        enemy.y< this.y+ this.spriteH &&
        enemy.y+ enemy.spriteH> this.y &&
        enemy.danger=== true 
      ){
        if(this.currentState== this.states[2] || 
          this.currentState== this.states[5] ||
          this.currentState== this.states[7] ||
          this.currentState== this.states[9] ||
          this.currentState== this.states[11] ||
          this.currentState== this.states[12] 

         ){
            enemy.stunned= true;
            if(this.currentState== this.states[9]||this.currentState== this.states[5]){
              this.sound.currentTime= 0;
              this.sound.play();
            } 
         } else{
          if(this.allowHit){
            this.game.UI.framesY--;
            this.allowHit= false;
            this.setState(8,0,document.querySelector('#hurt'));
            }
          }
      }
    });
    //for boss
    if(this.game.arrival && !this.game.dogArrival){
        if(this.bossCollision() && this.game.boss[0].currentState== this.game.boss[0].states[0]){ //for boss attack
            if(this.currentState!== this.states[2] &&
                this.currentState!== this.states[5] &&
                this.currentState!== this.states[9]
              ){
              if(this.allowHit){
                this.game.UI.framesY--;
                this.allowHit= false;
                this.setState(8,0,document.querySelector('#hurt'));
              }
              }
              if(this.currentState== this.states[5] ||
                this.currentState== this.states[9]){
                  this.sound.play();
                  this.sound.currentTime= 0;
                } 
        }
        if(this.bossCollision() && this.game.boss[0].currentState== this.game.boss[0].states[1]){ //for spell
          
              if(this.currentState!== this.states[2]){
                if(this.allowHit){
                  this.allowHit= false;
                  this.game.externalChange= true; // IF SPELL HITS WHEN SHIELDING
                    this.game.UI.framesY--;
                    this.setState(8,0,document.querySelector('#hurt'));
                 }
              }
          
        }//boss hurt
        if((this.game.boss[0].idleX< this.x+ this.spriteW &&
           this.game.boss[0].idleX+ this.game.boss[0].idleW > this.x &&
           this.game.boss[0].idleY< this.y+ this.spriteH &&
           this.game.boss[0].idleY+ this.game.boss[0].idleH> this.y
           ) && this.game.boss[0].backupState== this.game.boss[0].states[4]){ //for attack collision co ordinats are different
            
            if(this.currentState== this.states[7]){
              if(this.game.boss[0].allowHit) {
                  this.game.boss[0].backupState= this.game.boss[0].states[3];  
                  this.game.boss[0].backupState.enter();
                }

            }

        }
        
    }
    if(this.game.dogArrival){
          if(this.game.boss[0].currentState== this.game.boss[0].states[1] && this.bossCollision()){
            if(//hit 
              this.currentState!= this.states[7]
            ){
              if(this.allowHit && (this.currentState!= this.states[2]&& this.currentState!= this.states[5]&& this.currentState!= this.states[7]&& this.currentState!= this.states[9])){
                this.game.UI.framesY--;
                this.allowHit= false;
                this.setState(8,0,document.querySelector('#hurt'));
              }
              if(this.currentState== this.states[9]||this.currentState== this.states[5]){
              this.sound.currentTime= 0;
              this.sound.volume= 0.5;
              this.sound.play();
            } 
            }
            else{
              
              if(this.game.boss[0].allowHit) {
                this.game.boss[0].allowHit= false;
                this.game.boss[0].setState(3);
              }
            }
          }
        }
    //for life
    if(this.game.healthDisplay){
      if(
        this.game.UI.heartX< this.x+ this.spriteW &&
        this.game.UI.heartX+ this.game.UI.heartW > this.x &&
        this.game.UI.heartY< this.y+ this.spriteH &&
        this.game.UI.heartY+ this.game.UI.heartH> this.y 
      ){
        this.game.healthDisplay= false;
        this.game.lives++;
        this.game.UI.heartX= this.game.width;
    }
    }
    
  }
  bossCollision(){
    return (this.game.boss[0].collisionX< this.x+ this.spriteW &&
           this.game.boss[0].collisionX+ this.game.boss[0].collisionW > this.x &&
           this.game.boss[0].collisionY< this.y+ this.spriteH &&
           this.game.boss[0].collisionY+ this.game.boss[0].collisionH> this.y &&
           this.game.boss[0].danger=== true )
  }

}



