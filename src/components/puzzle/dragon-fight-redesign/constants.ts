export const WORLD = {
  width: 960,
  height: 600,
  padding: 42,
} as const;

export const PLAYER = {
  speed: 275,
  maxHp: 6,
  iframes: 900,
  dashSpeed: 720,
  dashTime: 165,
  dashCooldown: 850,
  attackCooldown: 360,
  attackRange: 96,
  attackDamage: 9,
  attackArc: 1.2,
  scale: 1,
} as const;

export const DRAGON = {
  maxHp: 340,
  poiseMax: 46,
  staggerTime: 1700,
  weakMultiplier: 1.7,
  scale: 0.55,
} as const;

export const OWLBEAR = {
  initialMaxHp: 3,
  rescuedMaxHp: 6,
  rescueDistance: 70,
  followDistance: 54,
  followSpeed: 125,
  damageCooldown: 650,
  scale: 0.72,
} as const;

export const TEXTURES = {
  knight: "knight",
  sword: "sword",
  dragon: "dragon",
  owlbear: "owlbear",
  fire: "fire",
  spark: "spark",
  pool: "pool",
} as const;

export const SCENE_KEYS = {
  arena: "arena",
} as const;
