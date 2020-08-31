import Phaser from 'phaser'

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {

            fauna(x: number, y: number, texture: string, frame?: string | number): Fauna
        }
    }
}
enum HeathState {
    IDLE,
    DAMAGE
}
export default class Fauna extends Phaser.Physics.Arcade.Sprite {

    private heathState = HeathState.IDLE
    private damageTime = 0

    private _health = 3


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.anims.play('fauna-run-side')
    }

    get health(){
        return this._health
    }

    handledamage(dir: Phaser.Math.Vector2) {
        if(this._health <=0){
            return
        }
        if (this.heathState === HeathState.DAMAGE) {
            return
        }
        this.setVelocity(dir.x, dir.y)
        this.setTint(0xff0000)
        this.heathState = HeathState.DAMAGE
        this.damageTime = 0
        --this._health

        if(this._health <=0){

            //die
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
        if(this.heathState === HeathState.DAMAGE){
            return
        }
        if (!cursors) {
            return
        }
        const speed = 100

        if (cursors.left?.isDown) {

            this.anims.play('fauna-run-side', true)
            this.setVelocity(-speed, 0);
            this.scaleX = -1
            this.body.offset.x = 24

        } else if (cursors.right?.isDown) {

            this.anims.play('fauna-run-side', true)
            this.setVelocity(speed, 0)
            this.scaleX = 1
            this.body.offset.x = 8

        } else if (cursors.up?.isDown) {

            this.anims.play('fauna-run-up', true)
            this.setVelocity(0, -speed)


        } else if (cursors.down?.isDown) {

            this.anims.play('fauna-run-down', true)
            this.setVelocity(0, speed)

        } else {
            const parts = this.anims.currentAnim.key.split('-')
            parts[1] = 'idle';
            this.anims.play(parts.join('-'))
            this.setVelocity(0, 0)
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