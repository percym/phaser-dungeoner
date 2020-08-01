import Phaser from 'phaser'

export default class PreLoader extends Phaser.Scene{

    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('tiles','tiles/dungeon_tiles.png')
    }

    create(){

        this.scene.start('game')
    }
}