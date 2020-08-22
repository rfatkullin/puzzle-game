import Phaser from "phaser";
import targetImage from "./assets/car.png";
import patternsAtlasSourceImage from "./assets/patterns_atlas.png";
import backgroundImage from "./assets/background.jpg";
import PuzzleConnections from "./grid/puzzle_connections";
import PuzzleGridMaker from "./grid/grid_maker";
import Puzzle from "./contracts/puzzle";
import PuzzleViewMaker from "./view/puzzle_view_maker";
import Config from "./config";
import Point from "./contracts/point";

export default class Main extends Phaser.Scene {
  private preload() {
    this.load.image("target", targetImage);
    this.load.image("background", backgroundImage);
    this.load.image("patterns_atlas", patternsAtlasSourceImage);
  }

  private loadImages(callback: (maskImg: HTMLImageElement, backgroundImage: HTMLImageElement) => void) {
    const maskImg = new Image();

    maskImg.onload = () => {
      const backgroundImage = new Image();
      backgroundImage.onload = () => { callback(maskImg, backgroundImage); }
      backgroundImage.src = this.textures.getBase64('target');
    };

    maskImg.src = this.textures.getBase64('patterns_atlas');
  }

  private constructPuzzlePieces(patternsAtlas: HTMLImageElement, targetImage: HTMLImageElement): Puzzle[] {
    const puzzleViewMaker: PuzzleViewMaker = new PuzzleViewMaker(this.textures, patternsAtlas, targetImage);
    const gridMaker = new PuzzleGridMaker();

    const widthOfGrid: number = targetImage.width / Config.PuzzleTotalSize;
    const heightOfGrid: number = targetImage.height / Config.PuzzleTotalSize;

    const puzzlesGrid: PuzzleConnections[][] = gridMaker.make(heightOfGrid, widthOfGrid);

    const puzzles: Puzzle[] = [];
    let currentPuzzleId: number = 0;

    for (let i = 0; i < heightOfGrid; ++i) {
      for (let j = 0; j < widthOfGrid; ++j) {
        const puzzleId = currentPuzzleId++;
        const puzzlePositionOnTarget: Point = new Point((j + 0.5) * Config.InnerQuadSize, (i + 0.5) * Config.InnerQuadSize);
        const connections: PuzzleConnections = puzzlesGrid[i][j];

        const puzzle: Puzzle = {
          Id: puzzleId,
          Connections: connections,
          OnTargetPosition: puzzlePositionOnTarget,
          ViewTextureName: puzzleViewMaker.generateTextureForPuzzle(puzzleId, puzzlePositionOnTarget, connections)
        }

        puzzles.push(puzzle);
      }
    }

    return puzzles;
  }

  private runGame(patternsAtlas: HTMLImageElement, targetImage: HTMLImageElement) {
    const puzzles: Puzzle[] = this.constructPuzzlePieces(patternsAtlas, targetImage);

    for (let puzzle of puzzles) {
      const image: Phaser.GameObjects.Image = this.add.image(0, 0, puzzle.ViewTextureName);
      image.setOrigin(0.5, 0.5);
      image.setPosition(Math.random() * Config.CanvasWidth, Math.random() * Config.CanvasHeight);
    }
  }

  private create() {
    const background: Phaser.GameObjects.Image = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setAlpha(0.5);

    this.runGame = this.runGame.bind(this);
    this.loadImages(this.runGame);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: Config.CanvasWidth,
  height: Config.CanvasHeight,
  scene: [Main],
  transparent: true
};

const game = new Phaser.Game(config);