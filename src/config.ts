export default class Config {
    public static readonly CanvasWidth: number = 800;
    public static readonly CanvasHeight: number = 600;

    public static readonly InnerQuadSize: number = 50;
    public static readonly BorderSize: number = 10;
    public static readonly HookSize: number = 10;

    public static readonly PuzzleTotalSize: number = Config.InnerQuadSize + 2 * Config.BorderSize;
}