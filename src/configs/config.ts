export default class Config {
    public static CanvasWidth: number = 800;
    public static CanvasHeight: number = 600;

    public static readonly InnerQuadSize: number = 50;
    public static readonly BorderSize: number = 10;
    public static readonly HookSize: number = 10;

    public static readonly PuzzleTotalSize: number = Config.InnerQuadSize + 2 * Config.BorderSize;

    // Puzzle shadow
    public static readonly PuzzleShadowAlpha: number = 0.6;
    public static readonly PuzzleShadowOffset: number = 3;

    public static Animation = {
        Menu: {
            MouseOverDuration: 100,
            MouseOverEase: 'Linear'
        }
    }

    public static readonly MinDistanceToAutoPut: number = 20;

    public static readonly FieldShadowAlpha: number = 0.2;
    public static readonly FieldShadowTint: number = 0x00E819;

    public static readonly Tints = {
        Menu: {
            HelpButton: 0xCCCCCC,
            SoundButton: 0xCCCCCC
        }
    };

    public static readonly Scales = {
        Menu: {
            ShowButton: 0.7,
            ShowButtonAnimated: 0.9,
            HelpButton: 0.7,
            HelpButtonAnimated: 0.9,
            SoundButton: 0.7,
            SoundButtonAnimated: 0.9
        },
        MiniTarget: 0.6
    };

    public static readonly Depths = {
        Background: 0,
        Field: 1,
        OnTargetPositionPuzzle: 2,
        OnFieldPuzzle: 10,
        OnDragPuzzle: 20,
        Menu: 30,
        Debug: 100
    };

    public static readonly Sound = {
        enabled: true
    };

    public static readonly Debug = {
        enabled: false,
        style: {
            lineStyle: {
                width: 2,
                color: 0xffffff
            }
        }
    };

    public static getViewportSize(): { width: number, height: number } {
        const screenWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        const screenHeight = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        return {
            width: screenWidth,
            height: screenHeight
        };
    }
}