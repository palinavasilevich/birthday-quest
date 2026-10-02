import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/final";
import { audio } from "@/data/audio/final";

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
      audio: audio.forest,
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
      audio: audio.forest,
      nextScene: "final-start-3",
    },

    {
      id: "final-start-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то впереди раздаётся грохот.\n\nЗатем ещё раз.",
      },
      audio: audio.forest,
      nextScene: "final-start-4",
    },

    {
      id: "final-start-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты слышишь рёв.\n\nЧто за зверь может издавать такие звуки?..",
      },
      audio: audio.forest,
      nextScene: "final-start-5",
    },

    {
      id: "final-start-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Это что... дракон?!",
      },
      audio: audio.forest,
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
      audio: audio.forest,
      nextScene: "final-battlefield-2",
    },

    {
      id: "final-battlefield-2",
      background: images.battleField,
      content: {
        type: "text",
        text: "Земля изрыта следами огня.\n\nПовсюду лежат обломки.",
      },
      audio: audio.forest,
      nextScene: "final-battlefield-3",
    },

    {
      id: "final-battlefield-3",
      background: images.dragon,
      content: {
        type: "text",
        text: "Над поляной кружит огромная тень.\n\nОн замечает тебя. Раздаётся рёв.",
      },
      audio: audio.forest,
      // Медленный наезд — тень дракона раскрывается игроку постепенно.
      specialEffects: ["zoom-in"],
      nextScene: "final-battlefield-4",
    },

    {
      id: "final-battlefield-4",
      background: images.dragon,
      content: {
        type: "text",
        text: "Но ты замечаешь ещё кое-что.\n\nВ стороне, среди обломков, что-то движется.",
      },
      audio: audio.forest,
      nextScene: "final-battlefield-5",
    },

    {
      id: "final-battlefield-5",
      background: images.dragon,
      content: {
        type: "text",
        text: "Маленькая фигура.\n\nТы узнаёшь её.",
      },
      audio: audio.forest,
      nextScene: "final-battlefield-6",
    },

    {
      id: "final-battlefield-6",
      background: images.owlbear,
      content: {
        type: "text",
        text: "Медвесыч?.. \n\nТак вот кто вёл тебя всё это время.",
      },
      audio: audio.dragon,
      // Тёплая вспышка узнавания — та же визуальная рифма, что у рун.
      specialEffects: ["glow"],
      autoTransitionToNextScene: true,
      autoTransitionDelay: 3500,
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
      // Затемнение по краям читается и как дым, застилающий обзор.
      audio: audio.dragon,
      specialEffects: ["vignette-pulse"],
      nextScene: "final-battle-2",
    },

    {
      id: "final-battle-2",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "Секунду назад ты видел, где он. Теперь — нет.\n\nТебе нужен как-то ориентир.",
      },
      audio: audio.dragon,
      nextScene: "final-battle-3",
    },

    {
      id: "final-battle-3",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И ты вспоминаешь строку из книги:\n\nТо, что когда-то существовало лишь в воображении, однажды может стать настоящим...",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-4",
    },

    {
      id: "final-battle-4",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "...и ожить в твоих руках.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-5",
    },

    {
      id: "final-battle-5",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И ты понимаешь.\n\nВсё необходимое у тебя уже есть.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-6",
    },

    {
      id: "final-battle-6",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты открываешь коробку.\n\nЛатунные пластины. Шестерни. Винты.\n\nВсе эти детали должны сложиться в одно целое.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-7",
    },

    {
      id: "final-battle-7",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты собираешь устройство под рёв дракона.\n\nСреди дыма и огня.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-8",
    },
    {
      id: "final-battle-8",
      background: images.device,
      content: {
        type: "text",
        text: "MI-01 лежит у тебя на ладони.\n\nНа мгновение — тишина.\n\nЗатем надкрылья раскрываются.\n\nОн оживает.",
      },
      // Механизм оживает так же, как ожили руны у стены.
      audio: audio.battleWithDragon,
      specialEffects: ["glow"],
      nextScene: "final-battle-9",
    },

    {
      id: "final-battle-9",
      background: images.deviceFliesAway,
      content: {
        type: "text",
        text: "Ты осторожно подбрасываешь его в воздух.\n\nОн раскрывает крылья и исчезает в густом дыму.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-10",
    },

    {
      id: "final-battle-10",
      background: images.deviceFliesAway,
      content: {
        type: "text",
        text: "Ты ждёшь.\n\nСекунда. Другая.\n\nТолько огонь, дым и рёв дракона.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-11",
    },

    {
      id: "final-battle-11",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "И вдруг — в глубине поля боя появляется маленький огонёк.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-12",
    },

    {
      id: "final-battle-12",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "MI-01 нашёл его.\n\nМедвесыч там.",
      },
      audio: audio.battleWithDragon,
      nextScene: "final-battle-13",
    },

    {
      id: "final-battle-13",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "Теперь ты знаешь, где он.\n\nСначала нужно добраться до Медвесыча.\n\nПотом — остановить дракона.",
      },
      audio: audio.battleWithDragon,
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
      audio: audio.battleWithDragon,
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
        text: "Дракон падает.\n\nНаступает тишина.\n\nПепел медленно оседает на землю.",
      },
      // Один резкий толчок + тёплая вспышка — удар падения дракона,
      // который быстро гаснет в тишину.
      audio: audio.victory,
      specialEffects: ["impact"],
      nextScene: "final-victory-2",
    },

    {
      id: "final-victory-2",
      background: images.owlbearSaved,
      content: {
        type: "text",
        text: "Медвесыч рядом с тобой.\n\nОн не отходит ни на шаг с той секунды, как ты до него добрался.",
      },
      audio: audio.victory,
      nextScene: "final-victory-3",
    },

    {
      id: "final-victory-3",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "MI-01 возвращается сам.\n\nСадится рядом с Медвесычем и складывает надкрылья.",
      },
      audio: audio.victory,
      nextScene: "final-companion",
    },

    {
      id: "final-companion",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "Где-то вдали звучит та мелодия, что ты слышал у каменной стены.",
      },
      audio: audio.victory,
      nextScene: "final-companion-2",
    },

    {
      id: "final-companion-2",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "Медвесыч поднимает голову.\n\nОн узнаёт её и начинает тихо повторять мелодию.",
      },
      audio: audio.victory,
      nextScene: "final-reveal",
    },

    // ─────────────────────────────
    // SCENE 07 — FINAL REVEAL
    // ─────────────────────────────

    {
      id: "final-reveal",
      background: images.finalVictory,
      content: {
        type: "text",
        text: "Поле боя стихло.\n\nТёмные облака начинают расходиться.",
      },
      audio: audio.victory,
      nextScene: "final-reveal-2",
    },
    {
      id: "final-reveal-2",
      background: images.finalVictory,
      content: {
        type: "text",
        text: "Ты закрываешь глаза.\n\nИ вспоминаешь, как всё начиналось.",
      },
      audio: audio.victory,
      specialEffects: ["vignette-pulse"],
      effectDelay: 2500,
      nextScene: "final-recollection-1",
    },

    {
      id: "final-recollection-1",
      background: images.book,
      content: {
        type: "text",
        text: "Книга на древнем пьедестале.\n\nПервая загадка — и первый шаг в неизвестность.",
      },
      // Лёгкий отблеск — вспышка памяти, а не полноценный переход.
      audio: audio.victory,
      specialEffects: ["fade-in"],
      effectDelay: 1600,
      nextScene: "final-recollection-2",
    },

    {
      id: "final-recollection-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Потом неоновые улицы.\n\nТайная мастерская и устройство, которое ты собрал.",
      },
      audio: audio.victory,
      specialEffects: ["fade-in"],
      nextScene: "final-recollection-3",
    },

    {
      id: "final-recollection-3",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Чертежи, детали и странная схема.\n\nКаждая находка вела тебя дальше.",
      },
      audio: audio.victory,
      specialEffects: ["fade-in"],
      nextScene: "final-reveal-5",
    },
    {
      id: "final-reveal-5",
      background: images.finalVictory,
      content: {
        type: "text",
        text: "Теперь ты понимаешь.\n\nНичего из этого не было случайностью.",
      },
      audio: audio.victory,
      nextScene: "final-thread",
    },

    // ─────────────────────────────
    // SCENE 08 — THE THREAD
    // ─────────────────────────────

    {
      id: "final-thread",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты открываешь глаза.\n\nМедвесыч возится с чем-то рядом.",
      },
      audio: audio.final,
      specialEffects: ["glow"],
      effectDelay: 1000,
      nextScene: "final-thread-2",
    },

    {
      id: "final-thread-2",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты видишь клубок ниток.\n\nТёплый рыжеватый цвет. Тот же, что и его шерсть.",
      },
      audio: audio.final,
      nextScene: "final-thread-3",
    },

    {
      id: "final-thread-3",
      background: images.yarnInHands,
      content: {
        type: "text",
        text: "Ты вынимаешь свою нитку — ту самую, из тёмной комнаты в лесу.",
      },
      audio: audio.final,
      nextScene: "final-thread-4",
    },

    {
      id: "final-thread-4",
      background: images.yarnInHands,
      content: {
        type: "text",
        text: "Прикладываешь.\n\nТа же пряжа. Тот же клубок, что лежал на столе в мастерской.",
      },
      audio: audio.final,
      nextScene: "final-thread-5",
    },

    {
      id: "final-thread-5",
      background: images.yarn,
      content: {
        type: "text",
        text: "Медвесыч смотрит на тебя, а потом...",
      },
      audio: audio.final,
      nextScene: "final-thread-6",
    },
    {
      id: "final-thread-6",
      background: images.yarnInBattleField,
      content: {
        type: "text",
        text: "Толкает клубок лапой.",
      },
      audio: audio.final,
      nextScene: "final-thread-7",
    },
    {
      id: "final-thread-7",
      background: images.yarnInForest,
      content: {
        type: "text",
        text: "Клубок катится.\n\nМимо обломков.\n\nЗа деревья.",
      },
      audio: audio.final,
      actions: [
        {
          id: "go-after",
          label: "Follow the thread",
          nextScene: "final-thread-8",
        },
      ],
    },
    {
      id: "final-thread-8",
      background: images.yarnDisappeared,
      content: {
        type: "text",
        text: "Нитка тянется сквозь этот волшебный мир.\n\nИ уходит туда, где заканчивается эта история и начинается что-то другое.",
      },
      audio: audio.final,
      actions: [
        {
          id: "go-after",
          label: "Follow the thread",
          nextScene: "final-thread-9",
        },
      ],
      // specialEffects: ["shimmer"],
    },
    {
      id: "final-thread-9",
      background: images.final,
      content: {
        type: "text",
        text: "Ты узнаёшь это место.\n\nТы дома.",
      },
      audio: audio.final,
      nextScene: "final-the-end",
    },
    {
      id: "final-the-end",
      background: images.final,
      content: {
        type: "text",
        text: "Ты прошёл долгий путь.\n\nНо самые важные приключения ждут тебя впереди.",
      },
      audio: audio.final,
      isFinish: true,
    },
  ],
};
