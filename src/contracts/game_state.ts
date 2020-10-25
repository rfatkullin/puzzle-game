import Puzzle from "./puzzle";

export default class GameState {
    
    public get Puzzles(): Puzzle[] {
        return this._puzzles;
    }

    private _puzzles: Puzzle[] = [];

    public setPuzzles(newPuzzles: Puzzle[]): void {
        this._puzzles = newPuzzles;
    }
}