import Phaser from "phaser";
import buttonAtlas from "../assets/ui/ui_buttons.png";
import Config from "../configs/config";
import MenuConfig from "../configs/menu_config";

import Image = Phaser.GameObjects.Image;
import FrameConfig = Phaser.Types.Loader.FileTypes.ImageFrameConfig;
import Container = Phaser.GameObjects.Container;

export default class Menu extends Phaser.Scene {
    private readonly InputSettings = {
        pixelPerfect: true,
        alphaTolerance: 0
    };

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
    }

    private create(): void {
        const menuContainer: Container = this.constructMenuContainer();

        const gameStartButton: Image = this.constructStartGameButton();
        const topButton: Image = this.constructTopButton();
        const editorButton: Image = this.constructEditorButton();

        menuContainer.add(gameStartButton);
        menuContainer.add(topButton);
        menuContainer.add(editorButton);
    }

    private startGame(): void {
        this.scene.transition({ target: 'game', duration: 100 });
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
        const gameStartButton: Image = this.add.image(0, this.getButtonOffsetFromTop(0), 'buttons', 0);

        gameStartButton.setInteractive(this.InputSettings);
        gameStartButton.on('pointerover', () => gameStartButton.setFrame(1));
        gameStartButton.on('pointerout', () => gameStartButton.setFrame(0));
        gameStartButton.on('pointerdown', this.startGame);

        return gameStartButton;
    }

    private constructTopButton(): Image {
        const topButton: Image = this.add.image(0, this.getButtonOffsetFromTop(1), 'buttons', 2);

        topButton.setInteractive(this.InputSettings);
        topButton.on('pointerover', () => topButton.setFrame(3));
        topButton.on('pointerout', () => topButton.setFrame(2));

        return topButton;
    }

    private constructEditorButton(): Image {
        const editorButton: Image = this.add.image(0, this.getButtonOffsetFromTop(2), 'buttons', 4);

        editorButton.setInteractive(this.InputSettings);
        editorButton.on('pointerover', () => editorButton.setFrame(5));
        editorButton.on('pointerout', () => editorButton.setFrame(4));

        return editorButton;
    }
}