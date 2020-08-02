import  Phaser from 'phaser'

const debugDraw =(layer: Phaser.Tilemaps.StaticTilemapLayer, scene:Phaser.Scene)=>{
    const debugGraphics = scene.add.graphics().setAlpha(0.7)
    layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243,243,48,255),
        faceColor: new Phaser.Display.Color(40, 39, 37 , 35)
    })
}

export{
    debugDraw
}