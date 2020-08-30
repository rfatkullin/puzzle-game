import Config from "../config";
import Point from "../contracts/point";
import PuzzleView from "../contracts/puzzle_view";

export default class GamePuzzleMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;
    private readonly _inputManager: Phaser.Input.InputPlugin

    private readonly _puzzleViewByName: Map<string, PuzzleView> = new Map<string, PuzzleView>();

    private readonly _debugGraphics: Phaser.GameObjects.Graphics;

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
        newTweensManager: Phaser.Tweens.TweenManager,
        newInputManager: Phaser.Input.InputPlugin) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
        this._inputManager = newInputManager;

        this.onDrag = this.onDrag.bind(this);
        this._inputManager.on('drag', this.onDrag);

        this._debugGraphics = this._gameObjectFactory.graphics(Config.DebugDrawingConfigs);
        this._debugGraphics.setDepth(10000);
    }

    public constructGamePuzzle(id: number, onTargetPosition: Point, texture: string, setRandomPositions: boolean = false): PuzzleView {
        let x: number = onTargetPosition.x;
        let y: number = onTargetPosition.y;

        if (setRandomPositions) {
            x = Math.random() * Config.CanvasWidth;
            y = Math.random() * Config.CanvasHeight;
        }

        const puzzleShadowSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, texture)
            .setOrigin(0.5, 0.5)
            .setAlpha(Config.PuzzleShadowAlpha)
            .setTint(0);

        const puzzleSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, texture)
            .setOrigin(0.5, 0.5)
            .setPosition(x, y)
            .setName(id.toString());

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
        puzzleSprite.on('dragend', () => this._debugGraphics.clear());

        this._inputManager.setDraggable(puzzleSprite);

        const puzzleView: PuzzleView = {
            MainSprite: puzzleSprite,
            ShadowSprite: puzzleShadowSprite,
            Texture: texture,
            OnTargetPosition: onTargetPosition
        }

        this._puzzleViewByName[puzzleSprite.name] = puzzleView;

        return puzzleView;
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
        if (gameObject == null || !gameObject.name) {
            return;
        }

        const puzzleView: PuzzleView = this._puzzleViewByName[gameObject.name];
        if (!puzzleView) {
            return;
        }

        const shadowPosition: Point = this.getSpriteShadowPosition(puzzleView.MainSprite);

        puzzleView.MainSprite.setPosition(dragX, dragY);
        puzzleView.ShadowSprite.setPosition(shadowPosition.x, shadowPosition.y);

        this.drawLineToPositionOnDrag(puzzleView.MainSprite, puzzleView.OnTargetPosition);
    }

    private drawLineToPositionOnDrag(currentPosition: Point, onTargetPosition: Point) {
        const line: Phaser.Geom.Line = new Phaser.Geom.Line(currentPosition.x, currentPosition.y, onTargetPosition.x, onTargetPosition.y);

        this._debugGraphics.clear();
        this._debugGraphics.strokeLineShape(line);
    }
}