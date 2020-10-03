import { EConnection } from "../grid/connection";
import PuzzleConnections from "../grid/puzzle_connections";
import Point from "../contracts/point";
import Config from "../config";

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

    public generateTextureForPuzzle(puzzleId: number, positionOnTarget: Point, connections: PuzzleConnections): string {
        const textureId: string = `puzzlePiece-${puzzleId}`;
        const canvas: Phaser.Textures.CanvasTexture = this._textureManager.createCanvas(
            textureId,
            this._pieceSize,
            this._pieceSize,
        );
        const canvasContext: CanvasRenderingContext2D = canvas.context;

        this.drawPuzzlePieceMask(canvasContext, connections);

        canvasContext.globalCompositeOperation = 'source-in';

        const mostLeft: number = positionOnTarget.x - Config.PuzzleTotalSize / 2;
        const mostTop: number = positionOnTarget.y - Config.PuzzleTotalSize / 2;

        canvasContext.drawImage(this._target, mostLeft, mostTop, Config.PuzzleTotalSize, Config.PuzzleTotalSize, 0, 0, Config.PuzzleTotalSize, Config.PuzzleTotalSize);

        canvasContext.globalCompositeOperation = 'source-over';

        this.drawPuzzlePieceBorder(canvasContext, connections);

        canvasContext.save();
        canvas.refresh();

        return textureId;
    }

    private drawPatternPiece(patternsImage: HTMLImageElement, ctx: CanvasRenderingContext2D, pieceName: string, x: number, y: number) {
        const [xOffset, yOffset, width, height] = this._maskPartsAreas[pieceName];

        ctx.drawImage(patternsImage, xOffset, yOffset, width, height, x, y, width, height);
    }

    private drawnBorder(patternsImage: HTMLImageElement, ctx: CanvasRenderingContext2D, pieceName: string, x: number, y: number) {
        const [xOffset, yOffset, width, height] = this._borderPartsAreas[pieceName];

        ctx.drawImage(patternsImage, xOffset, yOffset, width, height, x, y, width, height);
    }

    private drawPuzzlePieceMask(ctx: CanvasRenderingContext2D, puzzle: PuzzleConnections) {
        this.drawPatternPiece(this._patternsAtlas, ctx, "quad", this._offset * 2, this._offset * 2);

        if (puzzle.BottomConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-in", this._offset, this._sizeOfInnerPartOfPiece);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-solid", this._offset, this._sizeOfInnerPartOfPiece);
            if (puzzle.BottomConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-out", this._offset, this._sizeOfInnerPartOfPiece + this._offset);
            }
        }

        if (puzzle.TopConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-in", this._offset, this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-solid", this._offset, this._offset);
            if (puzzle.TopConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "horiz-out", this._offset, 0);
            }
        }

        if (puzzle.RightConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-in", this._sizeOfInnerPartOfPiece, this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-solid", this._sizeOfInnerPartOfPiece, this._offset);
            if (puzzle.RightConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "vert-out", this._sizeOfInnerPartOfPiece + this._offset, this._offset);
            }
        }

        if (puzzle.LeftConnection == EConnection.In) {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-in", this._offset, this._offset);
        }
        else {
            this.drawPatternPiece(this._patternsAtlas, ctx, "vert-solid", this._offset, this._offset);

            if (puzzle.LeftConnection == EConnection.Out) {
                this.drawPatternPiece(this._patternsAtlas, ctx, "vert-out", 0, this._offset);
            }
        }
    }

    private drawPuzzlePieceBorder(ctx: CanvasRenderingContext2D, puzzle: PuzzleConnections) {
        if (puzzle.BottomConnection == EConnection.In) {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-in-bottom", this._offset, this._sizeOfInnerPartOfPiece);
        }
        else if (puzzle.BottomConnection == EConnection.Out) {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-out-bottom", this._offset, this._sizeOfInnerPartOfPiece + this._offset);
        }
        else {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-solid-bottom", this._offset, this._sizeOfInnerPartOfPiece);
        }

        if (puzzle.LeftConnection == EConnection.In)
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-in-left", this._offset, this._offset);
        }
        else if (puzzle.LeftConnection == EConnection.Out)
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-out-left", 0, this._offset);
        }
        else
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-solid-left", 0, this._offset);
        }

        if (puzzle.RightConnection == EConnection.In)
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-in-right", this._sizeOfInnerPartOfPiece, this._offset);
        }
        else if (puzzle.RightConnection == EConnection.Out)
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-out-right", this._sizeOfInnerPartOfPiece + this._offset, this._offset);
        }
        else
        {
            this.drawnBorder(this._patternsAtlas, ctx, "vert-solid-right", this._sizeOfInnerPartOfPiece + this._offset, this._offset);
        }

        if (puzzle.TopConnection == EConnection.In) {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-in-top", this._offset, this._offset);
        }
        else if (puzzle.TopConnection == EConnection.Out) {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-out-top", this._offset, 0);
        }
        else {
            this.drawnBorder(this._patternsAtlas, ctx, "horiz-solid-top", this._offset, this._offset);
        }
    }
}