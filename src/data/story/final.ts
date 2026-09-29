import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter3";

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
        text: "Когда глаза привыкают к темноте, ты снова видишь знакомые деревья.\n\nТы вернулся в лес.\n\nНо он изменился.",
      },
      specialEffects: ["warp-in"],
      effectDelay: 2500,
      nextScene: "final-start-2",
    },

    {
      id: "final-start-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Воздух наполнен дымом.\n\nНа земле лежит пепел.",
      },
      nextScene: "final-start-3",
    },

    {
      id: "final-start-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то впереди раздаётся грохот.\n\nЗатем ещё раз.",
      },
      nextScene: "final-start-4",
    },

    {
      id: "final-start-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты слышишь рёв.\n\nЧто за зверь можем издавать такие звуки?..",
      },
      nextScene: "final-start-5",
    },

    {
      id: "final-start-5",
      background: images.forest,
      content: {
        type: "text",
        text: "ЭТО ЧТО ДРАКОН?!!",
      },
      nextScene: "final-battlefield",
    },

    // ─────────────────────────────
    // SCENE 02 — BATTLEFIELD
    // ─────────────────────────────

    {
      id: "final-battlefield",
      background: images.battleField,
      content: {
        type: "text",
        text: "Ты идёшь на звук.\n\nДеревья редеют. Впереди открывается поле боя.",
      },
      nextScene: "final-battlefield-2",
    },

    {
      id: "final-battlefield-2",
      background: images.battleField,
      content: {
        type: "text",
        text: "Земля изрыта следами огня.\n\nПовсюду лежат обломки.",
      },
      nextScene: "final-battlefield-3",
    },

    {
      id: "final-battlefield-3",
      background: images.dragon,
      content: {
        type: "text",
        text: "Над поляной кружит огромная тень.\n\nОн замечает тебя. Раздаётся рёв.",
      },
      nextScene: "final-battlefield-4",
    },

    {
      id: "final-battlefield-4",
      background: images.dragon,
      content: {
        type: "text",
        text: "Но ты замечаешь ещё кое-что.\n\nВ стороне, среди обломков, что-то движется.",
      },
      nextScene: "final-battlefield-5",
    },

    {
      id: "final-battlefield-5",
      background: images.dragon,
      content: {
        type: "text",
        text: "Маленькая фигура.\n\nТы узнаёшь её.",
      },
      nextScene: "final-battlefield-6",
    },

    {
      id: "final-battlefield-6",
      background: images.owlbear,
      content: {
        type: "text",
        text: "МЕДВЕСЫЧ?!!\n\nВот кто вёл тебя всё это время.",
      },
      nextScene: "final-battle",
    },

    // ─────────────────────────────
    // SCENE 03 — MI-01
    // ─────────────────────────────

    {
      id: "final-battle",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "Дракон обрушивает огонь на обломки.\n\nМежду вами встаёт стена дыма.",
      },
      nextScene: "final-battle-2",
    },

    {
      id: "final-battle-2",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "Секунду назад ты видел, где он. Теперь — нет.\n\nТебе нужен ориентир.",
      },
      nextScene: "final-battle-3",
    },

    {
      id: "final-battle-3",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И ты вспоминаешь строку из книги:",
      },
      nextScene: "final-battle-4",
    },

    {
      id: "final-battle-4",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "«То, что когда-то существовало лишь в воображении, однажды может стать настоящим — и ожить в твоих руках.»",
      },
      nextScene: "final-battle-5",
    },

    // {
    //   id: "final-battle-4",
    //   background: images.owlbearFire,
    //   content: {
    //     type: "text",
    //     text: "То, что однажды было лишь фантазией,\n\nможет стать настоящим — если однажды решиться создать его.",
    //   },
    //   nextScene: "final-battle-5",
    // },

    {
      id: "final-battle-5",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И ты понимаешь.\n\nВсё необходимое у тебя уже есть.",
      },
      nextScene: "final-battle-6",
    },

    {
      id: "final-battle-6",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты открываешь коробку.\n\nЛатунные пластины. Шестерни. Винты.\n\nВсе эти детали должны сложиться в одно целое.",
      },
      nextScene: "final-battle-7",
    },

    {
      id: "final-battle-7",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты собираешь устройство под рёв дракона. Среди дыма и огня.",
      },
      nextScene: "final-battle-8",
    },

    {
      id: "final-battle-8",
      background: images.device,
      content: {
        type: "text",
        text: "MI-01 лежит у тебя на ладони.\n\nНа мгновение — тишина.\n\nЗатем надкрылья раскрываются.\n\nОн оживает.",
      },
      nextScene: "final-battle-9",
    },

    {
      id: "final-battle-9",
      background: images.deviceFliesAway,
      content: {
        type: "text",
        text: "Ты осторожно подбрасываешь его в воздух.\n\nОн раскрывает крылья и исчезает в густом дыму.",
      },
      nextScene: "final-battle-10",
    },

    {
      id: "final-battle-10",
      background: images.deviceFliesAway,
      content: {
        type: "text",
        text: "Ты ждёшь.\n\nСекунда. Другая.\n\nТолько огонь, дым и рёв дракона.",
      },
      nextScene: "final-battle-11",
    },

    {
      id: "final-battle-11",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "И вдруг — в глубине поля боя появляется маленький огонёк.",
      },
      nextScene: "final-battle-12",
    },

    {
      id: "final-battle-12",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "MI-01 нашёл его.\n\nМедвесыч там.",
      },
      nextScene: "final-battle-13",
    },

    {
      id: "final-battle-13",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "Теперь ты знаешь, где он.\n\nСначала нужно добраться до Медвесыча.\n\nПотом — остановить дракона.",
      },
      nextScene: "final-puzzle",
    },

    // ─────────────────────────────
    // SCENE 04 — THE LAST STAND
    // ─────────────────────────────

    {
      id: "final-puzzle",
      background: images.forest,
      content: {
        type: "text",
        text: "",
      },
      puzzle: {
        id: "final-battle-puzzle",
        type: "final",
        nextScene: "final-victory",
      },
    },

    // ─────────────────────────────
    // SCENE 05 — VICTORY
    // ─────────────────────────────

    {
      id: "final-victory",
      background: images.victoryOverDragon,
      content: {
        type: "text",
        text: "Дракон падает.\n\nНаступает тишина.",
      },
      nextScene: "final-victory-2",
    },

    {
      id: "final-victory-2",
      background: images.victoryOverDragon,
      content: {
        type: "text",
        text: "Пепел медленно оседает на землю.",
      },
      nextScene: "final-victory-3",
    },

    {
      id: "final-victory-3",
      background: images.victoryOverDragonOwlbear,
      content: {
        type: "text",
        text: "Медвесыч рядом c тобой.\n\nОн не отходит ни на шаг с той секунды, как ты до него добрался.",
      },
      nextScene: "final-victory-4",
    },

    {
      id: "final-victory-4",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "MI-01 возвращается сам.\n\nСадится рядом с медвесычом и складывает крылья.",
      },
      nextScene: "final-companion",
    },

    // ─────────────────────────────
    // SCENE 06 — COMPANION
    // ─────────────────────────────

    // {
    //   id: "final-companion",
    //   background: images.forest,
    //   content: {
    //     type: "text",
    //     text: "Ты протягиваешь руку.",
    //   },
    //   nextScene: "final-companion-2",
    // },

    // {
    //   id: "final-companion-2",
    //   background: images.forest,
    //   content: {
    //     type: "text",
    //     text: "Медвесыч делает шаг. Ещё один.\n\nИ садится рядом.",
    //   },
    //   nextScene: "final-companion-3",
    // },

    {
      id: "final-companion",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то вдали звучит та мелодия, что ты слышал у каменной стены.",
      },
      nextScene: "final-companion-2",
    },

    {
      id: "final-companion-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч поднимает голову.\n\nОн узнаёт её раньше, чем ты, и начинает подпевать.",
      },
      nextScene: "final-reveal",
    },

    // ─────────────────────────────
    // SCENE 07 — FINAL REVEAL
    // ─────────────────────────────

    {
      id: "final-reveal",
      background: images.forest,
      content: {
        type: "text",
        text: "Поле боя стихло.\n\nТёмные облака начинают расходиться.",
      },
      nextScene: "final-reveal-2",
    },

    {
      id: "final-reveal-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты вспоминаешь всё, что нашёл по дороге.",
      },
      nextScene: "final-reveal-3",
    },

    {
      id: "final-reveal-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Книгу на пьедестале.\n\nКоробку с жуком в мастерской.",
      },
      nextScene: "final-reveal-4",
    },

    {
      id: "final-reveal-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Чертежи устройства и схему вязания.",
      },
      nextScene: "final-reveal-5",
    },

    {
      id: "final-reveal-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Ничего из этого не лежало там случайно.\n\nКто-то оставил их для тебя.",
      },
      nextScene: "final-thread",
    },

    // ─────────────────────────────
    // SCENE 08 — THE THREAD
    // ─────────────────────────────

    {
      id: "final-thread",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч возится с чем-то рядом.",
      },
      nextScene: "final-thread-2",
    },

    {
      id: "final-thread-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты видишь клубок ниток.\n\nТёплый рыжеватый цвет. Тот же, что и его шерсть.",
      },
      nextScene: "final-thread-3",
    },

    {
      id: "final-thread-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты вынимаешь свою нитку — ту самую, из тёмной комнаты в лесу.",
      },
      nextScene: "final-thread-4",
    },

    {
      id: "final-thread-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Прикладываешь.\n\nТа же пряжа. Тот же клубок, что лежал на столе в мастерской.",
      },
      nextScene: "final-thread-5",
    },

    {
      id: "final-thread-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч опускает клубок на землю.",
      },
      nextScene: "final-thread-6",
    },

    {
      id: "final-thread-6",
      background: images.forest,
      content: {
        type: "text",
        text: "И толкает его лапой.",
      },
      nextScene: "final-thread-7",
    },

    {
      id: "final-thread-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Клубок катится.\n\nМимо обломков.\n\nЗа деревья.",
      },

      actions: [
        {
          id: "go-after",
          label: "Пойти следом",
          nextScene: "final-thread-8",
        },
      ],
    },

    {
      id: "final-thread-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Клубок скрывается за деревьями.\n\nА нитка остаётся.",
      },
      nextScene: "final-thread-10",
    },

    {
      id: "final-thread-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Один её конец здесь, на выжженной земле.\n\nВторой — уже не в этой игре.",
      },
      nextScene: "final-thread-11",
    },

    {
      id: "final-thread-11",
      background: images.forest,
      content: {
        type: "text",
        text: "Подними глаза.\n\nОн где-то совсем рядом с тобой.",
      },
      nextScene: "final-thread-12",
    },

    {
      id: "final-thread-12",
      background: images.forest,
      content: {
        type: "text",
        text: "Книга. Жук. Медвесыч.\n\nВсё это сделала одна пара рук — и ты их очень хорошо знаешь.",
      },
    },

    // ─────────────────────────────
    // SCENE 09 — THE END
    // ─────────────────────────────

    {
      id: "final-the-end",
      background: images.forest,
      content: {
        type: "text",
        text: "THE END",
      },
      nextScene: "final-birthday",
    },
  ],
};
