import Phaser from 'phaser'

import {debugDraw} from '../utils/debug'
import {createLizardAnims} from '../anims/EnemyAnims'
import {createCharacterAnims} from '../anims/CharacterAnimations'
import Lizard from '../enemies/Lizard'
import   '../Characters/Fauna'
import Fauna from '../Characters/Fauna'
import {sceneEvents} from '../events/EventsCenter'

export default class Game extends Phaser.Scene{
    private cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys
    private fauna !: Fauna
    private hit = 0 
    private playerLizardCollider ?: Phaser.Physics.Arcade.Collider

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
        this.scene.run('game-ui')
        createLizardAnims(this.anims)
        createCharacterAnims(this.anims)
        
        const map = this.make.tilemap({key:'dungeon'})
        const tileset = map.addTilesetImage('dungeon_tiles','tiles',16,16,1,2)
        
        map.createStaticLayer('Ground', tileset)
        const wallsLayer =map.createStaticLayer('Wall', tileset)

        wallsLayer.setCollisionByProperty({collides:true})
        
        // debugDraw(wallsLayer, this)

        this.fauna =this.add.fauna(128,128,'fauna')
    
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
       
        this.playerLizardCollider= this.physics.add.collider(lizards, this.fauna, this.handlePlayerLizardCollision,undefined,this)  
    
    }

    private handlePlayerLizardCollision(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject){

        console.log(obj1)
        console.log(obj2)

        const lizard = obj2 as Lizard

        const dx= this.fauna.x - lizard.x 
        const dy= this.fauna.y - lizard.y

        const dir = new  Phaser.Math.Vector2(dx,dy).normalize().scale(200)

        this.fauna.handledamage(dir)

        sceneEvents.emit('player-health-changed',this.fauna.health)

        if(this.fauna.health <= 0 ){
            this.playerLizardCollider?.destroy()
        }
    }

    update(t:number , dt:number){
    
        if(this.fauna){
            this.fauna.update(this.cursorKeys)
        }
      
    }

}