import Config from "../configs/config";

export default class SoundFx {
    private readonly _soundManager: Phaser.Sound.BaseSoundManager;

    private readonly _clickSound: Phaser.Sound.BaseSound;
    private readonly _fittedClickSound: Phaser.Sound.BaseSound;

    public constructor(newSoundManager: Phaser.Sound.BaseSoundManager) {
        this._soundManager = newSoundManager;

        this._clickSound = this._soundManager.add('click');
        this._fittedClickSound = this._soundManager.add('fitted_click');

        this.setMute();
    }

    public onPuzzleDrag(): void {
        this._clickSound.play();
    }

    public onPuzzleDragEnd(success: boolean): void {
        if (success) {
            this._fittedClickSound.play();
            return;
        }

        this._clickSound.play();
    }

    public setMute(): void {
        this._soundManager.mute = !Config.Sound.enabled;
    }
}