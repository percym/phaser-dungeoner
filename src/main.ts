import Phaser from 'phaser'

import Game from './scenes/Game'
import PreLoader from './scenes/PreLoader'


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [PreLoader,Game],
	scale:{
		zoom:2
	}
})
