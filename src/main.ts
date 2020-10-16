import Phaser from "phaser";

import targetImage from "./assets/target.png";
import fieldShadowImage from "./assets/field_shadow.png";
import patternsAtlasSourceImage from "./assets/patterns_atlas.png";
import backgroundImage from "./assets/background.jpg";

import clickSound from "./assets/sound/click.wav";

import PuzzleConnections from "./grid/puzzle_connections";
import PuzzleGridMaker from "./grid/grid_maker";
import Puzzle from "./contracts/puzzle";
import PuzzleTextureMaker from "./view/puzzle_texture_maker";
import Config from "./config";
import PuzzleViewMaker from "./view/puzzle_view_maker";
import GameGrid from "./grid/game_grid";
import SoundFx from './fx/sound_fx';
import PuzzleView from "./contracts/puzzle_view";
import PuzzleDragDetails from "./contracts/events/puzzle_drag_details";
import PuzzlePiece from "./contracts/puzzle_piece";
import PuzzleMaker from "./view/puzzle_maker";

import Point = Phaser.Geom.Point;

export default class Main extends Phaser.Scene {

  private readonly _puzzles: Puzzle[] = [];

  private _puzzleMaker: PuzzleMaker;
  private _soundFx: SoundFx;

  public constructor(config) {
    super(config);

    this.runGame = this.runGame.bind(this);
    this.onPuzzleDrag = this.onPuzzleDrag.bind(this);
  }

  private preload() {
    this.load.image("target", targetImage);
    this.load.image("background", backgroundImage);
    this.load.image("patterns_atlas", patternsAtlasSourceImage);
    this.load.image("field_shadow", fieldShadowImage);

    this.load.audio('click', clickSound);
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

  private constructPuzzlePieces(grid: GameGrid, offsetToCenter: Point): PuzzlePiece[] {
    const pieces: PuzzlePiece[] = [];

    let id: number = 0;
    for (let i = 0; i < grid.Height; ++i) {
      for (let j = 0; j < grid.Width; ++j) {

        const targetImagePosition: Point = new Point((j + 0.5) * Config.InnerQuadSize, (i + 0.5) * Config.InnerQuadSize);
        const fieldPosition = new Point(targetImagePosition.x + offsetToCenter.x, targetImagePosition.y + offsetToCenter.y);

        const piece: PuzzlePiece = new PuzzlePiece(id++, targetImagePosition, fieldPosition, grid.Connections[i][j]);
        pieces.push(piece);
      }
    }

    for (let piece of pieces) {
      const adjecentIds = [
        piece.Id - 1,
        piece.Id + 1,
        piece.Id - grid.Width,
        piece.Id + grid.Width
      ]

      const adjecentPieces: PuzzlePiece[] = adjecentIds.filter(id => id >= 0 && id < pieces.length)
        .map(id => pieces[id]);

      piece.addAdjacentPieces(adjecentPieces);
    }

    return pieces;
  }

  private showFieldShadow(position: Point, targetImageHtmlImage: HTMLImageElement): void {
    const background: Phaser.GameObjects.Image = this.add.image(0, 0, 'field_shadow')
      .setOrigin(0, 0)
      .setPosition(position.x, position.y)
      .setScale(targetImageHtmlImage.width, targetImageHtmlImage.height)
      .setTint(Config.FieldShadowTint)
      .setAlpha(Config.FieldShadowAlpha);
  }

  private getOffsetsToCenter(targetImageSize: { width: number, height: number }): Point {
    return new Point(
      (Config.CanvasWidth - targetImageSize.width) / 2,
      (Config.CanvasHeight - targetImageSize.height) / 2);
  }

  private onPuzzleDrag(puzzleView: PuzzleView, eventDetails: PuzzleDragDetails): void {
    if (eventDetails.Event == 'end') {
      this.onPuzzleDragEnd(puzzleView, eventDetails.Position);
    }

    this._soundFx.onPuzzleDrag(eventDetails.Event);
  }

  private onPuzzleDragEnd(puzzleView: PuzzleView, newPosition: Point): void {
    const puzzle: Puzzle = this._puzzles[puzzleView.PuzzleId];
    const distance: number = Phaser.Math.Distance.BetweenPoints(puzzle.TargetPosition, newPosition);

    if (distance < Config.MinDistanceToAutoPut) {
      puzzle.putOnTargetPosition();
    }
  }

  private getGrid(targetImage: HTMLImageElement): GameGrid {
    const widthOfGrid: number = targetImage.width / Config.InnerQuadSize;
    const heightOfGrid: number = targetImage.height / Config.InnerQuadSize;
    const puzzlesGrid: PuzzleConnections[][] = new PuzzleGridMaker().make(heightOfGrid, widthOfGrid);

    return {
      Width: widthOfGrid,
      Height: heightOfGrid,
      Connections: puzzlesGrid
    };
  }

  private runGame(patternsAtlas: HTMLImageElement, targetImage: HTMLImageElement) {
    const grid: GameGrid = this.getGrid(targetImage);
    const offsetToCenter: Point = this.getOffsetsToCenter(targetImage);

    this.showFieldShadow(offsetToCenter, targetImage);

    const pieces: PuzzlePiece[] = this.constructPuzzlePieces(grid, offsetToCenter);
    const puzzleTextureMaker: PuzzleTextureMaker = new PuzzleTextureMaker(this.textures, patternsAtlas, targetImage);
    this._puzzleMaker.constructOriginPuzzles(pieces, grid.Width, puzzleTextureMaker);
  }

  private create() {
    this._soundFx = new SoundFx(this.sound);

    const puzzleViewMaker = new PuzzleViewMaker(this.add, this.tweens, this.input);
    this._puzzleMaker = new PuzzleMaker(puzzleViewMaker);

    const background: Phaser.GameObjects.Image = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setAlpha(0.5);

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