import Phaser from "phaser";

import birdImage from "../assets/targets/bird.png";
import nightCityImage from "../assets/targets/night_city.png";

import itemOverSound from "../assets/sounds/menu_item_over.wav";
import itemClickSound from "../assets/sounds/menu_item_select.wav";

import Config from "../configs/config";
import MenuConfig from "../configs/menu_config";
import SoundFx from "../fx/sound_fx";

import Image = Phaser.GameObjects.Image;
import Point = Phaser.Geom.Point;

export default class Gallery extends Phaser.Scene {
    private readonly _targets: string[] = ['bird', 'night_city'];

    private _soundFx: SoundFx;

    constructor() {
        super({
            key: 'gallery'
        });

        this.startGame = this.startGame.bind(this);
    }

    private preload(): void {
        this.load.image('bird', birdImage);
        this.load.image('night_city', nightCityImage);

        this.load.audio('menu_item_over', itemOverSound);
        this.load.audio('menu_item_click', itemClickSound);
    }

    private create(): void {
        this._soundFx = new SoundFx(this.sound);

        this.createGallery();
    }

    private createGallery(): void {
        const grid: Point[] = this.constructGalleryGrid(1, 2);

        for (let i = 0; i < this._targets.length; ++i) {
            this.constructTarget(this._targets[i], grid[i]);
        }
    }

    private constructTarget(name: string, position: Point): Image {
        const targetButton: Image = this.add.image(position.x, position.y, name);
        targetButton.setScale(MenuConfig.Gallery.TargetScale.Normal);

        targetButton.setInteractive(MenuConfig.InputSettings);
        targetButton.on('pointerover', () => this.onTargetOver(targetButton));
        targetButton.on('pointerout', () => targetButton.setScale(MenuConfig.Gallery.TargetScale.Normal));
        targetButton.on('pointerdown', () => this.startGame(name));

        return targetButton;
    }

    private onTargetOver(button: Image): void {
        this._soundFx.onMenuItemOver();

        button.setScale(MenuConfig.Gallery.TargetScale.Over);
    }

    private startGame(targetName: string): void {
        this._soundFx.onMenuItemClick();

        this.scene.start('game', { target: targetName });
    }

    private constructGalleryGrid(rowsNumber: number, columnsNumber: number): Point[] {
        const viewportSize: { width: number, height: number } = Config.getViewportSize();

        const verticalInterval: number = viewportSize.height / (rowsNumber + 1);
        const horizontalInterval: number = viewportSize.width / (columnsNumber + 1);

        const gridPoints: Point[] = [];
        for (let i = 0; i < rowsNumber; ++i) {
            for (let j = 0; j < columnsNumber; ++j) {
                const x: number = (j + 1) * horizontalInterval;
                const y: number = (i + 1) * verticalInterval;

                const point: Point = new Point(x, y);
                gridPoints.push(point);
            }
        }

        return gridPoints;
    }
}