import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    private cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys
    private fauna !: Phaser.Physics.Arcade.Sprite
	constructor()
	{
		super('game')
	}

	preload()
    {
      this.cursorKeys = this.input.keyboard.createCursorKeys() 
    }

    create()
    {
        const map = this.make.tilemap({key:'dungeon'})
        const tileset = map.addTilesetImage('dungeon_tiles','tiles')

        map.createStaticLayer('Ground', tileset)
        const wallsLayer =map.createStaticLayer('Wall', tileset)

        wallsLayer.setCollisionByProperty({collides:true})

        const debugGraphics = this.add.graphics().setAlpha(0.7)
        wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243,243,48,255),
            faceColor: new Phaser.Display.Color(40, 39, 37 , 35)
        })

         this.fauna = this.physics.add.sprite(120,120,'fauna','walk-down-3.png')
         this.anims.create({
            key:'fauna-idle-down',
            frames:[{key:'fauna', frame:'walk-down-3.png'}]
        })


        this.anims.create({
            key:'fauna-idle-up',
            frames:[{key:'fauna', frame:'walk-down-3.png'}]
        })

        this.anims.create({
            key:'fauna-idle-side',
            frames:[{key:'fauna', frame:'walk-down-3.png'}]
        })

        this.anims.create({
            key:'fauna-run-down',
            frames:this.anims.generateFrameNames('fauna',{start:1, end:8, prefix:'run-down-', suffix:'.png'}),
            repeat: -1,
            frameRate:15 
        })


        this.anims.create({
            key:'fauna-run-up',
            frames:this.anims.generateFrameNames('fauna',{start:1, end:8, prefix:'run-up-', suffix:'.png'}),
            repeat: -1,
            frameRate:15 
        })

        this.anims.create({
            key:'fauna-run-side',
            frames:this.anims.generateFrameNames('fauna',{start:1, end:8, prefix:'run-side-', suffix:'.png'}),
            repeat: -1,
            frameRate:15 
        })

        this.fauna.anims.play('fauna-run-side')
    }

    update(t:number , dt:number){
        if(!this.cursorKeys || !this.fauna){
            return
        }
        const speed =100

        if(this.cursorKeys.left?.isDown){
            this.fauna.anims.play('fauna-run-side',true)
            this.fauna.setVelocity(-speed,0);
            this.fauna.scaleX = -1
            
        }else if(this.cursorKeys.right?.isDown){
            
            this.fauna.anims.play('fauna-run-side',true)
            this.fauna.setVelocity(speed, 0)
            this.fauna.scaleX = 1

        }else if(this.cursorKeys.up?.isDown){
            
            this.fauna.anims.play('fauna-run-up',true)
            this.fauna.setVelocity(0, -speed)
            this.fauna.scaleX = 1

        }else if(this.cursorKeys.down?.isDown){

            this.fauna.anims.play('fauna-run-down',true)
            this.fauna.setVelocity(0, speed)
            this.fauna.scaleX = 1

        }else{
            this.fauna.anims.play('fauna-idle-down')
            this.fauna.setVelocity(0,0)
        }
    }

}