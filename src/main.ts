import Game from "./scenes/game";
import Config from "./configs/config";
import Menu from "./scenes/menu";

function startScene() {
  const viewportSize = Config.getViewportSize();

  Config.CanvasWidth = viewportSize.width - 20;
  Config.CanvasHeight = viewportSize.height - 20;

  const config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: Config.CanvasWidth,
    height: Config.CanvasHeight,
    scene: [Menu, Game],
    transparent: true,
    scale: {
      mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
       width: Config.CanvasWidth,
       height: Config.CanvasHeight
    }
  };

  new Phaser.Game(config);
}

startScene();