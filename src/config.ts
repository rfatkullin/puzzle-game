export default class Config {
    public static readonly CanvasWidth: number = 800;
    public static readonly CanvasHeight: number = 600;

    public static readonly InnerQuadSize: number = 50;
    public static readonly BorderSize: number = 10;
    public static readonly HookSize: number = 10;

    public static readonly PuzzleTotalSize: number = Config.InnerQuadSize + 2 * Config.BorderSize;

    // Puzzle shadow
    public static readonly PuzzleShadowAlpha: number = 0.6;
    public static readonly PuzzleShadowOffset: number = 3;

    // Puzzle Animation
    public static readonly PuzzleScaleOnOver: number = 1.2;
    public static readonly PuzzleScalingOutAnimzationDuration: number = 100;
    public static readonly PuzzleScalingInAnimzationDuration: number = 300;
    public static readonly PuzzleScalingOutAnimzationEase: string = 'Cubic.Out';
    public static readonly PuzzleScalingInAnimzationEase: string = 'Linear';

    public static readonly MinDistanceToAutoPut: number = 60;

    public static readonly FieldShadowAlpha: number = 0.2;
    public static readonly FieldShadowTint: number = 0x00E819;

    // Debug
    public static readonly DebugLineStyle = { width: 2, color: 0xffffff };

    public static readonly Tints = {
        Menu: {
            HelpButton: 0xCCCCCC
        }
    }

    public static readonly Scales = {
        Menu: {
            ShowButton: 0.7,
            ShowButtonAnimated: 0.9,
            HelpButton: 0.7,
            HelpButtonAnimated: 0.9
        },
        MiniTarget: 0.6
    }

    public static readonly Depths = {
        Background: 0,
        Field: 1,
        OnTargetPositionPuzzle: 2,
        OnFieldPuzzle: 10,
        OnDragPuzzle: 20,
        Menu: 30
    };

    public static readonly DebugDrawing = {
        enabled: false,
        lineStyle: Config.DebugLineStyle
    };
}