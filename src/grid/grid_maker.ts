import { EConnection } from "./connection";
import PuzzleConnections from "./puzzle_connections";

export default class PuzzleGridMaker {
    private readonly _oppositeConnection: any;

    constructor() {
        this._oppositeConnection = {
            [EConnection.In]: EConnection.Out,
            [EConnection.Out]: EConnection.In
        };
    }

    public make(height: number, width: number): PuzzleConnections[][] {
        const grid: PuzzleConnections[][] = [];

        for (let i = 0; i < height; ++i) {
            const row = [];
            grid.push(row);

            for (let j = 0; j < width; ++j) {
                const newPuzzle: PuzzleConnections = this.makePuzzle(grid, height, width, i, j);
                row.push(newPuzzle);
            }
        }

        return grid;
    }

    private makePuzzle(grid: PuzzleConnections[][], height: number, width: number, heightIndex: number, widthIndex: number): PuzzleConnections {
        let top: EConnection = EConnection.None;
        let right: EConnection = EConnection.None;
        let bottom: EConnection = EConnection.None;
        let left: EConnection = EConnection.None;

        if (heightIndex > 0) {
            const abovePuzzle = grid[heightIndex - 1][widthIndex];
            top = this.getOppositeConnection(abovePuzzle.BottomConnection);
        }

        if (widthIndex > 0) {
            const leftSidePuzzle = grid[heightIndex][widthIndex - 1];
            left = this.getOppositeConnection(leftSidePuzzle.RightConnection);
        }

        if (heightIndex < height - 1) {
            bottom = this.getRandomConnection();
        }

        if (widthIndex < width - 1) {
            right = this.getRandomConnection();
        }

        return {
            TopConnection: top,
            RightConnection: right,
            BottomConnection: bottom,
            LeftConnection: left
        };
    }

    private getRandomConnection(): EConnection {
        if (Math.random() < 0.5) {
            return EConnection.In;
        }

        return EConnection.Out;
    }

    private getOppositeConnection(connection: EConnection): EConnection {
        return this._oppositeConnection[connection];
    }
}