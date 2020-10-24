import { ELockType } from "../contracts/lock/puzzle_elock_type";
import PuzzleLock from "../contracts/lock/puzzle_lock";
import Puzzle from "../contracts/puzzle";
import PuzzlePiece from "../contracts/puzzle_piece";
import PuzzlePieceOrigin from "../contracts/puzzle_piece_origin";
import PuzzleView from "../contracts/puzzle_view";
import PuzzleTextureMaker from "./puzzle_texture_maker";
import PuzzleViewMaker from "./puzzle_view_maker";

import Point = Phaser.Geom.Point;

export default class PuzzleMaker {
    private readonly _viewMaker: PuzzleViewMaker;
    private readonly _textureMaker: PuzzleTextureMaker;

    public constructor(viewMaker: PuzzleViewMaker, textureMaker: PuzzleTextureMaker) {
        this._viewMaker = viewMaker;
        this._textureMaker = textureMaker;
    }

    public constructSinglePuzzle(id: number, originPieces: PuzzlePieceOrigin[], piecesPerRow: number, fieldStartPosition: Point): Puzzle {
        const pieces: PuzzlePiece[] = this.constructPieces(originPieces, fieldStartPosition);

        const centerPosition = this.getPiecesCenterPoint(pieces);
        const piecesTexture = this._textureMaker.generateTextureForPieces(id, pieces, piecesPerRow);

        const view: PuzzleView = this._viewMaker.constructPiecesView(id, centerPosition, piecesTexture, false);
        const puzzle: Puzzle = new Puzzle(id, centerPosition, pieces, view);

        return puzzle;
    }

    public constructPuzzlesForGameStart(originPieces: PuzzlePieceOrigin[], piecesPerRow: number, fieldStartPosition: Point): Puzzle[] {
        const pieces: PuzzlePiece[] = this.constructPieces(originPieces, fieldStartPosition);
        return this.constructMergedPuzzles(pieces, piecesPerRow);
    }

    public constructMergedPuzzles(pieces: PuzzlePiece[], piecesPerRow: number): Puzzle[] {
        const result: Puzzle[] = []
        const piecesNumber: number = pieces.length;
        const tempPieces: PuzzlePiece[] = [...pieces];

        for (let i = 0; i < piecesNumber; ++i) {
            if (tempPieces[i]) {
                const puzzlePiecesNumber: number = 4;//Math.floor(Math.random() * 5) + 1 // Max 5 pieces in puzzle
                const currentPuzzlePieces: PuzzlePiece[] = this.mergePieces(tempPieces[i].Id, tempPieces, piecesPerRow, puzzlePiecesNumber);

                const piecesTexture = this._textureMaker.generateTextureForPieces(pieces[i].Id, currentPuzzlePieces, piecesPerRow);

                const centerPosition: Point = this.getPiecesCenterPoint(currentPuzzlePieces);

                const view: PuzzleView = this._viewMaker.constructPiecesView(pieces[i].Id, centerPosition, piecesTexture);

                const puzzle: Puzzle = new Puzzle(pieces[i].Id, centerPosition, currentPuzzlePieces, view);

                this.setPiecesParent(puzzle, currentPuzzlePieces);

                result.push(puzzle);
            }
        }

        return result;
    }

    private constructPieces(originPieces: PuzzlePieceOrigin[], fieldStartPosition: Point): PuzzlePiece[] {
        const pieces: PuzzlePiece[] = originPieces.map(origin => {
            const puzzlePositionOnField: Point = new Point(
                origin.TargetImagePosition.x + fieldStartPosition.x,
                origin.TargetImagePosition.y + fieldStartPosition.y
            )

            return new PuzzlePiece(origin, puzzlePositionOnField);
        });

        for (let piece of pieces) {
            const left: PuzzlePiece = this.getLockPiece(piece.Origin.Locks.Left, pieces);
            const top: PuzzlePiece = this.getLockPiece(piece.Origin.Locks.Top, pieces);
            const right: PuzzlePiece = this.getLockPiece(piece.Origin.Locks.Right, pieces);
            const bottom: PuzzlePiece = this.getLockPiece(piece.Origin.Locks.Bottom, pieces);

            piece.setAdjacentPieces(left, top, right, bottom);
        }

        return pieces;
    }

    private setPiecesParent(puzzle: Puzzle, pieces: PuzzlePiece[]): void {
        for (let piece of pieces) {
            const relativePosition: Point = new Point(
                piece.TargetPositionOnField.x - puzzle.TargetPosition.x,
                piece.TargetPositionOnField.y - puzzle.TargetPosition.y
            );

            piece.setParent(puzzle, relativePosition);
        }
    }

    private getLockPiece(lock: PuzzleLock, originPieces: PuzzlePiece[]): PuzzlePiece {
        if (lock.LockType == ELockType.None) {
            return null;
        }

        return originPieces[lock.PieceId];
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
        const x: number[] = pieces.map(piece => piece.TargetPositionOnField.x);
        const y: number[] = pieces.map(piece => piece.TargetPositionOnField.y);

        const centerX: number = (Math.min(...x) + Math.max(...x)) / 2;
        const centerY: number = (Math.min(...y) + Math.max(...y)) / 2;

        return new Point(centerX, centerY);
    }
}