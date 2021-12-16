namespace SpriteKind {
    export const Static = SpriteKind.create()
    export const NPC = SpriteKind.create()
    export const NPC_Left = SpriteKind.create()
    export const NPC_Right = SpriteKind.create()
    export const NPC_Up = SpriteKind.create()
    export const NPC_Down = SpriteKind.create()
    export const Bush = SpriteKind.create()
    export const Background = SpriteKind.create()
    export const Bug_Bush = SpriteKind.create()
}
// makes the player use a treat, wich makes it easier to catch, but more likely to run
function useTreat () {
    moveBattleScene(false)
    story.printCharacterText("You threw a treat.")
    aggravation += -1
    throwable = sprites.create(assets.image`treat`, SpriteKind.Projectile)
    throwable.setPosition(10, 100)
    throwable.setVelocity(400, -100)
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
function moveBattleScene (up: boolean) {
    for (let backgroundSprite of sprites.allOfKind(SpriteKind.Background)) {
        if (up) {
            backgroundSprite.setVelocity(0, -60)
        } else {
            backgroundSprite.setVelocity(0, 60)
        }
        timer.after(500, function () {
            backgroundSprite.setVelocity(0, 0)
        })
    }
    for (let enemySprite of sprites.allOfKind(SpriteKind.Enemy)) {
        if (up) {
            enemySprite.setVelocity(0, -60)
        } else {
            enemySprite.setVelocity(0, 60)
        }
        timer.after(500, function () {
            enemySprite.setVelocity(0, 0)
        })
    }
    if (up) {
        character.setVelocity(0, -100)
    } else {
        character.setVelocity(0, 100)
    }
    timer.after(500, function () {
        character.setVelocity(0, 0)
    })
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
        if (randint(0, 9) == 9) {
            flower2 = getLocation(bushSprite.x, bushSprite.y)
            bushSprite.destroy()
            tiles.placeOnTile(sprites.create(assets.image`bushGlitch`, SpriteKind.Bug_Bush), flower2)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isScene) {
        story.clearAllText()
    }
})
function initMap () {
    if (glitchEncountered) {
        scene.setBackgroundColor(15)
    } else {
        scene.setBackgroundColor(7)
    }
    tiles.setTilemap(tilemap`map`)
    for (let flower of tiles.getTilesByType(sprites.castle.tileGrass2)) {
        tiles.placeOnTile(sprites.create(assets.image`bush`, SpriteKind.Bush), flower)
    }
    for (let npcInfo of NPC.NPCS) {
        npcLocation = getLocation(npcInfo.x, npcInfo.y)
        npcInfo.sprite = sprites.create(npcInfo.image, npcInfo.kind)
grid.place(npcInfo.sprite, npcLocation)
        tiles.setWallAt(npcLocation, true)
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
    if (info.score() >= 200) {
        game.over(true)
    } else {
        game.over(false)
    }
})
// throw a rock to deal damage, making it harder to catch, but less likely to run
function useRock () {
    moveBattleScene(false)
    story.printCharacterText("You used a rock.")
    throwable = sprites.create(assets.image`rock`, SpriteKind.Projectile)
    throwable.setPosition(10, 100)
    if (randint(0, 100) < 15) {
        throwable.setVelocity(400, 0)
        timer.after(300, function () {
            throwable.destroy()
            story.printCharacterText("The Rock missed.")
            enemyTurn()
        })
    } else {
        aggravation += 1
        throwable.setVelocity(400, -100)
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
    } else if (name == "Mega Cow") {
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
    } else if (name == "Mega Cow") {
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
        hp.startEffect(effects.ashes)
        creature.startEffect(effects.ashes)
        for (let backgroundSprite2 of sprites.allOfKind(SpriteKind.Background)) {
            backgroundSprite2.startEffect(effects.ashes)
            backgroundSprite2.startEffect(effects.trail)
            backgroundSprite2.startEffect(effects.blizzard)
        }
    }
}
function startEncounter () {
    controller.moveSprite(playerSprite, 0, 0)
    info.stopCountdown()
    info.showScore(false)
countdownLeft += 0 - Math.round((game.runtime() - countdownLastStart) / 1000)
    isMap = false
    music.stopAllSounds()
    for (let x2 = 0; x2 <= grid.numColumns(); x2++) {
        for (let y2 = 0; y2 <= grid.numRows(); y2++) {
            tiles.setTileAt(tiles.getTileLocation(x2, y2), assets.tile`transparency16`)
            tiles.setWallAt(tiles.getTileLocation(x2, y2), false)
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
        platformSprite = sprites.create(assets.image`battlePlatformsNew`, SpriteKind.Background)
        platformSprite.setPosition(80, 70)
        character = sprites.create(assets.image`matthewBattle`, SpriteKind.Player)
        character.setPosition(14, 108)
        aggravation = 5
        hp = statusbars.create(50, 4, StatusBarKind.EnemyHealth)
        hp.max = 143
        hp.value = 143
        hp.setPosition(130, 15)
        padding = ""
        getCreature(isGlitchEncounter)
        for (let index = 0; index < 8 - creatureName.length; index++) {
            padding = "" + padding + " "
        }
        creatureNameSprite = textsprite.create("" + creatureName + padding, 0, 15)
        creatureNameSprite.setPosition(130, 6)
        moveBattleScene(true)
        story.printCharacterText("You encountered a wild " + creatureName + "!")
        turnStart()
    })
}
function isDirectionPressed () {
    return controller.up.isPressed() || (controller.down.isPressed() || (controller.left.isPressed() || controller.right.isPressed()))
}
function getLocation (x: number, y: number) {
    return tiles.getTileLocation(Math.floor(x / 16), Math.floor(y / 16))
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bug_Bush, function (sprite, otherSprite) {
    if (!(glitchEncountered)) {
        isGlitchEncounter = true
        startEncounter()
    }
    glitchEncountered = true
})
// make the enemy make its move
function enemyTurn () {
    timer.after(1000, function () {
        moveBattleScene(true)
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
            }
        }
    } else {
        lastGrassLoc = tiles.getTileLocation(0, 0)
    }
})
function returnToMap () {
    isGlitchEncounter = false
    if (creature) {
        creature.destroy()
    }
    character.destroy()
    hp.destroy()
    creatureNameSprite.destroy()
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
    for (let enemySprite2 of sprites.allOfKind(SpriteKind.Enemy)) {
        enemySprite2.destroy()
    }
    for (let backgroundSprite22 of sprites.allOfKind(SpriteKind.Background)) {
        backgroundSprite22.destroy()
    }
    initMapScene(playerSprite.x, playerSprite.y)
}
function initMapScene (x: number, y: number) {
    initMap()
    isMap = true
    music.stopAllSounds()
    isScene = false
    lastGrassLoc = getLocation(x, y)
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    playerSprite.setPosition(x, y)
    for (let house of tiles.getTilesByType(sprites.builtin.forestTiles10)) {
        tiles.placeOnTile(sprites.create(img`
            ....................e2e22e2e....................
            .................222eee22e2e222.................
            ..............222e22e2e22eee22e222..............
            ...........e22e22eeee2e22e2eeee22e22e...........
            ........eeee22e22e22e2e22e2e22e22e22eeee........
            .....222e22e22eeee22e2e22e2e22eeee22e22e222.....
            ...22eeee22e22e22e22eee22eee22e22e22e22eeee22...
            4cc22e22e22eeee22e22e2e22e2e22e22eeee22e22e22cc4
            6c6eee22e22e22e22e22e2e22e2e22e22e22e22e22eee6c6
            46622e22eeee22e22eeee2e22e2eeee22e22eeee22e22664
            46622e22e22e22eeee22e2e22e2e22eeee22e22e22e22664
            4cc22eeee22e22e22e22eee22eee22e22e22e22eeee22cc4
            6c622e22e22eeee22e22e2e22e2e22e22eeee22e22e226c6
            466eee22e22e22e22e22e2e22e2e22e22e22e22e22eee664
            46622e22eeee22e22e22e2e22e2e22e22e22eeee22e22664
            4cc22e22e22e22e22eeee2e22e2eeee22e22e22e22e22cc4
            6c622eeee22e22eeee22eee22eee22eeee22e22eeee226c6
            46622e22e22eeee22e22e2e22e2e22e22eeee22e22e22664
            466eee22e22e22e22e22e2e22e2e22e22e22e22e22eee664
            4cc22e22eeee22e22e22e2e22e2e22e22e22eeee22e22cc4
            6c622e22e22e22e22e22eee22eee22e22e22e22e22e226c6
            46622eeee22e22e22eeecc6666cceee22e22e22eeee22664
            46622e22e22e22eeecc6666666666cceee22e22e22e22664
            4cceee22e22eeecc66666cccccc66666cceee22e22eeecc4
            6c622e22eeecc66666cc64444446cc66666cceee22e226c6
            46622e22cc66666cc64444444444446cc66666cc22e22664
            46622cc6666ccc64444444444444444446ccc6666cc22664
            4ccc6666ccc6444bcc666666666666ccb4446ccc6666ccc4
            cccccccc6666666cb44444444444444bc6666666cccccccc
            64444444444446c444444444444444444c64444444444446
            66cb444444444cb411111111111111114bc444444444bc66
            666cccccccccccd166666666666666661dccccccccccc666
            6666444444444c116eeeeeeeeeeeeee611c4444444446666
            666e2222222e4c16e4e44e44e44e44ee61c4e2222222e666
            666eeeeeeeee4c16e4e44e44e44e44ee61c4eeeeeeeee666
            666eddddddde4c66f4e4effffffe44ee66c4eddddddde666
            666edffdffde4c66f4effffffffff4ee66c4edffdffde666
            666edccdccde4c66f4effffffffffeee66c4edccdccde666
            666eddddddde4c66f4eeeeeeeeeeeeee66c4eddddddde666
            c66edffdffde4c66e4e44e44e44e44ee66c4edffdffde66c
            c66edccdccde4c66e4e44e44e44e44ee66c4edccdccde66c
            cc66666666664c66e4e44e44e44feeee66c46666666666cc
            .c66444444444c66e4e44e44e44ffffe66c44444444466c.
            ..c64eee4eee4c66f4e44e44e44f44fe66c4eee4eee46c..
            ...c4eee4eee4c66f4e44e44e44effee66c4eee4eee4c...
            ....644444444c66f4e44e44e44e44ee66c444444446....
            .....64eee444c66f4e44e44e44e44ee66c444eee46.....
            ......6ccc666c66e4e44e44e44e44ee66c666ccc6......
            `, SpriteKind.Static), house)
        for (let y = 0; y <= 1; y++) {
            for (let x = 0; x <= 2; x++) {
                tiles.setWallAt(grid.add(house, x - 1, y), true)
            }
        }
    }
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
    moveBattleScene(false)
    story.printCharacterText("You used the net stone")
    throwable = sprites.create(assets.image`netStone`, SpriteKind.Projectile)
    throwable.setPosition(10, 100)
    throwable.setVelocity(440, -80)
    timer.after(300, function () {
        throwable.setVelocity(0, 0)
        creature.destroy()
    })
    if (aggravation * 10 + (randint(0, 100) + hp.value) < 200) {
        timer.after(1000, function () {
            throwable.startEffect(effects.starField)
        })
        timer.after(2000, function () {
            effects.clearParticles(throwable)
            x22 = throwable.x
            y22 = throwable.y
            throwable.destroy()
            throwable = sprites.create(assets.image`netStoneCaptured`, SpriteKind.Projectile)
            throwable.setPosition(x22, y22)
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
let y22 = 0
let x22 = 0
let creatureNameSprite: TextSprite = null
let padding = ""
let platformSprite: Sprite = null
let grassSprite: Sprite = null
let hp: StatusBarSprite = null
let npcLocation: tiles.Location = null
let glitchEncountered = false
let flower2: tiles.Location = null
let creatureAddition2: Sprite = null
let creatureAddition: Sprite = null
let creature: Sprite = null
let character: Sprite = null
let creatureName = ""
let throwable: Sprite = null
let aggravation = 0
let isGlitchEncounter = false
let staticKinds: number[] = []
let creatures: string[] = []
let rotation = ""
let countdownLeft = 0
let countdownLastStart = 0
let isMap = false
let isGlitching = false
let npcLocation2: tiles.Location = null
let playerLocation: tiles.Location = null
let newGrassLoc: tiles.Location = null
let lastGrassLoc: tiles.Location = null
let playerSprite: Sprite = null
let isScene = false
let npcRange = null
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
            sprite: undefined,
            kind: SpriteKind.NPC_Right,
            x: 112,
            y: 32,
            image: assets.image`npc1`,
            goToAnimation: assets.animation`heroWalkRight`,
            goBackAnimation: assets.animation`heroWalkLeft`,
            afterDialogCallback: () => {
                info.setScore(0)
                timer.after(countdownLeft * 2000, function () {
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
                    text: "Are you here to help with catching the animals?"
                },
                {
                    name: "Matthew",
                    text: "Yes, I am."
                },
                {
                    text: "Ok, then good luck out there.\nYou need a total of 200 catch points."
                }
                ,
                {
                    text: "Hurry though, before it's too late!"
                }
            ],
            range: 5,
            interacted: false
        },
        {
            name: "Joe",
            callOut: "Matthew!",
            sprite: undefined,
            kind: SpriteKind.NPC_Right,
            x: 80,
            y: 80,
            image: assets.image`villager3WalkRight3`,
            goToAnimation: assets.animation`villager3WalkRight`,
            goBackAnimation: assets.animation`villager3WalkLeft`,
            dialogs: [
                {
                    text: "Hey Matthew, are you here to catch the animals?"
                },
                {
                    text: "Do you even know what started this all?"
                },
                {
                    name: "Matthew",
                    text: "No sir, I actually don't."
                },
                {
                    text: "I actually feel obliged to tell you,\nsince you're helping to catch these animals."
                },
                {
                    text: "Once upon a time, the people of our town were very poor."
                },
                {
                    text: "They only had farmland to produce crops,\nbut one day a farmer showed up."
                },
                {
                    text: "The farmer told us all about mass production."
                },
                {
                    text: "To do this he used animals."
                },
                {
                    text: "The cows grew in size,\nand the goats grew in numbers for the meat production."
                },
                {
                    text: "The beavers and elephants were trained to cut down trees."
                },
                {
                    text: "We thought that it went well,\na little bit too well."
                },
                {
                    text: "By the time everyone caught up on the news,\nit was far too late."
                }
            ],
            range: 5,
            interacted: false
        },
        {
            name: "Bystander",
            callOut: "Hey!",
            sprite: undefined,
            kind: SpriteKind.NPC_Down,
            x: 192,
            y: 112,
            image: assets.image`villager2WalkFront1`,
            goToAnimation: assets.animation`villager2WalkFront`,
            goBackAnimation: assets.animation`villager2WalkBack`,
            dialogs: [
                {
                    text: "Hi there stranger! Do you want to know a fun fact?"
                },
                {
                    name: "Matthew",
                    text: "Sure!"
                },
                {
                    text: "If you somehow extend our time something really weird will happen!"
                }
            ],
            range: 4,
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
            tiles.setWallAt(tiles.getTileLocation(originalLoc.col, originalLoc.row), false)
            animation.runImageAnimation(npc.sprite, npc.goToAnimation, 200, true)
            story.spriteMoveToLocation(npc.sprite, x, y, 70)
            animation.stopAnimation(animation.AnimationTypes.ImageAnimation, npc.sprite)
            npc.sprite.setImage(originalImage)
            for (let dialog of npc.dialogs) {
                story.printCharacterText(dialog.text, dialog.name || npc.name)
            }
            animation.runImageAnimation(npc.sprite, npc.goBackAnimation, 200, true)
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
isGlitching = false
creatures = [
"Beaver",
"Goat",
"Mega Cow",
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
let logo = sprites.create(img`
    ..........................................................................................................................................
    ..........................................................................................................................................
    ..........................................................................................................................................
    ...dbbdddddd...dddddd......ddd...ddd.........ddd...ddd...dddddd.........dddddd......dddddb.........ddd......bbdddd......ddd...ddddddddd...
    ...bbbbdddbd...dbdddd......dbd...dbb.........ddd...ddb...dddddd.........dbbddd......ddddbb.........ddd......bbbddd......ddd...ddddddddd...
    ...ddddddbbb...bbbddd......bbb...bbb.........ddd...dbb...bddddd.........dddddd......dddddd.........ddd......dddddd......ddd...ddbbddddb...
    ...ddd.........dddddd......ddd...ddd.........bbd.........ddd...ddb...ddd......ddd...ddb...ddd...ddd...ddd...ddddbb......ddd......bbd......
    ...ddd.........dddddd......ddd...ddd.........bbb.........ddd...dbb...ddb......ddb...dbb...ddd...ddd...ddd...dddbbb......bdd......ddd......
    ...ddd.........dddddd......ddd...ddd.........ddd.........ddb...ddd...dbb......ddd...ddd...ddd...ddb...ddd...dddddd......bbd......ddd......
    ...ddddddddd...ddd...ddd...ddd......ddd...ddd......ddd...dddddd......ddd......ddd...ddd...ddd...dbbbbdddd...ddd...ddd...ddd......ddd......
    ...ddddddddd...ddd...ddd...ddd......ddd...ddd......ddd...dddddd......ddd......ddd...ddd...ddd...ddddddddd...ddd...ddd...ddd......ddd......
    ...777777777...777...777...777......777...777......777...777777......777......777...777...777...7777e7777...777...e77...777......777......
    ...e77.........777......777777......777...777......777...777...777...e77......777...777...777...777...777...e77......777777......777......
    ...777.........7e7......777777......7e7...e77......777...7e7...777...777......777...777...777...77e...777...777......777777......777......
    ...777.........777......7e7777......777...77e......777...7e7...777...777......777...777...777...777...777...77e......7777e7......7e7......
    ...777777777...e77......e777e7.........77e.........7e7...7e7...777......7777e7......777e77......777...777...777......777e77......7e7......
    ...e777e7777...777......777777.........777.........ee7...777...77e......777e77......77e777......777...777...777......7e7777......777......
    ...777e777e7...e77......777777.........777.........777...777...777......777777......777777......777...7e7...777......777777......e77......
    ..........................................................................................................................................
    ..........................................................................................................................................
    ..........................................................................................................................................
    `, SpriteKind.Static)
logo.startEffect(effects.starField)
timer.after(2800, function () {
    effects.clearParticles(logo)
    logo.destroy(effects.halo, 1000)
})
timer.after(4000, function () {
    initMapScene(160, 5)
})
// Music1
forever(function () {
    if (isMap || isGlitchEncounter) {
        for (let index = 0; index < 2; index++) {
            music.playMelody("- - - - - - - - ", 120)
            pause(10)
            music.playMelody("- - - - - - - - ", 120)
        }
        while (isMap || isGlitchEncounter) {
            music.playMelody("G A F D G E C F ", 120)
            pause(10)
            music.playMelody("E D F E - D C D ", 120)
        }
    }
})
forever(function () {
    if (!(isMap)) {
        music.playMelody("E F C D D C E C ", 360)
        music.playMelody("C5 B C5 G A F C5 G ", 120)
    }
})
// Music3
forever(function () {
    if (isMap || isGlitchEncounter) {
        while (isMap || isGlitchEncounter) {
            music.playMelody("D C D E D C E D ", 120)
            pause(10)
            music.playMelody("C D E C5 B D C E ", 120)
        }
    }
})
// Music2
forever(function () {
    if (isMap || isGlitchEncounter) {
        while (isMap || isGlitchEncounter) {
            music.playMelody("C5 B C5 B G G A B ", 120)
            pause(10)
            music.playMelody("D A B G C5 C D F ", 120)
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
                npcLocation2 = getSpriteLocation(npc.sprite)
                if (npc.kind == SpriteKind.NPC_Left) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), -1 * npc.range, 0)
                    if (npcRange.col <= playerLocation.col && npcLocation2.col >= playerLocation.col && npcLocation2.row == playerLocation.row) {
                        NPC.interaction(npc, playerSprite.x + 16, npc.sprite.y)
                    }
                } else if (npc.kind == SpriteKind.NPC_Right) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), npc.range, 0)
                    if (npcRange.col >= playerLocation.col && npcLocation2.col <= playerLocation.col && npcLocation2.row == playerLocation.row) {
                        NPC.interaction(npc, playerSprite.x - 16, npc.sprite.y)
                    }
                } else if (npc.kind == SpriteKind.NPC_Up) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, -1 * npc.range)
                    if (npcRange.row <= playerLocation.row && npcLocation2.row >= playerLocation.row && npcLocation2.col == playerLocation.col) {
                        NPC.interaction(npc, npc.sprite.x, playerSprite.y + 16)
                    }
                } else if (npc.kind == SpriteKind.NPC_Down) {
                    npcRange = grid.add(getSpriteLocation(npc.sprite), 0, npc.range)
                    if (npcRange.row >= playerLocation.row && npcLocation2.row <= playerLocation.row && npcLocation2.col == playerLocation.col) {
                        NPC.interaction(npc, npc.sprite.x, playerSprite.y - 16)
                    }
                }
            }
        }
    }
})
