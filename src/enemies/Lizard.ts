import Phaser from 'phaser'
import {Direction} from '../utils/Direction'

export default class Lizard extends Phaser.Physics.Arcade.Sprite{

    private direction = Direction.Right

    constructor(scene : Phaser.Scene, x:number , y:number , texture:string , frame?:string | number ){
        super(scene, x ,y ,texture,frame)
        this.anims.play('lizard-run')
        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this)
    }

    private handleCollision(go : Phaser.GameObjects.GameObject, tile:Phaser.Tilemaps.Tile){
        
        if(go !== this){
            console.log('here')
            return
        }

        const newDirection = Phaser.Math.Between(0,3)
        this.direction = newDirection
        console.log(this.direction)
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