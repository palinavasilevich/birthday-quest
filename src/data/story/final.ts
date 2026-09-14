import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";

export const finalChapter: ChapterData = {
  id: "final",
  title: "THE LAST STAND",

  scenes: [
    // ─────────────────────────────
    // SCENE 01 — RETURN
    // ─────────────────────────────

    {
      id: "final-start",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы снова в лесу.",
      },
      nextScene: "final-start-2",
    },

    {
      id: "final-start-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Но лес изменился.",
      },
      nextScene: "final-start-3",
    },

    {
      id: "final-start-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Воздух наполнен дымом.",
      },
      nextScene: "final-start-4",
    },

    {
      id: "final-start-4",
      background: images.forest,
      content: {
        type: "text",
        text: "На земле лежит пепел.",
      },
      nextScene: "final-start-5",
    },

    {
      id: "final-start-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то впереди раздаётся грохот.",
      },
      nextScene: "final-start-6",
    },

    {
      id: "final-start-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Затем ещё один.",
      },
      nextScene: "final-start-7",
    },

    {
      id: "final-start-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы слышите рёв.",
      },
      nextScene: "final-start-8",
    },

    {
      id: "final-start-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Это не зверь.",
      },
      nextScene: "final-start-9",
    },

    {
      id: "final-start-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Это дракон.",
      },
      nextScene: "final-battlefield",
    },

    // ─────────────────────────────
    // SCENE 02 — BATTLEFIELD
    // ─────────────────────────────

    {
      id: "final-battlefield",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы идёте на звук.",
      },
      nextScene: "final-battlefield-2",
    },

    {
      id: "final-battlefield-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Деревья становятся всё реже.",
      },
      nextScene: "final-battlefield-3",
    },

    {
      id: "final-battlefield-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди открывается поле боя.",
      },
      nextScene: "final-battlefield-4",
    },

    {
      id: "final-battlefield-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Земля изрыта следами огня.",
      },
      nextScene: "final-battlefield-5",
    },

    {
      id: "final-battlefield-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Повсюду лежат обломки.",
      },
      nextScene: "final-battlefield-6",
    },

    {
      id: "final-battlefield-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Над поляной кружит огромная тень.",
      },
      nextScene: "final-battlefield-7",
    },

    {
      id: "final-battlefield-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон.",
      },
      nextScene: "final-battlefield-8",
    },

    {
      id: "final-battlefield-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Он замечает вас.",
      },
      nextScene: "final-battlefield-9",
    },

    {
      id: "final-battlefield-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Раздаётся новый рёв.",
      },
      nextScene: "final-battlefield-10",
    },

    {
      id: "final-battlefield-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Но вы замечаете ещё кое-что.",
      },
      nextScene: "final-battlefield-11",
    },

    {
      id: "final-battlefield-11",
      background: images.forest,
      content: {
        type: "text",
        text: "В стороне от дракона что-то движется.",
      },
      nextScene: "final-battlefield-12",
    },

    {
      id: "final-battlefield-12",
      background: images.forest,
      content: {
        type: "text",
        text: "Маленькая фигура прячется среди обломков.",
      },
      nextScene: "final-battlefield-13",
    },

    {
      id: "final-battlefield-13",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы узнаёте его.",
      },
      nextScene: "final-battlefield-14",
    },

    {
      id: "final-battlefield-14",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч.",
      },
      nextScene: "final-battlefield-15",
    },

    {
      id: "final-battlefield-15",
      background: images.forest,
      content: {
        type: "text",
        text: "Он окружён огнём.",
      },
      nextScene: "final-battlefield-16",
    },

    {
      id: "final-battlefield-16",
      background: images.forest,
      content: {
        type: "text",
        text: "До него невозможно добраться напрямую.",
      },
      nextScene: "final-battlefield-17",
    },

    {
      id: "final-battlefield-17",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон снова поднимается в воздух.",
      },
      nextScene: "final-battlefield-18",
    },

    {
      id: "final-battlefield-18",
      background: images.forest,
      content: {
        type: "text",
        text: "Он готовится атаковать.",
      },
      nextScene: "final-battle",
    },

    // ─────────────────────────────
    // SCENE 03 — THE LAST STAND
    // ─────────────────────────────

    {
      id: "final-battle",
      background: images.forest,
      content: {
        type: "text",
        text: "У вас есть всего несколько секунд.",
      },
      nextScene: "final-battle-2",
    },

    {
      id: "final-battle-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Сначала нужно добраться до Медвесыча.",
      },
      nextScene: "final-battle-3",
    },

    {
      id: "final-battle-3",
      background: images.forest,
      content: {
        type: "text",
        text: "А затем остановить дракона.",
      },
      nextScene: "final-battle-4",
    },

    {
      id: "final-battle-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы смотрите на поле боя.",
      },
      nextScene: "final-battle-5",
    },

    {
      id: "final-battle-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Всё, что вам нужно, уже у вас.",
      },
      nextScene: "final-battle-6",
    },

    {
      id: "final-battle-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Теперь осталось понять, как этим воспользоваться.",
      },
      nextScene: "final-puzzle",
    },

    // ─────────────────────────────
    // SCENE 04 — FINAL PUZZLE
    // ─────────────────────────────

    {
      id: "final-puzzle",
      background: images.forest,
      content: {
        type: "text",
        text: "Ваш ход.",
      },
      puzzle: {
        id: "final-battle-puzzle",
        type: "final",
        nextScene: "final-puzzle-solved",
      },
    },

    // ─────────────────────────────
    // SCENE 05 — THE FIGHT
    // ─────────────────────────────

    {
      id: "final-puzzle-solved",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы находите путь сквозь поле боя.",
      },
      nextScene: "final-puzzle-solved-2",
    },

    {
      id: "final-puzzle-solved-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон выпускает огонь.",
      },
      nextScene: "final-puzzle-solved-3",
    },

    {
      id: "final-puzzle-solved-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы успеваете уклониться.",
      },
      nextScene: "final-puzzle-solved-4",
    },

    {
      id: "final-puzzle-solved-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч всё ещё в опасности.",
      },
      nextScene: "final-puzzle-solved-5",
    },

    {
      id: "final-puzzle-solved-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы добираетесь до него.",
      },
      nextScene: "final-puzzle-solved-6",
    },

    {
      id: "final-puzzle-solved-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Теперь вы стоите между ним и драконом.",
      },
      nextScene: "final-puzzle-solved-7",
    },

    {
      id: "final-puzzle-solved-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон опускается на землю.",
      },
      nextScene: "final-puzzle-solved-8",
    },

    {
      id: "final-puzzle-solved-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Он идёт прямо на вас.",
      },
      nextScene: "final-puzzle-solved-9",
    },

    {
      id: "final-puzzle-solved-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы не отступаете.",
      },
      nextScene: "final-puzzle-solved-10",
    },

    {
      id: "final-puzzle-solved-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Это последний бой.",
      },
      nextScene: "final-dragon-defeated",
    },

    // ─────────────────────────────
    // SCENE 06 — DRAGON DEFEATED
    // ─────────────────────────────

    {
      id: "final-dragon-defeated",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон поднимается в последний раз.",
      },
      nextScene: "final-dragon-defeated-2",
    },

    {
      id: "final-dragon-defeated-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы наносите последний удар.",
      },
      nextScene: "final-dragon-defeated-3",
    },

    {
      id: "final-dragon-defeated-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон падает.",
      },
      nextScene: "final-dragon-defeated-4",
    },

    {
      id: "final-dragon-defeated-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Наступает тишина.",
      },
      nextScene: "final-dragon-defeated-5",
    },

    {
      id: "final-dragon-defeated-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Пепел медленно оседает на землю.",
      },
      nextScene: "final-companion",
    },

    // ─────────────────────────────
    // SCENE 07 — COMPANION
    // ─────────────────────────────

    {
      id: "final-companion",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы оглядываетесь.",
      },
      nextScene: "final-companion-2",
    },

    {
      id: "final-companion-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч всё ещё рядом.",
      },
      nextScene: "final-companion-3",
    },

    {
      id: "final-companion-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Он смотрит на вас.",
      },
      nextScene: "final-companion-4",
    },

    {
      id: "final-companion-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы протягиваете руку.",
      },
      nextScene: "final-companion-5",
    },

    {
      id: "final-companion-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Он долго не двигается.",
      },
      nextScene: "final-companion-6",
    },

    {
      id: "final-companion-6",
      background: images.forest,
      content: {
        type: "text",
        text: "А потом делает шаг вперёд.",
      },
      nextScene: "final-companion-7",
    },

    {
      id: "final-companion-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Ещё один.",
      },
      nextScene: "final-companion-acquired",
    },

    {
      id: "final-companion-acquired",
      background: images.forest,
      content: {
        type: "text",
        text: "COMPANION ACQUIRED",
      },
      nextScene: "final-companion-card",
    },

    // ─────────────────────────────
    // SCENE 08 — COMPANION CARD
    // ─────────────────────────────

    {
      id: "final-companion-card",
      background: images.forest,
      content: {
        type: "text",
        text: `━━━━━━━━━━━━━━━━━━━━

COMPANION

MEDВЕСЫЧ

Origin:
Baldur's Gate

Ability:
Never leaves the party

Status:
PARTY MEMBER

━━━━━━━━━━━━━━━━━━━━`,
      },
      nextScene: "final-reveal",
    },

    // ─────────────────────────────
    // SCENE 09 — FINAL REVEAL
    // ─────────────────────────────

    {
      id: "final-reveal",
      background: images.forest,
      content: {
        type: "text",
        text: "Некоторых спутников спасают.",
      },
      nextScene: "final-reveal-2",
    },

    {
      id: "final-reveal-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Некоторых — заслуживают.",
      },
      nextScene: "final-reveal-3",
    },

    {
      id: "final-reveal-3",
      background: images.forest,
      content: {
        type: "text",
        text: "А некоторых создают своими руками.",
      },
      nextScene: "final-reveal-4",
    },

    {
      id: "final-reveal-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Этот спутник не существует внутри игры.",
      },
      nextScene: "final-reveal-5",
    },

    {
      id: "final-reveal-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Он ждёт тебя в реальном мире.",
      },
      nextScene: "final-ending",
    },

    // ─────────────────────────────
    // SCENE 10 — END
    // ─────────────────────────────

    {
      id: "final-ending",
      background: images.forest,
      content: {
        type: "text",
        text: "Поле боя стихло.",
      },
      nextScene: "final-ending-2",
    },

    {
      id: "final-ending-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Тёмные облака начинают расходиться.",
      },
      nextScene: "final-ending-3",
    },

    {
      id: "final-ending-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч стоит рядом.",
      },
      nextScene: "final-ending-4",
    },

    {
      id: "final-ending-4",
      background: images.forest,
      content: {
        type: "text",
        text: "И впервые за всё путешествие вам не нужно искать дорогу.",
      },
      nextScene: "final-ending-5",
    },

    {
      id: "final-ending-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Потому что теперь вы идёте вместе.",
      },
      nextScene: "final-ending-6",
    },

    {
      id: "final-ending-6",
      background: images.forest,
      content: {
        type: "text",
        text: "THE END",
      },
    },
  ],
};
