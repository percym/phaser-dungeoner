import Phaser from 'phaser'

declare global{
    namespace Phaser.GameObjects{
        interface GameObjectFactory{
         
            fauna(x:number, y: number, texture :string, frame?:string| number):Fauna
        }
    }
}

export default class Fauna extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Phaser.Scene, x:number, y:number,texture:string , frame?:string|number){
        super(scene, x, y , texture,frame)
        // this.body.setSize(this.width * 0.5, this.height * 0.8)
        this.anims.play('fauna-run-side')
    }


}

Phaser.GameObjects.GameObjectFactory.register('fauna',function(this:Phaser.GameObjects.GameObjectFactory,x:number, y: number, texture :string, frame?:string| number){
    var sprite = new Fauna(this.scene, x,y,texture,frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    return sprite

})