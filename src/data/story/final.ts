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
      audio: audio.music.forest,
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
      audio: audio.music.forest,
      nextScene: "final-start-3",
    },
    {
      id: "final-start-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то впереди раздаётся грохот и рёв.",
      },
      audio: audio.music.forest,
      sfx: audio.sfx.dragonRoar,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1200,
      nextScene: "final-start-4",
    },
    {
      id: "final-start-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Что за зверь может издавать такие звуки?..",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "go-after",
          label: "Идти на звук",
          nextScene: "final-battlefield",
        },
      ],
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
      audio: audio.music.forest,
      nextScene: "final-battlefield-2",
    },
    {
      id: "final-battlefield-2",
      background: images.battleField,
      content: {
        type: "text",
        text: "Земля изрыта следами огня.\n\nПовсюду лежат обломки.",
      },
      audio: audio.music.forest,
      nextScene: "final-battlefield-3",
    },
    {
      id: "final-battlefield-3",
      background: images.dragon,
      content: {
        type: "text",
        text: "Над поляной кружит огромная тень дракона.\n\nОн замечает тебя. Раздаётся рёв.",
      },
      audio: audio.music.forest,
      sfx: audio.sfx.dragonRoar,
      specialEffects: ["rumble", "vignette-pulse"],
      nextScene: "final-battlefield-3-check",
    },
    {
      id: "final-battlefield-3-check",
      background: images.dragon,
      content: {
        type: "diceCheck",
        title: "Восприятие",
        description:
          "Дракон разворачивается над поляной, и на мгновение пламя освещает его целиком. Ты заставляешь себя не отводить взгляд: у такого зверя должно быть уязвимое место.",
        skill: "Восприятие",
        difficulty: 12,
        achievement: "dragonWeakness",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Порыв горячего ветра бросает пепел тебе в лицо. Ты зажмуриваешься, а когда снова открываешь глаза, дракон уже скрылся в дыму.",
            nextScene: "final-battlefield-4",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Чешуя сплошь покрывает его тело и отражает отблески огня. Слабых мест ты не видишь.",
            nextScene: "final-battlefield-4",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "Когда дракон поднимает крыло, ты замечаешь у его основания участок, где чешуя заметно тоньше. Туда и нужно бить.",
            nextScene: "final-battlefield-4",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Ты следишь за каждым взмахом и всё понимаешь. Чешуя у основания крыла тоньше, а перед ударом дракон открывает это место сам. Теперь ты знаешь, куда бить.",
            nextScene: "final-battlefield-4",
          },
        ],
      },
      audio: audio.music.forest,
    },
    {
      id: "final-battlefield-4",
      background: images.dragon,
      content: {
        type: "text",
        text: "Но ты замечаешь ещё кое-что.\n\nВ стороне, среди обломков, что-то движется.",
      },
      audio: audio.music.forest,
      nextScene: "final-battlefield-5",
    },
    {
      id: "final-battlefield-5",
      background: images.dragon,
      content: {
        type: "text",
        text: "Маленькая фигура.\n\nТы узнаёшь её.",
      },
      audio: audio.music.forest,
      nextScene: "final-battlefield-6",
    },
    {
      id: "final-battlefield-6",
      background: images.owlbear,
      content: {
        type: "text",
        text: "Медвесыч?..\n\nТак вот кто вёл тебя всё это время.",
      },
      audio: audio.music.dragon,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1600,
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
      audio: audio.music.dragon,
      sfx: audio.sfx.dragonFire,
      specialEffects: ["rumble", "vignette-pulse"],
      nextScene: "final-battle-2",
    },
    {
      id: "final-battle-2",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "Секунду назад ты видел, где он. Теперь его не видно.\n\nДым скрывает всё вокруг — тебе нужен ориентир.",
      },
      audio: audio.music.dragon,
      nextScene: "final-battle-3",
    },
    {
      id: "final-battle-3",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Вдруг в твоей сумке что-то начинает светиться.",
      },
      specialEffects: ["glow"],
      audio: audio.music.book,
      nextScene: "final-battle-4",
    },
    {
      id: "final-battle-4",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Ты достаёшь книгу.\n\nОна сама раскрывается на той самой странице.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-5",
    },
    {
      id: "final-battle-5",
      background: images.bookText,
      content: {
        type: "text",
        text: "Там, где раньше фраза обрывалась, появились новые слова.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-6",
    },
    {
      id: "final-battle-6",
      background: images.bookText,
      content: {
        type: "text",
        text: "",
      },
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 5000,
      audio: audio.music.book,
      nextScene: "final-battle-7",
    },
    {
      id: "final-battle-7",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И ты понимаешь.\n\nВсё необходимое у тебя уже есть.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-8",
    },
    {
      id: "final-battle-8",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты открываешь коробку.\n\nЛатунные пластины. Шестерни. Винты.\n\nНа внутренней стороне крышки — инструкция. Ты раскладываешь детали перед собой и пытаешься понять, как соединить их в единый механизм.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-9",
    },
    {
      id: "final-battle-9",
      background: images.deviceAssembly,
      content: {
        type: "text",
        text: "Ты сверяешь детали с инструкцией. В дыму снова раздаётся рёв дракона — времени почти не осталось.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-9-check",
    },
    {
      id: "final-battle-9-check",
      background: images.deviceAssembly,
      content: {
        type: "diceCheck",
        title: "Мастерство",
        description:
          "Дракон ревёт совсем рядом. У тебя есть только несколько мгновений, чтобы собрать механизм. Детали должны встать на свои места.",
        skill: "Мастерство",
        difficulty: 12,
        tag: "assembly",
        achievement: "mi01Master",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Одна из пластин срывается с места, а маленькая шестерня падает в пыль. Ты едва успеваешь найти её и закончить сборку. Времени на проверку уже нет.",
            nextScene: "final-battle-10",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Один из механизмов заедает. Ты вынужден разобрать соединение и попробовать снова. Наконец детали встают на место.",
            nextScene: "final-battle-10",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "Ты быстро соединяешь пластины, закрепляешь шестерни и проверяешь шарниры. Последняя деталь встаёт на место.",
            nextScene: "final-battle-10",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Твои руки словно сами знают, что делать. Ты замечаешь правильное положение каждой детали и собираешь механизм одним точным движением. Он готов раньше, чем дракон успевает ударить снова.",
            nextScene: "final-battle-10",
          },
        ],
      },
      audio: audio.music.book,
    },
    {
      id: "final-battle-10",
      background: images.device,
      content: {
        type: "text",
        text: "MI-01 лежит у тебя на ладони.\n\nНа мгновение — тишина.\n\nЗатем надкрылья раскрываются.\n\nОн оживает.",
      },
      // Механизм оживает так же, как ожили руны у стены.
      audio: audio.music.book,
      specialEffects: ["glow"],
      nextScene: "final-battle-11",
    },
    {
      id: "final-battle-11",
      background: images.deviceFliesAway,
      content: {
        type: "text",
        text: "Ты отпускаешь жука с ладони. Он раскрывает крылья и исчезает в густом дыму.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-12",
    },
    {
      id: "final-battle-12",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "Ты ждёшь.\n\nСекунда. Другая.\n\nТолько огонь, дым и рёв дракона.",
      },
      audio: audio.music.book,
      sfx: audio.sfx.crash,
      nextScene: "final-battle-13",
    },

    // {
    //   id: "final-battle-12-check",
    //   background: images.owlbearFire,
    //   content: {
    //     type: "diceCheck",
    //     title: "Восприятие",
    //     description:
    //       "Огонь жжёт лицо, дракон ревёт совсем рядом. Ты заставляешь себя не отводить взгляд от дыма, где исчез MI-01. Ему нужно время — и ты не можешь бросить его сейчас.",
    //     skill: "Восприятие",
    //     difficulty: 12,
    //     achievement: "medkit",
    //     outcomes: [
    //       {
    //         min: 1,
    //         max: 1,
    //         title: "Критический провал",
    //         text: "Жар заставляет тебя отшатнуться и закрыть лицо руками. Когда ты снова смотришь в дым, там уже ничего не разобрать. Ты не знаешь, удалось ли MI-01 выполнить свою задачу.",
    //         nextScene: "final-battle-13",
    //       },
    //       {
    //         min: 2,
    //         max: 11,
    //         title: "Неудача",
    //         text: "Ты напряжённо всматриваешься в дым, но вспышки пламени ослепляют, а рёв дракона заглушает остальные звуки. На мгновение тебе кажется, что ты замечаешь движение, но понять, что это было, не удаётся.",
    //         nextScene: "final-battle-13",
    //       },
    //       {
    //         min: 12,
    //         max: 19,
    //         title: "Успех",
    //         text: "Ты стоишь неподвижно и вслушиваешься. Сквозь рёв и треск пробивается тихое жужжание крыльев. MI-01 где-то рядом.",
    //         nextScene: "final-battle-13",
    //       },
    //       {
    //         min: 20,
    //         max: 20,
    //         title: "Критический успех",
    //         text: "Ты не двигаешься с места и слышишь жужжание крыльев раньше, чем что-либо ещё. Ты первым замечаешь крошечный огонёк, мерцающий в дыму.",
    //         nextScene: "final-battle-13",
    //       },
    //     ],
    //   },
    //   audio: audio.music.book,
    // },
    {
      id: "final-battle-13",
      background: images.owlbearFire,
      content: {
        type: "text",
        text: "И вдруг — в глубине поля боя появляется маленький огонёк.\n\nMI-01 пробивается сквозь дым. Он что-то нашёл.",
      },
      audio: audio.music.book,
      nextScene: "final-battle-14",
    },
    {
      id: "final-battle-14",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "Дым рассеивается.\n\nИ ты видишь его.",
      },
      audio: audio.music.battleWithDragon,
      nextScene: "final-battle-15",
    },
    {
      id: "final-battle-15",
      background: images.owlbearFound,
      content: {
        type: "text",
        text: "Медвесыч жив.\n\nТеперь ты понимаешь, что нужно делать.\n\nСначала — спасти его.\n\nПотом — остановить дракона.",
      },
      audio: audio.music.battleWithDragon,
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
      audio: audio.music.battleWithDragon,
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
      audio: audio.music.victory,
      // sfx: audio.sfx.dragonDeath,
      specialEffects: ["impact"],
      nextScene: "final-victory-2",
    },
    {
      id: "final-victory-2",
      background: images.dragonWin,
      content: {
        type: "text",
        text: "Дракон исчезает в вихре пепла.\n\nТёмные хлопья подхватывает ветер и уносит прочь.",
      },
      audio: audio.music.victory,
      nextScene: "final-victory-3",
    },
    {
      id: "final-victory-3",
      background: images.owlbearSaved,
      content: {
        type: "text",
        text: "Медвесыч рядом с тобой.\n\nОн не отходит ни на шаг с той секунды, как ты до него добрался.",
      },
      audio: audio.music.victory,
      nextScene: "final-victory-4",
    },
    {
      id: "final-victory-4",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "MI-01 возвращается сам.\n\nСадится рядом с Медвесычем и складывает надкрылья.",
      },
      audio: audio.music.victory,
      nextScene: "final-companion",
    },
    {
      id: "final-companion",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "Где-то вдали звучит та мелодия, что ты слышал у каменной стены.",
      },
      audio: audio.music.victory,
      nextScene: "final-companion-2",
    },
    {
      id: "final-companion-2",
      background: images.owlbearAndBeetle,
      content: {
        type: "text",
        text: "Медвесыч поднимает голову.\n\nОн узнаёт мелодию и тихо подхватывает её.",
      },
      audio: audio.music.victory,
      sfx: audio.sfx.song,
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
      audio: audio.music.victory,
      nextScene: "final-reveal-2",
    },
    {
      id: "final-reveal-2",
      background: images.finalVictory,
      content: {
        type: "text",
        text: "Ты закрываешь глаза.\n\nИ вспоминаешь, как всё начиналось.",
      },
      audio: audio.music.victory,
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
      audio: audio.music.victory,
      specialEffects: ["warp-in"],
      effectDelay: 0,
      nextScene: "final-recollection-2",
    },
    {
      id: "final-recollection-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Потом неоновые улицы.\n\nТайная мастерская и коробка с деталями, из которых ты собрал MI-01.",
      },
      audio: audio.music.victory,
      specialEffects: ["warp-in"],
      effectDelay: 0,
      nextScene: "final-recollection-3",
    },
    {
      id: "final-recollection-3",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Чертежи, детали и странная схема.\n\nКаждая находка вела тебя дальше.",
      },
      audio: audio.music.victory,
      specialEffects: ["warp-in"],
      effectDelay: 0,
      nextScene: "final-reveal-5",
    },
    {
      id: "final-reveal-5",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Теперь ты понимаешь.\n\nНичего из этого не было случайностью.",
      },
      audio: audio.music.victory,
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
      audio: audio.music.final,
      specialEffects: ["warp-in"],
      effectDelay: 1000,
      nextScene: "final-thread-2",
    },
    {
      id: "final-thread-2",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты видишь клубок ниток.\n\nТёплый коричневый цвет. Тот же, что и его шерсть.",
      },
      audio: audio.music.final,
      nextScene: "final-thread-3",
    },
    {
      id: "final-thread-3",
      background: images.yarnInHands,
      content: {
        type: "text",
        text: "Ты достаёшь из кармана нитку — ту самую, которую нашёл в древнем коридоре.",
      },
      audio: audio.music.final,
      nextScene: "final-thread-4",
    },
    {
      id: "final-thread-4",
      background: images.yarnInHands,
      content: {
        type: "text",
        text: "Та же нить, что вела тебя через этот мир.\n\nИ та самая, что лежала на столе в мастерской.",
      },
      audio: audio.music.final,
      nextScene: "final-thread-5",
    },
    {
      id: "final-thread-5",
      background: images.yarn,
      content: {
        type: "text",
        text: "Медвесыч смотрит на тебя, а потом...",
      },
      audio: audio.music.final,
      nextScene: "final-thread-6",
    },
    {
      id: "final-thread-6",
      background: images.yarnInBattleField,
      content: {
        type: "text",
        text: "Он осторожно толкает клубок лапой.",
      },
      audio: audio.music.final,
      nextScene: "final-thread-7",
    },
    {
      id: "final-thread-7",
      background: images.yarnInForest,
      content: {
        type: "text",
        text: "Клубок катится по земле — мимо обломков, между деревьями.\n\nВслед за ним тянется нитка.",
      },
      audio: audio.music.final,
      actions: [
        {
          id: "go-after",
          label: "Идти за нитью",
          nextScene: "final-thread-8",
        },
      ],
    },
    {
      id: "final-thread-8",
      background: images.yarnDisappeared,
      content: {
        type: "text",
        text: "Нитка уходит всё дальше — сквозь лес, прочь от поля боя.\n\nТуда, где заканчивается эта история и начинается другая.",
      },
      audio: audio.music.final,
      actions: [
        {
          id: "go-after",
          label: "Идти за нитью",
          nextScene: "final-thread-9",
        },
      ],
    },
    {
      id: "final-thread-9",
      background: images.final,
      content: {
        type: "text",
        text: "Ты узнаёшь это место.\n\nТы дома.",
      },
      audio: audio.music.final,
      nextScene: "final-thread-10",
    },
    {
      id: "final-thread-10",
      background: images.final,
      content: {
        type: "text",
        text: "Ты прошёл долгий путь.\n\nНо самые важные приключения ждут тебя впереди.",
      },
      audio: audio.music.final,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 4500,
      nextScene: "final-the-end",
    },
    {
      id: "final-the-end",
      background: images.final,
      content: {
        type: "text",
        text: "",
      },
      showBackgroundOnly: true,
      audio: audio.music.ending,
      isFinish: true,
    },
  ],
};
