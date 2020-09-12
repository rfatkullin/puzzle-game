import Config from "../config";
import Point from "../contracts/point";
import PuzzleView from "../contracts/puzzle_view";
import IPuzzleMoved from "./ipuzzle_moved";

export default class GamePuzzleMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;
    private readonly _inputManager: Phaser.Input.InputPlugin

    private readonly _puzzleViewByName: Map<string, PuzzleView> = new Map<string, PuzzleView>();

    private readonly _debugGraphics: Phaser.GameObjects.Graphics;

    private readonly _movedCallback: IPuzzleMoved;

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
        newTweensManager: Phaser.Tweens.TweenManager,
        newInputManager: Phaser.Input.InputPlugin,
        movedCallback: IPuzzleMoved) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
        this._inputManager = newInputManager;

        this.onDrag = this.onDrag.bind(this);
        this.onPointerEnter = this.onPointerEnter.bind(this);
        this.onPointerExit = this.onPointerExit.bind(this);

        this._inputManager.on('drag', this.onDrag);
        this._inputManager.on('pointerover', this.onPointerEnter);
        this._inputManager.on('pointerout', this.onPointerExit);

        this._debugGraphics = this._gameObjectFactory.graphics(Config.DebugDrawingConfigs);
        this._debugGraphics.setDepth(10000);

        this._movedCallback = movedCallback;

        this.onDragEnd = this.onDragEnd.bind(this);
        this._inputManager.on('dragend', this.onDragEnd);
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
            .setName(id.toString());

        const rectangleShape = new Phaser.Geom.Rectangle(
            Config.BorderSize,
            Config.BorderSize,
            Config.InnerQuadSize,
            Config.InnerQuadSize);

        puzzleSprite.setInteractive(rectangleShape, Phaser.Geom.Rectangle.Contains);
        this._inputManager.setDraggable(puzzleSprite);

        const puzzleView: PuzzleView = new PuzzleView(texture, onTargetPosition, puzzleSprite, puzzleShadowSprite);
        puzzleView.setPosition({ x: x, y: y });

        this._puzzleViewByName[puzzleSprite.name] = puzzleView;

        return puzzleView;
    }

    private onPointerEnter(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]): void {
        for (let gameObject of gameObjects) {
            const puzzleId: string = gameObject.name;
            if (!puzzleId) {
                return;
            }

            const puzzleView: PuzzleView = this._puzzleViewByName[puzzleId];
            puzzleView.startZoomInAnimation(this._tweensManager);
        }
    }

    private onPointerExit(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]): void {
        for (let gameObject of gameObjects) {
            const puzzleId: string = gameObject.name;
            if (!puzzleId) {
                return;
            }

            const puzzleView: PuzzleView = this._puzzleViewByName[puzzleId];
            puzzleView.startZoomOutAnimation(this._tweensManager);
        }
    }

    private onDragEnd(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        this._debugGraphics.clear();

        const puzzleId: string = gameObject.name;
        if (!puzzleId) {
            return;
        }

        this._movedCallback(+puzzleId, pointer);
    }

    private onDrag(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {
        if (gameObject == null || !gameObject.name) {
            return;
        }

        const puzzleView: PuzzleView = this._puzzleViewByName[gameObject.name];
        if (!puzzleView) {
            return;
        }

        puzzleView.setPosition(pointer);

        this.drawLineToPositionOnDrag(puzzleView.MainSprite, puzzleView.TargetPosition);
    }

    private drawLineToPositionOnDrag(currentPosition: Point, onTargetPosition: Point) {
        const line: Phaser.Geom.Line = new Phaser.Geom.Line(currentPosition.x, currentPosition.y, onTargetPosition.x, onTargetPosition.y);

        this._debugGraphics.clear();
        this._debugGraphics.strokeLineShape(line);
    }
}