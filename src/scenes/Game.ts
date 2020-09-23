import Phaser from 'phaser'

import {debugDraw} from '../utils/debug'
import {createLizardAnims} from '../anims/EnemyAnims'
import {createCharacterAnims} from '../anims/CharacterAnimations'
import {createTreasureChestAnimations} from '../anims/TreasurechestAnims'

import Lizard from '../enemies/Lizard'
import   '../Characters/Fauna'
import Fauna from '../Characters/Fauna'
import {sceneEvents} from '../events/EventsCenter'
import Chest from '../items/Chest'

export default class Game extends Phaser.Scene{

    private cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys
    private fauna !: Fauna
    private hit = 0 
    private playerLizardCollider?: Phaser.Physics.Arcade.Collider
    private lizardKnivesCollider?:Phaser.Physics.Arcade.Collider

    private knives?:Phaser.Physics.Arcade.Group
    private lizards?:Phaser.Physics.Arcade.Group

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
        createTreasureChestAnimations(this.anims)
        
        const map = this.make.tilemap({key:'dungeon'})
        const tileset = map.addTilesetImage('dungeon_tiles','tiles',16,16,1,2)
        
        map.createStaticLayer('Ground', tileset)
        const wallsLayer =map.createStaticLayer('Wall', tileset)

        wallsLayer.setCollisionByProperty({collides:true})

        const chests = this.physics.add.staticGroup({
            classType:Chest
        })
        const chestsLayer = map.getObjectLayer('Chests')
        chestsLayer.objects.forEach(chestObj=>{
            chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5 ,'treasure')
        })
        
        // debugDraw(wallsLayer, this)

            
         this.knives = this.physics.add.group({
            classType:Phaser.Physics.Arcade.Image
        })

        this.fauna =this.add.fauna(128,128,'fauna')
        this.fauna.setKnives(this.knives)
    
        this.cameras.main.startFollow(this.fauna, true)
    

         this.lizards = this.physics.add.group({
            classType:Lizard,
            createCallback: (go) =>{
                const lizGo = go as Lizard
                lizGo.body.onCollide = true

            }
        })

        this.lizards.get(256, 128,'lizard')
        this.physics.add.collider(this.fauna, wallsLayer)
        this.physics.add.collider(this.lizards, wallsLayer)
        this.physics.add.collider(this.knives, wallsLayer, this.handleKnivesAndWallsCollision, undefined, this)
        this.physics.add.collider(this.fauna, chests, this.handlePlayerChestCollision, undefined,this )
        
        this.lizardKnivesCollider = this.physics.add.collider(this.knives, this.lizards, this.handleKnivesAndLizardCollision, undefined , this)
       
        this.playerLizardCollider = this.physics.add.collider(this.lizards, this.fauna, this.handlePlayerLizardCollision,undefined,this)  
        
    
    }
   private handleKnivesAndWallsCollision(obj1: Phaser.GameObjects.GameObject , obj2: Phaser.GameObjects.GameObject) {
    this.knives?.killAndHide(obj1)
    
    }

    private handleKnivesAndLizardCollision(obj1: Phaser.GameObjects.GameObject , obj2: Phaser.GameObjects.GameObject){
        this.knives?.killAndHide(obj1)
        this.lizards?.killAndHide(obj2)
        // console.dir(obj2)



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

    private handlePlayerChestCollision(obj1:Phaser.GameObjects.GameObject, obj2:Phaser.GameObjects.GameObject){

        console.dir(obj1)
        console.dir(obj2)
        const chest = obj2 as Chest
        this.fauna.setChest(chest)
     
    }

    update(t:number , dt:number){
    
        if(this.fauna){
            this.fauna.update(this.cursorKeys)
        }
      
    }

}