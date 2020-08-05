import Phaser from 'phaser'

import {debugDraw} from '../utils/debug'
import {createLizardAnims} from '../anims/EnemyAnims'
import {createCharacterAnims} from '../anims/CharacterAnimations'
import Lizard from '../enemies/Lizard'

export default class Game extends Phaser.Scene{
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
        createLizardAnims(this.anims)
        createCharacterAnims(this.anims)
        
        const map = this.make.tilemap({key:'dungeon'})
        const tileset = map.addTilesetImage('dungeon_tiles','tiles',16,16,1,2)
        
        map.createStaticLayer('Ground', tileset)
        const wallsLayer =map.createStaticLayer('Wall', tileset)

        wallsLayer.setCollisionByProperty({collides:true})
        
        // debugDraw(wallsLayer, this)

        this.fauna = this.physics.add.sprite(120,120,'fauna','walk-down-3.png')
        this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.8)
        this.fauna.anims.play('fauna-run-side')

        this.cameras.main.startFollow(this.fauna, true)

        this.physics.add.collider(this.fauna, wallsLayer)


        const lizards = this.physics.add.group({
            classType:Lizard
        })

        lizards.get(256, 128,'lizard')
        // const lizard = this.physics.add.sprite(256,128, 'lizard','lizard_m_idle_anim_f0.png')
               
        // lizard.anims.play('lizard-run')
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
            this.fauna.body.offset.x = 24

        }else if(this.cursorKeys.right?.isDown){
            
            this.fauna.anims.play('fauna-run-side',true)
            this.fauna.setVelocity(speed, 0)
            this.fauna.scaleX = 1
            this.fauna.body.offset.x = 8

        }else if(this.cursorKeys.up?.isDown){
            
            this.fauna.anims.play('fauna-run-up',true)
            this.fauna.setVelocity(0, -speed)
        

        }else if(this.cursorKeys.down?.isDown){

            this.fauna.anims.play('fauna-run-down',true)
            this.fauna.setVelocity(0, speed)

        }else{
            const parts = this.fauna.anims.currentAnim.key.split('-')
            parts[1] ='idle';
            this.fauna.anims.play(parts.join('-'))
            console.log(parts)
            console.log(parts.join('-'))
            this.fauna.setVelocity(0,0)
        }
    }

}