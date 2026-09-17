import Phaser from "phaser";

import { TEXTURES } from "./constants";

const v = (x: number, y: number) => new Phaser.Math.Vector2(x, y);

export function makeTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists(TEXTURES.knight)) return;

  const g = scene.add.graphics();

  // ============================================================
  // HERO — маленький пиксельный рыцарь
  // ============================================================

  g.clear();

  // shadow
  g.fillStyle(0x070910, 0.55);
  g.fillEllipse(32, 60, 36, 9);

  // cape
  g.fillStyle(0x4d1727, 1);
  g.fillPoints([v(18, 30), v(8, 55), v(22, 50), v(28, 33)], true);

  g.fillStyle(0x8e2638, 1);
  g.fillPoints([v(19, 31), v(12, 50), v(23, 46), v(27, 32)], true);

  g.fillStyle(0xc43b4d, 1);
  g.fillPoints([v(18, 32), v(15, 44), v(20, 42)], true);

  // boots
  g.fillStyle(0x111722, 1);
  g.fillRect(22, 49, 9, 11);
  g.fillRect(35, 49, 9, 11);

  g.fillStyle(0x30394a, 1);
  g.fillRect(21, 48, 10, 5);
  g.fillRect(34, 48, 10, 5);

  // legs
  g.fillStyle(0x485365, 1);
  g.fillRect(23, 40, 8, 11);
  g.fillRect(35, 40, 8, 11);

  // body
  g.fillStyle(0x4e596a, 1);
  g.fillRect(18, 27, 27, 17);

  g.fillStyle(0x8291a3, 1);
  g.fillRect(21, 28, 20, 13);

  g.fillStyle(0xc4d0dc, 1);
  g.fillRect(23, 29, 4, 11);

  g.fillStyle(0x303948, 1);
  g.fillRect(27, 29, 4, 11);

  // belt
  g.fillStyle(0x765333, 1);
  g.fillRect(19, 40, 25, 4);

  g.fillStyle(0xe8c27a, 1);
  g.fillRect(29, 40, 5, 4);

  // shoulders
  g.fillStyle(0x667487, 1);
  g.fillCircle(18, 29, 6);
  g.fillCircle(45, 29, 6);

  g.fillStyle(0xaab8c7, 1);
  g.fillCircle(17, 28, 2);
  g.fillCircle(44, 28, 2);

  // helmet
  g.fillStyle(0x28303e, 1);
  g.fillCircle(31, 18, 15);

  g.fillStyle(0x667487, 1);
  g.fillCircle(31, 17, 12);

  g.fillStyle(0xaebdcb, 1);
  g.fillRect(24, 9, 11, 3);

  // red plume
  g.fillStyle(0x7d2032, 1);
  g.fillPoints([v(25, 8), v(31, 1), v(38, 9)], true);

  g.fillStyle(0xc43b4d, 1);
  g.fillPoints([v(29, 7), v(31, 3), v(34, 8)], true);

  // visor
  g.fillStyle(0x11151d, 1);
  g.fillRect(22, 17, 18, 9);

  g.fillStyle(0x8e9daf, 1);
  g.fillRect(23, 18, 16, 2);

  g.fillStyle(0x080b12, 1);
  g.fillRect(24, 21, 14, 4);

  // face under visor
  g.fillStyle(0xc58b68, 1);
  g.fillRect(27, 25, 9, 5);

  // shield
  g.fillStyle(0x243a62, 1);
  g.fillPoints(
    [v(16, 30), v(5, 33), v(7, 47), v(16, 52), v(21, 45), v(21, 33)],
    true,
  );

  g.lineStyle(2, 0xb8c6d5, 1);

  g.strokePoints([
    v(16, 30),
    v(5, 33),
    v(7, 47),
    v(16, 52),
    v(21, 45),
    v(21, 33),
    v(16, 30),
  ]);

  g.fillStyle(0xe8c27a, 1);
  g.fillCircle(14, 40, 2.5);

  g.generateTexture(TEXTURES.knight, 64, 64);

  // ============================================================
  // SWORD
  // ============================================================

  g.clear();

  g.fillStyle(0x5b3d22, 1);
  g.fillRect(0, 4, 12, 5);

  g.fillStyle(0xe8c27a, 1);
  g.fillRect(10, 0, 4, 13);

  g.fillStyle(0xcbd8e5, 1);
  g.fillRect(14, 4, 27, 5);

  g.fillStyle(0xffffff, 1);
  g.fillRect(15, 4, 25, 1);

  g.fillTriangle(41, 4, 41, 9, 48, 6.5);

  g.generateTexture(TEXTURES.sword, 50, 13);

  // ============================================================
  // MEDВЕСЫЧ
  // ============================================================

  g.clear();

  // Shadow
  g.fillStyle(0x070910, 0.55);
  g.fillEllipse(32, 56, 42, 9);

  // ------------------------------------------------------------
  // Back / body
  // ------------------------------------------------------------

  g.fillStyle(0x402318, 1);
  g.fillEllipse(32, 37, 39, 30);

  // Body main
  g.fillStyle(0x65402a, 1);
  g.fillEllipse(32, 36, 34, 28);

  // Body light
  g.fillStyle(0x7b4c2f, 1);
  g.fillEllipse(29, 35, 23, 20);

  // Chest
  g.fillStyle(0x8d5937, 1);
  g.fillEllipse(31, 40, 18, 15);

  // ------------------------------------------------------------
  // Head
  // ------------------------------------------------------------

  g.fillStyle(0x4b2a1d, 1);
  g.fillCircle(32, 20, 18);

  // ears
  g.fillStyle(0x3b2118, 1);

  g.fillTriangle(17, 13, 16, 2, 26, 10);

  g.fillTriangle(38, 10, 48, 2, 47, 14);

  // inner ears
  g.fillStyle(0x875035, 1);

  g.fillTriangle(19, 10, 18, 5, 23, 10);

  g.fillTriangle(40, 10, 45, 5, 45, 11);

  // ------------------------------------------------------------
  // Owl face
  // ------------------------------------------------------------

  g.fillStyle(0x9b6743, 1);

  g.fillCircle(25, 21, 9);
  g.fillCircle(39, 21, 9);

  // Eye whites
  g.fillStyle(0xd8c89e, 1);

  g.fillCircle(26, 21, 5.5);
  g.fillCircle(38, 21, 5.5);

  // Eye outlines
  g.lineStyle(1.5, 0x39231b, 1);

  g.strokeCircle(26, 21, 5.5);
  g.strokeCircle(38, 21, 5.5);

  // pupils
  g.fillStyle(0x16131a, 1);

  g.fillCircle(27, 21, 2.2);
  g.fillCircle(37, 21, 2.2);

  // eye highlights
  g.fillStyle(0xffffff, 1);

  g.fillCircle(27.6, 20.2, 0.8);
  g.fillCircle(37.6, 20.2, 0.8);

  // ------------------------------------------------------------
  // Beak
  // ------------------------------------------------------------

  g.fillStyle(0xd59a43, 1);

  g.fillTriangle(32, 22, 27, 27, 37, 27);

  g.fillStyle(0x8f5d27, 1);

  g.fillTriangle(32, 27, 27, 25, 37, 25);

  // ------------------------------------------------------------
  // Brow / owl markings
  // ------------------------------------------------------------

  g.lineStyle(2, 0x382018, 0.9);

  g.lineBetween(20, 16, 26, 13);
  g.lineBetween(38, 13, 44, 16);

  // ------------------------------------------------------------
  // Arms / wings
  // ------------------------------------------------------------

  g.fillStyle(0x55301f, 1);

  g.fillEllipse(13, 36, 10, 18);
  g.fillEllipse(51, 36, 10, 18);

  g.fillStyle(0x75472c, 1);

  g.fillEllipse(14, 35, 6, 13);
  g.fillEllipse(50, 35, 6, 13);

  // ------------------------------------------------------------
  // Feet
  // ------------------------------------------------------------

  g.fillStyle(0xa06a38, 1);

  g.fillEllipse(23, 51, 13, 7);
  g.fillEllipse(41, 51, 13, 7);

  // claws
  g.lineStyle(2, 0xc18a4a, 1);

  g.lineBetween(18, 52, 16, 55);
  g.lineBetween(23, 52, 22, 56);
  g.lineBetween(28, 52, 28, 55);

  g.lineBetween(36, 52, 35, 55);
  g.lineBetween(41, 52, 41, 56);
  g.lineBetween(46, 52, 48, 55);

  // ------------------------------------------------------------
  // Feather details
  // ------------------------------------------------------------

  g.lineStyle(1.5, 0x47291d, 0.8);

  g.lineBetween(20, 31, 14, 34);
  g.lineBetween(20, 35, 14, 39);
  g.lineBetween(44, 31, 50, 34);
  g.lineBetween(44, 35, 50, 39);

  // small chest feathers
  g.lineBetween(27, 31, 32, 34);
  g.lineBetween(32, 34, 37, 31);

  g.generateTexture(TEXTURES.owlbear, 64, 60);

  // ============================================================
  // DRAGON
  //
  // ВАЖНО:
  // Дракон теперь НЕ рисуется здесь.
  // Он загружается как dragon.svg в ArenaScene.preload().
  // ============================================================

  // ============================================================
  // PROJECTILE — FIRE
  // ============================================================

  g.clear();

  g.fillStyle(0xff4b18, 0.28);
  g.fillCircle(15, 15, 15);

  g.fillStyle(0xff7025, 0.9);
  g.fillCircle(15, 15, 10);

  g.fillStyle(0xffc14a, 1);
  g.fillCircle(15, 15, 6);

  g.fillStyle(0xfff7dc, 1);
  g.fillCircle(15, 15, 2.5);

  g.generateTexture(TEXTURES.fire, 30, 30);

  // ============================================================
  // SPARK
  // ============================================================

  g.clear();

  g.fillStyle(0xfff4c7, 1);

  g.fillRect(3, 0, 2, 8);
  g.fillRect(0, 3, 8, 2);

  g.generateTexture(TEXTURES.spark, 8, 8);

  // ============================================================
  // FIRE POOL
  // ============================================================

  g.clear();

  g.fillStyle(0x9c211f, 0.24);
  g.fillCircle(50, 50, 49);

  g.lineStyle(3, 0xff6328, 0.7);
  g.strokeCircle(50, 50, 40);

  g.fillStyle(0xff7a24, 0.32);
  g.fillCircle(50, 50, 29);

  g.fillStyle(0xffb33e, 0.35);
  g.fillCircle(50, 50, 14);

  g.generateTexture(TEXTURES.pool, 100, 100);

  g.destroy();
}
