import Phaser from 'phaser'

import Game from './scenes/Game'
import PreLoader from './scenes/PreLoader'
import GameUI from './scenes/GameUI'


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 400,
	height: 250,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug:true
		}
	},
	scene: [PreLoader,Game,GameUI],
	scale:{
		zoom:2
	}
})
