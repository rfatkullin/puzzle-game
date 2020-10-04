import { EConnection } from "../grid/connection";
import PuzzleConnections from "../grid/puzzle_connections";
import Point from "../contracts/point";
import Config from "../config";
import PuzzlePiece from "../contracts/puzzle_piece";
import PieceAdjacements from "./adjacent_pieces";

export default class PuzzleTextureMaker {
    private readonly _sizeOfInnerPartOfPiece: number = Config.InnerQuadSize;
    private readonly _offset: number = Config.BorderSize;
    private readonly _pieceSize: number = Config.PuzzleTotalSize;

    // TODO: express all those params through Config class properties
    private readonly _maskPartsAreas: any = {
        "horiz-out": [0, 50, 30, 10],
        "vert-out": [70, 0, 10, 30],

        "horiz-in": [0, 0, 50, 10],
        "vert-in": [50, 0, 10, 50],

        "quad": [0, 20, 30, 30],

        "horiz-solid": [0, 10, 50, 10],
        "vert-solid": [60, 0, 10, 50]
    };

    private readonly _borderPartsAreas: any = {
        "horiz-in-top": [0, 60, 50, 10],
        "horiz-in-bottom": [0, 69, 50, 10],

        "horiz-out-top": [0, 69, 50, 10],
        "horiz-out-bottom": [0, 60, 50, 10],

        "horiz-solid-top": [0, 88, 50, 1],
        "horiz-solid-bottom": [0, 79, 50, 10],

        "vert-in-left": [52, 50, 10, 50],
        "vert-in-right": [61, 50, 10, 50],

        "vert-out-left": [61, 50, 10, 50],
        "vert-out-right": [52, 50, 10, 50],

        "vert-solid-left": [71, 50, 10, 50],
        "vert-solid-right": [80, 50, 1, 50],
    };

    private readonly _patternsAtlas: HTMLImageElement;
    private readonly _target: HTMLImageElement;
    private readonly _textureManager: Phaser.Textures.TextureManager;

    public constructor(newTextureManager: Phaser.Textures.TextureManager, newPatternsAtlas: HTMLImageElement, newTarget: HTMLImageElement) {
        this._patternsAtlas = newPatternsAtlas;
        this._target = newTarget;
        this._textureManager = newTextureManager;
    }

    public generateTextureForPieces(id: number, pieces: PuzzlePiece[], piecesPerRow: number): string {
        const textureId: string = `puzzlePiece-${id}`;
        const { leftTop, rightBottom } = this.getBoundaries(pieces);

        const canvas: Phaser.Textures.CanvasTexture = this._textureManager.createCanvas(
            textureId,
            rightBottom.x - leftTop.x,
            rightBottom.y - leftTop.y,
        );
        const canvasContext: CanvasRenderingContext2D = canvas.context;

        const positions: Point[] = pieces.map(piece => piece.TargetImagePosition);
        const leftX: number = Math.min(...positions.map(p => p.x));
        const topY: number = Math.min(...positions.map(p => p.y));

        for (let piece of pieces) {
            this.drawPuzzlePieceMask(canvasContext, { x: piece.TargetImagePosition.x - leftX, y: piece.TargetImagePosition.y - topY }, piece.Connections);
        }

        canvasContext.globalCompositeOperation = 'source-in';

        const rightX: number = Math.max(...positions.map(p => p.x));
        const bottomY: number = Math.max(...positions.map(p => p.y));

        const mostLeft: number = leftX - Config.PuzzleTotalSize / 2;
        const mostTop: number = topY - Config.PuzzleTotalSize / 2;
        const mostRight: number = rightX + Config.PuzzleTotalSize / 2;
        const mostBottom: number = bottomY + Config.PuzzleTotalSize / 2;

        const width = mostRight - mostLeft;
        const hegiht = mostBottom - mostTop;

        canvasContext.drawImage(this._target, mostLeft, mostTop, width, hegiht, 0, 0, width, hegiht);

        canvasContext.globalCompositeOperation = 'source-over';

        for (let piece of pieces) {
            const adjacements: PieceAdjacements = this.getPieceAdjacement(piece.Id, piecesPerRow, pieces);
            this.drawPuzzlePieceBorder(canvasContext, 
                { x: piece.TargetImagePosition.x - leftX, y: piece.TargetImagePosition.y - topY }, 
                piece.Connections, 
                adjacements);
        }

        canvasContext.save();
        canvas.refresh();

        return textureId;
    }

    private getBoundaries(pieces: PuzzlePiece[]): { leftTop: Point, rightBottom: Point } {
        const positions: Point[] = pieces.map(piece => piece.TargetImagePosition);
        const xValues: number[] = positions.map(position => position.x);
        const yValues: number[] = positions.map(position => position.y)

        const left: number = Math.min(...xValues);
        const top: number = Math.min(...yValues);

        const right: number = Math.max(...xValues);
        const bottom: number = Math.max(...yValues);

        const quadHalf: number = Config.PuzzleTotalSize / 2;
        return {
            leftTop: { x: left - quadHalf, y: top - quadHalf },
            rightBottom: { x: right + quadHalf, y: bottom + quadHalf }
        };
    }

    public generateTextureForPuzzle(puzzleId: number, positionOnTarget: Point, connections: PuzzleConnections): string {
        const textureId: string = `puzzlePiece-${puzzleId}`;
        const canvas: Phaser.Textures.CanvasTexture = this._textureManager.createCanvas(
            textureId,
            this._pieceSize,
            this._pieceSize,
        );
        const canvasContext: CanvasRenderingContext2D = canvas.context;

        this.drawPuzzlePieceMask(canvasContext, { x: 0, y: 0 }, connections);

        canvasContext.globalCompositeOperation = 'source-in';

        const mostLeft: number = positionOnTarget.x - Config.PuzzleTotalSize / 2;
        const mostTop: number = positionOnTarget.y - Config.PuzzleTotalSize / 2;

        canvasContext.drawImage(this._target, mostLeft, mostTop, Config.PuzzleTotalSize, Config.PuzzleTotalSize, 0, 0, Config.PuzzleTotalSize, Config.PuzzleTotalSize);

        canvasContext.globalCompositeOperation = 'source-over';

        this.drawPuzzlePieceBorder(canvasContext, { x: 0, y: 0 }, connections, PieceAdjacements.Alone());

        canvasContext.save();
        canvas.refresh();

        return textureId;
    }

    private getPieceAdjacement(pieceId: number, width: number, pieces: PuzzlePiece[]): PieceAdjacements {
        const fromLeft = pieces.findIndex(piece => piece.Id == pieceId - 1) >= 0;
        const fromTop = pieces.findIndex(piece => piece.Id == pieceId - width) >= 0;
        const fromRight = pieces.findIndex(piece => piece.Id == pieceId + 1) >= 0;
        const fromBottom = pieces.findIndex(piece => piece.Id == pieceId + width) >= 0;

        return new PieceAdjacements(fromLeft, fromTop, fromRight, fromBottom);
    }

    private drawPatternPiece(patternsImage: HTMLImageElement, ctx: CanvasRenderingContext2D, pieceName: string, x: number, y: number) {
        const [xOffset, yOffset, width, height] = this._maskPartsAreas[pieceName];

        ctx.drawImage(patternsImage, xOffset, yOffset, width, height, x, y, width, height);
    }

    private drawnBorder(patternsImage: HTMLImageElement, ctx: CanvasRenderingContext2D, pieceName: string, x: number, y: number) {
        const [xOffset, yOffset, width, height] = this._borderPartsAreas[pieceName];

        ctx.drawImage(patternsImage, xOffset, yOffset, width, height, x, y, width, height);
    }

    private drawPuzzlePieceMask(ctx: CanvasRenderingContext2D, pos: Point, puzzle: PuzzleConnections) {
        this.drawPatternPiece(this._patternsAtlas, ctx, "quad", pos.x + this._offset * 2, pos.y + this._offset * 2);

        if (puzzle.BottomConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-in", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-solid", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece);
            if (puzzle.BottomConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-out", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece + this._offset);
            }
        }

        if (puzzle.TopConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-in", pos.x + this._offset, pos.y + this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-solid", pos.x + this._offset, pos.y + this._offset);
            if (puzzle.TopConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-out", pos.x + this._offset, pos.y);
            }
        }

        if (puzzle.RightConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-in", pos.x + this._sizeOfInnerPartOfPiece, pos.y + this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-solid", pos.x + this._sizeOfInnerPartOfPiece, pos.y + this._offset);
            if (puzzle.RightConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "vert-out", pos.x + this._sizeOfInnerPartOfPiece + this._offset, pos.y + this._offset);
            }
        }

        if (puzzle.LeftConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-in", pos.x + this._offset, pos.y + this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-solid", pos.x + this._offset, pos.y + this._offset);

            if (puzzle.LeftConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "vert-out", pos.x, pos.y + this._offset);
            }
        }
    }

    private drawPuzzlePieceBorder(ctx: CanvasRenderingContext2D, pos: Point, puzzle: PuzzleConnections, adjacements: PieceAdjacements) {
        if (!adjacements.Bottom) {            
            if (puzzle.BottomConnection == EConnection.In) {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-in-bottom", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece);
            }
            else if (puzzle.BottomConnection == EConnection.Out) {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-out-bottom", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece + this._offset);
            }
            else {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-solid-bottom", pos.x + this._offset, pos.y + this._sizeOfInnerPartOfPiece);
            }
        }

        if (!adjacements.Left) {
            if (puzzle.LeftConnection == EConnection.In) {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-in-left", pos.x + this._offset, pos.y + this._offset);
            }
            else if (puzzle.LeftConnection == EConnection.Out) {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-out-left", pos.x, pos.y + this._offset);
            }
            else {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-solid-left", pos.x, pos.y + this._offset);
            }
        }

        if (!adjacements.Right) {
            if (puzzle.RightConnection == EConnection.In) {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-in-right", pos.x + this._sizeOfInnerPartOfPiece, pos.y + this._offset);
            }
            else if (puzzle.RightConnection == EConnection.Out) {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-out-right", pos.x + this._sizeOfInnerPartOfPiece + this._offset, pos.y + this._offset);
            }
            else {
                this.drawnBorder(this._patternsAtlas, ctx, "vert-solid-right", pos.x + this._sizeOfInnerPartOfPiece + this._offset, pos.y + this._offset);
            }
        }

        if (!adjacements.Top) {
            if (puzzle.TopConnection == EConnection.In) {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-in-top", pos.x + this._offset, pos.y + this._offset);
            }
            else if (puzzle.TopConnection == EConnection.Out) {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-out-top", pos.x + this._offset, pos.y);
            }
            else {
                this.drawnBorder(this._patternsAtlas, ctx, "horiz-solid-top", pos.x + this._offset, pos.y + this._offset);
            }
        }
    }
}