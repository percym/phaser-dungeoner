import Phaser from 'phaser'

export default class PreLoader extends Phaser.Scene{

    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('tiles','tiles/dungeon_tiles.png')
        this.load.tilemapTiledJSON('dungeon','tiles/dungeon01.json')

        this.load.atlas('fauna','character/fauna.png', 'character/fauna.json')
    }

    create(){
        this.scene.start('game')
    }
}