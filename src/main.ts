import Phaser from "phaser";

import targetImage from "./assets/target.png";
import fieldShadowImage from "./assets/field_shadow.png";
import patternsAtlasSourceImage from "./assets/patterns_atlas.png";
import backgroundImage from "./assets/background.jpg";

import clickSound from "./assets/sound/click.wav";

import PuzzleFieldMaker from "./field/game_field_maker";
import Puzzle from "./contracts/puzzle";
import PuzzleTextureMaker from "./view/puzzle_texture_maker";
import Config from "./config";
import PuzzleViewMaker from "./view/puzzle_view_maker";
import GameField from "./field/game_field";
import SoundFx from './fx/sound_fx';
import PuzzleView from "./contracts/puzzle_view";
import PuzzleDragDetails from "./contracts/events/puzzle_drag_details";
import PuzzlePieceOrigin from "./contracts/puzzle_piece_origin";
import PuzzleMaker from "./view/puzzle_maker";

import DebugDrawer from "./debug/debug_drawer";

import Point = Phaser.Geom.Point;

export default class Main extends Phaser.Scene {

  private _puzzles: Puzzle[] = [];

  private _debugDrawer: DebugDrawer;
  private _puzzleViewMaker;
  private _puzzleTextureMaker: PuzzleTextureMaker;
  private _puzzleMaker: PuzzleMaker;
  private _soundFx: SoundFx;

  private _fieldStartPosition: Point;

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

  private showFieldShadow(targetImageHtmlImage: HTMLImageElement): void {
    const { x, y } = this._fieldStartPosition;

    const background: Phaser.GameObjects.Image = this.add.image(0, 0, 'field_shadow')
      .setOrigin(0, 0)
      .setPosition(x, y)
      .setScale(targetImageHtmlImage.width, targetImageHtmlImage.height)
      .setTint(Config.FieldShadowTint)
      .setAlpha(Config.FieldShadowAlpha);
  }

  private onPuzzleDrag(puzzleView: PuzzleView, eventDetails: PuzzleDragDetails): void {
    switch (eventDetails.Event) {
      case 'end':
        this.onPuzzleDragEnd(puzzleView, eventDetails.Position);
        this._soundFx.onPuzzleDrag(eventDetails.Event);
        break;
      case 'start':
        this._soundFx.onPuzzleDrag(eventDetails.Event);
        break;
      default:
        break;
    }
  }

  private onPuzzleDragEnd(puzzleView: PuzzleView, newPosition: Point): void {
    const puzzle: Puzzle = this._puzzles.find(puzzle => puzzle.Id == puzzleView.PuzzleId);
    const distance: number = Phaser.Math.Distance.BetweenPoints(puzzle.TargetPosition, newPosition);

    if (distance < Config.MinDistanceToAutoPut) {
      puzzle.putOnTargetPosition();
    }
  }

  private getField(targetImage: HTMLImageElement): GameField {
    const widthOfGrid: number = targetImage.width / Config.InnerQuadSize;
    const heightOfGrid: number = targetImage.height / Config.InnerQuadSize;
    const puzzlesGrid: PuzzlePieceOrigin[] = new PuzzleFieldMaker().make(heightOfGrid, widthOfGrid);

    return {
      Width: widthOfGrid,
      Height: heightOfGrid,
      Pieces: puzzlesGrid
    };
  }

  private runGame(patternsAtlas: HTMLImageElement, targetImage: HTMLImageElement) {
    this.setFieldStartPosition(targetImage);
    this.showFieldShadow(targetImage);

    this._puzzleTextureMaker.setPatternsAndTarget(patternsAtlas, targetImage);

    const gameField: GameField = this.getField(targetImage);

    this._puzzles = this._puzzleMaker.constructPuzzlesForGameStart(gameField.Pieces, gameField.Width, this._fieldStartPosition);
  }

  private setFieldStartPosition({ width, height }: { width: number, height: number }): void {
    this._fieldStartPosition = new Point(
      (Config.CanvasWidth - width) / 2,
      (Config.CanvasHeight - height) / 2);
  }

  private create() {
    this.initSubsystems();

    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setAlpha(0.5);

    this.loadImages(this.runGame);
  }

  private initSubsystems(): void {
    this._soundFx = new SoundFx(this.sound);

    this._debugDrawer = new DebugDrawer(this.add);

    this._puzzleTextureMaker = new PuzzleTextureMaker(this.textures);

    this._puzzleViewMaker = new PuzzleViewMaker(this.add, this.tweens, this.input);
    this._puzzleViewMaker.DragEvent.subscribe(this.onPuzzleDrag)
    this._puzzleViewMaker.DragEvent.subscribe(this._debugDrawer.onDragPuzzle);

    this._puzzleMaker = new PuzzleMaker(this._puzzleViewMaker, this._puzzleTextureMaker);
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