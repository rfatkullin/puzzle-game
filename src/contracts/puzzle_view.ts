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

    private static getSpriteShadowPosition(spritePosition: Point): Point {
        return {
            x: spritePosition.x + Config.PuzzleShadowOffset,
            y: spritePosition.y + Config.PuzzleShadowOffset
        };
    }
}