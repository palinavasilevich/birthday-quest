import Phaser from "phaser";
import {
  DRAGON,
  OWLBEAR,
  PLAYER,
  SCENE_KEYS,
  TEXTURES,
  WORLD,
} from "./constants";
import { makeTextures } from "./textures";
import type {
  AiState,
  AttackName,
  Fireball,
  FirePool,
  GameHooks,
  GameStats,
} from "./types";

const { width: W, height: H, padding: PAD } = WORLD;

/**
 * Вся боевая логика. Сцена ничего не знает про React —
 * только про интерфейс GameHooks, который ей передают в конструкторе.
 */
export class ArenaScene extends Phaser.Scene {
  private readonly hooks: GameHooks;

  private player!: Phaser.Physics.Arcade.Sprite;
  private dragon!: Phaser.Physics.Arcade.Sprite;
  private owlbear!: Phaser.Physics.Arcade.Sprite;
  private sword!: Phaser.GameObjects.Sprite;
  private owlbearDangerZone!: Phaser.GameObjects.Arc;

  private fires!: Phaser.Physics.Arcade.Group;
  private pools!: Phaser.GameObjects.Group;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  // ---------------------------------------------------------------
  // Состояние игрока
  // ---------------------------------------------------------------

  private playerHp: number = PLAYER.maxHp;
  private facing = -Math.PI / 2;
  private moveAngle = 0;

  private invulnUntil = 0;
  private dashUntil = 0;
  private dashReadyAt = 0;
  private nextAttackAt = 0;

  private dashVec = new Phaser.Math.Vector2();
  private aimPointer: Phaser.Math.Vector2 | null = null;
  private wantAttack = false;

  // ---------------------------------------------------------------
  // Состояние взмаха
  // ---------------------------------------------------------------

  private swingActive = false;
  private swingElapsed = 0;
  private swingBase = 0;
  private swingHit = false;

  // ---------------------------------------------------------------
  // Состояние дракона
  // ---------------------------------------------------------------

  private dragonHp: number = DRAGON.maxHp;
  private poise: number = 0;

  // ---------------------------------------------------------------
  // Медвесыч
  // ---------------------------------------------------------------

  private owlbearHp: number = OWLBEAR.initialMaxHp;
  private owlbearMaxHp: number = OWLBEAR.initialMaxHp;
  private owlbearSafe = false;
  private owlbearInvulnerableUntil = 0;
  private owlbearNextAttackAt = 0;

  // ---------------------------------------------------------------
  // AI
  // ---------------------------------------------------------------

  private phase: 1 | 2 | 3 = 1;
  private aiState: AiState = "intro";
  private aiTimer = 1400;

  private orbitDir: 1 | -1 = 1;
  private pendingAttack: AttackName = "volley";
  private lastAttack: AttackName | null = null;

  private shotsLeft = 0;
  private shotTimer = 0;
  private breathBase = 0;

  // ---------------------------------------------------------------
  // Состояние игры
  // ---------------------------------------------------------------

  private gameOver = false;
  private lastStats: GameStats | null = null;

  constructor(hooks: GameHooks) {
    super(SCENE_KEYS.arena);
    this.hooks = hooks;
  }

  // ===============================================================
  // PRELOAD
  // ===============================================================

  preload(): void {
    const dragonUrl = new URL("./dragon.svg", import.meta.url).href;

    this.load.svg(TEXTURES.dragon, dragonUrl, {
      width: 520,
      height: 323,
    });

    // -------------------------------------------------------------
    // Player — fixed visual directions.
    //
    // The sprite itself is never rotated. We keep the exact
    // `facing` angle separately for sword/attack calculations.
    // -------------------------------------------------------------

    const playerDownUrl = new URL("./player-down.svg", import.meta.url).href;
    const playerUpUrl = new URL("./player-up.svg", import.meta.url).href;
    const playerRightUrl = new URL("./player-right.svg", import.meta.url).href;

    this.load.svg(TEXTURES.playerDown, playerDownUrl, {
      width: 96,
      height: 96,
    });

    this.load.svg(TEXTURES.playerUp, playerUpUrl, {
      width: 96,
      height: 96,
    });

    this.load.svg(TEXTURES.playerRight, playerRightUrl, {
      width: 96,
      height: 96,
    });
  }

  // ===============================================================
  // CREATE
  // ===============================================================

  create(): void {
    makeTextures(this);

    this.resetState();

    this.physics.world.setBounds(PAD, PAD, W - PAD * 2, H - PAD * 2);

    this.drawFloor();

    // -------------------------------------------------------------
    // Игрок
    // -------------------------------------------------------------

    this.player = this.physics.add
      .sprite(W * 0.5, H * 0.78, TEXTURES.playerDown)
      .setScale(PLAYER.scale);

    this.player.setCircle(13, 11, 18).setCollideWorldBounds(true).setDepth(10);

    // -------------------------------------------------------------
    // Меч
    // -------------------------------------------------------------

    this.sword = this.add
      .sprite(0, 0, TEXTURES.sword)
      .setOrigin(0.1, 0.5)
      .setDepth(11)
      .setVisible(false);

    // -------------------------------------------------------------
    // Дракон
    // -------------------------------------------------------------

    this.dragon = this.physics.add
      .sprite(W * 0.72, H * 0.28, TEXTURES.dragon)
      .setDepth(8)
      .setScale(DRAGON.scale);

    this.dragon.setCircle(88, 92, 62).setCollideWorldBounds(true);

    // -------------------------------------------------------------
    // Медвесыч
    // -------------------------------------------------------------

    this.owlbear = this.physics.add
      .sprite(W * 0.78, H * 0.68, TEXTURES.owlbear)
      .setDepth(9)
      .setScale(OWLBEAR.scale);

    this.owlbear.setCircle(22, 8, 8);

    this.owlbearDangerZone = this.add
      .circle(this.owlbear.x, this.owlbear.y, 34)
      .setStrokeStyle(2, 0xff6b4a, 0.75)
      .setFillStyle(0xff4d2f, 0.08)
      .setDepth(1);

    // -------------------------------------------------------------
    // Снаряды
    // -------------------------------------------------------------

    this.fires = this.physics.add.group();
    this.pools = this.add.group();

    // -------------------------------------------------------------
    // Коллизии
    // -------------------------------------------------------------

    this.physics.add.overlap(this.player, this.fires, (_player, fire) => {
      const ball = fire as Fireball;

      this.spawnBurst(ball.x, ball.y, 0xffa63d, 6);

      ball.destroy();

      this.hurtPlayer(1);
    });

    this.physics.add.overlap(this.player, this.dragon, () => {
      if (this.aiState === "charge") {
        this.hurtPlayer(1, 420);
      }
    });

    this.physics.add.overlap(this.owlbear, this.dragon, () => {
      if (this.owlbearSafe && this.aiState === "charge") {
        this.damageOwlbear(1);
      }
    });

    this.physics.add.overlap(this.owlbear, this.fires, (_owlbear, fire) => {
      if (this.gameOver) return;

      const ball = fire as Fireball;

      this.spawnBurst(ball.x, ball.y, 0xffa63d, 6);

      ball.destroy();

      if (this.owlbearSafe) {
        this.damageOwlbear(1);
      } else {
        this.damageOwlbearBeforeRescue(1);
      }
    });

    this.bindInput();

    this.pushStats(true);

    this.hooks.onAnnounce("Дракон просыпается…");
  }

  // ===============================================================
  // RESET
  // ===============================================================

  /**
   * Сцена переиспользуется при restart(),
   * поэтому состояние сбрасываем вручную.
   */
  private resetState(): void {
    this.playerHp = PLAYER.maxHp;

    this.facing = -Math.PI / 2;
    this.moveAngle = 0;

    this.invulnUntil = 0;
    this.dashUntil = 0;
    this.dashReadyAt = 0;
    this.nextAttackAt = 0;

    this.aimPointer = null;
    this.wantAttack = false;

    this.swingActive = false;
    this.swingElapsed = 0;
    this.swingBase = 0;
    this.swingHit = false;

    this.dragonHp = DRAGON.maxHp;
    this.poise = 0;

    this.phase = 1;
    this.owlbearHp = OWLBEAR.initialMaxHp;
    this.owlbearMaxHp = OWLBEAR.initialMaxHp;
    this.owlbearSafe = false;
    this.owlbearInvulnerableUntil = 0;
    this.owlbearNextAttackAt = 0;

    this.aiState = "intro";
    this.aiTimer = 1400;

    this.orbitDir = 1;
    this.pendingAttack = "volley";
    this.lastAttack = null;

    this.shotsLeft = 0;
    this.shotTimer = 0;
    this.breathBase = 0;

    this.gameOver = false;
    this.lastStats = null;
  }

  // ===============================================================
  // INPUT
  // ===============================================================

  private bindInput(): void {
    const keyboard = this.input.keyboard;

    if (!keyboard) return;

    this.cursors = keyboard.createCursorKeys();

    this.keys = keyboard.addKeys("W,A,S,D,SPACE,SHIFT") as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    keyboard.addCapture("SPACE,SHIFT,UP,DOWN,LEFT,RIGHT");

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.aimPointer = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
    });

    this.input.on("pointerdown", () => {
      this.wantAttack = true;
    });
  }

  // ===============================================================
  // STATS
  // ===============================================================

  /**
   * Уведомляем React только когда значения реально изменились.
   */
  private pushStats(force = false): void {
    const next: GameStats = {
      hp: this.playerHp,
      dragonHp: Math.max(0, Math.round(this.dragonHp)),
      phase: this.phase,
      poise: this.poise,
      owlbearHp: this.owlbearHp,
      owlbearMaxHp: this.owlbearMaxHp,
      owlbearSafe: this.owlbearSafe,
    };

    const prev = this.lastStats;

    if (
      !force &&
      prev &&
      prev.hp === next.hp &&
      prev.dragonHp === next.dragonHp &&
      prev.phase === next.phase &&
      prev.poise === next.poise &&
      prev.owlbearHp === next.owlbearHp &&
      prev.owlbearMaxHp === next.owlbearMaxHp &&
      prev.owlbearSafe === next.owlbearSafe
    ) {
      return;
    }

    this.lastStats = next;

    this.hooks.onStats(next);
  }

  // ===============================================================
  // FLOOR
  // ===============================================================

  private drawFloor(): void {
    const g = this.add.graphics().setDepth(0);

    // -------------------------------------------------------------
    // Dark stone floor
    // -------------------------------------------------------------

    g.fillStyle(0x070910, 1);
    g.fillRect(0, 0, W, H);

    g.fillStyle(0x171922, 1);
    g.fillRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

    const stones: Array<[number, number, number, number]> = [
      [70, 75, 115, 58],
      [190, 70, 105, 62],
      [305, 76, 126, 57],
      [440, 70, 105, 62],
      [555, 76, 125, 57],
      [690, 70, 105, 62],
      [805, 76, 105, 57],

      [72, 140, 130, 68],
      [210, 137, 120, 70],
      [338, 145, 128, 64],
      [474, 138, 118, 72],
      [600, 145, 130, 63],
      [738, 138, 118, 70],
      [865, 145, 50, 65],

      [70, 215, 118, 68],
      [198, 220, 128, 61],
      [335, 212, 110, 72],
      [455, 220, 135, 61],
      [600, 210, 112, 72],
      [720, 218, 132, 62],
      [858, 215, 55, 70],

      [68, 292, 128, 62],
      [205, 286, 112, 70],
      [326, 295, 132, 59],
      [468, 285, 116, 73],
      [595, 294, 130, 61],
      [735, 286, 116, 70],
      [858, 292, 55, 60],

      [70, 370, 122, 70],
      [204, 365, 125, 63],
      [338, 374, 112, 69],
      [460, 365, 135, 62],
      [605, 372, 112, 70],
      [725, 364, 135, 64],
      [862, 370, 50, 68],

      [72, 446, 126, 66],
      [208, 438, 115, 72],
      [332, 450, 130, 61],
      [470, 440, 118, 70],
      [598, 450, 132, 60],
      [738, 440, 116, 70],
      [858, 446, 55, 64],

      [70, 515, 130, 60],
      [210, 512, 120, 64],
      [340, 518, 125, 57],
      [475, 512, 112, 63],
      [598, 518, 130, 57],
      [738, 512, 118, 63],
      [860, 515, 50, 58],
    ];

    stones.forEach(([x, y, width, height]) => {
      g.fillStyle(0x1d202d, 1);

      g.fillRoundedRect(x, y, width, height, 3);

      g.lineStyle(1, 0x303344, 0.55);

      g.strokeRoundedRect(x, y, width, height, 3);
    });

    // -------------------------------------------------------------
    // Cracks
    // -------------------------------------------------------------

    const cracks: Array<[number, number, number, number, number, number]> = [
      [112, 118, 125, 130, 116, 141],
      [270, 160, 283, 151, 292, 164],
      [390, 110, 401, 122, 394, 136],
      [515, 182, 527, 171, 538, 181],
      [650, 118, 664, 132, 658, 145],
      [780, 188, 793, 177, 806, 191],
      [152, 334, 165, 346, 158, 359],
      [295, 404, 307, 393, 320, 405],
      [520, 350, 533, 363, 525, 378],
      [674, 402, 688, 390, 701, 402],
      [812, 326, 823, 338, 817, 352],
      [420, 495, 435, 485, 445, 498],
    ];

    cracks.forEach(([x1, y1, x2, y2, x3, y3]) => {
      g.lineStyle(2, 0x343748, 0.75);

      g.lineBetween(x1, y1, x2, y2);

      g.lineBetween(x2, y2, x3, y3);
    });

    // -------------------------------------------------------------
    // Lava
    // -------------------------------------------------------------

    const lava = [
      [42, 80, 58, 120, 48, 155],
      [42, 470, 57, 430, 48, 392],
      [918, 95, 902, 133, 912, 166],
      [918, 462, 902, 425, 913, 388],
      [145, 558, 180, 548, 205, 559],
      [750, 559, 780, 548, 815, 559],
    ];

    lava.forEach(([x1, y1, x2, y2, x3, y3]) => {
      g.lineStyle(8, 0x5f1c1a, 0.9);

      g.lineBetween(x1, y1, x2, y2);

      g.lineBetween(x2, y2, x3, y3);

      g.lineStyle(2, 0xff5425, 0.75);

      g.lineBetween(x1, y1, x2, y2);

      g.lineBetween(x2, y2, x3, y3);
    });

    // -------------------------------------------------------------
    // Ritual pillars
    // -------------------------------------------------------------

    const pillars: Array<[number, number]> = [
      [72, 105],
      [888, 105],
      [72, 458],
      [888, 458],
    ];

    pillars.forEach(([x, y]) => {
      g.fillStyle(0x0d1018, 1);
      g.fillRect(x - 17, y - 9, 34, 70);

      g.fillStyle(0x272b3a, 1);
      g.fillRect(x - 13, y - 7, 26, 66);

      g.fillStyle(0x3a3d4d, 1);
      g.fillRect(x - 10, y - 4, 20, 58);

      g.fillStyle(0x151821, 1);
      g.fillRect(x - 20, y - 12, 40, 8);

      g.fillRect(x - 20, y + 56, 40, 8);

      g.lineStyle(2, 0xff5b2b, 0.72);

      g.lineBetween(x, y + 2, x, y + 45);

      g.lineStyle(1, 0xe8a15b, 0.55);

      g.lineBetween(x - 4, y + 12, x + 4, y + 20);

      g.lineBetween(x + 4, y + 20, x - 4, y + 29);
    });

    // -------------------------------------------------------------
    // Central ritual seal
    // -------------------------------------------------------------

    const cx = W * 0.5;
    const cy = H * 0.57;

    g.lineStyle(3, 0x3f3448, 0.72);

    g.strokeCircle(cx, cy, 103);

    g.lineStyle(1, 0x6c4650, 0.58);

    g.strokeCircle(cx, cy, 88);

    g.strokeCircle(cx, cy, 58);

    g.lineStyle(2, 0x6d373b, 0.58);

    g.lineBetween(cx - 72, cy, cx + 72, cy);

    g.lineBetween(cx, cy - 72, cx, cy + 72);

    g.lineBetween(cx - 52, cy - 52, cx + 52, cy + 52);

    g.lineBetween(cx + 52, cy - 52, cx - 52, cy + 52);

    // -------------------------------------------------------------
    // Sigils
    // -------------------------------------------------------------

    const sigils: Array<[number, number, number]> = [
      [145, 250, 34],
      [815, 255, 34],
      [480, 505, 34],
    ];

    sigils.forEach(([x, y, r]) => {
      g.lineStyle(3, 0xff5a27, 0.88);

      g.strokeCircle(x, y, r);

      g.lineStyle(1, 0xffa33f, 0.8);

      g.lineBetween(x - r, y, x + r, y);

      g.lineBetween(x, y - r, x, y + r);

      g.lineBetween(x - r * 0.7, y - r * 0.7, x + r * 0.7, y + r * 0.7);

      g.lineBetween(x + r * 0.7, y - r * 0.7, x - r * 0.7, y + r * 0.7);
    });

    // -------------------------------------------------------------
    // Chains
    // -------------------------------------------------------------

    g.lineStyle(3, 0x161820, 0.95);

    const chains = [
      [48, 44, 85, 83],
      [912, 44, 875, 83],
      [48, 556, 82, 521],
      [912, 556, 878, 521],
    ];

    chains.forEach(([x1, y1, x2, y2]) => {
      g.lineBetween(x1, y1, x2, y2);

      g.lineStyle(1, 0x4c4650, 0.75);

      g.lineBetween(x1 + 2, y1, x2 + 2, y2);

      g.lineStyle(3, 0x161820, 0.95);
    });

    // -------------------------------------------------------------
    // Frame
    // -------------------------------------------------------------

    g.lineStyle(5, 0x352844, 1);

    g.strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

    g.lineStyle(2, 0x8b6849, 0.52);

    g.strokeRect(PAD + 5, PAD + 5, W - PAD * 2 - 10, H - PAD * 2 - 10);

    g.lineStyle(1, 0xd0a26a, 0.18);

    g.strokeRect(PAD + 9, PAD + 9, W - PAD * 2 - 18, H - PAD * 2 - 18);

    // -------------------------------------------------------------
    // Corner ornaments
    // -------------------------------------------------------------

    const corners: Array<[number, number, number]> = [
      [PAD + 12, PAD + 12, 1],
      [W - PAD - 12, PAD + 12, -1],
      [PAD + 12, H - PAD - 12, 1],
      [W - PAD - 12, H - PAD - 12, -1],
    ];

    corners.forEach(([x, y, direction]) => {
      g.lineStyle(2, 0xc09159, 0.52);

      g.lineBetween(x, y, x + 15 * direction, y);

      g.lineBetween(x, y, x, y + 15);

      g.lineBetween(x + 5 * direction, y + 5, x + 12 * direction, y + 12);
    });
  }

  // ===============================================================
  // MAIN UPDATE
  // ===============================================================

  override update(time: number, delta: number): void {
    if (!this.gameOver) {
      this.updatePlayer(time, delta);

      // Визуальное направление дракона отдельно
      // от математических углов атак.
      this.updateDragonDirection();

      this.updateDragon(time, delta);
      this.constrainDragonToArena();

      this.updateOwlbear(time, delta);
    }

    this.updateProjectiles(delta);
  }

  // ===============================================================
  // PLAYER
  // ===============================================================

  private updatePlayer(time: number, delta: number): void {
    const { player, keys, cursors } = this;

    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || keys.A.isDown) {
      vx -= 1;
    }

    if (cursors.right.isDown || keys.D.isDown) {
      vx += 1;
    }

    if (cursors.up.isDown || keys.W.isDown) {
      vy -= 1;
    }

    if (cursors.down.isDown || keys.S.isDown) {
      vy += 1;
    }

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);

      vx /= len;
      vy /= len;

      this.moveAngle = Math.atan2(vy, vx);
    }

    // -------------------------------------------------------------
    // Dash
    // -------------------------------------------------------------

    if (Phaser.Input.Keyboard.JustDown(keys.SHIFT) && time > this.dashReadyAt) {
      const angle = vx !== 0 || vy !== 0 ? this.moveAngle : this.facing;

      this.dashVec.set(
        Math.cos(angle) * PLAYER.dashSpeed,
        Math.sin(angle) * PLAYER.dashSpeed,
      );

      this.dashUntil = time + PLAYER.dashTime;

      this.invulnUntil = Math.max(
        this.invulnUntil,
        time + PLAYER.dashTime + 60,
      );

      this.dashReadyAt = time + PLAYER.dashCooldown;

      this.spawnBurst(player.x, player.y, 0x8fa7c9, 8);

      this.hooks.onDash(PLAYER.dashCooldown);
    }

    // -------------------------------------------------------------
    // Movement
    // -------------------------------------------------------------

    if (time < this.dashUntil) {
      player.setVelocity(this.dashVec.x, this.dashVec.y);

      player.setAlpha(0.55);

      player.setScale(PLAYER.scale * 0.92);
    } else {
      player.setVelocity(vx * PLAYER.speed, vy * PLAYER.speed);

      player.setAlpha(
        time < this.invulnUntil ? 0.4 + 0.4 * Math.sin(time / 55) : 1,
      );
    }

    // -------------------------------------------------------------
    // Aim
    // -------------------------------------------------------------

    if (this.aimPointer) {
      this.facing = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        this.aimPointer.x,
        this.aimPointer.y,
      );
    } else if (vx !== 0 || vy !== 0) {
      this.facing = this.moveAngle;
    }

    // The hero sprite has only fixed visual directions.
    // `facing` remains the exact mathematical aiming angle for
    // the sword and attack hit detection.
    this.updatePlayerDirection();

    // -------------------------------------------------------------
    // Idle animation
    // -------------------------------------------------------------

    if (!this.swingActive && time >= this.dashUntil) {
      player.setScale(PLAYER.scale + Math.sin(time / 180) * 0.018);
    }

    // -------------------------------------------------------------
    // Attack
    // -------------------------------------------------------------

    const pressed =
      Phaser.Input.Keyboard.JustDown(keys.SPACE) || this.wantAttack;

    this.wantAttack = false;

    if (pressed && time > this.nextAttackAt) {
      this.startSwing(time);
    }

    if (this.swingActive) {
      this.updateSwing(delta);
    }
  }

  /**
   * Updates only the visual direction of the hero.
   *
   * The sprite never rotates:
   *   up    -> playerUp
   *   down  -> playerDown
   *   right -> playerRight
   *   left  -> playerRight + flipX
   *
   * The exact `facing` angle is still used by the sword and
   * attack calculations.
   */
  private updatePlayerDirection(): void {
    const { player } = this;

    const dx = this.aimPointer
      ? this.aimPointer.x - player.x
      : Math.cos(this.facing);

    const dy = this.aimPointer
      ? this.aimPointer.y - player.y
      : Math.sin(this.facing);

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal: use the right-facing sprite and mirror it for left.
      player.setTexture(TEXTURES.playerRight);
      player.setFlipX(dx < 0);
      player.setFlipY(false);
      return;
    }

    // Vertical: use dedicated up/down sprites.
    if (dy < 0) {
      player.setTexture(TEXTURES.playerUp);
    } else {
      player.setTexture(TEXTURES.playerDown);
    }

    player.setFlipX(false);
    player.setFlipY(false);
  }

  private startSwing(time: number): void {
    this.nextAttackAt = time + PLAYER.attackCooldown;

    this.swingActive = true;
    this.swingElapsed = 0;
    this.swingHit = false;

    this.swingBase = this.facing;

    this.sword.setVisible(true);
  }

  private updateSwing(delta: number): void {
    const duration = 180;

    this.swingElapsed += delta;

    const t = Phaser.Math.Clamp(this.swingElapsed / duration, 0, 1);

    const angle = this.swingBase - 1.15 + 2.3 * Phaser.Math.Easing.Cubic.Out(t);

    this.sword
      .setPosition(
        this.player.x + Math.cos(angle) * 28,
        this.player.y + Math.sin(angle) * 28,
      )
      .setRotation(angle)
      .setAlpha(1 - t * 0.5);

    // -------------------------------------------------------------
    // Hit dragon
    // -------------------------------------------------------------

    if (!this.swingHit) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.dragon.x,
        this.dragon.y,
      );

      const toDragon = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.dragon.x,
        this.dragon.y,
      );

      const offset = Math.abs(
        Phaser.Math.Angle.Wrap(toDragon - this.swingBase),
      );

      if (dist < PLAYER.attackRange + 46 && offset < PLAYER.attackArc) {
        this.swingHit = true;

        this.hitDragon(PLAYER.attackDamage);
      }
    }

    // -------------------------------------------------------------
    // Sword destroys fireballs
    // -------------------------------------------------------------

    this.getFires().forEach((ball) => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        ball.x,
        ball.y,
      );

      const toBall = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        ball.x,
        ball.y,
      );

      if (
        dist < PLAYER.attackRange &&
        Math.abs(Phaser.Math.Angle.Wrap(toBall - angle)) < 0.9
      ) {
        this.spawnBurst(ball.x, ball.y, 0xffd34d, 5);

        ball.destroy();
      }
    });

    if (t >= 1) {
      this.swingActive = false;
      this.sword.setVisible(false);
    }
  }

  // ===============================================================
  // PLAYER DAMAGE
  // ===============================================================

  private hurtPlayer(damage: number, knockback = 260): void {
    if (this.time.now < this.invulnUntil || this.gameOver) {
      return;
    }

    this.playerHp -= damage;

    this.invulnUntil = this.time.now + PLAYER.iframes;

    this.cameras.main.shake(140, 0.008);

    this.cameras.main.flash(90, 120, 20, 20);

    const away = Phaser.Math.Angle.Between(
      this.dragon.x,
      this.dragon.y,
      this.player.x,
      this.player.y,
    );

    this.player.setVelocity(
      Math.cos(away) * knockback,
      Math.sin(away) * knockback,
    );

    this.pushStats();

    if (this.playerHp <= 0) {
      this.finish(false, "player");
    }
  }

  // ===============================================================
  // DRAGON DAMAGE
  // ===============================================================

  private hitDragon(damage: number): void {
    const weak = this.aiState === "recover" || this.aiState === "stagger";
    const counter = this.aiState === "charge";

    // Hitting the dragon during charge is a risky counter:
    // it deals bonus damage, adds a large amount of poise and
    // immediately interrupts the charge.
    const multiplier =
      (weak ? DRAGON.weakMultiplier : 1) * (counter ? 1.35 : 1);

    this.dragonHp -= damage * multiplier;

    this.poise += counter ? 14 : damage;

    if (counter) {
      this.dragon.setVelocity(0, 0);
      this.setAi("stagger", Math.max(850, DRAGON.staggerTime - 450));

      this.hooks.onAnnounce("Контрудар! Дракон остановлен!");
      this.cameras.main.shake(180, 0.009);
    }

    this.dragon.setTintFill();

    this.time.delayedCall(70, () => {
      if (!this.dragon.active) {
        return;
      }

      this.dragon.clearTint();

      if (this.aiState === "stagger") {
        this.dragon.setTint(0x8fa7c9);
      }
    });

    this.spawnBurst(
      this.dragon.x + Phaser.Math.Between(-20, 20),
      this.dragon.y + Phaser.Math.Between(-20, 20),
      weak ? 0xffd34d : 0xc94b3e,
      9,
    );

    // -------------------------------------------------------------
    // Phase
    // -------------------------------------------------------------

    const nextPhase: 1 | 2 | 3 =
      this.dragonHp > DRAGON.maxHp * 0.66
        ? 1
        : this.dragonHp > DRAGON.maxHp * 0.33
          ? 2
          : 3;

    if (nextPhase !== this.phase) {
      this.phase = nextPhase;

      this.hooks.onAnnounce(`Фаза ${this.phase}`);

      this.cameras.main.shake(260, 0.012);

      this.setAi("stagger", 900);
    }

    // -------------------------------------------------------------
    // Poise
    // -------------------------------------------------------------

    if (this.poise >= DRAGON.poiseMax && this.aiState !== "stagger") {
      this.poise = 0;

      this.setAi("stagger", DRAGON.staggerTime);

      this.hooks.onAnnounce("Дракон оглушён!");
    }

    this.pushStats();

    // -------------------------------------------------------------
    // Death gate
    // -------------------------------------------------------------

    if (this.dragonHp <= 0) {
      if (this.owlbearSafe) {
        this.finish(true);
      } else {
        this.dragonHp = 1;

        this.hooks.onAnnounce("Сначала спасите Медвесыча!");

        this.pushStats(true);
      }
    }
  }

  // ===============================================================
  // DRAGON AI
  // ===============================================================

  private setAi(state: AiState, durationMs: number): void {
    this.aiState = state;
    this.aiTimer = durationMs;

    this.dragon.setVelocity(0, 0);

    this.dragon.clearTint();

    if (state === "stagger") {
      this.dragon.setTint(0x8fa7c9);
    }

    if (state === "telegraph") {
      this.dragon.setTint(0xff9a80);
    }
  }

  private get dragonBody(): Phaser.Physics.Arcade.Body {
    return this.dragon.body as Phaser.Physics.Arcade.Body;
  }

  /**
   * Дракон визуально использует только четыре направления.
   *
   * Сам SVG смотрит вправо:
   *
   *       ↑
   *       🐉
   *
   *  ← 🐉     🐉 →
   *
   *       🐉
   *       ↓
   *
   * Никакого rotation у sprite здесь нет.
   */
  /**
   * Dragon visual direction.
   *
   * The dragon SVG is drawn facing right, so we only mirror it
   * horizontally. We deliberately do NOT use flipY and do NOT
   * rotate the sprite: flipY would turn the dragon upside down.
   *
   * Attack angles remain fully independent and can still point
   * anywhere around the dragon.
   */
  private updateDragonDirection(): void {
    const dx = this.player.x - this.dragon.x;

    if (Math.abs(dx) > 4) {
      // dragon.svg faces right by default.
      // Mirror horizontally when the player is on the left.
      this.dragon.setFlipX(dx < 0);
    }
  }

  /**
   * Keep the whole visual dragon inside the arena.
   *
   * The physics circle is intentionally much smaller than the
   * dragon SVG, so setCollideWorldBounds() alone can still allow
   * the wings/tail to visually cross the frame.
   */
  private constrainDragonToArena(): void {
    if (!this.dragon.active) {
      return;
    }

    const halfWidth = (520 * DRAGON.scale) / 2;
    const halfHeight = (323 * DRAGON.scale) / 2;

    const minX = PAD + halfWidth;
    const maxX = W - PAD - halfWidth;
    const minY = PAD + halfHeight;
    const maxY = H - PAD - halfHeight;

    let hitLeft = false;
    let hitRight = false;
    let hitTop = false;
    let hitBottom = false;

    if (this.dragon.x < minX) {
      this.dragon.x = minX;
      hitLeft = true;
    } else if (this.dragon.x > maxX) {
      this.dragon.x = maxX;
      hitRight = true;
    }

    if (this.dragon.y < minY) {
      this.dragon.y = minY;
      hitTop = true;
    } else if (this.dragon.y > maxY) {
      this.dragon.y = maxY;
      hitBottom = true;
    }

    if (hitLeft || hitRight || hitTop || hitBottom) {
      const body = this.dragonBody;

      if (hitLeft && body.velocity.x < 0) {
        body.velocity.x = 0;
      }

      if (hitRight && body.velocity.x > 0) {
        body.velocity.x = 0;
      }

      if (hitTop && body.velocity.y < 0) {
        body.velocity.y = 0;
      }

      if (hitBottom && body.velocity.y > 0) {
        body.velocity.y = 0;
      }
    }
  }

  private updateDragon(time: number, delta: number): void {
    const { dragon, player } = this;

    this.aiTimer -= delta;

    switch (this.aiState) {
      // -----------------------------------------------------------
      // Intro / stagger / recover
      // -----------------------------------------------------------

      case "intro":
      case "stagger":
      case "recover": {
        const body = this.dragonBody;

        dragon.setVelocity(body.velocity.x * 0.9, body.velocity.y * 0.9);

        if (this.aiTimer <= 0) {
          // Recovery gets shorter as the fight progresses.
          const repositionTime =
            this.phase === 1 ? 620 : this.phase === 2 ? 470 : 340;

          this.setAi("reposition", repositionTime);
        }

        break;
      }

      // -----------------------------------------------------------
      // Reposition
      // -----------------------------------------------------------

      case "reposition": {
        const dist = Phaser.Math.Distance.Between(
          dragon.x,
          dragon.y,
          player.x,
          player.y,
        );

        const toPlayer = Phaser.Math.Angle.Between(
          dragon.x,
          dragon.y,
          player.x,
          player.y,
        );

        const speed = this.phase === 1 ? 125 : this.phase === 2 ? 165 : 205;

        // The dragon tries to stay close enough to threaten the player,
        // while orbiting so the player cannot simply stand still.
        const desiredDistance =
          this.phase === 1 ? 285 : this.phase === 2 ? 255 : 225;

        const radial = Phaser.Math.Clamp((dist - desiredDistance) / 105, -1, 1);

        const orbit = toPlayer + Math.PI / 2;

        dragon.setVelocity(
          Math.cos(toPlayer) * radial * speed +
            Math.cos(orbit) * speed * 0.82 * this.orbitDir,

          Math.sin(toPlayer) * radial * speed +
            Math.sin(orbit) * speed * 0.82 * this.orbitDir,
        );

        if (this.aiTimer <= 0) {
          this.chooseAttack();
        }

        break;
      }

      // -----------------------------------------------------------
      // Telegraph
      // -----------------------------------------------------------

      case "telegraph": {
        const body = this.dragonBody;

        dragon.setVelocity(body.velocity.x * 0.85, body.velocity.y * 0.85);

        dragon.setScale(
          DRAGON.scale + 0.025 * Math.sin(time / (this.phase === 3 ? 24 : 35)),
        );

        if (this.aiTimer <= 0) {
          dragon.setScale(DRAGON.scale);

          this.startAttack();
        }

        break;
      }

      // -----------------------------------------------------------
      // Volley
      // -----------------------------------------------------------

      case "volley": {
        this.shotTimer -= delta;

        if (this.shotTimer <= 0 && this.shotsLeft > 0) {
          const spread =
            this.phase === 1
              ? Phaser.Math.FloatBetween(-0.08, 0.08)
              : Phaser.Math.FloatBetween(-0.13, 0.13);

          const target = this.getAttackTarget();

          const angle =
            Phaser.Math.Angle.Between(dragon.x, dragon.y, target.x, target.y) +
            spread;

          const speed = this.phase === 1 ? 350 : this.phase === 2 ? 410 : 470;

          const mouth = this.mouthPosition(angle);

          this.spawnFire(mouth.x, mouth.y, angle, speed, 1);

          this.shotsLeft -= 1;
          this.shotTimer = this.phase === 1 ? 145 : this.phase === 2 ? 115 : 90;
        }

        if (this.shotsLeft <= 0 && this.aiTimer <= 0) {
          const recoverTime =
            this.phase === 1 ? 520 : this.phase === 2 ? 390 : 280;

          this.setAi("recover", recoverTime);
        }

        break;
      }

      // -----------------------------------------------------------
      // Ring
      // -----------------------------------------------------------

      case "ring": {
        this.shotTimer -= delta;

        if (this.shotTimer <= 0 && this.shotsLeft > 0) {
          const count = this.phase === 1 ? 15 : this.phase === 2 ? 18 : 21;

          const offset = (this.shotsLeft % 2) * (Math.PI / count);

          const speed = this.phase === 1 ? 245 : this.phase === 2 ? 275 : 305;

          for (let i = 0; i < count; i += 1) {
            this.spawnFire(
              dragon.x,
              dragon.y,
              offset + (i / count) * Math.PI * 2,
              speed,
              0.9,
            );
          }

          this.shotsLeft -= 1;
          this.shotTimer = this.phase === 3 ? 300 : 380;
        }

        if (this.shotsLeft <= 0 && this.aiTimer <= 0) {
          const recoverTime =
            this.phase === 1 ? 560 : this.phase === 2 ? 420 : 300;

          this.setAi("recover", recoverTime);
        }

        break;
      }

      // -----------------------------------------------------------
      // Breath
      // -----------------------------------------------------------

      case "breath": {
        const duration = this.phase === 2 ? 1650 : 1900;

        const progress = 1 - Phaser.Math.Clamp(this.aiTimer / duration, 0, 1);

        // This is the mathematical attack angle only.
        // It never rotates the dragon sprite.
        const sweep = this.phase === 2 ? 1.85 : 2.15;

        const angle = this.breathBase - sweep / 2 + sweep * progress;

        this.shotTimer -= delta;

        if (this.shotTimer <= 0) {
          const jitter =
            this.phase === 2
              ? Phaser.Math.FloatBetween(-0.07, 0.07)
              : Phaser.Math.FloatBetween(-0.09, 0.09);

          const attackAngle = angle + jitter;

          const mouth = this.mouthPosition(attackAngle);

          const speed = this.phase === 2 ? 455 : 505;
          const life = this.phase === 2 ? 1650 : 1850;

          this.spawnFire(mouth.x, mouth.y, attackAngle, speed, 0.75, life);

          this.shotTimer = this.phase === 2 ? 48 : 38;
        }

        if (this.aiTimer <= 0) {
          this.setAi("recover", this.phase === 2 ? 520 : 360);
        }

        break;
      }

      // -----------------------------------------------------------
      // Charge
      // -----------------------------------------------------------

      case "charge": {
        const body = this.dragonBody;

        this.shotTimer -= delta;

        if (this.shotTimer <= 0) {
          const poolLife =
            this.phase === 1 ? 2300 : this.phase === 2 ? 2700 : 3100;

          this.spawnPool(dragon.x, dragon.y, poolLife);

          this.shotTimer = this.phase === 1 ? 120 : this.phase === 2 ? 95 : 75;
        }

        const hitWall =
          body.blocked.left ||
          body.blocked.right ||
          body.blocked.up ||
          body.blocked.down;

        if (this.aiTimer <= 0 || hitWall) {
          if (hitWall) {
            this.cameras.main.shake(200, 0.01);
          }

          const recoverTime =
            this.phase === 1 ? 650 : this.phase === 2 ? 480 : 330;

          this.setAi("recover", recoverTime);
        }

        break;
      }

      // -----------------------------------------------------------
      // Rain
      // -----------------------------------------------------------

      case "rain": {
        if (this.aiTimer <= 0) {
          this.setAi("recover", 600);
        }

        break;
      }
    }
  }

  // ===============================================================
  // ATTACK TARGET
  // ===============================================================

  private getAttackTarget(): Phaser.Math.Vector2 {
    if (this.owlbearSafe) {
      const chance = this.phase === 1 ? 0.25 : this.phase === 2 ? 0.38 : 0.5;

      if (Math.random() < chance) {
        return new Phaser.Math.Vector2(this.owlbear.x, this.owlbear.y);
      }
    }

    return new Phaser.Math.Vector2(this.player.x, this.player.y);
  }

  // ===============================================================
  // CHOOSE ATTACK
  // ===============================================================

  private chooseAttack(): void {
    // Weighted attack pools. Later phases deliberately favour
    // combinations that force movement instead of allowing the
    // player to stand at a safe distance and spam attacks.
    const pool: AttackName[] =
      this.phase === 1
        ? ["volley", "volley", "ring", "charge"]
        : this.phase === 2
          ? ["volley", "ring", "breath", "breath", "charge", "charge"]
          : [
              "volley",
              "ring",
              "breath",
              "breath",
              "charge",
              "charge",
              "rain",
              "rain",
            ];

    let pick = Phaser.Utils.Array.GetRandom(pool) as AttackName;

    // Do not repeat the same attack twice in a row.
    if (pick === this.lastAttack) {
      const alternatives = pool.filter((attack) => attack !== this.lastAttack);
      pick = Phaser.Utils.Array.GetRandom(alternatives) as AttackName;
    }

    this.lastAttack = pick;
    this.pendingAttack = pick;

    this.orbitDir = Math.random() < 0.5 ? 1 : -1;

    const telegraph = this.phase === 1 ? 420 : this.phase === 2 ? 330 : 250;

    this.setAi("telegraph", telegraph);
  }

  // ===============================================================
  // START ATTACK
  // ===============================================================

  private startAttack(): void {
    const { dragon, player } = this;

    this.shotTimer = 0;

    switch (this.pendingAttack) {
      case "volley": {
        const shots = this.phase === 1 ? 4 : this.phase === 2 ? 5 : 6;

        const duration = this.phase === 1 ? 780 : this.phase === 2 ? 700 : 620;

        this.shotsLeft = shots;

        this.setAi("volley", duration);

        break;
      }

      case "ring": {
        const waves = this.phase === 1 ? 1 : this.phase === 2 ? 2 : 3;

        this.shotsLeft = waves;

        const duration =
          this.phase === 1 ? 700 : this.phase === 2 ? 1050 : 1250;

        this.setAi("ring", duration);

        break;
      }

      case "breath": {
        const target = this.getAttackTarget();

        this.breathBase = Phaser.Math.Angle.Between(
          dragon.x,
          dragon.y,
          target.x,
          target.y,
        );

        const duration = this.phase === 2 ? 1650 : 1900;

        this.setAi("breath", duration);

        break;
      }

      case "charge": {
        const target = this.getAttackTarget();

        const angle = Phaser.Math.Angle.Between(
          dragon.x,
          dragon.y,
          target.x,
          target.y,
        );

        const speed = this.phase === 1 ? 670 : this.phase === 2 ? 730 : 790;

        const duration =
          this.phase === 1 ? 1250 : this.phase === 2 ? 1150 : 1050;

        this.setAi("charge", duration);

        dragon.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        break;
      }

      case "rain": {
        const warningCount = this.phase === 3 ? 10 : 8;

        const duration = this.phase === 3 ? 1550 : 1300;

        this.setAi("rain", duration);

        for (let i = 0; i < warningCount; i += 1) {
          const target =
            this.owlbearSafe && Math.random() < 0.5 ? this.owlbear : player;

          const spreadX = Phaser.Math.Between(-250, 250);
          const spreadY = Phaser.Math.Between(-190, 190);

          this.spawnWarning(
            Phaser.Math.Clamp(target.x + spreadX, PAD + 48, W - PAD - 48),
            Phaser.Math.Clamp(target.y + spreadY, PAD + 48, H - PAD - 48),
            650 + i * 55,
          );
        }

        break;
      }
    }
  }

  // ===============================================================
  // DRAGON MOUTH
  // ===============================================================

  /**
   * Возвращает позицию пасти по математическому
   * направлению конкретной атаки.
   *
   * Важно: angle здесь НЕ меняет rotation дракона.
   */
  private mouthPosition(angle: number): Phaser.Math.Vector2 {
    const { dragon } = this;

    const forward = 122;
    const side = -18;

    const cos = Math.cos(angle);

    const sin = Math.sin(angle);

    return new Phaser.Math.Vector2(
      dragon.x + cos * forward - sin * side,

      dragon.y + sin * forward + cos * side,
    );
  }

  // ===============================================================
  // OWLBEAR
  // ===============================================================

  private updateOwlbear(time: number, delta: number): void {
    if (!this.owlbear.active || this.gameOver) {
      return;
    }

    this.owlbearDangerZone.setPosition(this.owlbear.x, this.owlbear.y);

    this.owlbearDangerZone.setVisible(!this.owlbearSafe);

    // -------------------------------------------------------------
    // До спасения
    // -------------------------------------------------------------

    if (!this.owlbearSafe) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.owlbear.x,
        this.owlbear.y,
      );

      if (distance <= OWLBEAR.rescueDistance) {
        this.rescueOwlbear();
      }

      this.owlbear.setVelocity(0, 0);

      return;
    }

    // -------------------------------------------------------------
    // Follow player
    // -------------------------------------------------------------

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.owlbear.x,
      this.owlbear.y,
      this.player.x,
      this.player.y,
    );

    if (distanceToPlayer > OWLBEAR.followDistance) {
      const angle = Phaser.Math.Angle.Between(
        this.owlbear.x,
        this.owlbear.y,
        this.player.x,
        this.player.y,
      );

      const speed = Math.min(
        OWLBEAR.followSpeed,
        Math.max(50, distanceToPlayer * 3),
      );

      this.owlbear.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
      );
    } else {
      this.owlbear.setVelocity(0, 0);
    }

    // -------------------------------------------------------------
    // Медвесыч помогает оглушить дракона
    // -------------------------------------------------------------

    if (
      time >= this.owlbearNextAttackAt &&
      Phaser.Math.Distance.Between(
        this.owlbear.x,
        this.owlbear.y,
        this.dragon.x,
        this.dragon.y,
      ) < 105
    ) {
      this.owlbearNextAttackAt = time + 1200;

      this.poise = Math.min(DRAGON.poiseMax, this.poise + 4);

      this.spawnBurst(this.dragon.x, this.dragon.y, 0xe8b66a, 5);

      if (this.poise >= DRAGON.poiseMax && this.aiState !== "stagger") {
        this.poise = 0;

        this.setAi("stagger", DRAGON.staggerTime);

        this.hooks.onAnnounce("Медвесыч оглушил дракона!");
      }

      this.pushStats();
    }

    void delta;
  }

  // ===============================================================
  // RESCUE OWLBEAR
  // ===============================================================

  private rescueOwlbear(): void {
    if (this.owlbearSafe) {
      return;
    }

    this.owlbearSafe = true;

    this.owlbearMaxHp = OWLBEAR.rescuedMaxHp;

    this.owlbearHp = this.owlbearMaxHp;

    this.owlbearInvulnerableUntil = this.time.now + OWLBEAR.damageCooldown;

    this.owlbearDangerZone.setVisible(false);

    this.owlbear.setTint(0xffd59a);

    this.tweens.add({
      targets: this.owlbear,
      scale: OWLBEAR.scale * 1.18,
      duration: 140,
      yoyo: true,
      ease: "Quad.Out",
    });

    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xe8c27a, 16);

    this.cameras.main.flash(180, 232, 194, 122);

    this.hooks.onAnnounce(
      `Медвесыч спасён! ${this.owlbearHp}/${this.owlbearMaxHp} HP`,
    );

    this.pushStats(true);
  }

  // ===============================================================
  // OWLBEAR DAMAGE BEFORE RESCUE
  // ===============================================================

  private damageOwlbearBeforeRescue(amount: number): void {
    if (this.owlbearSafe || this.gameOver) {
      return;
    }

    this.owlbearHp = Math.max(0, this.owlbearHp - amount);

    this.owlbear.setTint(0xff6655);

    this.time.delayedCall(120, () => {
      if (this.owlbear.active && !this.owlbearSafe) {
        this.owlbear.clearTint();
      }
    });

    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xff6b4a, 7);

    this.hooks.onAnnounce(
      this.owlbearHp > 0
        ? `Медвесыч ранен! ${this.owlbearHp}/${this.owlbearMaxHp}`
        : "Медвесыч погиб…",
    );

    this.pushStats(true);

    if (this.owlbearHp <= 0) {
      this.finish(false, "owlbear");
    }
  }

  // ===============================================================
  // OWLBEAR DAMAGE
  // ===============================================================

  private damageOwlbear(amount: number): void {
    if (!this.owlbearSafe || this.gameOver) {
      return;
    }

    if (this.time.now < this.owlbearInvulnerableUntil) {
      return;
    }

    this.owlbearHp = Math.max(0, this.owlbearHp - amount);

    this.owlbearInvulnerableUntil = this.time.now + OWLBEAR.damageCooldown;

    this.owlbear.setTint(0xff6655);

    this.time.delayedCall(120, () => {
      if (!this.owlbear.active || this.gameOver) {
        return;
      }

      this.owlbear.clearTint();

      this.owlbear.setTint(0xffd59a);
    });

    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xff6b4a, 8);

    this.cameras.main.shake(90, 0.004);

    if (this.owlbearHp <= 0) {
      this.owlbearHp = 0;

      this.pushStats(true);

      this.hooks.onAnnounce("Медвесыч погиб…");

      this.finish(false, "owlbear");

      return;
    }

    this.hooks.onAnnounce(
      `Медвесыч ранен! ${this.owlbearHp}/${this.owlbearMaxHp}`,
    );

    this.pushStats(true);
  }

  // ===============================================================
  // PROJECTILES
  // ===============================================================

  private getFires(): Fireball[] {
    return this.fires.getChildren().slice() as Fireball[];
  }

  private getPools(): FirePool[] {
    return this.pools.getChildren().slice() as FirePool[];
  }

  private spawnFire(
    x: number,
    y: number,
    angle: number,
    speed: number,
    scale = 1,
    life = 3500,
  ): void {
    const ball = this.fires.create(x, y, TEXTURES.fire) as Fireball;

    ball.setDepth(9).setScale(scale);

    ball.setCircle(9, 4, 4);

    const body = ball.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);

    ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    ball.life = life;
  }

  // ===============================================================
  // FIRE POOL
  // ===============================================================

  private spawnPool(x: number, y: number, life = 2600): void {
    const pool = this.add.image(x, y, TEXTURES.pool) as FirePool;

    pool.setDepth(2).setScale(0.6).setAlpha(0);

    pool.life = life;
    pool.hitTimer = 0;
    pool.owlbearHitTimer = 0;

    this.tweens.add({
      targets: pool,
      alpha: 1,
      scale: 0.95,
      duration: 180,
    });

    this.pools.add(pool);
  }

  // ===============================================================
  // WARNING
  // ===============================================================

  /**
   * Круг-предупреждение, на месте которого
   * через delay появится лужа.
   */
  private spawnWarning(x: number, y: number, delay: number): void {
    const ring = this.add
      .circle(x, y, 44)
      .setStrokeStyle(2, 0xffa63d, 0.9)
      .setDepth(2);

    const fill = this.add.circle(x, y, 6, 0xffa63d, 0.35).setDepth(2);

    this.tweens.add({
      targets: fill,
      scale: 7,
      duration: delay,

      onComplete: () => {
        ring.destroy();
        fill.destroy();

        if (this.gameOver) {
          return;
        }

        this.spawnPool(x, y, 1800);

        this.spawnBurst(x, y, 0xffa63d, 12);

        const playerDist = Phaser.Math.Distance.Between(
          x,
          y,
          this.player.x,
          this.player.y,
        );

        if (playerDist < 48) {
          this.hurtPlayer(1);
        }

        if (
          this.owlbearSafe &&
          Phaser.Math.Distance.Between(x, y, this.owlbear.x, this.owlbear.y) <
            48
        ) {
          this.damageOwlbear(1);
        }
      },
    });
  }

  // ===============================================================
  // UPDATE PROJECTILES
  // ===============================================================

  private updateProjectiles(delta: number): void {
    // -------------------------------------------------------------
    // Fireballs
    // -------------------------------------------------------------

    this.getFires().forEach((ball) => {
      ball.life -= delta;

      // Вращение огненного шара оставляем:
      // это эффект самого projectile, а не дракона.
      ball.rotation += delta * 0.02;

      const outside =
        ball.x < PAD - 20 ||
        ball.x > W - PAD + 20 ||
        ball.y < PAD - 20 ||
        ball.y > H - PAD + 20;

      if (ball.life <= 0 || outside) {
        ball.destroy();
      }
    });

    // -------------------------------------------------------------
    // Fire pools
    // -------------------------------------------------------------

    this.getPools().forEach((pool) => {
      pool.life -= delta;
      pool.hitTimer -= delta;

      if (pool.life < 400) {
        pool.setAlpha(Math.max(0, pool.life / 400));
      }

      // Player
      const dist = Phaser.Math.Distance.Between(
        pool.x,
        pool.y,
        this.player.x,
        this.player.y,
      );

      if (!this.gameOver && pool.hitTimer <= 0 && dist < 40) {
        pool.hitTimer = 500;

        this.hurtPlayer(1, 120);
      }

      // Owlbear
      if (
        !this.gameOver &&
        this.owlbearSafe &&
        pool.owlbearHitTimer <= 0 &&
        Phaser.Math.Distance.Between(
          pool.x,
          pool.y,
          this.owlbear.x,
          this.owlbear.y,
        ) < 40
      ) {
        pool.owlbearHitTimer = 500;

        this.damageOwlbear(1);
      }

      if (pool.life <= 0) {
        pool.destroy();
      }
    });
  }

  // ===============================================================
  // PARTICLES
  // ===============================================================

  private spawnBurst(x: number, y: number, color: number, count: number): void {
    for (let i = 0; i < count; i += 1) {
      const spark = this.add
        .image(x, y, TEXTURES.spark)
        .setTint(color)
        .setDepth(20)
        .setScale(Phaser.Math.FloatBetween(0.4, 1.1));

      const angle = Math.random() * Math.PI * 2;

      const radius = Phaser.Math.Between(16, 52);

      this.tweens.add({
        targets: spark,

        x: x + Math.cos(angle) * radius,

        y: y + Math.sin(angle) * radius,

        alpha: 0,
        scale: 0,

        duration: Phaser.Math.Between(220, 420),

        onComplete: () => {
          spark.destroy();
        },
      });
    }
  }

  // ===============================================================
  // FINISH
  // ===============================================================

  private finish(won: boolean, reason: "player" | "owlbear" = "player"): void {
    this.gameOver = true;

    this.player.setVelocity(0, 0);

    this.dragon.setVelocity(0, 0);

    this.sword.setVisible(false);

    this.fires.clear(true, true);

    this.owlbear.setVelocity(0, 0);

    this.owlbearDangerZone.setVisible(false);

    if (won) {
      this.dragon.setTint(0x555a70);

      this.tweens.add({
        targets: this.dragon,
        alpha: 0.25,
        scale: DRAGON.scale * 0.9,
        duration: 900,
      });

      this.cameras.main.flash(400, 232, 194, 122);
    } else {
      this.tweens.add({
        targets: this.player,
        alpha: 0.2,
        scale: 0.6,
        duration: 700,
      });
    }

    this.hooks.onEnd(won, won ? undefined : reason);
  }
}
