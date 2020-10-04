import PuzzleConnections from "../grid/puzzle_connections";
import Point from "./point";

export default class PuzzlePiece {
    public readonly Id: number;
    public readonly TargetImagePosition: Point;
    public readonly FieldPosition: Point;
    public readonly Connections: PuzzleConnections;
    
    public ParentId: number;
    public AdjecentPieces: PuzzlePiece[] = [];

    public constructor(id: number, targetImagePosition: Point, fieldPosition: Point, connections: PuzzleConnections) {
        this.Id = id;
        this.Connections = connections;
        this.TargetImagePosition = targetImagePosition;
        this.FieldPosition = fieldPosition;
    }

    public setParant(parentId: number): void {
        this.ParentId = parentId;
    }

    public addAdjacentPieces(pieces: PuzzlePiece[]): void {
        this.AdjecentPieces = this.AdjecentPieces.concat(pieces);
    }
}