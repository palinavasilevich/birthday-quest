import Phaser from "phaser";

import { TEXTURES } from "./constants";

export function makeTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists(TEXTURES.knight)) return;

  const g = scene.add.graphics();

  // Knight
  g.clear();
  g.fillStyle(0x11162a, 1);
  g.fillCircle(17, 17, 13);
  g.fillStyle(0x35507f, 1);
  g.fillCircle(17, 17, 10.5);
  g.fillStyle(0x5c7cb8, 1);
  g.fillCircle(16, 17, 8);
  g.fillStyle(0xc9d6ea, 1);
  g.fillCircle(19, 17, 6);
  g.fillStyle(0x0b0f1a, 1);
  g.fillRect(21, 15, 5, 4);
  g.fillStyle(0xe8c27a, 1);
  g.fillCircle(17, 10, 2);
  g.generateTexture(TEXTURES.knight, 34, 34);

  // Sword
  g.clear();
  g.fillStyle(0x5b3d22, 1);
  g.fillRect(0, 3, 10, 4);
  g.fillStyle(0xe8c27a, 1);
  g.fillRect(9, 0, 4, 10);
  g.fillStyle(0xdde6f2, 1);
  g.fillRect(13, 3, 23, 4);
  g.fillStyle(0xffffff, 1);
  g.fillRect(13, 3, 23, 1);
  g.fillTriangle(36, 3, 36, 7, 41, 5);
  g.generateTexture(TEXTURES.sword, 42, 10);

  // Dragon
  g.clear();
  g.fillStyle(0x4d1424, 1);

  g.fillPoints(
    [
      new Phaser.Math.Vector2(76, 62),
      new Phaser.Math.Vector2(18, 2),
      new Phaser.Math.Vector2(124, 26),
    ],
    true,
  );

  g.fillPoints(
    [
      new Phaser.Math.Vector2(76, 88),
      new Phaser.Math.Vector2(18, 148),
      new Phaser.Math.Vector2(124, 124),
    ],
    true,
  );

  g.fillStyle(0x6b1b2c, 1);

  g.fillPoints(
    [
      new Phaser.Math.Vector2(84, 60),
      new Phaser.Math.Vector2(34, 16),
      new Phaser.Math.Vector2(118, 36),
    ],
    true,
  );

  g.fillPoints(
    [
      new Phaser.Math.Vector2(84, 90),
      new Phaser.Math.Vector2(34, 134),
      new Phaser.Math.Vector2(118, 114),
    ],
    true,
  );

  g.fillStyle(0x7d2030, 1);

  g.fillPoints(
    [
      new Phaser.Math.Vector2(46, 66),
      new Phaser.Math.Vector2(0, 58),
      new Phaser.Math.Vector2(46, 84),
    ],
    true,
  );

  g.fillEllipse(96, 75, 122, 68);

  g.fillStyle(0xa82a34, 1);
  g.fillEllipse(100, 75, 100, 48);

  g.fillStyle(0xc94b3e, 1);
  g.fillEllipse(104, 75, 74, 28);

  g.fillStyle(0x7d2030, 1);
  g.fillEllipse(152, 75, 66, 42);

  g.fillStyle(0xa82a34, 1);
  g.fillEllipse(174, 75, 54, 34);

  g.fillStyle(0xe8d9b0, 1);

  g.fillPoints(
    [
      new Phaser.Math.Vector2(162, 60),
      new Phaser.Math.Vector2(148, 38),
      new Phaser.Math.Vector2(170, 55),
    ],
    true,
  );

  g.fillPoints(
    [
      new Phaser.Math.Vector2(162, 90),
      new Phaser.Math.Vector2(148, 112),
      new Phaser.Math.Vector2(170, 95),
    ],
    true,
  );

  g.fillStyle(0x5d1722, 1);
  g.fillEllipse(193, 80, 34, 18);

  g.fillStyle(0xffd34d, 1);
  g.fillCircle(182, 66, 5);
  g.fillCircle(182, 86, 5);

  g.fillStyle(0x12131a, 1);
  g.fillCircle(184, 66, 2.4);
  g.fillCircle(184, 86, 2.4);

  g.generateTexture(TEXTURES.dragon, 212, 150);

  // Owlbear
  g.clear();
  g.fillStyle(0x241b17, 1);
  g.fillCircle(30, 34, 22);
  g.fillStyle(0x6b4631, 1);
  g.fillCircle(30, 35, 19);
  g.fillStyle(0x8b6045, 1);
  g.fillCircle(22, 30, 9);
  g.fillCircle(38, 30, 9);
  g.fillStyle(0x4a3025, 1);
  g.fillCircle(18, 17, 7);
  g.fillCircle(42, 17, 7);
  g.fillStyle(0xe8d9b0, 1);
  g.fillCircle(24, 31, 3);
  g.fillCircle(36, 31, 3);
  g.fillStyle(0x171218, 1);
  g.fillCircle(24, 31, 1.5);
  g.fillCircle(36, 31, 1.5);
  g.fillStyle(0xd9b36c, 1);
  g.fillTriangle(30, 34, 25, 40, 35, 40);
  g.fillStyle(0x3a2922, 1);
  g.fillEllipse(30, 47, 31, 14);
  g.generateTexture(TEXTURES.owlbear, 60, 60);

  // Fireball
  g.clear();
  g.fillStyle(0xff5a1f, 0.3);
  g.fillCircle(13, 13, 13);
  g.fillStyle(0xff7a2a, 0.9);
  g.fillCircle(13, 13, 9);
  g.fillStyle(0xffc24d, 1);
  g.fillCircle(13, 13, 5.5);
  g.fillStyle(0xfff6d8, 1);
  g.fillCircle(13, 13, 2.6);
  g.generateTexture(TEXTURES.fire, 26, 26);

  // Spark
  g.clear();
  g.fillStyle(0xffffff, 1);
  g.fillCircle(4, 4, 4);
  g.generateTexture(TEXTURES.spark, 8, 8);

  // Fire pool
  g.clear();
  g.fillStyle(0xff4d1a, 0.22);
  g.fillCircle(46, 46, 46);
  g.fillStyle(0xff6b26, 0.32);
  g.fillCircle(46, 46, 34);
  g.fillStyle(0xffa63d, 0.4);
  g.fillCircle(46, 46, 20);
  g.generateTexture(TEXTURES.pool, 92, 92);

  g.destroy();
}
