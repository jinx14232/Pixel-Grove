
class layer{
    constructor(game, width, height, speedModifier, image){
        this.game= game;
        this.SpriteWdth= width;
        this.spriteHeight= height;
        this.width= this.game.width;
        this.height= this.game.height;
        this.speedModifier= speedModifier;
        this.x= 0;
        this.y= 0;
        this.image= image;
    }
    update(){
        if(this.x < -this.width){
            this.x= 0;
        }else
            this.x-= this.game.speed * this.speedModifier;
    }
    draw(cxt){
        cxt.drawImage(this.image,this.x,this.y,this.width,this.height);
        cxt.drawImage(this.image,this.x+this.width-this.game.speed ,this.y,this.width,this.height)

    }
}

export class bg{
    constructor(game){
        this.game= game;
        this.width= 928;
        this.height= 793;
        this.image0= document.querySelector('#l0');
        this.l0= new layer(this.game, this.width, this.height, 2, this.image0);
        this.image1= document.querySelector('#l1');
        this.l1= new layer(this.game, this.width, this.height, 2, this.image1);
        this.image2= document.querySelector('#l2');
        this.l2= new layer(this.game, this.width, this.height, 2, this.image2);
        this.image3= document.querySelector('#l3');
        this.l3= new layer(this.game, this.width, this.height, 1, this.image3);
        this.image5= document.querySelector('#l5');
        this.l5= new layer(this.game, this.width, this.height, 2, this.image5);
        this.image6= document.querySelector('#l6');
        this.l6= new layer(this.game, this.width, this.height, 4, this.image6);
        this.image7= document.querySelector('#l7');
        this.l7= new layer(this.game, this.width, this.height, 3, this.image7);
        this.image8= document.querySelector('#l8');
        this.l8= new layer(this.game, this.width, this.height, 3, this.image8);
        this.image9= document.querySelector('#l9');
        this.l9= new layer(this.game, this.width, this.height, 4, this.image9);
        this.image10= document.querySelector('#l10');
        this.l10= new layer(this.game, this.width, this.height, 4, this.image10);
        this.image11= document.querySelector('#l11');
        this.l11= new layer(this.game, this.width, this.height, 2, this.image11);
        this.image12= document.querySelector('#l12');
        this.l12= new layer(this.game, this.width, this.height, 4, this.image12);

        this.layers= [this.l0,this.l1,this.l2,this.l3,this.l5,this.l6,this.l7,this.l8,this.l9,this.l10,this.l11,this.l12];
        // this.layers= [this.l0, this.l1, this.l2, this.l3, this.l5, this.l6, this.l7, this.l8, this.l9, this.l10, this.l11, this.l12];
        console.log(this.layers);
    }
    update(){
        this.layers.forEach(layer=>{
            layer.update();
        })
    }
    draw(cxt){
        this.layers.forEach(layer=>{
            layer.draw(cxt);
        })
    }

}