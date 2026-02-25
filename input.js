export class Input{
    constructor(){
        this.keys= [];
        document.addEventListener('keydown',e=>{
            if((e.key=== 'ArrowUp' ||
                e.key=== 'ArrowDown' ||
                e.key=== 'ArrowLeft' ||
                e.key=== 'ArrowRight' ||
                e.key=== 'Shift' ||
                e.key=== 'Enter' ||
                e.key=== ' ' ||
                e.key=== 'Control') && 
                this.keys.indexOf(e.key)=== -1){
                this.keys.push(e.key);
            }
        })

        document.addEventListener('keyup',e=>{
            if(e.key=== 'ArrowUp' ||
                e.key=== 'ArrowDown' ||
                e.key=== 'ArrowLeft' ||
                e.key=== 'ArrowRight' ||
                e.key=== 'Shift' ||
                e.key=== 'Enter' ||
                e.key=== ' ' ||
                e.key=== 'Control'){
                this.keys.splice(e.key,1);
            }
        })
    }
}