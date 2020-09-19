export default class SoundFx {
    private readonly _soundManager: Phaser.Sound.BaseSoundManager;

    private readonly _clickSound: Phaser.Sound.BaseSound;

    public constructor(newSoundManager: Phaser.Sound.BaseSoundManager) {
        this._soundManager = newSoundManager;

        this._clickSound = this._soundManager.add('click');
    }

    public onPuzzleDrag(details: string): void { 
        this._clickSound.play();
    }
}