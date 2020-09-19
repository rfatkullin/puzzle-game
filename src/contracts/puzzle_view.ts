import Point from "./point";
import Config from "../config";

import { IEvent, EventDispatcher } from "strongly-typed-events";
import PuzzleDragDetails from "./events/puzzle_drag_details";

export default class PuzzleView {
    private readonly _tweensManager: Phaser.Tweens.TweenManager;

    private _dragEvent = new EventDispatcher<PuzzleView, PuzzleDragDetails>();

    public get onDrag(): IEvent<PuzzleView, PuzzleDragDetails> {
        return this._dragEvent.asEvent();
    }

    public readonly PuzzleId: number;

    public readonly Texture: string;

    public readonly TargetPosition: Point;

    public readonly MainSprite: Phaser.GameObjects.Image;

    public readonly ShadowSprite: Phaser.GameObjects.Image;

    public constructor(id: number,
        texture: string,
        targetPosition: Point,
        mainSprite: Phaser.GameObjects.Image,
        shadowSprite: Phaser.GameObjects.Image,
        tweensManager: Phaser.Tweens.TweenManager) {

        this.PuzzleId = id;
        this.Texture = texture;
        this.TargetPosition = targetPosition;
        this.MainSprite = mainSprite;
        this.ShadowSprite = shadowSprite;

        this._tweensManager = tweensManager;
    }

    public setPosition(newPosition: { x: number, y: number }): void {
        const shadowPosition: Point = PuzzleView.getSpriteShadowPosition(newPosition);

        this.MainSprite.setPosition(newPosition.x, newPosition.y);
        this.ShadowSprite.setPosition(shadowPosition.x, shadowPosition.y);
    }

    public onDragStart(position: Point) {
        this.startZoomInAnimation();
        this._dragEvent.dispatch(this, new PuzzleDragDetails('start', position));
    }

    public onDragEnd(position: Point) {
        this.startZoomOutAnimation();
        this._dragEvent.dispatch(this, new PuzzleDragDetails('end', position));
    }

    private startZoomInAnimation(): void {
        PuzzleView.startScaleOutTween(this.MainSprite, this._tweensManager);
        PuzzleView.startScaleOutTween(this.ShadowSprite, this._tweensManager);
    }

    private startZoomOutAnimation(): void {
        this._tweensManager.killTweensOf(this.MainSprite);
        this._tweensManager.killTweensOf(this.ShadowSprite);

        PuzzleView.startScaleInTween(this.MainSprite, this._tweensManager);
        PuzzleView.startScaleInTween(this.ShadowSprite, this._tweensManager);
    }

    private static startScaleOutTween(sprite: Phaser.GameObjects.Image, tweensManager: Phaser.Tweens.TweenManager): void {
        tweensManager.add({
            targets: sprite,
            scale: { from: 1.0, to: Config.PuzzleScaleOnOver },
            ease: Config.PuzzleScalingOutAnimzationEase,
            duration: Config.PuzzleScalingOutAnimzationDuration
        });
    }

    private static startScaleInTween(sprite: Phaser.GameObjects.Image, tweensManager: Phaser.Tweens.TweenManager): void {
        tweensManager.add({
            targets: sprite,
            scale: { from: sprite.scale, to: 1.0 },
            ease: Config.PuzzleScalingInAnimzationEase,
            duration: Config.PuzzleScalingInAnimzationDuration
        });
    }

    private static getSpriteShadowPosition(spritePosition: Point): Point {
        return {
            x: spritePosition.x + Config.PuzzleShadowOffset,
            y: spritePosition.y + Config.PuzzleShadowOffset
        };
    }
}