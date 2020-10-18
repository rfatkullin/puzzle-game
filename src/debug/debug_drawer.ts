import Config from "../config";
import PuzzleDragDetails from "../contracts/events/puzzle_drag_details";
import PuzzleView from "../contracts/puzzle_view";

import ObjectFactory = Phaser.GameObjects.GameObjectFactory;

export default class DebugDrawer {
    private static readonly GraphicsDepth = 10000;

    private readonly _debugGraphics: Phaser.GameObjects.Graphics;

    public constructor(objectFactory: ObjectFactory) {
        if (Config.DebugDrawing.enabled) {
            this._debugGraphics = objectFactory.graphics(Config.DebugDrawing);
            this._debugGraphics.setDepth(DebugDrawer.GraphicsDepth);
        }

        this.onDragPuzzle = this.onDragPuzzle.bind(this);
    }

    public onDragPuzzle(puzzleView: PuzzleView, eventDetails: PuzzleDragDetails): void {
        switch (eventDetails.Event) {
            case 'drag':
                this.drawLineToPositionOnDrag(puzzleView);
                break;
            case 'end':
                this.onDragEndPuzzle();
                break;
            default:
                break;
        }
    }

    private onDragEndPuzzle(): void {
        if (this._debugGraphics == null) {
            return;
        }

        this._debugGraphics.clear();
    }

    private drawLineToPositionOnDrag(puzzleView: PuzzleView,) {
        if (this._debugGraphics == null) {
            return;
        }

        const { x, y } = puzzleView.MainSprite;
        const { x: targetX, y: targetY } = puzzleView.TargetPosition;

        const line: Phaser.Geom.Line = new Phaser.Geom.Line(x, y, targetX, targetY);

        this._debugGraphics.clear();
        this._debugGraphics.strokeLineShape(line);
    }
}