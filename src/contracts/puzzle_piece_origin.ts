import PuzzleLocks from "./lock/puzzle_locks";

import Point = Phaser.Geom.Point;

export default class PuzzlePieceOrigin {
    public readonly Id: number;
    public readonly TargetImagePosition: Point;
    public readonly Locks: PuzzleLocks;

    public constructor(id: number, targetImagePosition: Point, connections: PuzzleLocks) {
        this.Id = id;
        this.TargetImagePosition = targetImagePosition;
        this.Locks = connections;
    }
}