import Phaser from 'phaser'
import {Direction} from '../utils/Direction'

export default class Lizard extends Phaser.Physics.Arcade.Sprite{

    private direction = Direction.Right
    constructor(scene : Phaser.Scene, x:number , y:number , texture:string , frame?:string | number ){
        super(scene, x ,y ,texture,frame)
        this.anims.play('lizard-run')
    }

    preUpdate(t:number, dt:number){
        super.preUpdate(t,dt)

    

    const speed = 100

    switch(this.direction) {
        case Direction.Up :
        this.setVelocity(0, -speed)
        break;
    
         case Direction.Down:
        this.setVelocity(0, speed)
        break;

         case Direction.Left:
        this.setVelocity(-speed, 0)
        break;

            case Direction.Right:
        this.setVelocity(speed, 0)
        break;    


        default:
        break;
    
    }
}
   
}