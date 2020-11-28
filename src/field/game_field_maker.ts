import Config from "../configs/config";
import PuzzlePieceOrigin from "../contracts/puzzle_piece_origin";
import { ELockType } from "../contracts/lock/puzzle_elock_type";
import PuzzleLocks from "../contracts/lock/puzzle_locks";
import PuzzleLock from "../contracts/lock/puzzle_lock";

import Point = Phaser.Geom.Point;

export default class PuzzleFieldMaker {
    private readonly _oppositeConnection: any;

    constructor() {
        this._oppositeConnection = {
            [ELockType.In]: ELockType.Out,
            [ELockType.Out]: ELockType.In
        };
    }

    public make(height: number, width: number): PuzzlePieceOrigin[] {
        const connections: PuzzleLocks[] = this.generateConnections(height, width);
        return this.makePieces(connections, width);
    }

    private generateConnections(height: number, width: number): PuzzleLocks[] {
        const piecesNumber = height * width;
        const pieces: PuzzleLocks[] = [];

        for (let i = 0; i < piecesNumber; ++i) {
            const locks: PuzzleLocks = this.makeLocks(pieces, piecesNumber, height, width, i);
            pieces.push(locks);
        }

        return pieces;
    }

    private makePieces(connections: PuzzleLocks[], width: number): PuzzlePieceOrigin[] {
        const originPieces: PuzzlePieceOrigin[] = [];

        for (let index = 0; index < connections.length; ++index) {
            const y = Math.floor(index / width);
            const x = index % width;
            const targetImagePosition: Point = new Point((x + 0.5) * Config.InnerQuadSize, (y + 0.5) * Config.InnerQuadSize);
            const piece: PuzzlePieceOrigin = new PuzzlePieceOrigin(index, targetImagePosition, connections[index]);
            originPieces.push(piece);
        }

        return originPieces;
    }

    private makeLocks(field: PuzzleLocks[], piecesNumber: number, height: number, width: number, index: number): PuzzleLocks {
        const locks = new PuzzleLocks();

        if (index % width > 0) {
            const leftPieceId: number = index - 1;
            const lockType = this.getOppositeConnection(field[leftPieceId].Right.LockType);
            locks.Left = new PuzzleLock(lockType, index - 1);

            field[leftPieceId].Right.PieceId = index;
        }
        else {
            locks.Left = new PuzzleLock(ELockType.None);
        }

        if (index - width >= 0) {
            const topPieceId: number = index - width;
            const lockType = this.getOppositeConnection(field[topPieceId].Bottom.LockType);
            locks.Top = new PuzzleLock(lockType, topPieceId);

            field[topPieceId].Bottom.PieceId = index;
        }
        else {
            locks.Top = new PuzzleLock(ELockType.None);
        }

        if (index % width != width - 1) {
            locks.Right = new PuzzleLock(this.getRandomConnection());
        }
        else {
            locks.Right = new PuzzleLock(ELockType.None);
        }

        if (index + width < piecesNumber) {
            locks.Bottom = new PuzzleLock(this.getRandomConnection());
        }
        else {
            locks.Bottom = new PuzzleLock(ELockType.None);
        }

        return locks;
    }

    private getRandomConnection(): ELockType {
        if (Math.random() < 0.5) {
            return ELockType.In;
        }

        return ELockType.Out;
    }

    private getOppositeConnection(connection: ELockType): ELockType {
        return this._oppositeConnection[connection];
    }
}