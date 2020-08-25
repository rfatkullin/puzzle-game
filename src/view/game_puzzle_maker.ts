import Puzzle from "../contracts/puzzle";
import Config from "../config";
import Point from "../contracts/point";

export default class GamePuzzleMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;
    private readonly _inputManager: Phaser.Input.InputPlugin

    private readonly _puzzleSpriteToShadowSprite: Map<string, Phaser.GameObjects.Image>;

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
        newTweensManager: Phaser.Tweens.TweenManager,
        newInputManager: Phaser.Input.InputPlugin) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
        this._inputManager = newInputManager;

        this.onDrag = this.onDrag.bind(this);
        this._inputManager.on('drag', this.onDrag);

        this._puzzleSpriteToShadowSprite = new Map<string, Phaser.GameObjects.Image>();
    }

    public constructGamePuzzle(puzzle: Puzzle, setRandomPositions: boolean = false): void {
        let x: number = puzzle.OnTargetPosition.x;
        let y: number = puzzle.OnTargetPosition.y;

        if (setRandomPositions) {
            x = Math.random() * Config.CanvasWidth;
            y = Math.random() * Config.CanvasHeight;
        }

        const puzzleShadowSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, puzzle.ViewTextureName)
            .setOrigin(0.5, 0.5)
            .setAlpha(Config.PuzzleShadowAlpha)
            .setTint(0);

        const puzzleSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, puzzle.ViewTextureName)
            .setOrigin(0.5, 0.5)
            .setPosition(x, y)
            .setName(puzzle.Id.toString());

        const rectangleShape = new Phaser.Geom.Rectangle(
            Config.BorderSize,
            Config.BorderSize,
            Config.InnerQuadSize,
            Config.InnerQuadSize);

        const puzzleShadowSpritePosition = this.getSpriteShadowPosition(puzzleSprite);
        puzzleShadowSprite.setPosition(puzzleShadowSpritePosition.x, puzzleShadowSpritePosition.y);

        puzzleSprite.setInteractive(rectangleShape, Phaser.Geom.Rectangle.Contains);

        // TODO: check and fix performance issues.
        puzzleSprite.on('pointerover', () => this.onPointerEnter([puzzleSprite, puzzleShadowSprite], this._tweensManager));
        puzzleSprite.on('pointerout', () => this.onPointerExit([puzzleSprite, puzzleShadowSprite], this._tweensManager));

        this._inputManager.setDraggable(puzzleSprite);

        this._puzzleSpriteToShadowSprite[puzzleSprite.name] = puzzleShadowSprite;
    }

    private onPointerEnter(sprites: Phaser.GameObjects.Image[], tweensManager: Phaser.Tweens.TweenManager): void {
        for (let sprite of sprites) {
            tweensManager.add({
                targets: sprite,
                scale: { from: 1.0, to: Config.PuzzleScaleOnOver },
                ease: Config.PuzzleScalingOutAnimzationEase,
                duration: Config.PuzzleScalingOutAnimzationDuration
            });
        }
    }

    private onPointerExit(sprites: Phaser.GameObjects.Image[], tweensManager: Phaser.Tweens.TweenManager): void {
        for (let sprite of sprites) {
            tweensManager.killTweensOf(sprite);

            tweensManager.add({
                targets: sprite,
                scale: { from: sprite.scale, to: 1.0 },
                ease: Config.PuzzleScalingInAnimzationEase,
                duration: Config.PuzzleScalingInAnimzationDuration
            });
        }
    }

    private getSpriteShadowPosition(spritePosition: Point): Point {
        return {
            x: spritePosition.x + Config.PuzzleShadowOffset,
            y: spritePosition.y + Config.PuzzleShadowOffset
        };
    }

    private onDrag(pointer: any, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) {
        const puzzleSprite: Phaser.GameObjects.Image = gameObject as Phaser.GameObjects.Image;
        if (puzzleSprite == null || !puzzleSprite.name) {
            return;
        }

        puzzleSprite.setPosition(dragX, dragY);

        const shadowSprite: Phaser.GameObjects.Image = this._puzzleSpriteToShadowSprite[puzzleSprite.name];
        const shadowPosition: Point = this.getSpriteShadowPosition(puzzleSprite);
        shadowSprite.setPosition(shadowPosition.x, shadowPosition.y);
    }
}