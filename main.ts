namespace SpriteKind {
    export const Static = SpriteKind.create()
    export const NPC = SpriteKind.create()
    export const NPC_Left = SpriteKind.create()
    export const NPC_Right = SpriteKind.create()
    export const NPC_Top = SpriteKind.create()
    export const NPC_Bottom = SpriteKind.create()
    export const Bush = SpriteKind.create()
}
function getSpriteLocation (sprite: Sprite) {
    return getLocation(sprite.x, sprite.y)
}
function glitchInit () {
    for (let bushSprite of sprites.allOfKind(SpriteKind.Bush)) {
        if (randint(0, 19) == 19) {
            bushSprite.setImage(assets.image`bush_glitch`)
        }
    }
}
function initMap () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`map`)
    for (let flower of tiles.getTilesByType(sprites.castle.tileGrass2)) {
        tiles.placeOnTile(sprites.create(assets.image`bush`, SpriteKind.Bush), flower)
    }
    entranceNPC = sprites.create(assets.image`npc1`, SpriteKind.Static)
    grid.place(entranceNPC, tiles.getTileLocation(7, 2))
    npcs = [entranceNPC]
    if (startGlitching) {
        glitchInit()
    }
}
function startEncounter (monster: string) {
    controller.moveSprite(playerSprite, 0, 0)
    onMap = false
    music.stopAllSounds()
    for (let x = 0; x <= grid.numColumns(); x++) {
        for (let y = 0; y <= grid.numRows(); y++) {
            tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`transparency16`)
        }
    }
    playerSprite.destroy()
    for (let kind of staticKinds) {
        for (let staticSprite of sprites.allOfKind(kind)) {
            staticSprite.destroy()
        }
    }
    for (let offset = 0; offset <= 3; offset++) {
        timer.after(offset * 400 - 200, function () {
            scene.setBackgroundColor(1)
        })
        timer.after(offset * 400, function () {
            scene.setBackgroundColor(15)
        })
    }
    timer.after(1400, function () {
        console.log([playerSprite.x, playerSprite.y])
        initMapScene(playerSprite.x, playerSprite.y)
    })
}
function getLocation (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(x / 16), Math.floor(y / 16))
}
function isDirectionPress () {
    return controller.up.isPressed() || (controller.down.isPressed() || (controller.left.isPressed() || controller.right.isPressed()))
}
scene.onOverlapTile(SpriteKind.Player, sprites.castle.tileGrass2, function (sprite, location) {
    newGrassLoc = getSpriteLocation(playerSprite)
    // Checking if the tile is flowers because this event is hyper sensitive
    if (tiles.tileAtLocationEquals(newGrassLoc, sprites.castle.tileGrass2)) {
        if (!(lastGrassLoc) || lastGrassLoc.col != newGrassLoc.col || lastGrassLoc.row != newGrassLoc.row) {
            lastGrassLoc = newGrassLoc
            if (randint(0, 9) == 9) {
                startEncounter(monsters._pickRandom())
            }
        }
    } else {
        lastGrassLoc = tiles.getTileLocation(0, 0)
    }
})
function initMapScene (x: number, y: number) {
    initMap()
    onMap = true
    inScene = false
    lastGrassLoc = getLocation(x, y)
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    playerSprite.setPosition(x, y)
    controller.moveSprite(playerSprite, 70, 70)
    scene.cameraFollowSprite(playerSprite)
    music.setVolume(100)
}
let npcLocation: tiles.Location = null
let playerLocation: tiles.Location = null
let inScene = false
let lastGrassLoc: tiles.Location = null
let newGrassLoc: tiles.Location = null
let playerSprite: Sprite = null
let npcs: Sprite[] = []
let entranceNPC: Sprite = null
let onMap = false
let staticKinds: number[] = []
let monsters: string[] = []
let startGlitching = false
startGlitching = false
monsters = [
"Monster1",
"Monster2",
"Monster3",
"Monster4",
"Monster5",
"Monster6",
"Monster7",
"Monster8",
"Monster9",
"Monster10"
]
staticKinds = [
SpriteKind.Static,
SpriteKind.NPC_Left,
SpriteKind.NPC_Right,
SpriteKind.NPC_Top,
SpriteKind.NPC_Bottom,
SpriteKind.Bush
]
timer.after(5000, function () {
    startGlitching = true
    if (onMap) {
        glitchInit()
    }
})
initMapScene(160, 5)
forever(function () {
    if (onMap) {
        for (let index = 0; index < 2; index++) {
            music.playMelody("- - - - - - - - ", 120)
            pause(10)
            music.playMelody("- - - - - - - - ", 120)
        }
        while (onMap) {
            music.playMelody("G A F D G E C F ", 120)
            pause(10)
            music.playMelody("E D F E - D C D ", 120)
        }
    } else {
        music.playMelody("C5 B A B C5 B C5 B ", 360)
    }
})
forever(function () {
    playerLocation = getSpriteLocation(playerSprite)
    for (let npcSprite of npcs) {
        // If the sprite isn't a static NPC
        if (npcSprite.kind() == SpriteKind.NPC) {
            npcLocation = getSpriteLocation(npcSprite)
            if (npcSprite.kind() == SpriteKind.NPC_Left && false) {
            	
            } else if (npcSprite.kind() == SpriteKind.NPC_Right) {
            	
            } else if (npcSprite.kind() == SpriteKind.NPC_Top) {
            	
            } else if (npcSprite.kind() == SpriteKind.NPC_Bottom) {
            	
            }
        }
    }
    pause(200)
})
forever(function () {
    if (onMap) {
        while (onMap) {
            music.playMelody("C5 B C5 B G G A B ", 120)
            pause(10)
            music.playMelody("D A B G C5 C D F ", 120)
        }
    }
})
forever(function () {
    if (onMap) {
        while (onMap) {
            music.playMelody("D C D E D C E D ", 120)
            pause(10)
            music.playMelody("C D E C5 B D C E ", 120)
        }
    }
})
