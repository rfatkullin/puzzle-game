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
import Distance = Phaser.Math.Distance;
import GameState from "./contracts/game_state";

export default class Main extends Phaser.Scene {

  private _debugDrawer: DebugDrawer;
  private _puzzleViewMaker: PuzzleViewMaker;
  private _puzzleTextureMaker: PuzzleTextureMaker;
  private _puzzleMaker: PuzzleMaker;
  private _soundFx: SoundFx;

  private _fieldStartPosition: Point;

  private _gameState: GameState;

  public constructor(config) {
    super(config);

    this.runGame = this.runGame.bind(this);
    this.onPuzzleDrag = this.onPuzzleDrag.bind(this);

    this._gameState = new GameState();
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
      .setAlpha(Config.FieldShadowAlpha)
      .setDepth(Config.Depths.Field);
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
    const puzzle: Puzzle = this._gameState.Puzzles.find(puzzle => puzzle.Id == puzzleView.PuzzleId);
    const distanceToTargetPosition: number = Distance.BetweenPoints(puzzle.TargetPosition, newPosition);

    if (distanceToTargetPosition < Config.MinDistanceToAutoPut) {
      const adjacentPuzzles: Puzzle[] = this.findAllAdjacentPuzzlesOnTargetPosition(puzzle);
      if (adjacentPuzzles.length > 0) {
        adjacentPuzzles.push(puzzle);
        const mergedPuzzle: Puzzle = this.mergePuzzles(adjacentPuzzles);
        mergedPuzzle.putOnTargetPosition();
      }
      else {
        puzzle.putOnTargetPosition();
      }
    }
    else {
      const { distance, puzzle: closestPuzzle } = this.findClosestPuzzle(puzzle);
      if (distance < Config.MinDistanceToAutoPut) {
        const closestPuzzlePosition: Point = closestPuzzle.View.getPosition();
        const closestPuzzleTargetPosition: Point = closestPuzzle.TargetPosition;

        const mergedPuzzle: Puzzle = this.mergePuzzles([puzzle, closestPuzzle]);

        const positionShift: Point = new Point(
          closestPuzzleTargetPosition.x - mergedPuzzle.TargetPosition.x,
          closestPuzzleTargetPosition.y - mergedPuzzle.TargetPosition.y);
        const newPosition: Point = new Point(
          closestPuzzlePosition.x - positionShift.x,
          closestPuzzlePosition.y - positionShift.y
        );

        mergedPuzzle.View.setPosition(newPosition);
      }
    }
  }

  private mergePuzzles(puzzles: Puzzle[]): Puzzle {
    const mergedPuzzle: Puzzle = this._puzzleMaker.mergePuzzles(puzzles);

    const newPuzzles: Puzzle[] = this._gameState.Puzzles.filter(p => puzzles.findIndex(puzzle => puzzle.Id === p.Id) < 0);
    newPuzzles.push(mergedPuzzle);

    this._gameState.setPuzzles(newPuzzles);

    puzzles.forEach(puzzle => puzzle.destroy());

    return mergedPuzzle;
  }

  private findAllAdjacentPuzzlesOnTargetPosition(puzzle: Puzzle): Puzzle[] {
    const puzzlesSet: Set<number> = new Set<number>();

    const adjacentPuzzles: Puzzle[] = puzzle.Pieces.flatMap(piece => {
      const piecePuzzles: Puzzle[] = []
      if (piece.Left && !puzzlesSet.has(piece.Left.Parent.Id)) {
        piecePuzzles.push(piece.Left.Parent);
        puzzlesSet.add(piece.Left.Parent.Id);
      }
      if (piece.Top && !puzzlesSet.has(piece.Top.Parent.Id)) {
        piecePuzzles.push(piece.Top.Parent);
        puzzlesSet.add(piece.Top.Parent.Id);
      }
      if (piece.Right && !puzzlesSet.has(piece.Right.Parent.Id)) {
        piecePuzzles.push(piece.Right.Parent);
        puzzlesSet.add(piece.Right.Parent.Id);
      }
      if (piece.Bottom && !puzzlesSet.has(piece.Bottom.Parent.Id)) {
        piecePuzzles.push(piece.Bottom.Parent);
        puzzlesSet.add(piece.Bottom.Parent.Id);
      }

      return piecePuzzles;
    });

    return adjacentPuzzles.filter(puzzle => puzzle && puzzle.IsOnTargetPosition);
  }

  private findClosestPuzzle(puzzle: Puzzle): { distance: number, puzzle: Puzzle } {
    const piecesIds: number[] = puzzle.Pieces.map(piece => piece.Id);
    const candidates: { distance: number, puzzle: Puzzle }[] = [];

    for (let piece of puzzle.Pieces) {
      if (piece.Left && piecesIds.indexOf(piece.Left.Id) < 0) {
        candidates.push({
          distance: Distance.BetweenPoints(piece.getLeftLockPosition(), piece.Left.getRightLockPosition()),
          puzzle: piece.Left.Parent
        })
      }

      if (piece.Top && piecesIds.indexOf(piece.Top.Id) < 0) {
        candidates.push({
          distance: Distance.BetweenPoints(piece.getTopLockPosition(), piece.Top.getBottomLockPosition()),
          puzzle: piece.Top.Parent
        })
      }

      if (piece.Right && piecesIds.indexOf(piece.Right.Id) < 0) {
        candidates.push({
          distance: Distance.BetweenPoints(piece.getRightLockPosition(), piece.Right.getLeftLockPosition()),
          puzzle: piece.Right.Parent
        })
      }

      if (piece.Bottom && piecesIds.indexOf(piece.Bottom.Id) < 0) {
        candidates.push({
          distance: Distance.BetweenPoints(piece.getBottomLockPosition(), piece.Bottom.getTopLockPosition()),
          puzzle: piece.Bottom.Parent
        })
      }
    }

    let closestCandidateIndex = 0;
    for (let i = 1; i < candidates.length; ++i) {
      if (candidates[i].distance < candidates[closestCandidateIndex].distance) {
        closestCandidateIndex = i;
      }
    }

    return candidates[closestCandidateIndex];
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

    const puzzles: Puzzle[] = this._puzzleMaker.constructPuzzlesForGameStart(gameField.Pieces, gameField.Width, this._fieldStartPosition);
    this._gameState.setPuzzles(puzzles);
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
      .setAlpha(0.5)
      .setDepth(Config.Depths.Background);

    this.loadImages(this.runGame);
  }

  private initSubsystems(): void {
    this._soundFx = new SoundFx(this.sound);

    this._debugDrawer = new DebugDrawer(this.add, this._gameState);

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