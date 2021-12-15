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
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isScene) {
        story.clearAllText()
    }
})
function initMap () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`map`)
    for (let flower of tiles.getTilesByType(sprites.castle.tileGrass2)) {
        tiles.placeOnTile(sprites.create(assets.image`bush`, SpriteKind.Bush), flower)
    }
    npcs[0].sprite = sprites.create(assets.image`npc1`, SpriteKind.NPC_Right)
grid.place(npcs[0].sprite, tiles.getTileLocation(7, 2))
    if (isGlitching) {
        glitchInit()
    }
}
function playerHasStopped () {
    if (rotation == "Right") {
        animation.runImageAnimation(
        playerSprite,
        assets.animation`rightStop`,
        200,
        true
        )
    } else if (rotation == "Down") {
        animation.runImageAnimation(
        playerSprite,
        assets.animation`downStop`,
        200,
        true
        )
    } else if (rotation == "Left") {
        animation.runImageAnimation(
        playerSprite,
        assets.animation`leftStop`,
        200,
        true
        )
    } else if (rotation == "Up") {
        animation.runImageAnimation(
        playerSprite,
        assets.animation`upStop`,
        200,
        true
        )
    }
    rotation = ""
}
function startEncounter (monster: string) {
    controller.moveSprite(playerSprite, 0, 0)
    isMap = false
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
        initMapScene(playerSprite.x, playerSprite.y)
    })
}
function isDirectionPressed () {
    return controller.up.isPressed() || (controller.down.isPressed() || (controller.left.isPressed() || controller.right.isPressed()))
}
function getLocation (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(x / 16), Math.floor(y / 16))
}
scene.onOverlapTile(SpriteKind.Player, sprites.castle.tileGrass2, function (sprite, location) {
    newGrassLoc = getSpriteLocation(playerSprite)
    // Checking if the tile is flowers because this event is hyper sensitive
    if (tiles.tileAtLocationEquals(newGrassLoc, sprites.castle.tileGrass2)) {
        if (!(lastGrassLoc) || lastGrassLoc.col != newGrassLoc.col || lastGrassLoc.row != newGrassLoc.row) {
            lastGrassLoc = newGrassLoc
            if (randint(0, 9) == 9) {
                startEncounter(monsters._pickRandom())
            } else {
                isGrassHit = true
            }
        }
    } else {
        lastGrassLoc = tiles.getTileLocation(0, 0)
    }
})
function initMapScene (x: number, y: number) {
    initMap()
    isMap = true
    isScene = false
    lastGrassLoc = getLocation(x, y)
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    playerSprite.setPosition(x, y)
    controller.moveSprite(playerSprite, 70, 70)
    scene.cameraFollowSprite(playerSprite)
    music.setVolume(100)
}
let isMap = false
let staticKinds: number[] = []
let monsters: string[] = []
let isGlitching = false
let isGrassHit = false
let rotation = ""
let npcLocation: tiles.Location = null
let playerLocation: tiles.Location = null
let newGrassLoc: tiles.Location = null
let lastGrassLoc: tiles.Location = null
let playerSprite: Sprite = null
let isScene = false
let npcRange = null
let npcs = [{
    name: "Park Guard",
    callOut: "Stop!",
    sprite: <Sprite | undefined>undefined,
    dialogs: [
        {
            name: "???",
            text: "Hello there stranger, I'm the park guard.",
        },
        {
            name: "Matthew",
            text: "Hi there."
        },
        {
            text: "Are you here to help with catching the farm animals?"
        },
        {
            name: "Matthew",
            text: "Yes, I am."
        },
        {
            text: "Ok, then good luck out there. Hurry though, before it's too late!"
        }
    ],
    range: 5,
    interacted: false
}]
interface NPCInfo {
    name: string,
    callOut: string,
    sprite: Sprite,
    dialogs: {
        name?: string,
        text: string
    }[],
    range: number,
    interacted: boolean
}
function npcInteraction(npc: NPCInfo, x: number, y: number) {
    let originalCords = [npc.sprite.x, npc.sprite.y]
    let originalLoc = getLocation(originalCords[0], originalCords[1]);
    let originalImage = npc.sprite.image
    let goBackAnimation: Image[] = null
    story.startCutscene(function () {
        isScene = true
        controller.moveSprite(playerSprite, 0, 0)
        playerHasStopped()
        story.spriteSayText(npc.sprite, npc.callOut, 15, 1, story.TextSpeed.VeryFast)
        if (npc.name == "Park Guard") {
            goBackAnimation = assets.animation`heroWalkLeft`
            animation.runImageAnimation(npc.sprite, assets.animation`heroWalkRight`, 200, true)
        }
        story.spriteMoveToLocation(npc.sprite, x, y, 70)
        animation.stopAnimation(animation.AnimationTypes.ImageAnimation, npc.sprite)
        npc.sprite.setImage(originalImage)
        for (let dialog of npc.dialogs) {
            story.printCharacterText(dialog.text, dialog.name || npc.name)
        }
        animation.runImageAnimation(
            npc.sprite,
            goBackAnimation,
            200,
            true
        )
        tiles.setWallAt(tiles.getTileLocation(originalLoc.col, originalLoc.row), false)
        story.spriteMoveToLocation(npc.sprite, originalCords[0], originalCords[1], 70)
        animation.stopAnimation(animation.AnimationTypes.ImageAnimation, npc.sprite)
        npc.sprite.setImage(originalImage)
        tiles.setWallAt(tiles.getTileLocation(originalLoc.col, originalLoc.row), true)
        isScene = false
        npc.interacted = true
        controller.moveSprite(playerSprite, 70, 70)
    })
}
rotation = "Down"
isGrassHit = false
isGlitching = false
monsters = [
"Beaver",
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
timer.after(300000 - 5000, function () {
    isGlitching = true
    if (isMap) {
        glitchInit()
    }
})
initMapScene(160, 5)
// effects
forever(function () {
    if (isGrassHit) {
        music.playMelody("F E D - - - - - ", 500)
        isGrassHit = false
    }
})
// Music1
forever(function () {
    if (isMap) {
        for (let index = 0; index < 2; index++) {
            music.playMelody("- - - - - - - - ", 120)
            pause(10)
            music.playMelody("- - - - - - - - ", 120)
        }
        while (isMap) {
            music.playMelody("G A F D G E C F ", 120)
            pause(10)
            music.playMelody("E D F E - D C D ", 120)
        }
    } else {
        music.playMelody("C5 B A B C5 B C5 B ", 360)
    }
})
// Music2
forever(function () {
    if (isMap) {
        while (isMap) {
            music.playMelody("C5 B C5 B G G A B ", 120)
            pause(10)
            music.playMelody("D A B G C5 C D F ", 120)
        }
    }
})
// Music3
forever(function () {
    if (isMap) {
        while (isMap) {
            music.playMelody("D C D E D C E D ", 120)
            pause(10)
            music.playMelody("C D E C5 B D C E ", 120)
        }
    }
})
// NPC AI
game.onUpdateInterval(100, function () {
    if (isMap && !(isScene)) {
        playerLocation = getSpriteLocation(playerSprite)
        if (controller.right.isPressed()) {
            if (rotation != "Right") {
                animation.runImageAnimation(
                playerSprite,
                assets.animation`right`,
                200,
                true
                )
                rotation = "Right"
            }
        } else if (controller.left.isPressed()) {
            if (rotation != "Left") {
                animation.runImageAnimation(
                playerSprite,
                assets.animation`left`,
                200,
                true
                )
                rotation = "Left"
            }
        } else if (controller.down.isPressed()) {
            if (rotation != "Down") {
                animation.runImageAnimation(
                playerSprite,
                assets.animation`down`,
                200,
                true
                )
                rotation = "Down"
            }
        } else if (controller.up.isPressed()) {
            if (rotation != "Up") {
                animation.runImageAnimation(
                playerSprite,
                assets.animation`up`,
                200,
                true
                )
                rotation = "Up"
            }
        } else {
            playerHasStopped()
        }
        for (let npc of npcs) {
            // If the sprite isn't a static NPC
            if (npc.sprite.kind() != SpriteKind.NPC && !(npc.interacted)) {
                npcLocation = getSpriteLocation(npc.sprite)
                if (npc.sprite.kind() == SpriteKind.NPC_Left) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), -1 * npc.range, 0)
                    if (npcRange.col <= playerLocation.col && npcLocation.col >= playerLocation.col && npcLocation.row == playerLocation.row) {
                        rotation = "Right"
                        npcInteraction(npc, playerSprite.x + 16, npc.sprite.y)
                    }
                } else if (npc.sprite.kind() == SpriteKind.NPC_Right) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), npc.range, 0)
                    if (npcRange.col >= playerLocation.col && npcLocation.col <= playerLocation.col && npcLocation.row == playerLocation.row) {
                        rotation = "Left"
                        npcInteraction(npc, playerSprite.x - 16, npc.sprite.y)
                    }
                } else if (npc.sprite.kind() == SpriteKind.NPC_Top) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, -1 * npc.range)
                    if (npcRange.row <= playerLocation.row && npcLocation.row >= playerLocation.row && npcLocation.col == playerLocation.col) {
                        rotation = "Down"
                        npcInteraction(npc, npc.sprite.x, playerSprite.y - 16)
                    }
                } else if (npc.sprite.kind() == SpriteKind.NPC_Bottom) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, npc.range)
                    if (npcRange.row >= playerLocation.row && npcLocation.row <= playerLocation.row && npcLocation.col == playerLocation.col) {
                        rotation = "Up"
                        npcInteraction(npc, npc.sprite.x, playerSprite.y + 16)
                    }
                }
            }
        }
    }
})
