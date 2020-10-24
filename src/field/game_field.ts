import PuzzlePieceOrigin from "../contracts/puzzle_piece_origin";

export default class GameField {
    public readonly Width: number;
    public readonly Height: number;

    public readonly Pieces: PuzzlePieceOrigin[];
}