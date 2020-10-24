import { ELockType } from "./puzzle_elock_type";

export default class PuzzleLock {
    public PieceId: number;
    public readonly LockType: ELockType;

    public constructor(lockType: ELockType, adjacentPieceId: number = -1) {
        this.PieceId = adjacentPieceId;
        this.LockType = lockType;
    }
}