import Phaser from 'phaser'
import Chest from '../items/Chest'
import {sceneEvents}  from '../events/EventsCenter'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {

            fauna(x: number, y: number, texture: string, frame?: string | number): Fauna
        }
    }
}
enum HeathState {
    IDLE,
    DAMAGE,
    DEAD
}
export default class Fauna extends Phaser.Physics.Arcade.Sprite {

    private heathState = HeathState.IDLE
    private damageTime = 0

    private _health = 3
    private _coins = 0

    private knives ?: Phaser.Physics.Arcade.Group
    private activateChest?: Chest

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('fauna-run-side')
    }

    get health(){
        return this._health
    }

    setKnives(knives: Phaser.Physics.Arcade.Group){
        this.knives= knives;

    }

    setChest(chest:Chest){
        this.activateChest= chest

    }

    private throwKnives(){
        if(!this.knives){
            return
        }
        const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image
        if (!knife){
            return 0
        }

        
        const parts= this.anims.currentAnim.key.split('-')
        console.log(parts)
        const direction = parts[2]

        const vec = new Phaser.Math.Vector2(0,0)

        switch(direction){
            case 'up':
                vec.y =-1
                break
                case 'down':
                    vec.y = 1
                    break   
                    case 'side':
                        if(this.scaleX < 0){
                            vec.x =-1
                        }else{
                            vec.x = 1
                        }
                        break 
        }
        const angle = vec.angle()
     
        knife.setActive(true)
        knife.setRotation(angle)
        knife.setVisible(true)
        knife.x += vec.x *16;
        knife.y += vec.y *16;
        knife.setVelocity(vec.x *300 , vec.y * 300)
    }
    handledamage(dir: Phaser.Math.Vector2) {
        if(this._health <=0){
            return
        }
        if (this.heathState === HeathState.DAMAGE) {
            return
        }
       
        --this._health

        if(this._health <=0){

            //TODO:die
            this.heathState  = HeathState.DEAD
            this.anims.play('fauna-faint')
            this.setVelocity(0,0)
        }else{
            this.setVelocity(dir.x, dir.y)
            this.setTint(0xff0000)
            this.heathState = HeathState.DAMAGE
            this.damageTime = 0
        }
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t,dt)
        switch (this.heathState) {
            case HeathState.IDLE:
                break
            case HeathState.DAMAGE:
                this.damageTime += dt

                if (this.damageTime >= 250) {
                    this.heathState = HeathState.IDLE
                    this.setTint(0xffffff)
                    this.damageTime = 0

                }
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

        if(this.heathState === HeathState.DAMAGE || this.heathState=== HeathState.DEAD){
            return
        }
        if (!cursors) {
            return
        }

        if(Phaser.Input.Keyboard.JustDown(cursors.space!)){

            if(this.activateChest){
                const coins = this.activateChest.open()
                this._coins += coins
                sceneEvents.emit('player-coins-changed',this._coins)
            }else{
                this.throwKnives()
            }
            return
        }
        const speed = 100

        const leftDown = cursors.left?.isDown
        const rightDown = cursors.right?.isDown
        const upDown = cursors.up?.isDown
        const downDown = cursors.down?.isDown
        if (leftDown) {

            this.anims.play('fauna-run-side', true)
            this.setVelocity(-speed, 0);
            this.scaleX = -1
            this.body.offset.x = 24

        } else if (rightDown) {

            this.anims.play('fauna-run-side', true)
            this.setVelocity(speed, 0)
            this.scaleX = 1
            this.body.offset.x = 8

        } else if (upDown) {

            this.anims.play('fauna-run-up', true)
            this.setVelocity(0, -speed)


        } else if (downDown) {

            this.anims.play('fauna-run-down', true)
            this.setVelocity(0, speed)

        } else {
            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle';
            this.anims.play(parts.join('-'))
            this.setVelocity(0, 0)
        }

        if(leftDown || rightDown || upDown || downDown){
            this.activateChest= undefined
        }
    }

}

Phaser.GameObjects.GameObjectFactory.register('fauna', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
    var sprite = new Fauna(this.scene, x, y, texture, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

    return sprite

})