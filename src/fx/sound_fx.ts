import Config from "../configs/config";

import BaseSoundManager = Phaser.Sound.BaseSoundManager;
import BaseSound = Phaser.Sound.BaseSound;

export default class SoundFx {
    private readonly _soundManager: BaseSoundManager;

    private _clickSound: BaseSound;
    private _fittedClickSound: BaseSound;

    private _menuItemOverSound: BaseSound;
    private _menuItemClick: BaseSound;

    public constructor(newSoundManager: BaseSoundManager) {
        this._soundManager = newSoundManager;

        this.setMute();
    }

    public onPuzzleDrag(): void {
        this.getClickSound().play();
    }

    public onPuzzleDragEnd(success: boolean): void {
        if (success) {
            this.getFittedClickSound().play();
            return;
        }

        this.getClickSound().play();
    }

    public onMenuItemOver(): void {
        this.getMenuItemOverSound().play();
    }

    public onMenuItemClick(): void {
        this.getMenuItemClickSound().play();
    }

    public setMute(): void {
        this._soundManager.mute = !Config.Sound.enabled;
    }

    private getClickSound(): BaseSound {
        if (!this._clickSound) {
            this._clickSound = this._soundManager.add('click');
        }

        return this._clickSound;
    }
    private getFittedClickSound(): BaseSound {
        if (!this._fittedClickSound) {
            this._fittedClickSound = this._soundManager.add('fitted_click');
        }

        return this._fittedClickSound;
    }

    private getMenuItemOverSound(): BaseSound {
        if (!this._menuItemOverSound) {
            this._menuItemOverSound = this._soundManager.add('menu_item_over');
        }

        return this._menuItemOverSound;
    }
    private getMenuItemClickSound(): BaseSound {
        if (!this._menuItemClick) {
            this._menuItemClick = this._soundManager.add('menu_item_click');
        }

        return this._menuItemClick;
    }
}