namespace SpriteKind {
    export const Static = SpriteKind.create()
    export const NPC = SpriteKind.create()
    export const NPC_Left = SpriteKind.create()
    export const NPC_Right = SpriteKind.create()
    export const NPC_Up = SpriteKind.create()
    export const NPC_Down = SpriteKind.create()
    export const Bush = SpriteKind.create()
    export const Background = SpriteKind.create()
}
// makes the player use a treat, wich makes it easier to catch, but more likely to run
function useTreat () {
    story.printCharacterText("You threw a treat.")
    aggravation += -1
    throwable = sprites.create(assets.image`treat`, SpriteKind.Projectile)
    throwable.setPosition(25, 70)
    throwable.setVelocity(300, 23)
    timer.after(300, function () {
        throwable.destroy()
        enemyTurn()
    })
}
function getCreature (glitch: boolean) {
    if (glitch) {
        creatureName = creatures.pop()
    } else {
        creatureName = creatures[randint(0, creatures.length - 2)]
    }
    getSpecificCreature(creatureName)
    return creatureName
}
function generateElephant () {
    creature = sprites.create(assets.image`elephant`, SpriteKind.Enemy)
    creature.setPosition(134, 72)
    animation.runImageAnimation(
    creature,
    assets.animation`elephantAnim`,
    200,
    true
    )
}
function generateBeaver () {
    creature = sprites.create(assets.image`beaver`, SpriteKind.Enemy)
    creature.setPosition(133, 69)
    animation.runImageAnimation(
    creature,
    assets.animation`beaverAnim`,
    200,
    true
    )
    creatureAddition = sprites.create(assets.image`treeStump`, SpriteKind.Enemy)
    creatureAddition.setPosition(137, 85)
    creatureAddition2 = sprites.create(assets.image`treeStump`, SpriteKind.Enemy)
    creatureAddition2.setPosition(153, 85)
}
function getSpriteLocation (sprite: Sprite) {
    return getLocation(sprite.x, sprite.y)
}
function glitchInit () {
    for (let bushSprite of sprites.allOfKind(SpriteKind.Bush)) {
        if (randint(0, 19) == 19) {
            bushSprite.setImage(assets.image`bushGlitch`)
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
    for (let npcInfo of NPC.NPCS) {
        npcInfo.sprite = sprites.create(npcInfo.image, npcInfo.kind)
grid.place(npcInfo.sprite, getLocation(npcInfo.x, npcInfo.y))
    }
    if (isGlitching) {
        glitchInit()
    }
}
// make it return to the map here
function useRun () {
    if (randint(0, 100) < 5) {
        story.printCharacterText("You couldn't get away!")
        enemyTurn()
    } else {
        story.printCharacterText("You got away savely.")
        returnToMap()
    }
}
function generateCow () {
    creature = sprites.create(assets.image`cow`, SpriteKind.Enemy)
    creature.setPosition(134, 64)
    animation.runImageAnimation(
    creature,
    assets.animation`cowAnim`,
    500,
    true
    )
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
info.onCountdownEnd(function () {
    if (info.score() >= 100) {
        game.over(true)
    } else {
        game.over(false)
    }
})
// throw a rock to deal damage, making it harder to catch, but less likely to run
function useRock () {
    story.printCharacterText("You used a rock.")
    throwable = sprites.create(assets.image`rock`, SpriteKind.Projectile)
    throwable.setPosition(25, 70)
    if (randint(0, 100) < 15) {
        throwable.setVelocity(400, 100)
        timer.after(300, function () {
            throwable.destroy()
            story.printCharacterText("The Rock missed.")
            enemyTurn()
        })
    } else {
        aggravation += 1
        throwable.setVelocity(300, 23)
        timer.after(300, function () {
            throwable.destroy()
            hp.value = hp.value - randint(10, 20)
            if (hp.value == 0) {
                creature.vy += 100
                timer.after(100, function () {
                    creature.destroy()
                })
                story.printCharacterText("The opposing " + creatureName + " fainted.")
                timer.after(1000, function () {
                    returnToMap()
                })
            } else {
                enemyTurn()
            }
        })
    }
}
function scoreForEncounter (name: string) {
    if (name == "Beaver") {
        return 30
    } else if (name == "Cow") {
        return 50
    } else if (name == "Goat") {
        return 20
    } else if (name == "Elephant") {
        return 50
    } else {
        return 123
    }
}
function generateGoat () {
    creature = sprites.create(assets.image`goat`, SpriteKind.Enemy)
    creature.setPosition(138, 72)
    animation.runImageAnimation(
    creature,
    assets.animation`goatAnim`,
    500,
    true
    )
}
function turnStart () {
    story.showPlayerChoices("Catch", "Treat", "Rock", "Run")
    if (story.checkLastAnswer("Catch")) {
        useBall()
    } else if (story.checkLastAnswer("Treat")) {
        useTreat()
    } else if (story.checkLastAnswer("Rock")) {
        useRock()
    } else if (story.checkLastAnswer("Run")) {
        useRun()
    }
}
function getSpecificCreature (name: string) {
    if (name == "Beaver") {
        generateBeaver()
    } else if (name == "Cow") {
        generateCow()
    } else if (name == "Goat") {
        generateGoat()
    } else if (name == "Elephant") {
        generateElephant()
    } else {
        creature = sprites.create(assets.image`missingno`, SpriteKind.Enemy)
        creature.setPosition(138, 72)
        effects.blizzard.startScreenEffect()
        effects.starField.startScreenEffect()
    }
}
function startEncounter () {
    controller.moveSprite(playerSprite, 0, 0)
    info.stopCountdown()
    info.showScore(false)
countdownLeft += 0 - Math.round((game.runtime() - countdownLastStart) / 1000)
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
    scene.centerCameraAt(0, 0)
    timer.after(400 * 3.5, function () {
        scene.setBackgroundImage(assets.image`sky`)
        grassSprite = sprites.create(assets.image`grass`, SpriteKind.Background)
        grassSprite.setPosition(80, 60)
        platformSprite = sprites.create(assets.image`battlePlatforms`, SpriteKind.Background)
        platformSprite.setPosition(80, 60)
        character = sprites.create(assets.image`default`, SpriteKind.Player)
        character.setPosition(25, 69)
        story.printCharacterText("You encountered a wild " + getCreature(isGlitchEncounter) + "!")
        aggravation = 5
        hp = statusbars.create(50, 4, StatusBarKind.EnemyHealth)
        hp.max = 143
        hp.value = 143
        hp.setPosition(130, 15)
        padding = ""
        for (let index = 0; index < 8 - creatureName.length; index++) {
            padding = "" + padding + " "
        }
        creatureNameSprite = textsprite.create("" + creatureName + padding, 0, 15)
        creatureNameSprite.setPosition(130, 6)
        turnStart()
    })
}
function isDirectionPressed () {
    return controller.up.isPressed() || (controller.down.isPressed() || (controller.left.isPressed() || controller.right.isPressed()))
}
function getLocation (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(x / 16), Math.floor(y / 16))
}
// make the enemy make its move
function enemyTurn () {
    timer.after(1000, function () {
        if (aggravation * 10 + randint(0, 100) < 95) {
            creature.vx += 100
            timer.after(100, function () {
                creature.destroy()
            })
            story.printCharacterText("The opposing " + creatureName + " fled.")
            returnToMap()
        } else {
            story.printCharacterText("The opposing " + creatureName + " is watching carefully.")
            turnStart()
        }
    })
}
scene.onOverlapTile(SpriteKind.Player, sprites.castle.tileGrass2, function (sprite, location) {
    newGrassLoc = getSpriteLocation(playerSprite)
    // Checking if the tile is flowers because this event is hyper sensitive
    if (tiles.tileAtLocationEquals(newGrassLoc, sprites.castle.tileGrass2)) {
        if (!(lastGrassLoc) || lastGrassLoc.col != newGrassLoc.col || lastGrassLoc.row != newGrassLoc.row) {
            lastGrassLoc = newGrassLoc
            if (randint(0, 9) == 9) {
                startEncounter()
            } else {
                isGrassHit = true
            }
        }
    } else {
        lastGrassLoc = tiles.getTileLocation(0, 0)
    }
})
function returnToMap () {
    if (creature) {
        creature.destroy()
    }
    character.destroy()
    hp.destroy()
    creatureNameSprite.destroy()
    if (isGlitchEncounter) {
        effects.blizzard.endScreenEffect()
        effects.starField.endScreenEffect()
    }
    scene.setBackgroundImage(img`
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        `)
    for (let projectileSprite of sprites.allOfKind(SpriteKind.Projectile)) {
        projectileSprite.destroy()
    }
    for (let enemySprite of sprites.allOfKind(SpriteKind.Enemy)) {
        enemySprite.destroy()
    }
    for (let backgroundSprite of sprites.allOfKind(SpriteKind.Background)) {
        backgroundSprite.destroy()
    }
    initMapScene(playerSprite.x, playerSprite.y)
}
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
    if (countdownLastStart) {
        info.showScore(true)
countdownLastStart = game.runtime()
        info.startCountdown(countdownLeft)
    }
}
// makes the player throw the ball if selected
function useBall () {
    story.printCharacterText("You used the net stone")
    throwable = sprites.create(assets.image`netStone`, SpriteKind.Projectile)
    throwable.setPosition(25, 70)
    throwable.setVelocity(400, 40)
    timer.after(300, function () {
        throwable.setVelocity(0, 0)
        creature.destroy()
    })
    if (aggravation * 10 + (randint(0, 100) + hp.value) > 200) {
        timer.after(1000, function () {
            throwable.startEffect(effects.starField)
        })
        timer.after(2000, function () {
            effects.clearParticles(throwable)
            x2 = throwable.x
            y2 = throwable.y
            throwable.destroy()
            throwable = sprites.create(assets.image`netStoneCaptured`, SpriteKind.Projectile)
            throwable.setPosition(x2, y2)
            throwable.startEffect(effects.confetti)
            timer.after(1000, function () {
                effects.clearParticles(throwable)
                story.printCharacterText("" + creatureName + " was caught!")
                throwable.destroy()
                info.changeScoreBy(scoreForEncounter(creatureName))
                returnToMap()
            })
        })
    } else {
        timer.after(1000, function () {
            throwable.destroy()
            story.printCharacterText("" + creatureName + " broke free.")
            getSpecificCreature(creatureName)
            enemyTurn()
        })
    }
}
let y2 = 0
let x2 = 0
let creatureNameSprite: TextSprite = null
let padding = ""
let character: Sprite = null
let platformSprite: Sprite = null
let grassSprite: Sprite = null
let hp: StatusBarSprite = null
let creatureAddition2: Sprite = null
let creatureAddition: Sprite = null
let creature: Sprite = null
let creatureName = ""
let throwable: Sprite = null
let aggravation = 0
let isGlitchEncounter = false
let staticKinds: number[] = []
let creatures: string[] = []
let isGrassHit = false
let npcRange = null
let isScene = false
let playerSprite: Sprite = null
let lastGrassLoc: tiles.Location = null
let newGrassLoc: tiles.Location = null
let playerLocation: tiles.Location = null
let npcLocation: tiles.Location = null
let isGlitching = false
let isMap = false
let countdownLastStart = 0
let countdownLeft = 0
let rotation = ""
namespace NPC {
    export interface NPCInfo {
        name: string,
        callOut: string,
        sprite?: Sprite,
        kind: number,
        image: Image,
        goToAnimation: Image[],
        goBackAnimation: Image[],
        afterDialogCallback?: () => void
        x: number,
        y: number,
        dialogs: {
            name?: string,
            text: string
        }[],
        range: number,
        interacted: boolean
    }
    export const NPCS: NPCInfo[] = [
        {
            name: "Park Guard",
            callOut: "Stop!",
            sprite: <Sprite | undefined>undefined,
            kind: SpriteKind.NPC_Right,
            x: 112,
            y: 32,
            image: assets.image`npc1`,
            goToAnimation: assets.animation`heroWalkRight`,
            goBackAnimation: assets.animation`heroWalkLeft`,
            afterDialogCallback: () => {
                info.setScore(0)
                timer.after(countdownLeft * 1000 - 5000, function () {
                    isGlitching = true
                    if (isMap) {
                        glitchInit()
                    }
                })
            },
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
        }
    ]
    export function interaction(npc: NPC.NPCInfo, x: number, y: number) {
        if (countdownLastStart) {
            info.showScore(false)
            info.stopCountdown()
            countdownLeft -= Math.round((game.runtime() - countdownLastStart) / 1000)
        }
        let originalCords = [npc.sprite.x, npc.sprite.y]
        let originalLoc = getLocation(originalCords[0], originalCords[1]);
        let originalImage = npc.sprite.image
        switch (npc.kind) {
            case SpriteKind.NPC_Left:
                rotation = "Right"
                break;
            case SpriteKind.NPC_Right:
                rotation = "Left"
                break
            case SpriteKind.NPC_Up:
                rotation = "Down"
                break;
            case SpriteKind.NPC_Down:
                rotation = "Up"
                break;
        }
        story.startCutscene(function () {
            isScene = true
            controller.moveSprite(playerSprite, 0, 0)
            playerHasStopped()
            story.spriteSayText(npc.sprite, npc.callOut, 15, 1, story.TextSpeed.VeryFast)
            animation.runImageAnimation(npc.sprite, npc.goToAnimation, 200, true)
            story.spriteMoveToLocation(npc.sprite, x, y, 70)
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, npc.sprite)
            npc.sprite.setImage(originalImage)
            for (let dialog of npc.dialogs) {
                story.printCharacterText(dialog.text, dialog.name || npc.name)
            }
            animation.runImageAnimation(npc.sprite, npc.goBackAnimation, 200, true)
            tiles.setWallAt(tiles.getTileLocation(originalLoc.col, originalLoc.row), false)
            story.spriteMoveToLocation(npc.sprite, originalCords[0], originalCords[1], 70)
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, npc.sprite)
            npc.sprite.setImage(originalImage)
            tiles.setWallAt(tiles.getTileLocation(originalLoc.col, originalLoc.row), true)
            if (npc.afterDialogCallback) {
                npc.afterDialogCallback()
            }
            isScene = false
            npc.interacted = true
            controller.moveSprite(playerSprite, 70, 70)
            countdownLastStart = game.runtime()
            info.showScore(true)
            info.startCountdown(countdownLeft)
        })
    }
}
rotation = "Down"
isGrassHit = false
isGlitching = false
creatures = [
"Beaver",
"Goat",
"Cow",
"Elephant",
"$^*$-44e3${$#}@"
]
staticKinds = [
SpriteKind.Static,
SpriteKind.NPC_Left,
SpriteKind.NPC_Right,
SpriteKind.NPC_Up,
SpriteKind.NPC_Down,
SpriteKind.Bush
]
countdownLeft = 300
isGlitchEncounter = false
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
        for (let npc of NPC.NPCS) {
            // If the sprite isn't a static NPC
            if (npc.sprite.kind() != SpriteKind.NPC && !(npc.interacted)) {
                npcLocation = getSpriteLocation(npc.sprite)
                if (npc.kind == SpriteKind.NPC_Left) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), -1 * npc.range, 0)
                    if (npcRange.col <= playerLocation.col && npcLocation.col >= playerLocation.col && npcLocation.row == playerLocation.row) {
                        NPC.interaction(npc, playerSprite.x + 16, npc.sprite.y)
                    }
                } else if (npc.kind == SpriteKind.NPC_Right) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), npc.range, 0)
                    if (npcRange.col >= playerLocation.col && npcLocation.col <= playerLocation.col && npcLocation.row == playerLocation.row) {
                        NPC.interaction(npc, playerSprite.x - 16, npc.sprite.y)
                    }
                } else if (npc.kind == SpriteKind.NPC_Up) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, -1 * npc.range)
                    if (npcRange.row <= playerLocation.row && npcLocation.row >= playerLocation.row && npcLocation.col == playerLocation.col) {
                        NPC.interaction(npc, npc.sprite.x, playerSprite.y - 16)
                    }
                } else if (npc.kind == SpriteKind.NPC_Down) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, npc.range)
                    if (npcRange.row >= playerLocation.row && npcLocation.row <= playerLocation.row && npcLocation.col == playerLocation.col) {
                        NPC.interaction(npc, npc.sprite.x, playerSprite.y + 16)
                    }
                }
            }
        }
    }
})
