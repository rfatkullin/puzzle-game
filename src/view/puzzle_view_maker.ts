import Config from "../config";
import PuzzleView from "../contracts/puzzle_view";

import { IEvent, EventDispatcher } from "strongly-typed-events";

import Point = Phaser.Geom.Point;
import PuzzleDragDetails from "../contracts/events/puzzle_drag_details";

export default class PuzzleViewMaker {
    private readonly _gameObjectFactory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;
    private readonly _inputManager: Phaser.Input.InputPlugin

    private readonly _puzzleViewByName: Map<string, PuzzleView> = new Map<string, PuzzleView>();

    private _dragEvent = new EventDispatcher<PuzzleView, PuzzleDragDetails>();

    public get DragEvent(): IEvent<PuzzleView, PuzzleDragDetails> {
        return this._dragEvent.asEvent();
    }

    constructor(newGameObjectFactory: Phaser.GameObjects.GameObjectFactory,
        newTweensManager: Phaser.Tweens.TweenManager,
        newInputManager: Phaser.Input.InputPlugin) {
        this._gameObjectFactory = newGameObjectFactory;
        this._tweensManager = newTweensManager;
        this._inputManager = newInputManager;

        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        this._inputManager.on('dragstart', this.onDragStart);
        this._inputManager.on('drag', this.onDrag);
        this._inputManager.on('dragend', this.onDragEnd);
    }

    public constructPiecesView(id: number, targetPosition: Point, texture: string, setRandomPositions: boolean = false): PuzzleView {
        let position: Point = targetPosition;

        if (setRandomPositions) {
            position = new Point(
                Math.random() * Config.CanvasWidth,
                Math.random() * Config.CanvasHeight);
        }

        const puzzleShadowSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, texture)
            .setOrigin(0.5, 0.5)
            .setAlpha(Config.PuzzleShadowAlpha)
            .setTint(0);

        const puzzleSprite: Phaser.GameObjects.Image = this._gameObjectFactory.image(0, 0, texture)
            .setOrigin(0.5, 0.5)
            .setName(id.toString());

        const inputSettings = {
            pixelPerfect: true,
            alphaTolerance: 0
        }
        puzzleSprite.setInteractive(inputSettings);
        this._inputManager.setDraggable(puzzleSprite);

        const puzzleView: PuzzleView = new PuzzleView(id, texture, targetPosition, puzzleSprite, puzzleShadowSprite, this._tweensManager);
        puzzleView.setPosition(position);

        this._puzzleViewByName[puzzleSprite.name] = puzzleView;

        return puzzleView;
    }

    private onDragStart(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        const puzzleId: string = gameObject.name;
        if (!puzzleId) {
            return;
        }

        const puzzleView: PuzzleView = this._puzzleViewByName[puzzleId];
        
        puzzleView.onDragStart();
        
        var newPosition = new Point(pointer.x, pointer.y);
        this._dragEvent.dispatch(puzzleView, new PuzzleDragDetails('start', newPosition));
    }

    private onDragEnd(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        const puzzleId: string = gameObject.name;
        if (!puzzleId) {
            return;
        }

        const puzzleView: PuzzleView = this._puzzleViewByName[puzzleId];
        puzzleView.onDragEnd();

        var newPosition = new Point(pointer.x, pointer.y);
        this._dragEvent.dispatch(puzzleView, new PuzzleDragDetails('end', newPosition));
    }

    private onDrag(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {
        if (gameObject == null || !gameObject.name) {
            return;
        }

        const puzzleId: string = gameObject.name;
        const puzzleView: PuzzleView = this._puzzleViewByName[puzzleId];
        if (!puzzleView) {
            return;
        }

        this.setViewPosition(puzzleView, pointer);
        
        var newPosition = new Point(pointer.x, pointer.y);
        this._dragEvent.dispatch(puzzleView, new PuzzleDragDetails('drag', newPosition));
    }

    private setViewPosition(puzzleView: PuzzleView, pointer: Phaser.Input.Pointer): void {
        const delta: Point = new Point(
            pointer.position.x - pointer.prevPosition.x,
            pointer.position.y - pointer.prevPosition.y);

        const oldPosition: Point = puzzleView.getPosition();
        const newPostion: Point = new Point(
            oldPosition.x + delta.x,
            oldPosition.y + delta.y);

        puzzleView.setPosition(newPostion);
    }
}