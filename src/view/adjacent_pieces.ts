export default class PieceAdjacements {
    public Left: boolean;
    public Top: boolean;
    public Right: boolean;
    public Bottom: boolean;

    public constructor(left: boolean, top: boolean, right: boolean, bottom: boolean) {
        this.Left = left;
        this.Top = top;
        this.Right = right;
        this.Bottom = bottom;
    }

    public static Alone(): PieceAdjacements
    {
        return new PieceAdjacements(false, false, false, false);
    }
}