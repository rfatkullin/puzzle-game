import Point from "./point";

export default class PuzzleView {
    public readonly Texture: string;

    public readonly OnTargetPosition: Point;

    public readonly MainSprite: Phaser.GameObjects.Image;

    public readonly ShadowSprite: Phaser.GameObjects.Image;
}