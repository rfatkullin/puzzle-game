import PuzzlePiece from "./puzzle_piece";
import PuzzleView from "./puzzle_view";

import Point = Phaser.Geom.Point;

export default class Puzzle {
    private _isOnTargetPosition: boolean = false;
    private _adjacentPuzzles: Puzzle[] = []

    get IsOnTargetPosition(): boolean {
        return this._isOnTargetPosition;
    }

    public readonly Id: number;
    public readonly TargetPosition: Point;
    public readonly View: PuzzleView;
    public readonly Pieces: PuzzlePiece[] = [];
    public readonly Position: Point;

    public constructor(id: number,
        targetPosition: Point,
        pieces: PuzzlePiece[],
        view: PuzzleView) {

        this.Id = id;
        this.TargetPosition = targetPosition;
        this.View = view;
        this.Pieces = pieces;

        this._isOnTargetPosition = false;
    }

    public putOnTargetPosition(): void {
        this.View.setPosition(this.TargetPosition);
        this._isOnTargetPosition = true;
    }

    public addAdjacentPuzzle(adjacentPuzzle: Puzzle): void {
        this._adjacentPuzzles.push(adjacentPuzzle);
    }
}