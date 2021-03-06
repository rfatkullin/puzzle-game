import Config from "../configs/config";

import Point = Phaser.Geom.Point;

export default class PuzzleView {
    private readonly _tweensManager: Phaser.Tweens.TweenManager;

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

        this.setDepth(Config.Depths.OnFieldPuzzle);
    }

    public getPosition(): Point {
        var { x, y } = this.MainSprite;
        return new Point(x, y);
    }

    public setPosition(newPosition: Point): void {
        const shadowPosition: Point = PuzzleView.getSpriteShadowPosition(newPosition);

        this.MainSprite.setPosition(newPosition.x, newPosition.y);
        this.ShadowSprite.setPosition(shadowPosition.x, shadowPosition.y);
    }

    public onDragStart() {
        this.setDepth(Config.Depths.OnDragPuzzle);
    }

    public onDragEnd() {
        this.setDepth(Config.Depths.OnFieldPuzzle);
    }

    public destroy(): void {
        // TODO: destroy textures.
        this.MainSprite.destroy();
        this.ShadowSprite.destroy();

    }

    public switchOffInteractivity(): void {
        this.MainSprite.disableInteractive();
        this.ShadowSprite.disableInteractive();
    }

    public onTargetPosition(): void {
        this.setDepth(Config.Depths.OnTargetPositionPuzzle)
    }

    private setDepth(depth: number): void {
        this.MainSprite.setDepth(depth);
        this.ShadowSprite.setDepth(depth);
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
        return new Point(
            spritePosition.x + Config.PuzzleShadowOffset,
            spritePosition.y + Config.PuzzleShadowOffset);
    }    
}