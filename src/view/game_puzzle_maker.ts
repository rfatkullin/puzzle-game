import Puzzle from "../contracts/puzzle";
import Config from "../config";

export default class GamePuzzleMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory, newTweensManager: Phaser.Tweens.TweenManager) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
    }

    public constructGamePuzzle(puzzle: Puzzle, setRandomPositions: boolean = false): void {
        let x: number = puzzle.OnTargetPosition.x;
        let y: number = puzzle.OnTargetPosition.y;

        if (setRandomPositions) {
            x = Math.random() * Config.CanvasWidth;
            y = Math.random() * Config.CanvasHeight;
        }

        const puzzleGroup: Phaser.GameObjects.Group = this._gameObjectFactory.group();

        const puzzleShadowSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, puzzle.ViewTextureName)
            .setOrigin(0.5, 0.5)
            .setPosition(x + Config.PuzzleShadowOffset, y + Config.PuzzleShadowOffset)
            .setAlpha(0.6)
            .setTint(0);

        const puzzleSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, puzzle.ViewTextureName)
            .setOrigin(0.5, 0.5)
            .setPosition(x, y);

        puzzleGroup.add(puzzleSprite);
        puzzleGroup.add(puzzleShadowSprite);

        const rectangleShape = new Phaser.Geom.Rectangle(
            Config.BorderSize,
            Config.BorderSize,
            Config.InnerQuadSize,
            Config.InnerQuadSize);

        puzzleSprite.setInteractive(rectangleShape, Phaser.Geom.Rectangle.Contains);

        puzzleSprite.on('pointerover', () => this.onPointerEnter([puzzleSprite, puzzleShadowSprite], this._tweensManager));

        puzzleSprite.on('pointerout', () => this.onPointerExit([puzzleSprite, puzzleShadowSprite], this._tweensManager));
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
}