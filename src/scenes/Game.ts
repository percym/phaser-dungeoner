import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
	constructor()
	{
		super('game')
	}

	preload()
    {
       
    }

    create()
    {
        const map = this.make.tilemap({key:'dungeon'})
        const tileset = map.addTilesetImage('dungeon_tiles','tiles')

        map.createStaticLayer('Ground', tileset)
        map.createStaticLayer('Wall', tileset)

    }
}
