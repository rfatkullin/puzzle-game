import Config from "../config";
import PuzzleDragDetails from "../contracts/events/puzzle_drag_details";
import GameState from "../contracts/game_state";
import Puzzle from "../puzzle";
import PuzzlePiece from "../contracts/puzzle_piece";
import PuzzleView from "../contracts/puzzle_view";

import ObjectFactory = Phaser.GameObjects.GameObjectFactory;
import Line = Phaser.Geom.Line;
import Point = Phaser.Geom.Point;

export default class DebugDrawer {
    private readonly _debugGraphics: Phaser.GameObjects.Graphics;

    private _gameState: GameState;

    public constructor(objectFactory: ObjectFactory, gameState: GameState) {
        this._debugGraphics = objectFactory.graphics(Config.Debug.style);
        this._debugGraphics.setDepth(Config.Depths.Debug);

        this._gameState = gameState;

        this.onDragPuzzle = this.onDragPuzzle.bind(this);
    }

    public onDragPuzzle(puzzleView: PuzzleView, eventDetails: PuzzleDragDetails): void {
        switch (eventDetails.Event) {
            case 'drag':
                this.drawTargetLines(puzzleView.PuzzleId);
                break;
            case 'end':
                this.onDragEndPuzzle();
                break;
            default:
                break;
        }
    }

    private onDragEndPuzzle(): void {
        if (!Config.Debug.enabled) {
            return;
        }

        this._debugGraphics.clear();
    }

    private drawTargetLines(puzzleId: number): void {
        if (!Config.Debug.enabled) {
            return;
        }

        this._debugGraphics.clear();

        const puzzle: Puzzle = this._gameState.Puzzles.find(puzzle => puzzle.Id == puzzleId);
        this.drawLineToTargetPosition(puzzle.View);
        this.drawLinesToLocks(puzzle.Pieces);
    }

    private drawLinesToLocks(pieces: PuzzlePiece[]): void {
        const piecesIds: number[] = pieces.map(piece => piece.Id);

        for (let piece of pieces) {
            if (piece.Left && piecesIds.indexOf(piece.Left.Id) < 0) {
                this.lineDrawToLock(piece.getLeftLockPosition(), piece.Left.getRightLockPosition());
            }

            if (piece.Top && piecesIds.indexOf(piece.Top.Id) < 0) {
                this.lineDrawToLock(piece.getTopLockPosition(), piece.Top.getBottomLockPosition());
            }

            if (piece.Right && piecesIds.indexOf(piece.Right.Id) < 0) {
                this.lineDrawToLock(piece.getRightLockPosition(), piece.Right.getLeftLockPosition());
            }

            if (piece.Bottom && piecesIds.indexOf(piece.Bottom.Id) < 0) {
                this.lineDrawToLock(piece.getBottomLockPosition(), piece.Bottom.getTopLockPosition());
            }
        }
    }

    private lineDrawToLock(startPosition: Point, endPosition: Point): void {
        const line = new Line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);

        this._debugGraphics.strokeLineShape(line);
    }

    private drawLineToTargetPosition(puzzleView: PuzzleView): void {
        const { x, y } = puzzleView.MainSprite;
        const { x: targetX, y: targetY } = puzzleView.TargetPosition;

        const line = new Line(x, y, targetX, targetY);
        this._debugGraphics.strokeLineShape(line);
    }
}