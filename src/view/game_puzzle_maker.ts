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

        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this._inputManager.on('dragstart', this.onDragStart);
        this._inputManager.on('drag', this.onDrag);
        this._inputManager.on('dragend', this.onDragEnd);

        this._debugGraphics = this._gameObjectFactory.graphics(Config.DebugDrawingConfigs);
        this._debugGraphics.setDepth(10000);

        this._movedCallback = movedCallback;
    }

    public constructGamePuzzle(id: number, targetPosition: Point, texture: string, setRandomPositions: boolean = false): PuzzleView {
        let x: number = targetPosition.x;
        let y: number = targetPosition.y;

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

        const puzzleView: PuzzleView = new PuzzleView(texture, targetPosition, puzzleSprite, puzzleShadowSprite);
        puzzleView.setPosition({ x: x, y: y });

        this._puzzleViewByName[puzzleSprite.name] = puzzleView;

        return puzzleView;
    }

    private onDragStart(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        const puzzleId: string = gameObject.name;
        if (!puzzleId) {
            return;
        }

        this._puzzleViewByName[puzzleId].startZoomInAnimation(this._tweensManager);
    }

    private onDragEnd(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        this._debugGraphics.clear();

        const puzzleId: string = gameObject.name;
        if (!puzzleId) {
            return;
        }

        this._puzzleViewByName[puzzleId].startZoomOutAnimation(this._tweensManager)
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