import Point from "./point";
import Config from "../config";

export default class PuzzleView {
    public readonly Texture: string;

    public readonly TargetPosition: Point;

    public readonly MainSprite: Phaser.GameObjects.Image;

    public readonly ShadowSprite: Phaser.GameObjects.Image;

    public constructor(texture: string, targetPosition: Point, mainSprite: Phaser.GameObjects.Image, shadowSprite: Phaser.GameObjects.Image) {
        this.Texture = texture;
        this.TargetPosition = targetPosition;
        this.MainSprite = mainSprite;
        this.ShadowSprite = shadowSprite;
    }

    public setPosition(newPosition: { x: number, y: number }): void {
        const shadowPosition: Point = PuzzleView.getSpriteShadowPosition(newPosition);

        this.MainSprite.setPosition(newPosition.x, newPosition.y);
        this.ShadowSprite.setPosition(shadowPosition.x, shadowPosition.y);
    }

    public startZoomInAnimation(tweensManager: Phaser.Tweens.TweenManager): void {
        PuzzleView.startScaleOutTween(this.MainSprite, tweensManager);
        PuzzleView.startScaleOutTween(this.ShadowSprite, tweensManager);
    }

    public startZoomOutAnimation(tweensManager: Phaser.Tweens.TweenManager): void {
        tweensManager.killTweensOf(this.MainSprite);
        tweensManager.killTweensOf(this.ShadowSprite);

        PuzzleView.startScaleInTween(this.MainSprite, tweensManager);
        PuzzleView.startScaleInTween(this.ShadowSprite, tweensManager);
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