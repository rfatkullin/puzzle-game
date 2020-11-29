import Puzzle from "../puzzle/puzzle";

export default class GameState {
    public get Target(): string {
        return this._target;
    }

    public get Puzzles(): Puzzle[] {
        return this._puzzles;
    }

    private _puzzles: Puzzle[] = [];
    private _target: string;

    public setPuzzles(newPuzzles: Puzzle[]): void {
        this._puzzles = newPuzzles;
    }

    public setTarget(target: string): void {
        this._target = target;
    }
}