import PuzzleConnections from "../grid/puzzle_connections";
import Point from "./point";

export default class Puzzle {
    public Id: number;

    public Connections: PuzzleConnections;

    public OnTargetPosition: Point;

    public ViewTextureName: string;
}