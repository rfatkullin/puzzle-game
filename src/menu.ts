import Config from "./config";

import Image = Phaser.GameObjects.Image;

export default class Menu {
    private readonly _factory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;

    public constructor(factory: Phaser.GameObjects.GameObjectFactory, tweensManager: Phaser.Tweens.TweenManager) {
        this._factory = factory;
        this._tweensManager = tweensManager;
    }

    public show() {
        const showButton: Image = this._factory.image(Config.CanvasWidth - 80, 30, 'showButton')
            .setScale(Config.Scales.Menu.ShowButton)
            .setDepth(Config.Depths.Menu)
            .setName("showButton");

        const helpButton: Image = this._factory.image(Config.CanvasWidth - 30, 30, 'helpButton')
            .setScale(Config.Scales.Menu.HelpButton)
            .setDepth(Config.Depths.Menu)
            .setName("helpButton");

        const miniImage: Image = this._factory.image(0, 0, 'target')
            .setOrigin(1.0, 0.0)
            .setPosition(showButton.x - 50, showButton.y)
            .setScale(Config.Scales.MiniTarget)
            .setDepth(Config.Depths.Menu)
            .setVisible(false);

        const inputSettings = {
            pixelPerfect: true,
            alphaTolerance: 0
        }

        showButton.setInteractive(inputSettings);
        helpButton.setInteractive(inputSettings);

        showButton.on('pointerover', () => this.startScaleOutTween(showButton,
            Config.Scales.Menu.ShowButton,
            Config.Scales.Menu.ShowButtonAnimated));
        showButton.on('pointerout', () => this.startScaleInTween(showButton, Config.Scales.Menu.ShowButton));
        showButton.on('pointerdown', () => {
            miniImage.setVisible(true);
        })
        showButton.on('pointerup', () => {
            miniImage.setVisible(false);
        })

        helpButton.on('pointerover', () => this.startScaleOutTween(helpButton,
            Config.Scales.Menu.HelpButton,
            Config.Scales.Menu.HelpButtonAnimated));
        helpButton.on('pointerout', () => this.startScaleInTween(helpButton, Config.Scales.Menu.HelpButton));
        helpButton.on('pointerdown', () => {
            Config.DebugDrawing.enabled = !Config.DebugDrawing.enabled;
            this.setHelpButtonTint(helpButton);
        })

        this.setHelpButtonTint(helpButton);
    }

    private setHelpButtonTint(button: Image): void {
        button.setTint(Config.DebugDrawing.enabled ? 0xFFFFFF : Config.Tints.Menu.HelpButton);
    }

    private startScaleOutTween(sprite: Image, startScale: number, endScale: number): void {
        this._tweensManager.add({
            targets: sprite,
            scale: { from: startScale, to: endScale },
            ease: Config.PuzzleScalingOutAnimzationEase,
            duration: 200
        });
    }

    private startScaleInTween(sprite: Image, endScale: number): void {
        this._tweensManager.add({
            targets: sprite,
            scale: { from: sprite.scale, to: endScale },
            ease: Config.PuzzleScalingInAnimzationEase,
            duration: 200
        });
    }
}