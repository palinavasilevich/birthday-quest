import Phaser from "phaser";
import { WORLD } from "./constants";

export function createGameConfig(
  parent: HTMLElement,
  scene: Phaser.Scene,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#12131a",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WORLD.width,
      height: WORLD.height,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [scene],
  };
}
