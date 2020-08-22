import { EConnection } from "./connection";

export default class PuzzleConnections {
    public TopConnection: EConnection = EConnection.None;
    public RightConnection: EConnection = EConnection.None;
    public BottomConnection: EConnection = EConnection.None;
    public LeftConnection: EConnection = EConnection.None;
}