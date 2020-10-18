import Puzzle from "../contracts/puzzle";
import PuzzlePiece from "../contracts/puzzle_piece";
import PuzzleView from "../contracts/puzzle_view";
import PuzzleTextureMaker from "./puzzle_texture_maker";
import PuzzleViewMaker from "./puzzle_view_maker";

import Point = Phaser.Geom.Point;

export default class PuzzleMaker {
    private _viewMaker: PuzzleViewMaker;

    public constructor(viewMaker: PuzzleViewMaker) {
        this._viewMaker = viewMaker;
    }

    public construcPuzzle(id: number, pieces: PuzzlePiece[], piecesPerRow: number, textureMaker: PuzzleTextureMaker): Puzzle {
        const centerPosition = this.getPiecesCenterPoint(pieces);
        const piecesTexture = textureMaker.generateTextureForPieces(id, pieces, piecesPerRow);

        const view: PuzzleView = this._viewMaker.constructPiecesView(id, centerPosition, piecesTexture, false);
        const puzzle: Puzzle = new Puzzle(id, centerPosition, pieces, view);

        return puzzle;
    }

    public constructOriginPuzzles(pieces: PuzzlePiece[], piecesPerRow: number, textureMaker: PuzzleTextureMaker): Puzzle[] {
        //return pieces.map(piece => this.construcPuzzle(piece.Id, [piece], textureMaker));
        return this.constructMergedPuzzles(pieces, piecesPerRow, textureMaker);
    }

    public constructMergedPuzzles(pieces: PuzzlePiece[], piecesPerRow: number, textureMaker: PuzzleTextureMaker): Puzzle[] {
        const result: Puzzle[] = []
        const piecesNumber: number = pieces.length;
        const tempPieces: PuzzlePiece[] = [...pieces];

        for (let i = 0; i < piecesNumber; ++i) {
            if (tempPieces[i]) {
                const puzzlePiecesNumber: number = 3;//Math.floor(Math.random() * 5) + 1 // Max 5 pieces in puzzle
                const currentPuzzlePieces: PuzzlePiece[] = this.mergePieces(tempPieces[i].Id, tempPieces, piecesPerRow, puzzlePiecesNumber);
                const piecesTexture = textureMaker.generateTextureForPieces(pieces[i].Id, currentPuzzlePieces, piecesPerRow);
                const centerPosition: Point = this.getPiecesCenterPoint(currentPuzzlePieces);
                const view: PuzzleView = this._viewMaker.constructPiecesView(pieces[i].Id, centerPosition, piecesTexture);
                const puzzle: Puzzle = new Puzzle(pieces[i].Id, centerPosition, currentPuzzlePieces, view);

                result.push(puzzle);
            }
        }

        return result;
    }

    private mergePieces(currentPieceId: number, pieces: PuzzlePiece[], width: number, puzzlePiecesNumber: number): PuzzlePiece[] {
        const result: PuzzlePiece[] = [];

        while (currentPieceId > -1 && result.length < puzzlePiecesNumber) {
            result.push(pieces[currentPieceId]);
            pieces[currentPieceId] = null;

            const nextPossibleId: number[] = [];

            const isTherePieceInSameRow = currentPieceId + 1 < pieces.length && pieces[currentPieceId + 1] &&
                (currentPieceId + 1) % width != 0
            if (isTherePieceInSameRow) {
                nextPossibleId.push(currentPieceId + 1);
            }

            if (currentPieceId + width < pieces.length && pieces[currentPieceId + width]) {
                nextPossibleId.push(currentPieceId + width)
            }

            if (nextPossibleId) {
                currentPieceId = nextPossibleId[Math.floor(Math.random() * (nextPossibleId.length + 1))];
            }
            else {
                currentPieceId = -1;
            }
        }

        return result;
    }

    private getPiecesCenterPoint(pieces: PuzzlePiece[]): Point {
        const initialValue = new Point(0, 0);

        const reducer = (agg: Point, currentPoint: Point) => {
            agg.x += currentPoint.x;
            agg.y += currentPoint.y;

            return agg;
        };

        const positionsSum: Point = pieces.map(piece => piece.FieldPosition)
            .reduce(reducer, initialValue);

        return new Point(
            positionsSum.x / pieces.length,
            positionsSum.y / pieces.length);
    };
}