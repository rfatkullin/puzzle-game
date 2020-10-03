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
import Point from "./contracts/point";
import GamePuzzleMaker from "./view/game_puzzle_maker";
import GameGrid from "./grid/game_grid";
import SoundFx from './fx/sound_fx';
import PuzzleView from "./contracts/puzzle_view";
import PuzzleDragDetails from "./contracts/events/puzzle_drag_details";

export default class Main extends Phaser.Scene {

  private readonly _puzzles: Puzzle[] = [];
  private _soundFx: SoundFx;

  public constructor(config)
  {
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

  private constructPuzzlePieces(patternsAtlasHtmlImage: HTMLImageElement, targetImageHtmlImage: HTMLImageElement): Puzzle[] {
    const puzzleViewMaker: PuzzleTextureMaker = new PuzzleTextureMaker(this.textures, patternsAtlasHtmlImage, targetImageHtmlImage);
    const gamePuzzleMaker: GamePuzzleMaker = new GamePuzzleMaker(this.add, this.tweens, this.input);
    const grid: GameGrid = this.getGrid(targetImageHtmlImage);
    const offsetToCenter: Point = this.getOffsetsToCenter(targetImageHtmlImage);

    this.showFieldShadow(offsetToCenter, targetImageHtmlImage);

    let currentPuzzleId: number = 0;

    for (let i = 0; i < grid.Height; ++i) {
      for (let j = 0; j < grid.Width; ++j) {
        const puzzleId = currentPuzzleId++;
        const positionOnTarget: Point = new Point((j + 0.5) * Config.InnerQuadSize, (i + 0.5) * Config.InnerQuadSize);
        const puzzleTexture = puzzleViewMaker.generateTextureForPuzzle(puzzleId, positionOnTarget, grid.Connections[i][j])

        const positionOnCanvas: Point = new Point(positionOnTarget.x + offsetToCenter.x, positionOnTarget.y + offsetToCenter.y);
        const view: PuzzleView = gamePuzzleMaker.constructGamePuzzle(puzzleId, positionOnCanvas, puzzleTexture, true);

        view.onDrag.subscribe(this.onPuzzleDrag);
        
        const puzzle: Puzzle = new Puzzle(puzzleId, grid.Connections[i][j], positionOnCanvas, view);
        this._puzzles.push(puzzle);
      }
    }

    return this._puzzles;
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
    return {
      x: (Config.CanvasWidth - targetImageSize.width) / 2,
      y: (Config.CanvasHeight - targetImageSize.height) / 2,
    }
  }

  private onPuzzleDrag(puzzleView: PuzzleView, eventDetails: PuzzleDragDetails): void {
    if (eventDetails.Event == 'end')
    {
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
    this._soundFx = new SoundFx(this.sound);

    this.constructPuzzlePieces(patternsAtlas, targetImage);
  }

  private create() {
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