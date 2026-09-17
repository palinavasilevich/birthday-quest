# The Last Quest — Final Dragon Fight

A React + TypeScript + Phaser 3 final battle redesigned to match the supplied pixel-art UI concept.

## Visual layout

- Ornate fantasy title/header.
- Hero hearts + dash on the top-left.
- Dragon phase + HP bar on the top-right.
- Large 960×600 Phaser arena in the center.
- Bottom-left Owlbear companion panel with live HP.
- Bottom-center WASD / mouse / Shift controls.
- Bottom-right protection warning.
- Responsive scaling through CSS + Phaser `Scale.FIT`.

## Arena

- Dark cracked stone ritual chamber.
- Lava fissures around the edges.
- Four rune-lit pillars.
- Central ritual seal.
- Three glowing circular sigils.
- Hanging chain details.
- Fire projectiles and hazard pools remain dynamic.

## Characters

- Procedural pixel-art knight with silver armor, red plume/cape, shield and sword.
- Large red dragon with wings, horns, eyes, jaw, claws and tail.
- Brown Owlbear with owl face and bear body.

## Mechanics

- Player: 6 HP, sword attack, dash, WASD + mouse.
- Owlbear starts at 3/3 HP.
- Rescue it by approaching within the rescue distance.
- After rescue it becomes 6/6 HP and follows the hero.
- The dragon can still damage and kill the rescued Owlbear.
- Fireballs, pools, warning explosions and charge can damage Owlbear.
- Owlbear can contribute to dragon poise.
- Dragon cannot be killed until Owlbear is rescued.
- Owlbear death or player death = defeat.
- Dragon death while Owlbear is alive = victory.

## Important integration

Copy `GameLayout.tsx` to the existing layout component location, for example:

`src/components/layout/game-layout.tsx`

For the final battle scene use:

`<GameLayout ... isPuzzle={Boolean(scene.puzzle)}>`

Install Phaser if it is not already installed:

`npm install phaser`

No `@ts-nocheck` is used.
