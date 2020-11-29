import Phaser from "phaser";

import buttonAtlas from "../assets/ui/ui_buttons.png";

import itemOverSound from "../assets/sounds/menu_item_over.wav";
import itemClickSound from "../assets/sounds/menu_item_select.wav";

import Config from "../configs/config";
import MenuConfig from "../configs/menu_config";
import SoundFx from "../fx/sound_fx";

import Image = Phaser.GameObjects.Image;
import FrameConfig = Phaser.Types.Loader.FileTypes.ImageFrameConfig;
import Container = Phaser.GameObjects.Container;

export default class Menu extends Phaser.Scene {
    private _soundFx: SoundFx;

    constructor() {
        super({
            key: 'ui'
        });

        this.startGame = this.startGame.bind(this);
    }

    private preload(): void {
        const frameConfig: FrameConfig = {
            frameWidth: MenuConfig.ButtonSpritesheet.Widh,
            frameHeight: MenuConfig.ButtonSpritesheet.Height,
            endFrame: MenuConfig.ButtonSpritesheet.FramesNumber - 1
        }

        this.load.spritesheet('buttons', buttonAtlas, frameConfig);

        this.load.audio('menu_item_over', itemOverSound);
        this.load.audio('menu_item_click', itemClickSound);
    }

    private create(): void {
        this._soundFx = new SoundFx(this.sound);

        this.createMenu();
    }

    private createMenu(): void {
        const menuContainer: Container = this.constructMenuContainer();

        const gameStartButton: Image = this.constructStartGameButton();
        const topButton: Image = this.constructTopButton();
        const editorButton: Image = this.constructEditorButton();

        menuContainer.add(gameStartButton);
        menuContainer.add(topButton);
        menuContainer.add(editorButton);
    }

    private startGame(): void {
        this.scene.transition({ target: 'gallery', duration: 100 });
    }

    private getButtonOffsetFromTop(index: number): number {
        return index * (MenuConfig.ButtonSpritesheet.Height + MenuConfig.ButtonLayout.Offset);
    }

    private constructMenuContainer(): Container {
        const viewportSize: { width: number, height: number } = Config.getViewportSize();
        const container = this.add.container();

        container.setPosition(viewportSize.width * MenuConfig.Position.RatioFromWidth,
            viewportSize.height * MenuConfig.Position.RatioFromHeight);

        return container;
    }

    private constructStartGameButton(): Image {
        const startButton: Image = this.add.image(0, this.getButtonOffsetFromTop(0), 'buttons', 0);

        startButton.setInteractive(MenuConfig.InputSettings);
        startButton.on('pointerover', () => this.onItemOver(startButton, 1));
        startButton.on('pointerout', () => startButton.setFrame(0));
        startButton.on('pointerdown', () => this.onItemClick(this.startGame));

        return startButton;
    }

    private constructTopButton(): Image {
        const topButton: Image = this.add.image(0, this.getButtonOffsetFromTop(1), 'buttons', 2);

        topButton.setInteractive(MenuConfig.InputSettings);
        topButton.on('pointerover', () => this.onItemOver(topButton, 3));
        topButton.on('pointerout', () => topButton.setFrame(2));

        return topButton;
    }

    private constructEditorButton(): Image {
        const editorButton: Image = this.add.image(0, this.getButtonOffsetFromTop(2), 'buttons', 4);

        editorButton.setInteractive(MenuConfig.InputSettings);
        editorButton.on('pointerover', () => this.onItemOver(editorButton, 5));
        editorButton.on('pointerout', () => editorButton.setFrame(4));

        return editorButton;
    }

    private onItemOver(button: Image, frameIndex: number): void {
        button.setFrame(frameIndex);

        this._soundFx.onMenuItemOver();
    }

    private onItemClick(action): void {
        this._soundFx.onMenuItemClick();
        action();
    }
}