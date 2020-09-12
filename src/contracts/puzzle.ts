import PuzzleConnections from "../grid/puzzle_connections";
import Point from "./point";
import PuzzleView from "./puzzle_view";

export default class Puzzle {
    private _isOnTargetPosition: boolean = false;

    get IsOnTargetPosition(): boolean {
        return this._isOnTargetPosition;
    }

    public readonly Id: number;
    public readonly TargetPosition: Point;
    public readonly Connections: PuzzleConnections;
    public readonly View: PuzzleView;

    public constructor(id: number, connections: PuzzleConnections, targetPosition: Point, view: PuzzleView) {
        this.Id = id;
        this.Connections = connections;
        this.TargetPosition = targetPosition;
        this.View = view;
        this._isOnTargetPosition = false;
    }

    public putOnTargetPosition(): void {
        this.View.setPosition(this.TargetPosition);
        this._isOnTargetPosition = true;
    }
}