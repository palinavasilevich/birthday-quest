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
  BattleBonuses,
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
  private bonuses: BattleBonuses;
  private mi01StunUsed = false;
  private mi01HealUsed = false;
  private mi01AvailableAt = 0;

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

  // When Medвесыч is badly wounded, the player must stay near him
  // long enough to help him recover.
  private owlbearNeedsHelp = false;
  private owlbearAidProgress = 0;
  private owlbearAidAnnounced = false;

  // ---------------------------------------------------------------
  // AI
  // ---------------------------------------------------------------

  private phase: 1 | 2 | 3 = 1;
  private aiState: AiState = "intro";
  private aiTimer = 1400;

  private orbitDir: 1 | -1 = 1;
  private pendingAttack: AttackName = "volley";
  private lastAttack: AttackName | null = null;

  // Phase 3 can chain attacks without giving the player
  // a completely safe reset between them.
  private attackQueue: AttackName[] = [];

  // After several clean hits the dragon briefly hardens.
  // Stagger/counter breaks this protection.
  private dragonGuardUntil = 0;
  private dragonConsecutiveHits = 0;
  private lastDragonHitAt = 0;

  private shotsLeft = 0;
  private shotTimer = 0;
  private breathBase = 0;

  private mi01!: Phaser.GameObjects.Image;
  private attackWarnings!: Phaser.GameObjects.Group;
  // private mi01Trail!: Phaser.GameObjects.Particles.ParticleEmitter;

  // ---------------------------------------------------------------
  // Состояние игры
  // ---------------------------------------------------------------

  private gameOver = false;
  private lastStats: GameStats | null = null;

  constructor(hooks: GameHooks, bonuses: BattleBonuses) {
    super(SCENE_KEYS.arena);
    this.hooks = hooks;
    this.bonuses = bonuses;
  }

  setBonuses(bonuses: BattleBonuses): void {
    this.bonuses = bonuses;
  }

  // ===============================================================
  // PRELOAD
  // ===============================================================

  preload(): void {
    const arenaUrl = new URL("./forest-arena.png", import.meta.url).href;
    this.load.image("forest-arena", arenaUrl);

    const dragonUrl = new URL("./dragon.svg", import.meta.url).href;

    this.load.svg(TEXTURES.dragon, dragonUrl, {
      width: 520,
      height: 323,
    });

    const mi01Url = new URL("./mi01.png", import.meta.url).href;
    this.load.image("mi01", mi01Url);

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

    this.add
      .image(W / 2, H / 2, "forest-arena")
      .setDisplaySize(W, H)
      .setDepth(0);

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

    this.mi01 = this.add
      .image(0, 0, "mi01")
      .setScale(0.075)
      .setDepth(12)
      .setVisible(false);
    // -------------------------------------------------------------
    // Снаряды
    // -------------------------------------------------------------

    this.fires = this.physics.add.group();
    this.pools = this.add.group();
    this.attackWarnings = this.add.group();

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
    this.playerHp = PLAYER.maxHp + this.bonuses.extraPlayerHp;

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
    this.owlbearMaxHp = OWLBEAR.initialMaxHp + this.bonuses.extraOwlbearHp;
    this.owlbearHp = this.owlbearMaxHp;
    this.owlbearSafe = false;
    this.owlbearInvulnerableUntil = 0;
    this.owlbearNextAttackAt = 0;
    this.owlbearNeedsHelp = false;
    this.owlbearAidProgress = 0;
    this.owlbearAidAnnounced = false;

    this.mi01StunUsed = false;
    this.mi01HealUsed = false;
    this.mi01AvailableAt = 0;

    this.attackQueue = [];
    this.dragonGuardUntil = 0;
    this.dragonConsecutiveHits = 0;
    this.lastDragonHitAt = 0;

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
      // Проверяем HP каждый кадр: после первого оглушения MI-01
      // автоматически лечит Медвесыча, как только у него < 2 HP.
      this.tryMi01Heal();
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

  private animateMi01Interrupt(): void {
    if (!this.mi01?.active || !this.dragon?.active) return;

    // Если предыдущая анимация ещё не завершилась,
    // прекращаем её перед новым запуском.
    this.tweens.killTweensOf(this.mi01);

    const startX = this.dragon.x - 150;
    const startY = this.dragon.y + 80;

    this.mi01
      .setPosition(startX, startY)
      .setRotation(0)
      .setAlpha(0)
      .setVisible(true);

    // Быстрый влёт.
    this.tweens.add({
      targets: this.mi01,
      alpha: 1,
      x: this.dragon.x - 65,
      y: this.dragon.y - 35,
      duration: 220,
      ease: "Cubic.Out",
      onComplete: () => {
        if (!this.mi01.active || !this.dragon.active) return;

        const centerX = this.dragon.x;
        const centerY = this.dragon.y;
        const radiusX = 95;
        const radiusY = 55;
        const startAngle = Math.PI;

        // Облёт головы дракона.
        const orbit = { angle: startAngle };

        this.tweens.add({
          targets: orbit,
          angle: startAngle + Math.PI * 2,
          duration: 720,
          ease: "Sine.easeInOut",

          onUpdate: () => {
            if (!this.mi01.active) return;

            const progress = orbit.angle;

            this.mi01.setPosition(
              centerX + Math.cos(progress) * radiusX,
              centerY + Math.sin(progress) * radiusY,
            );

            this.mi01.setRotation(progress + Math.PI / 2);

            // Золотистые искры позади жука.
            if (Math.random() > 0.45) {
              const spark = this.add
                .circle(
                  this.mi01.x,
                  this.mi01.y,
                  Phaser.Math.Between(1, 3),
                  0xffc66d,
                  0.9,
                )
                .setDepth(11);

              this.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 0.2,
                duration: 260,
                onComplete: () => spark.destroy(),
              });
            }
          },

          onComplete: () => {
            if (!this.mi01.active) return;

            // Резкий уход из кадра.
            this.tweens.add({
              targets: this.mi01,
              x: W + 70,
              y: this.mi01.y - 100,
              alpha: 0,
              rotation: this.mi01.rotation + Math.PI,
              duration: 300,
              ease: "Cubic.In",
              onComplete: () => this.mi01.setVisible(false),
            });
          },
        });
      },
    });
  }

  private tryMi01Interrupt(): boolean {
    const interruptibleAttacks: AttackName[] = [
      "volley",
      "ring",
      "charge",
      "breath",
      "rain",
    ];

    if (
      !this.bonuses.mi01InterruptAvailable ||
      !this.owlbearSafe ||
      this.time.now < this.mi01AvailableAt ||
      this.mi01StunUsed ||
      this.gameOver ||
      !interruptibleAttacks.includes(this.pendingAttack)
    ) {
      return false;
    }

    this.mi01StunUsed = true;
    this.attackQueue = [];
    this.shotsLeft = 0;

    this.getFires().forEach((fire) => fire.destroy());
    this.attackWarnings?.clear(true, true);
    this.dragon.setVelocity(0, 0);
    this.setAi("stagger", 2500);

    this.animateMi01Interrupt();

    this.hooks.onMi01Interrupt();
    this.hooks.onAnnounce(
      "MI-01 отвлекает дракона! Действуйте, пока он оглушён!",
    );

    this.spawnBurst(this.dragon.x, this.dragon.y, 0x77b88a, 18);

    this.cameras.main.shake(180, 0.008);

    return true;
  }

  /**
   * Второе вмешательство MI-01: если после оглушения дракона
   * у Медвесыча остаётся меньше 2 HP, жук один раз лечит его.
   */
  private tryMi01Heal(): void {
    if (
      !this.bonuses.mi01InterruptAvailable ||
      !this.owlbearSafe ||
      this.time.now < this.mi01AvailableAt ||
      !this.mi01StunUsed ||
      this.mi01HealUsed ||
      this.owlbearHp >= 2 ||
      this.owlbearHp <= 0 ||
      this.gameOver
    ) {
      return;
    }

    this.mi01HealUsed = true;
    this.owlbearHp = Math.min(this.owlbearMaxHp, this.owlbearHp + 3);
    this.owlbearNeedsHelp = false;
    this.owlbearAidProgress = 0;
    this.owlbearAidAnnounced = false;
    this.owlbearInvulnerableUntil = this.time.now + 2_000;

    this.owlbear.clearTint();
    this.owlbear.setTint(0xffd59a);

    this.animateMi01Heal();
    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xe8c27a, 18);
    this.cameras.main.flash(180, 232, 194, 122);

    this.hooks.onAnnounce(
      `MI-01 лечит Медвесыча! ${this.owlbearHp}/${this.owlbearMaxHp} HP`,
    );
    this.pushStats(true);
  }

  /** Жук подлетает к Медвесычу и оставляет золотистый лечебный импульс. */
  private animateMi01Heal(): void {
    if (!this.mi01?.active || !this.owlbear?.active) return;

    this.tweens.killTweensOf(this.mi01);

    this.mi01
      .setPosition(this.owlbear.x - 110, this.owlbear.y - 75)
      .setRotation(0)
      .setAlpha(0)
      .setVisible(true);

    this.tweens.add({
      targets: this.mi01,
      x: this.owlbear.x,
      y: this.owlbear.y - 28,
      alpha: 1,
      duration: 280,
      ease: "Cubic.Out",
      onComplete: () => {
        if (!this.mi01.active) return;

        this.spawnBurst(this.owlbear.x, this.owlbear.y, 0x9ee7a2, 14);
        this.tweens.add({
          targets: this.mi01,
          x: this.owlbear.x + 90,
          y: this.owlbear.y - 80,
          alpha: 0,
          rotation: Math.PI,
          duration: 360,
          ease: "Cubic.In",
          onComplete: () => this.mi01.setVisible(false),
        });
      },
    });
  }

  // ===============================================================
  // DRAGON DAMAGE
  // ===============================================================

  private hitDragon(damage: number): void {
    const now = this.time.now;
    const weak = this.aiState === "recover" || this.aiState === "stagger";
    const counter = this.aiState === "charge";

    // A counter or stagger breaks the dragon's guard.
    if (counter || weak) {
      this.dragonGuardUntil = 0;
      this.dragonConsecutiveHits = 0;
    } else {
      // A rapid string of ordinary hits is partially absorbed by the
      // dragon's scales. This makes timing matter more than button spam.
      if (now - this.lastDragonHitAt > 1400) {
        this.dragonConsecutiveHits = 0;
      }

      this.dragonConsecutiveHits += 1;
      this.lastDragonHitAt = now;

      if (this.dragonConsecutiveHits >= 4) {
        this.dragonGuardUntil = now + 900;
      }
    }

    const guarded = now < this.dragonGuardUntil && !counter && !weak;

    // Hitting the dragon during charge is a risky counter:
    // it deals bonus damage, adds a large amount of poise and
    // immediately interrupts the charge.
    const multiplier =
      (weak ? DRAGON.weakMultiplier : 1) *
      (counter ? 1.35 : 1) *
      (guarded ? 0.55 : 1) *
      this.bonuses.damageMultiplier;

    this.dragonHp -= damage * multiplier;

    this.poise += counter ? 14 : guarded ? Math.ceil(damage * 0.5) : damage;

    if (counter) {
      this.dragon.setVelocity(0, 0);
      this.setAi("stagger", Math.max(850, DRAGON.staggerTime - 450));

      this.hooks.onAnnounce("Контрудар! Дракон остановлен!");
      this.cameras.main.shake(180, 0.009);
    } else if (guarded) {
      this.hooks.onAnnounce("Чешуя дракона отражает удар!");
    } else if (this.dragonConsecutiveHits === 4) {
      this.hooks.onAnnounce("Дракон поднимает чешую!");
    }

    this.dragon.setTint();

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

      this.dragonGuardUntil = 0;
      this.dragonConsecutiveHits = 0;
      this.poise = 0;

      // A phase change starts a fresh attack pattern using the
      // newly unlocked attacks immediately after the short stagger.
      this.attackQueue =
        this.phase === 3
          ? (["rain", "breath", "charge"] as AttackName[])
          : this.phase === 2
            ? (["breath", "ring"] as AttackName[])
            : [];

      this.hooks.onAnnounce(`Фаза ${this.phase}`);

      this.cameras.main.shake(260, 0.012);

      this.setAi(
        "stagger",
        this.phase === 2 ? 950 : this.phase === 3 ? 750 : 900,
      );
    }

    // -------------------------------------------------------------
    // Poise
    // -------------------------------------------------------------

    if (this.poise >= DRAGON.poiseMax && this.aiState !== "stagger") {
      this.poise = 0;

      const staggerTime =
        this.phase === 1 ? 1200 : this.phase === 2 ? 950 : 750;

      this.setAi("stagger", staggerTime);

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
          // Stagger is a damage window, not a safe reset.
          // As soon as the dragon recovers it immediately starts
          // a new phase-appropriate attack.
          this.poise = 0;
          this.dragon.setScale(DRAGON.scale);

          this.chooseAttack(true);
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
            this.phase === 1 ? 2800 : this.phase === 2 ? 3600 : 4600;

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
      const chance = this.owlbearNeedsHelp
        ? this.phase === 3
          ? 0.75
          : 0.6
        : this.phase === 1
          ? 0.25
          : this.phase === 2
            ? 0.38
            : 0.5;

      if (Math.random() < chance) {
        return new Phaser.Math.Vector2(this.owlbear.x, this.owlbear.y);
      }
    }

    return new Phaser.Math.Vector2(this.player.x, this.player.y);
  }

  // ===============================================================
  // CHOOSE ATTACK
  // ===============================================================

  private chooseAttack(immediate = false): void {
    // Every phase immediately unlocks its new attacks.
    //
    // Phase 1: volley / ring / charge
    // Phase 2: + breath
    // Phase 3: + rain
    //
    // Phase 3 can also deliberately chain a combo.
    let pick: AttackName;

    const queued = this.attackQueue.shift();

    if (queued) {
      pick = queued;
    } else {
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
                "ring",
              ];

      pick = Phaser.Utils.Array.GetRandom(pool) as AttackName;

      // Never repeat the same attack when there is another option.
      if (pick === this.lastAttack) {
        const alternatives = pool.filter(
          (attack) => attack !== this.lastAttack,
        );

        if (alternatives.length > 0) {
          pick = Phaser.Utils.Array.GetRandom(alternatives) as AttackName;
        }
      }
    }

    this.lastAttack = pick;
    this.pendingAttack = pick;

    this.orbitDir = Math.random() < 0.5 ? 1 : -1;

    // After stagger the next attack starts very quickly.
    // Normal attacks still get a readable telegraph.
    const normalTelegraph =
      this.phase === 1 ? 420 : this.phase === 2 ? 330 : 250;

    const immediateTelegraph =
      this.phase === 1 ? 180 : this.phase === 2 ? 140 : 110;

    this.setAi("telegraph", immediate ? immediateTelegraph : normalTelegraph);
  }

  // ===============================================================
  // START ATTACK
  // ===============================================================

  private startAttack(): void {
    if (this.tryMi01Interrupt()) {
      return;
    }

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
            this.owlbearSafe &&
            Math.random() < (this.owlbearNeedsHelp ? 0.7 : 0.5)
              ? this.owlbear
              : player;

          const spreadX = Phaser.Math.Between(-250, 250);
          const spreadY = Phaser.Math.Between(-190, 190);

          this.spawnWarning(
            Phaser.Math.Clamp(target.x + spreadX, PAD + 48, W - PAD - 48),
            Phaser.Math.Clamp(target.y + spreadY, PAD + 48, H - PAD - 48),
            650 + i * 55,
          );
        }

        // In the final phase, rain is only the opening move.
        // The player gets a short reposition window, then has to
        // survive a volley followed by a charge.
        if (this.phase === 3) {
          this.attackQueue = ["volley", "charge"];
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

    // The danger ring is also used as a visual warning when the
    // companion needs the player's help.
    this.owlbearDangerZone.setVisible(
      !this.owlbearSafe || this.owlbearNeedsHelp,
    );

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
    // Медвесыч сильно ранен: игрок должен помочь
    // -------------------------------------------------------------

    if (this.owlbearNeedsHelp) {
      this.owlbear.setVelocity(0, 0);

      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.owlbear.x,
        this.owlbear.y,
      );

      if (distance <= 88) {
        this.owlbearAidProgress += delta;

        this.owlbear.setTint(0xffb36b);

        if (this.owlbearAidProgress >= 900) {
          this.owlbearNeedsHelp = false;
          this.owlbearAidProgress = 0;
          this.owlbearAidAnnounced = false;

          this.owlbearHp = Math.min(this.owlbearMaxHp, this.owlbearHp + 2);

          this.owlbearInvulnerableUntil =
            this.time.now + OWLBEAR.damageCooldown + 350;

          this.owlbear.clearTint();
          this.owlbear.setTint(0xffd59a);

          this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xe8c27a, 14);

          this.hooks.onAnnounce(
            `Медвесыч снова в бою! ${this.owlbearHp}/${this.owlbearMaxHp}`,
          );

          this.pushStats(true);
        }
      } else {
        this.owlbearAidProgress = 0;
        this.owlbear.clearTint();
        this.owlbear.setTint(0xffd59a);
      }

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
  }

  // ===============================================================
  // RESCUE OWLBEAR
  // ===============================================================

  private rescueOwlbear(): void {
    if (this.owlbearSafe) {
      return;
    }

    this.owlbearSafe = true;
    this.mi01AvailableAt = this.time.now + 10_000;

    this.owlbearMaxHp = OWLBEAR.rescuedMaxHp + this.bonuses.extraOwlbearHp;
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

    if (this.owlbearHp > 0 && this.owlbearHp <= 2) {
      this.owlbearNeedsHelp = true;
      this.owlbearAidProgress = 0;

      if (!this.owlbearAidAnnounced) {
        this.owlbearAidAnnounced = true;
        this.hooks.onAnnounce("Медвесыч тяжело ранен! Подойдите к нему!");
      }
    }

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

    // Let the arena become progressively dangerous, but never fill it
    // completely. Old pools are removed first when the cap is reached.
    const MAX_POOLS = this.phase === 3 ? 11 : this.phase === 2 ? 9 : 7;
    const activePools = this.getPools();

    if (activePools.length >= MAX_POOLS) {
      activePools[0]?.destroy();
    }

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
    this.attackWarnings.add(ring);
    this.attackWarnings.add(fill);

    this.tweens.add({
      targets: fill,
      scale: 7,
      duration: delay,

      onComplete: () => {
        // MI-01 can cancel the warning before it becomes a fire pool.
        if (!ring.active || !fill.active) return;

        ring.destroy();
        fill.destroy();

        if (this.gameOver) {
          return;
        }

        const poolLife =
          this.phase === 1 ? 2200 : this.phase === 2 ? 3300 : 4300;

        this.spawnPool(x, y, poolLife);

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

    this.attackQueue = [];
    this.dragonGuardUntil = 0;

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
