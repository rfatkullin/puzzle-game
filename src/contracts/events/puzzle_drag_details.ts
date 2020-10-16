import Point = Phaser.Geom.Point;

export default class PuzzleDragDetails {
    public Event: string;

    public Position: Point

    public constructor(event: string, position: Point) {
        this.Event = event;
        this.Position = position;
    }
}