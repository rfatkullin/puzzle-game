export default interface IPuzzleMoved {
    (puzzleId: number, position: { x: number, y: number }): void;
}