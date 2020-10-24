import Config from "../config";
import { ELockType } from "./lock/puzzle_elock_type";
import Puzzle from "./puzzle";
import PuzzlePieceOrigin from "./puzzle_piece_origin";

import Point = Phaser.Geom.Point;

export default class PuzzlePiece {
    public readonly Id: number;
    public readonly TargetPositionOnField: Point;
    public readonly Origin: PuzzlePieceOrigin;

    private _relativePosition: Point;
    private _parent: Puzzle;
    
    private _left: PuzzlePiece;
    private _top: PuzzlePiece;
    private _right: PuzzlePiece;
    private _bottom: PuzzlePiece;

    public constructor(originPiece: PuzzlePieceOrigin, targetPositionOnField: Point) {
        this.Id = originPiece.Id;
        this.Origin = originPiece;
        this.TargetPositionOnField = targetPositionOnField;
    }

    public getLockPositions(): Point[] {
        const lockPositions: Point[] = [];
        const absolutePosition: Point = new Point(
            this._relativePosition.x + this._parent.Position.x,
            this._relativePosition.y + this._parent.Position.y
        );

        const connections: PuzzleLocks = this._origin.Locks;

        if (connections.LeftConnection != ELockType.None) {
            lockPositions.push(new Point(
                absolutePosition.x - Config.InnerQuadSize / 2,
                absolutePosition.y
            ));
        }

        if (connections.TopConnection != ELockType.None) {
            lockPositions.push(new Point(
                absolutePosition.x,
                absolutePosition.y - Config.InnerQuadSize / 2
            ));
        }

        if (connections.RightConnection != ELockType.None) {
            lockPositions.push(new Point(
                absolutePosition.x + Config.InnerQuadSize / 2,
                absolutePosition.y
            ));
        }

        if (connections.BottomConnection != ELockType.None) {
            lockPositions.push(new Point(
                absolutePosition.x,
                absolutePosition.y + Config.InnerQuadSize / 2
            ));
        }

        return lockPositions;
    }

    public setParent(parent: Puzzle, relativePosition: Point): void {
        this._parent = parent;
        this._relativePosition = relativePosition;
    }

    public setAdjacentPieces(left: PuzzlePiece, top: PuzzlePiece, right: PuzzlePiece, bottom: PuzzlePiece) {
        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
    }
}