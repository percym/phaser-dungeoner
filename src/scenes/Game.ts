import Phaser from 'phaser'

import {debugDraw} from '../utils/debug'
import {createLizardAnims} from '../anims/EnemyAnims'
import {createCharacterAnims} from '../anims/CharacterAnimations'
import Lizard from '../enemies/Lizard'
import   '../Characters/Fauna'

export default class Game extends Phaser.Scene{
    private cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys
    private fauna !: Phaser.Physics.Arcade.Sprite
    private hit = 0 

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

        this.fauna =this.add.fauna(128,128,'fauna')
        // this.fauna = this.physics.add.sprite(120,120,'fauna','walk-down-3.png')
        // this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.8)
        // this.fauna.anims.play('fauna-run-side')
        this.cameras.main.startFollow(this.fauna, true)

        const lizards = this.physics.add.group({
            classType:Lizard,
            createCallback: (go) =>{
                const lizGo = go as Lizard
                lizGo.body.onCollide = true

            }
        })

        lizards.get(256, 128,'lizard')
        this.physics.add.collider(this.fauna, wallsLayer)
        this.physics.add.collider(lizards, wallsLayer)
       
        this.physics.add.collider(lizards, this.fauna, this.handlePlayerLizardCollision,undefined,this)  
    
    }

    private handlePlayerLizardCollision(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject){

        console.log(obj1)
        console.log(obj2)

        const lizard = obj2 as Lizard

        const dx= this.fauna.x - lizard.x 
        const dy= this.fauna.y - lizard.y

        const dir = new  Phaser.Math.Vector2(dx,dy).normalize().scale(200)

        this.fauna.setVelocity(dir.x, dir.y)

        this.hit =1
    }

    update(t:number , dt:number){
        
        if(this.hit > 0){
            ++this.hit
            if(this.hit > 10){
                this.hit =0
            }
            return
        }

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
            this.fauna.setVelocity(0,0)
        }
    }

}