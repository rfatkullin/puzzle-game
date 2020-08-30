import PuzzleConnections from "../grid/puzzle_connections";
import Point from "./point";
import PuzzleView from "./puzzle_view";

export default class Puzzle {
    public Id: number;

    public Connections: PuzzleConnections;

    public OnTargetPosition: Point;

    public View: PuzzleView;
}