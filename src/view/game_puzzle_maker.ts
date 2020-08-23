import Puzzle from "../contracts/puzzle";
import Config from "../config";

export default class GamePuzzleMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory, newTweensManager: Phaser.Tweens.TweenManager) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
    }

    public constructGamePuzzle(puzzle: Puzzle): void {
        const puzzlePosition = { x: Math.random() * Config.CanvasWidth, y: Math.random() * Config.CanvasHeight };

        const puzzleSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, puzzle.ViewTextureName)
            .setOrigin(0.5, 0.5)
            .setPosition(puzzlePosition.x, puzzlePosition.y);

        const rectangleShape = new Phaser.Geom.Rectangle(
            Config.BorderSize,
            Config.BorderSize,
            Config.InnerQuadSize,
            Config.InnerQuadSize);

        puzzleSprite.setInteractive(rectangleShape, Phaser.Geom.Rectangle.Contains);

        puzzleSprite.on('pointerover', () => this.onPointerEnter(puzzleSprite, this._tweensManager));

        puzzleSprite.on('pointerout', () => this.onPointerExit(puzzleSprite, this._tweensManager));
    }

    private onPointerEnter(sprite: Phaser.GameObjects.Image, tweensManager: Phaser.Tweens.TweenManager): void {
        tweensManager.add({
            targets: sprite,
            scale: { from: 1.0, to: Config.PuzzleScaleOnOver },
            ease: Config.PuzzleScalingOutAnimzationEase,
            duration: Config.PuzzleScalingOutAnimzationDuration
        });
    }

    private onPointerExit(sprite: Phaser.GameObjects.Image, tweensManager: Phaser.Tweens.TweenManager): void {
        tweensManager.killTweensOf(sprite);

        tweensManager.add({
            targets: sprite,
            scale: { from: sprite.scale, to: 1.0 },
            ease: Config.PuzzleScalingInAnimzationEase,
            duration: Config.PuzzleScalingInAnimzationDuration
        });
    }
}