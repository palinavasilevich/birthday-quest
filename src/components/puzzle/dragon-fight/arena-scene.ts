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
 * Вся боевая логика. Сцена ничего не знает про React — только про интерфейс
 * GameHooks, который ей передают в конструкторе.
 */
export class ArenaScene extends Phaser.Scene {
  private readonly hooks: GameHooks;

  // Явное присваивание: поля инициализируются в create(), а не в конструкторе,
  // потому что Phaser создаёт сцену задолго до запуска игры.
  private player!: Phaser.Physics.Arcade.Sprite;
  private dragon!: Phaser.Physics.Arcade.Sprite;
  private owlbear!: Phaser.Physics.Arcade.Sprite;
  private sword!: Phaser.GameObjects.Sprite;
  private owlbearDangerZone!: Phaser.GameObjects.Arc;
  private fires!: Phaser.Physics.Arcade.Group;
  private pools!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  // Состояние игрока
  private playerHp = PLAYER.maxHp;
  private facing = -Math.PI / 2;
  private moveAngle = 0;
  private invulnUntil = 0;
  private dashUntil = 0;
  private dashReadyAt = 0;
  private nextAttackAt = 0;
  private dashVec = new Phaser.Math.Vector2();
  private aimPointer: Phaser.Math.Vector2 | null = null;
  private wantAttack = false;

  // Состояние взмаха
  private swingActive = false;
  private swingElapsed = 0;
  private swingBase = 0;
  private swingHit = false;

  // Состояние дракона
  private dragonHp: number = DRAGON.maxHp;
  private poise: number = 0;

  // Медвесыч
  private owlbearHp: number = OWLBEAR.maxHp;
  private owlbearSafe = false;
  private owlbearNextAttackAt = 0;
  private phase: 1 | 2 | 3 = 1;
  private aiState: AiState = "intro";
  private aiTimer = 1400;
  private orbitDir: 1 | -1 = 1;
  private pendingAttack: AttackName = "volley";
  private lastAttack: AttackName | null = null;
  private shotsLeft = 0;
  private shotTimer = 0;
  private breathBase = 0;
  private gameOver = false;
  private lastStats: GameStats | null = null;

  constructor(hooks: GameHooks) {
    super(SCENE_KEYS.arena);
    this.hooks = hooks;
  }

  create(): void {
    makeTextures(this);
    this.resetState();
    this.physics.world.setBounds(PAD, PAD, W - PAD * 2, H - PAD * 2);
    this.drawFloor();

    this.player = this.physics.add.sprite(W * 0.5, H * 0.78, TEXTURES.knight);
    this.player.setCircle(12, 5, 5).setCollideWorldBounds(true).setDepth(10);

    this.sword = this.add
      .sprite(0, 0, TEXTURES.sword)
      .setOrigin(0.1, 0.5)
      .setDepth(11)
      .setVisible(false);

    this.dragon = this.physics.add
      .sprite(W * 0.5, H * 0.26, TEXTURES.dragon)
      .setScale(0.8)
      .setDepth(8);
    this.dragon.setCircle(48, 58, 27).setCollideWorldBounds(true);

    this.owlbear = this.physics.add
      .sprite(W * 0.78, H * 0.68, TEXTURES.owlbear)
      .setDepth(9)
      .setScale(0.82);
    this.owlbear.setCircle(22, 8, 8);

    this.owlbearDangerZone = this.add
      .circle(this.owlbear.x, this.owlbear.y, 42)
      .setStrokeStyle(2, 0xff6b4a, 0.75)
      .setFillStyle(0xff4d2f, 0.08)
      .setDepth(1);

    this.fires = this.physics.add.group();
    this.pools = this.add.group();

    this.physics.add.overlap(this.player, this.fires, (_player, fire) => {
      const ball = fire as Fireball;
      this.spawnBurst(ball.x, ball.y, 0xffa63d, 6);
      ball.destroy();
      this.hurtPlayer(1);
    });

    this.physics.add.overlap(this.player, this.dragon, () => {
      if (this.aiState === "charge") this.hurtPlayer(1, 420);
    });

    this.physics.add.overlap(this.owlbear, this.fires, (_owlbear, fire) => {
      if (this.owlbearSafe || this.gameOver) return;
      const ball = fire as Fireball;
      ball.destroy();
      this.damageOwlbear(1);
    });

    this.bindInput();
    this.pushStats(true);
    this.hooks.onAnnounce("Дракон просыпается…");
  }

  /** Сцена переиспользуется при restart(), поэтому состояние сбрасываем вручную. */
  private resetState(): void {
    this.playerHp = PLAYER.maxHp;
    this.facing = -Math.PI / 2;
    this.invulnUntil = 0;
    this.dashUntil = 0;
    this.dashReadyAt = 0;
    this.nextAttackAt = 0;
    this.aimPointer = null;
    this.wantAttack = false;
    this.swingActive = false;
    this.dragonHp = DRAGON.maxHp;
    this.poise = 0;
    this.phase = 1;
    this.owlbearHp = OWLBEAR.maxHp;
    this.owlbearSafe = false;
    this.owlbearNextAttackAt = 0;
    this.aiState = "intro";
    this.aiTimer = 1400;
    this.lastAttack = null;
    this.gameOver = false;
    this.lastStats = null;
  }

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

  /** Уведомляем React только когда значения реально изменились. */
  private pushStats(force = false): void {
    const next: GameStats = {
      hp: this.playerHp,
      dragonHp: Math.max(0, Math.round(this.dragonHp)),
      phase: this.phase,
      poise: this.poise,
      owlbearHp: this.owlbearHp,
      owlbearMaxHp: OWLBEAR.maxHp,
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
      prev.owlbearSafe === next.owlbearSafe
    ) {
      return;
    }
    this.lastStats = next;
    this.hooks.onStats(next);
  }

  private drawFloor(): void {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x181a26, 1).fillRect(0, 0, W, H);
    g.fillStyle(0x21243a, 1).fillRect(PAD, PAD, W - PAD * 2, H - PAD * 2);
    g.lineStyle(1, 0x2b2f4a, 0.8);
    for (let x = PAD; x <= W - PAD; x += 48) g.lineBetween(x, PAD, x, H - PAD);
    for (let y = PAD; y <= H - PAD; y += 48) g.lineBetween(PAD, y, W - PAD, y);
    g.fillStyle(0x2a2e48, 1);
    const rocks: Array<[number, number, number]> = [
      [130, 160, 26],
      [820, 200, 22],
      [250, 470, 18],
      [700, 480, 30],
      [480, 300, 16],
    ];
    rocks.forEach(([x, y, r]) => g.fillCircle(x, y, r));
    g.lineStyle(3, 0x4a3a62, 1).strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);
  }

  override update(time: number, delta: number): void {
    if (!this.gameOver) {
      this.updatePlayer(time, delta);
      this.updateDragon(time, delta);
      this.updateOwlbear(time, delta);
    }
    this.updateProjectiles(delta);
  }

  // ----------------------------------------------------------------- игрок

  private updatePlayer(time: number, delta: number): void {
    const { player, keys, cursors } = this;
    let vx = 0;
    let vy = 0;
    if (cursors.left.isDown || keys.A.isDown) vx -= 1;
    if (cursors.right.isDown || keys.D.isDown) vx += 1;
    if (cursors.up.isDown || keys.W.isDown) vy -= 1;
    if (cursors.down.isDown || keys.S.isDown) vy += 1;

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      vx /= len;
      vy /= len;
      this.moveAngle = Math.atan2(vy, vx);
    }

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

    if (time < this.dashUntil) {
      player.setVelocity(this.dashVec.x, this.dashVec.y);
      player.setAlpha(0.55);
    } else {
      player.setVelocity(vx * PLAYER.speed, vy * PLAYER.speed);
      player.setAlpha(
        time < this.invulnUntil ? 0.4 + 0.4 * Math.sin(time / 55) : 1,
      );
    }

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
    player.setRotation(this.facing);

    const pressed =
      Phaser.Input.Keyboard.JustDown(keys.SPACE) || this.wantAttack;
    this.wantAttack = false;
    if (pressed && time > this.nextAttackAt) this.startSwing(time);
    if (this.swingActive) this.updateSwing(delta);
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
        this.player.x + Math.cos(angle) * 12,
        this.player.y + Math.sin(angle) * 12,
      )
      .setRotation(angle)
      .setAlpha(1 - t * 0.5);

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

    // Меч сбивает огненные шары
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

  private hurtPlayer(damage: number, knockback = 260): void {
    if (this.time.now < this.invulnUntil || this.gameOver) return;

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
    if (this.playerHp <= 0) this.finish(false);
  }

  // ---------------------------------------------------------------- дракон

  private hitDragon(damage: number): void {
    const weak = this.aiState === "recover" || this.aiState === "stagger";
    const multiplier = weak ? DRAGON.weakMultiplier : 1;
    this.dragonHp -= damage * multiplier;
    this.poise += damage;

    // this.dragon.setTintFill(0xffffff);
    this.dragon.setTintFill();
    this.time.delayedCall(70, () => {
      if (!this.dragon.active) return;
      this.dragon.clearTint();
      if (this.aiState === "stagger") this.dragon.setTint(0x8fa7c9);
    });
    this.spawnBurst(
      this.dragon.x + Phaser.Math.Between(-20, 20),
      this.dragon.y + Phaser.Math.Between(-20, 20),
      weak ? 0xffd34d : 0xc94b3e,
      9,
    );

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

    if (this.poise >= DRAGON.poiseMax && this.aiState !== "stagger") {
      this.poise = 0;
      this.setAi("stagger", DRAGON.staggerTime);
      this.hooks.onAnnounce("Дракон оглушён!");
    }

    this.pushStats();

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

  private setAi(state: AiState, durationMs: number): void {
    this.aiState = state;
    this.aiTimer = durationMs;
    this.dragon.setVelocity(0, 0);
    this.dragon.clearTint();
    if (state === "stagger") this.dragon.setTint(0x8fa7c9);
    if (state === "telegraph") this.dragon.setTint(0xff9a80);
  }

  private get dragonBody(): Phaser.Physics.Arcade.Body {
    return this.dragon.body as Phaser.Physics.Arcade.Body;
  }

  private updateDragon(time: number, delta: number): void {
    const { dragon, player } = this;
    this.aiTimer -= delta;

    if (this.aiState !== "charge") {
      const toPlayer = Phaser.Math.Angle.Between(
        dragon.x,
        dragon.y,
        player.x,
        player.y,
      );
      dragon.rotation = Phaser.Math.Angle.RotateTo(
        dragon.rotation,
        toPlayer,
        0.05,
      );
    }

    switch (this.aiState) {
      case "intro":
      case "stagger":
      case "recover": {
        const body = this.dragonBody;
        dragon.setVelocity(body.velocity.x * 0.9, body.velocity.y * 0.9);
        if (this.aiTimer <= 0) this.setAi("reposition", 700 - this.phase * 120);
        break;
      }

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
        const speed = 100 + this.phase * 40;
        const radial = Phaser.Math.Clamp((dist - 270) / 120, -1, 1);
        const orbit = toPlayer + Math.PI / 2;
        dragon.setVelocity(
          Math.cos(toPlayer) * radial * speed +
            Math.cos(orbit) * speed * 0.7 * this.orbitDir,
          Math.sin(toPlayer) * radial * speed +
            Math.sin(orbit) * speed * 0.7 * this.orbitDir,
        );
        if (this.aiTimer <= 0) this.chooseAttack();
        break;
      }

      case "telegraph": {
        const body = this.dragonBody;
        dragon.setVelocity(body.velocity.x * 0.85, body.velocity.y * 0.85);
        dragon.setScale(0.8 + 0.03 * Math.sin(time / 35));
        if (this.aiTimer <= 0) {
          dragon.setScale(0.8);
          this.startAttack();
        }
        break;
      }

      case "volley": {
        this.shotTimer -= delta;
        if (this.shotTimer <= 0 && this.shotsLeft > 0) {
          const spread = Phaser.Math.FloatBetween(-0.09, 0.09);
          const angle =
            Phaser.Math.Angle.Between(dragon.x, dragon.y, player.x, player.y) +
            spread;
          const mouth = this.mouthPosition();
          this.spawnFire(mouth.x, mouth.y, angle, 300 + this.phase * 45, 1);
          this.shotsLeft -= 1;
          this.shotTimer = 150;
        }
        if (this.shotsLeft <= 0 && this.aiTimer <= 0)
          this.setAi("recover", 700);
        break;
      }

      case "ring": {
        this.shotTimer -= delta;
        if (this.shotTimer <= 0 && this.shotsLeft > 0) {
          const count = 12 + this.phase * 3;
          const offset = (this.shotsLeft % 2) * (Math.PI / count);
          for (let i = 0; i < count; i += 1) {
            this.spawnFire(
              dragon.x,
              dragon.y,
              offset + (i / count) * Math.PI * 2,
              215,
              0.9,
            );
          }
          this.shotsLeft -= 1;
          this.shotTimer = 420;
        }
        if (this.shotsLeft <= 0 && this.aiTimer <= 0)
          this.setAi("recover", 750);
        break;
      }

      case "breath": {
        const progress = 1 - Phaser.Math.Clamp(this.aiTimer / 1500, 0, 1);
        const angle = this.breathBase - 0.85 + 1.7 * progress;
        dragon.rotation = angle;
        this.shotTimer -= delta;
        if (this.shotTimer <= 0) {
          const mouth = this.mouthPosition();
          const jitter = Phaser.Math.FloatBetween(-0.06, 0.06);
          this.spawnFire(mouth.x, mouth.y, angle + jitter, 430, 0.75, 1400);
          this.shotTimer = 40;
        }
        if (this.aiTimer <= 0) this.setAi("recover", 900);
        break;
      }

      case "charge": {
        const body = this.dragonBody;
        dragon.rotation = Math.atan2(body.velocity.y, body.velocity.x);
        this.shotTimer -= delta;
        if (this.shotTimer <= 0) {
          this.spawnPool(dragon.x, dragon.y, 2200);
          this.shotTimer = 130;
        }
        const hitWall =
          body.blocked.left ||
          body.blocked.right ||
          body.blocked.up ||
          body.blocked.down;
        if (this.aiTimer <= 0 || hitWall) {
          if (hitWall) this.cameras.main.shake(200, 0.01);
          this.setAi("recover", 1000);
        }
        break;
      }

      case "rain": {
        if (this.aiTimer <= 0) this.setAi("recover", 600);
        break;
      }
    }
  }

  private chooseAttack(): void {
    const pool: AttackName[] = ["volley", "ring", "charge"];
    if (this.phase >= 2) pool.push("breath", "volley", "charge");
    if (this.phase >= 3) pool.push("rain", "breath", "ring");

    let pick = Phaser.Utils.Array.GetRandom(pool) as AttackName;
    if (pick === this.lastAttack)
      pick = Phaser.Utils.Array.GetRandom(pool) as AttackName;

    this.lastAttack = pick;
    this.pendingAttack = pick;
    this.orbitDir = Math.random() < 0.5 ? 1 : -1;
    this.setAi("telegraph", 480 - this.phase * 70);
  }

  private startAttack(): void {
    const { dragon, player } = this;
    this.shotTimer = 0;

    switch (this.pendingAttack) {
      case "volley":
        this.shotsLeft = 3 + this.phase;
        this.setAi("volley", 200 + (3 + this.phase) * 150);
        break;

      case "ring":
        this.shotsLeft = this.phase >= 2 ? 2 : 1;
        this.setAi("ring", 500 + this.shotsLeft * 420);
        break;

      case "breath":
        this.breathBase = Phaser.Math.Angle.Between(
          dragon.x,
          dragon.y,
          player.x,
          player.y,
        );
        this.setAi("breath", 1500);
        break;

      case "charge": {
        const angle = Phaser.Math.Angle.Between(
          dragon.x,
          dragon.y,
          player.x,
          player.y,
        );
        const speed = 620 + this.phase * 50;
        this.setAi("charge", 1100);
        dragon.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        break;
      }

      case "rain":
        this.setAi("rain", 1300);
        for (let i = 0; i < 7; i += 1) {
          this.spawnWarning(
            Phaser.Math.Clamp(
              player.x + Phaser.Math.Between(-260, 260),
              PAD + 40,
              W - PAD - 40,
            ),
            Phaser.Math.Clamp(
              player.y + Phaser.Math.Between(-200, 200),
              PAD + 40,
              H - PAD - 40,
            ),
            800 + i * 40,
          );
        }
        break;
    }
  }

  /** Точка вылета огня — пасть дракона. */
  private mouthPosition(): Phaser.Math.Vector2 {
    const { dragon } = this;
    return new Phaser.Math.Vector2(
      dragon.x + Math.cos(dragon.rotation) * 74,
      dragon.y + Math.sin(dragon.rotation) * 74,
    );
  }

  // --------------------------------------------------------------- Медвесыч

  private updateOwlbear(time: number, delta: number): void {
    if (!this.owlbear.active) return;

    this.owlbearDangerZone.setPosition(this.owlbear.x, this.owlbear.y);
    this.owlbearDangerZone.setVisible(!this.owlbearSafe);

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
      return;
    }

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

    // После спасения Медвесыч иногда помогает оглушать дракона.
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

  private rescueOwlbear(): void {
    if (this.owlbearSafe) return;

    this.owlbearSafe = true;
    this.owlbearDangerZone.setVisible(false);
    this.owlbear.setTint(0xffd59a);
    this.owlbear.setScale(0.9);

    this.tweens.add({
      targets: this.owlbear,
      scale: 1,
      duration: 260,
      ease: "Back.Out",
    });

    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xe8c27a, 14);
    this.hooks.onAnnounce("Медвесыч спасён!");
    this.pushStats(true);
  }

  private damageOwlbear(amount: number): void {
    if (this.owlbearSafe || this.gameOver) return;

    this.owlbearHp = Math.max(0, this.owlbearHp - amount);
    this.owlbear.setTint(0xff6655);
    this.time.delayedCall(140, () => {
      if (this.owlbear.active && this.owlbearSafe === false) {
        this.owlbear.clearTint();
      }
    });

    this.spawnBurst(this.owlbear.x, this.owlbear.y, 0xff6b4a, 8);
    this.hooks.onAnnounce(
      this.owlbearHp > 0
        ? `Медвесыч ранен! ${this.owlbearHp}/${OWLBEAR.maxHp}`
        : "Медвесыч погиб…",
    );

    this.pushStats(true);

    if (this.owlbearHp <= 0) {
      this.finish(false);
    }
  }

  // --------------------------------------------------------------- снаряды

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

  private spawnPool(x: number, y: number, life = 2600): void {
    const pool = this.add.image(x, y, TEXTURES.pool) as FirePool;
    pool.setDepth(2).setScale(0.6).setAlpha(0);
    pool.life = life;
    pool.hitTimer = 0;
    this.tweens.add({ targets: pool, alpha: 1, scale: 0.95, duration: 180 });
    this.pools.add(pool);
  }

  /** Круг-предупреждение, на месте которого через delay появится лужа. */
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
        if (this.gameOver) return;
        this.spawnPool(x, y, 1800);
        this.spawnBurst(x, y, 0xffa63d, 12);
        const dist = Phaser.Math.Distance.Between(
          x,
          y,
          this.player.x,
          this.player.y,
        );
        if (dist < 48) this.hurtPlayer(1);
      },
    });
  }

  private updateProjectiles(delta: number): void {
    this.getFires().forEach((ball) => {
      ball.life -= delta;
      ball.rotation += delta * 0.02;
      const outside =
        ball.x < PAD - 20 ||
        ball.x > W - PAD + 20 ||
        ball.y < PAD - 20 ||
        ball.y > H - PAD + 20;
      if (ball.life <= 0 || outside) ball.destroy();
    });

    this.getPools().forEach((pool) => {
      pool.life -= delta;
      pool.hitTimer -= delta;
      if (pool.life < 400) pool.setAlpha(Math.max(0, pool.life / 400));

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
      if (pool.life <= 0) pool.destroy();
    });
  }

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
        onComplete: () => spark.destroy(),
      });
    }
  }

  private finish(won: boolean): void {
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
        angle: this.dragon.angle + 40,
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

    this.hooks.onEnd(won);
  }
}
