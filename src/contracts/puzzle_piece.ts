import Config from "../config";
import { ELockType } from "./lock/puzzle_elock_type";
import Puzzle from "./puzzle";
import PuzzlePieceOrigin from "./puzzle_piece_origin";

import Point = Phaser.Geom.Point;

export default class PuzzlePiece {
    public readonly Id: number;
    public readonly TargetPositionOnField: Point;
    public readonly Origin: PuzzlePieceOrigin;

    public Left: PuzzlePiece;
    public Top: PuzzlePiece;
    public Right: PuzzlePiece;
    public Bottom: PuzzlePiece;

    private _relativePosition: Point;
    private _parent: Puzzle;

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
        this._parent = parent;
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
            this._relativePosition.x + this._parent.View.MainSprite.x,
            this._relativePosition.y + this._parent.View.MainSprite.y
        );
    }
}