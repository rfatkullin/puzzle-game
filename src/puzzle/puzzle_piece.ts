import Config from "../configs/config";
import Puzzle from "./puzzle";
import PuzzlePieceOrigin from "../contracts/puzzle_piece_origin";

import Point = Phaser.Geom.Point;

export default class PuzzlePiece {
    public readonly Id: number;
    public readonly TargetPositionOnField: Point;
    public readonly Origin: PuzzlePieceOrigin;

    public Left: PuzzlePiece;
    public Top: PuzzlePiece;
    public Right: PuzzlePiece;
    public Bottom: PuzzlePiece;

    public Parent: Puzzle;

    private _relativePosition: Point;

    public constructor(originPiece: PuzzlePieceOrigin, targetPositionOnField: Point) {
        this.Id = originPiece.Id;
        this.Origin = originPiece;
        this.TargetPositionOnField = targetPositionOnField;
    }

    public getLeftLockPosition(): Point {
        const absolutePosition: Point = this.getAbsolutePosition();

        return new Point(
            absolutePosition.x - Config.InnerQuadSize / 2,
            absolutePosition.y
        );
    }

    public getTopLockPosition(): Point {
        const absolutePosition: Point = this.getAbsolutePosition();

        return new Point(
            absolutePosition.x,
            absolutePosition.y - Config.InnerQuadSize / 2
        );
    }

    public getRightLockPosition(): Point {
        const absolutePosition: Point = this.getAbsolutePosition();

        return new Point(
            absolutePosition.x + Config.InnerQuadSize / 2,
            absolutePosition.y
        );
    }

    public getBottomLockPosition(): Point {
        const absolutePosition: Point = this.getAbsolutePosition();

        return new Point(
            absolutePosition.x,
            absolutePosition.y + Config.InnerQuadSize / 2
        );
    }

    public setParent(parent: Puzzle, relativePosition: Point): void {
        this.Parent = parent;
        this._relativePosition = relativePosition;
    }

    public setAdjacentPieces(left: PuzzlePiece, top: PuzzlePiece, right: PuzzlePiece, bottom: PuzzlePiece) {
        this.Left = left;
        this.Top = top;
        this.Right = right;
        this.Bottom = bottom;
    }

    private getAbsolutePosition(): Point {
        return new Point(
            this._relativePosition.x + this.Parent.View.MainSprite.x,
            this._relativePosition.y + this.Parent.View.MainSprite.y
        );
    }
}