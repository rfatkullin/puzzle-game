import Config from "../configs/config";
import SoundFx from "../fx/sound_fx";

import Image = Phaser.GameObjects.Image;
import Point = Phaser.Geom.Point;

export default class Menu {
    private readonly _factory: Phaser.GameObjects.GameObjectFactory;
    private readonly _tweensManager: Phaser.Tweens.TweenManager;
    private readonly _soundFx: SoundFx;

    public constructor(factory: Phaser.GameObjects.GameObjectFactory,
        tweensManager: Phaser.Tweens.TweenManager,
        soundFx: SoundFx) {
        this._factory = factory;
        this._tweensManager = tweensManager;
        this._soundFx = soundFx;
    }

    public show() {
        const soundButton: Image = this._factory.image(Config.CanvasWidth - 30, 30, 'soundButton')
            .setScale(Config.Scales.Menu.SoundButton)
            .setDepth(Config.Depths.Menu);

        const helpButton: Image = this._factory.image(Config.CanvasWidth - 80, 30, 'helpButton')
            .setScale(Config.Scales.Menu.HelpButton)
            .setDepth(Config.Depths.Menu);

        const showButton: Image = this._factory.image(Config.CanvasWidth - 130, 30, 'showButton')
            .setScale(Config.Scales.Menu.ShowButton)
            .setDepth(Config.Depths.Menu);

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

        soundButton.setInteractive(inputSettings);
        helpButton.setInteractive(inputSettings);
        showButton.setInteractive(inputSettings);

        soundButton.on('pointerover', () => this.startScaleOutTween(soundButton,
            Config.Scales.Menu.SoundButton,
            Config.Scales.Menu.SoundButtonAnimated));
        soundButton.on('pointerout', () => this.startScaleInTween(soundButton, Config.Scales.Menu.SoundButton));
        soundButton.on('pointerdown', () => {
            Config.Sound.enabled = !Config.Sound.enabled;
            this.setSoundButtonTint(soundButton);
            this._soundFx.setMute();
        });
        this.setSoundButtonTint(soundButton);

        helpButton.on('pointerover', () => this.startScaleOutTween(helpButton,
            Config.Scales.Menu.HelpButton,
            Config.Scales.Menu.HelpButtonAnimated));
        helpButton.on('pointerout', () => this.startScaleInTween(helpButton, Config.Scales.Menu.HelpButton));
        helpButton.on('pointerdown', () => {
            Config.Debug.enabled = !Config.Debug.enabled;
            this.setHelpButtonTint(helpButton);
        });
        this.setHelpButtonTint(helpButton);

        showButton.on('pointerover', () => this.startScaleOutTween(showButton,
            Config.Scales.Menu.ShowButton,
            Config.Scales.Menu.ShowButtonAnimated));
        showButton.on('pointerout', () => this.startScaleInTween(showButton, Config.Scales.Menu.ShowButton));
        showButton.on('pointerdown', () => {
            miniImage.setVisible(true);
        });
        showButton.on('pointerup', () => {
            miniImage.setVisible(false);
        });
    }

    public showCongrats(): void {
        const sparks: string[] = ["spark0", "spark1", "spark2", "spark3"];
        const positions: Point[] = [
            new Point(100, 100),
            new Point(Config.CanvasWidth - 100, 100),
            new Point(Config.CanvasWidth - 100, Config.CanvasHeight - 100),
            new Point(100, Config.CanvasHeight - 100),
        ]

        for (let i: number = 0; i < 4; ++i) {
            const particles = this._factory.particles(sparks[i]);
            particles.setDepth(100);

            const emitter = particles.createEmitter({
                x: positions[i].x,
                y: positions[i].y,
                speed: 200,
                angle: { min: 0, max: 360 },
                scale: { start: 1.0, end: 0 },
                blendMode: Phaser.BlendModes.SCREEN,
                lifespan: 2000,

            });
        }

        const text = this._factory.text(0, 0, "Bingo!", {
            fontFamily: 'Courier',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
            fontSize: '100px',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#000',
                blur: 0,
                stroke: false,
                fill: false
            },
        });

        text.setOrigin(0.5, 0.5);
        text.setPosition(Config.CanvasWidth / 2, Config.CanvasHeight / 2);
        text.setDepth(500);
    }

    private setHelpButtonTint(button: Image): void {
        button.setTint(Config.Debug.enabled ? 0xFFFFFF : Config.Tints.Menu.HelpButton);
    }

    private setSoundButtonTint(button: Image): void {
        button.setTint(Config.Sound.enabled ? 0xFFFFFF : Config.Tints.Menu.SoundButton);
    }

    private startScaleOutTween(sprite: Image, startScale: number, endScale: number): void {
        this._tweensManager.add({
            targets: sprite,
            scale: { from: startScale, to: endScale },
            ease: Config.Animation.Menu.MouseOverEase,
            duration: Config.Animation.Menu.MouseOverDuration
        });
    }

    private startScaleInTween(sprite: Image, endScale: number): void {
        this._tweensManager.add({
            targets: sprite,
            scale: { from: sprite.scale, to: endScale },
            ease: Config.Animation.Menu.MouseOverEase,
            duration: Config.Animation.Menu.MouseOverDuration
        });
    }
}