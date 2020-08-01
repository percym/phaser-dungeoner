import Phaser from 'phaser'

import Game from './scenes/Game'
import PreLoader from './scenes/PreLoader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [PreLoader,Game]
}

export default new Phaser.Game(config)
