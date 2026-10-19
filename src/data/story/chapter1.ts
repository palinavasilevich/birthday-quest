import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";
import { audio } from "@/data/audio/chapter1";
export const firstChapter: ChapterData = {
  id: "chapter1",
  title: "СЛЕД",
  scenes: [
    // ============================================================
    // THE FOREST
    // ============================================================
    {
      id: "chapter1-forest",
      background: images.forest,
      content: {
        type: "text",
        text: "Тихий лес.\n\nВетер шелестит в кронах деревьев.\n\nГде-то вдали кричит птица.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-forest-2",
    },
    {
      id: "chapter1-forest-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди виднеется узкая тропа.\n\nТы бывал здесь много раз.\n\nНо этой тропы раньше не было.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "follow-trail",
          label: "Follow the trail",
          nextScene: "chapter1-footprints",
        },
      ],
    },
    // ============================================================
    // THE FOOTPRINTS
    // ============================================================
    {
      id: "chapter1-footprints",
      background: images.forest,
      content: {
        type: "text",
        text: "Тропа уходит под сень деревьев.\n\nНо кое-что заставляет тебя замедлить шаг.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "look-closer",
          label: "Take a closer look",
          nextScene: "chapter1-footprints-2",
        },
      ],
    },
    {
      id: "chapter1-footprints-2",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Ты замечаешь странные следы.\n\nМаленькие. Глубокие. И совершенно не похожие на следы лесного зверя.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-footprints-2-part-2",
    },
    {
      id: "chapter1-footprints-2-part-2",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Они выглядят так, словно их оставили совсем недавно. Но вокруг ни звука, ни движения.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-footprints-3",
    },
    {
      id: "chapter1-footprints-3",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Ты поднимаешь взгляд.\n\nСледы ведут дальше и один за другим исчезают среди деревьев.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "follow-footprints",
          label: "Follow the footprints",
          nextScene: "chapter1-stone",
        },
      ],
    },
    // ============================================================
    // THE STONE
    // ============================================================
    {
      id: "chapter1-stone",
      background: images.wall,
      content: {
        type: "text",
        text: "Следы приводят тебя к древней каменной стене, покрытой мхом.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "examine-wall",
          label: "Examine the wall",
          nextScene: "chapter1-stone-2",
        },
      ],
    },
    {
      id: "chapter1-stone-2",
      background: images.wall,
      content: {
        type: "text",
        text: "Сначала в ней не видно ничего необычного.\n\nНо затем ты замечаешь странные символы.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-stone-3",
    },
    {
      id: "chapter1-stone-3",
      background: images.wallWithSymbols,
      content: {
        type: "text",
        text: "Пять древних знаков высечены прямо в камне.\n\nТы узнаешь их:\n\nAXII · QUEN · AARD · YRDEN · IGNI.",
      },
      audio: audio.music.forest,
      specialEffects: ["zoom-in"],
      // effectDelay: 1600,
      nextScene: "chapter1-stone-4",
    },
    {
      id: "chapter1-stone-4",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "У подножия стены ты замечаешь те же маленькие следы.\n\nОни заканчиваются прямо перед каменной кладкой.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "touch-rune",
          label: "Touch the rune",
          nextScene: "chapter1-signs",
        },
        {
          id: "clear-moss",
          label: "Clear the moss at the base",
          nextScene: "chapter1-moss",
        },
      ],
    },
    // ── Ветка: счистить мох ──
    {
      id: "chapter1-moss",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Ты счищаешь мох у самого низа стены. \n\nИ видишь, что под ним проступает знакомый символ.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-moss-2",
    },
    {
      id: "chapter1-moss-2",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Царапины свежие и совсем низко над землёй.\n\nТот, кто их оставил, был невысокого роста.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-moss-3",
    },
    {
      id: "chapter1-moss-3",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "QUEN.\n\nТеперь ты знаешь, с чего начинать.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-signs",
    },
    // ============================================================
    // THE SIGNS
    // ============================================================
    {
      id: "chapter1-signs",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "Ты подходишь ближе и касаешься знака.",
      },
      autoTransitionDelay: 3100,
      autoTransitionToNextScene: true,
      audio: audio.music.forest,
      nextScene: "chapter1-rune-puzzle",
    },
    {
      id: "chapter1-rune-puzzle",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "",
      },
      puzzle: {
        id: "rune-discovery",
        type: "runes",
        nextScene: "chapter1-door",
      },
    },
    // ============================================================
    // THE DOOR
    // ============================================================
    {
      id: "chapter1-door",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "Последняя нота затихает.\n\nНесколько секунд — полная тишина.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-door-2",
    },
    {
      id: "chapter1-door-2",
      background: images.wallWithSymbolsFinal,
      content: {
        type: "text",
        text: "Затем руны вспыхивают одновременно.\n\nПо стене пробегает золотистая линия света.",
      },
      audio: audio.music.room,
      specialEffects: ["glow"],
      nextScene: "chapter1-door-3",
    },
    {
      id: "chapter1-door-3",
      background: images.wallWithSymbolsDoor,
      content: {
        type: "text",
        text: "Раздаётся глубокий гул.\n\nКамень начинает двигаться.\n\nДревняя дверь медленно открывается.",
      },
      audio: audio.music.room,
      sfx: audio.sfx.door,
      specialEffects: ["rumble"],
      actions: [
        {
          id: "enter-chamber",
          label: "Enter",
          nextScene: "chapter1-chamber",
        },
      ],
    },
    // ============================================================
    // THE CHAMBER
    // ============================================================
    {
      id: "chapter1-chamber",
      background: images.room,
      content: {
        type: "text",
        text: "За дверью открывается небольшая каменная комната.\n\nВ центре стоит каменный пьедестал.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-chamber-2",
    },

    {
      id: "chapter1-chamber-2",
      background: images.book,
      content: {
        type: "text",
        text: "На каменном пьедестале лежит книга. Кажется, этому месту сотни лет, но книга выглядит удивительно хорошо сохранившейся.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-chamber-3",
    },

    {
      id: "chapter1-chamber-3",
      background: images.roomTraces,
      content: {
        type: "text",
        text: "В пыли у пьедестала ты замечаешь тот же маленький след.",
      },
      audio: audio.music.room,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 3200,
      nextScene: "chapter1-chamber-4",
    },

    {
      id: "chapter1-chamber-4",
      background: images.doorClosed,
      content: {
        type: "text",
        text: "Вдруг за спиной раздаётся глубокий гул. Ты оборачиваешься и видишь, как каменная дверь исчезает в стене, оставляя после себя сплошную каменную кладку.",
      },
      audio: audio.music.room,
      sfx: audio.sfx.doorClose,
      // specialEffects: ["rumble"],
      nextScene: "chapter1-chamber-5",
    },

    {
      id: "chapter1-chamber-5",
      background: images.book,
      content: {
        type: "text",
        text: "В комнате больше нет выхода.\n\nПеред тобой только книга, оставленная на пьедестале.",
      },
      audio: audio.music.room,
      actions: [
        {
          id: "take-book",
          label: "Take the book",
          nextScene: "chapter1-relic",
        },
        {
          id: "leave-book",
          label: "Leave it alone",
          nextScene: "chapter1-leave",
        },
      ],
    },
    // ── Ветка: не трогать чужое ──
    {
      id: "chapter1-leave",
      background: images.book,
      content: {
        type: "text",
        text: "Ты решаешь не трогать книгу.\n\nЧужие вещи в незнакомых местах лучше оставлять на месте.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-leave-2",
    },
    {
      id: "chapter1-leave-2",
      background: images.doorClosed,
      content: {
        type: "text",
        text: "Ты отворачиваешься от пьедестала и осматриваешь комнату в поисках другого выхода.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-leave-2-part-2",
    },
    {
      id: "chapter1-leave-2-part-2",
      background: images.leaveRoom,
      content: {
        type: "text",
        text: "Вдруг за спиной раздаётся шорох и глухой стук о камень.\n\nТы медленно оборачиваешься.",
      },
      specialEffects: ["impact"],
      audio: audio.music.room,
      sfx: audio.sfx.bookDropped,
      nextScene: "chapter1-leave-3",
    },
    {
      id: "chapter1-leave-3",
      background: images.bookNearThePedestal,
      content: {
        type: "text",
        text: "Книга лежит на полу у пьедестала.\n\nТы уверен, что оставил её на месте. Так как же она оказалась здесь?..",
      },
      audio: audio.music.room,
      nextScene: "chapter1-leave-4",
    },
    {
      id: "chapter1-leave-4",
      background: images.bookNearThePedestal,
      content: {
        type: "text",
        text: "В комнате по-прежнему тихо.\n\nСловно кто-то затаился в темноте, ожидая твоего следующего шага.",
      },
      audio: audio.music.room,
      actions: [
        {
          id: "pick-book",
          label: "Pick up the book",
          nextScene: "chapter1-relic",
        },
      ],
    },
    // ============================================================
    // THE RELIC
    // ============================================================

    {
      id: "chapter1-relic",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Как только ты прикасаешься к книге, по комнате проносится внезапный порыв воздуха.",
      },
      audio: audio.music.book,
      nextScene: "chapter1-relic-2",
    },

    //     {
    //   id: "chapter1-relic",
    //   background: images.bookInHands,
    //   content: {
    //     type: "text",
    //     text: "Как только ты прикасаешься к книге, по комнате проносится внезапный порыв воздуха. Свет гаснет.",
    //   },
    //   audio: audio.music.book,
    //   nextScene: "chapter1-relic-2",
    // },

    {
      id: "chapter1-relic-2",
      background: images.bookOpen,
      content: {
        type: "text",
        text: "Книга раскрывается у тебя в руках, и пожелтевшие страницы начинают переворачиваться.",
      },
      audio: audio.music.book,
      nextScene: "chapter1-relic-3",
    },
    {
      id: "chapter1-relic-3",
      background: images.bookOpen,
      content: {
        type: "text",
        text: "Страницы мелькают одна за другой. На мгновение ты различаешь выцветшие рисунки, странные символы и записи на незнакомом языке.",
      },
      audio: audio.music.book,
      nextScene: "chapter1-relic-4",
    },
    {
      id: "chapter1-relic-4",
      background: images.bookOpenWithoutText,
      content: {
        type: "text",
        text: "Наконец книга замирает на пустой странице.",
      },
      audio: audio.music.book,
      nextScene: "chapter1-relic-5",
    },
    {
      id: "chapter1-relic-5",
      background: images.bookOpenWithoutText,
      content: {
        type: "text",
        text: "По бумаге медленно разливается мягкое золотистое свечение.\n\nНа пустой странице проступают символы.\n\nОдин за другим они складываются в слова.",
      },
      audio: audio.music.book,
      specialEffects: ["glow"],
      nextScene: "chapter1-relic-6",
    },

    // {
    //   id: "chapter1-relic-6",
    //   background: images.bookOpenWithoutText,
    //   content: {
    //     type: "text",
    //     text: "Один за другим они складываются в слова, словно невидимая рука выводит их прямо у тебя на глазах.",
    //   },
    //   audio: audio.music.book,
    //   nextScene: "chapter1-relic-7",
    // },
    {
      id: "chapter1-relic-6",
      background: images.bookText,
      content: {
        type: "text",
        text: "«То, что существует лишь в воображении, однажды может стать настоящим...»",
      },
      audio: audio.music.book,
      showBackgroundOnly: true,
      autoTransitionDelay: 3200,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-relic-7",
    },
    {
      id: "chapter1-relic-7",
      background: images.bookText,
      content: {
        type: "text",
        text: "Ты ждёшь продолжения, но страница остаётся неизменной.",
      },
      audio: audio.music.book,
      autoTransitionDelay: 4400,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-sound",
    },
    // ============================================================
    // THE SOUND
    // ============================================================
    {
      id: "chapter1-sound",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Книга внезапно захлопывается. Золотое свечение гаснет, и комната погружается в полумрак.",
      },
      audio: audio.music.door,
      nextScene: "chapter1-sound-part-2",
    },
    {
      id: "chapter1-sound-part-2",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Несколько секунд ничего не происходит.\n\nЗатем из глубины комнаты доносится глухой щелчок.",
      },
      audio: audio.music.door,
      nextScene: "chapter1-sound-2",
    },
    {
      id: "chapter1-sound-2",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "На противоположной стене дрожит каменная кладка.\n\nРаздаётся скрежет древнего механизма. Каменные плиты медленно расходятся, открывая узкий проход.",
      },
      audio: audio.music.door,
      sfx: audio.sfx.doorRoomOpen,
      nextScene: "chapter1-sound-3",
    },

    {
      id: "chapter1-sound-3",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "В глубине прохода мелькает небольшая тень.",
      },
      audio: audio.music.shadow,
      specialEffects: ["vignette-pulse"],
      effectDelay: 1600,
      actions: [
        {
          id: "chase",
          label: "Follow the shadow",
          nextScene: "chapter1-chase",
        },
        {
          id: "wait",
          label: "Stay still and wait",
          nextScene: "chapter1-wait",
        },
      ],
    },
    // ============================================================
    // CHASE
    // ============================================================
    //
    // Mirrors "wait" in weight (10 scenes) rather than being the
    // short, reward-less branch it used to be. Same emotional beat
    // as wait — the player still ends up with the yarn — but earned
    // differently: not a gift left on purpose, but a scrap torn off
    // mid-flight, found only because the player pushed forward
    // instead of holding still.
    // ============================================================
    {
      id: "chapter1-chase",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "Ты бросаешься к проходу.\n\nНо тень уже исчезла.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-2",
    },
    {
      id: "chapter1-chase-2",
      background: images.corridorTraces,
      content: {
        type: "text",
        text: "Ты видишь следы, уходящие вглубь коридора.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-3",
    },
    {
      id: "chapter1-chase-3",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Ты бросаешься вперёд, едва различая дорогу.\n\nПлечом задеваешь стену — острый камень царапает кожу.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-4",
    },
    {
      id: "chapter1-chase-4",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Следы продолжаются всё глубже.\n\nНо тени впереди больше нет.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-5",
    },
    {
      id: "chapter1-chase-5",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Ты останавливаешься, чтобы отдышаться.\n\nИ тут замечаешь что-то на выступе стены рядом.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-6",
    },
    {
      id: "chapter1-chase-6",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Клочок пряжи тёплого коричневого цвета зацепился за острый край камня.",
      },
      audio: audio.music.persecution,
      actions: [
        {
          id: "take-thread-torn",
          label: "Take the thread",
          nextScene: "chapter1-chase-7",
        },
      ],
    },
    {
      id: "chapter1-chase-7",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Ты снимаешь нитку с камня.\n\nОна мягкая и почему-то кажется знакомой. Ты убираешь её в карман и продолжаешь путь.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-ending",
    },
    // ============================================================
    // WAIT
    // ============================================================
    {
      id: "chapter1-wait",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Ты не двигаешься.\n\nПроходит секунда. Другая.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-2",
    },
    {
      id: "chapter1-wait-2",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Тень в проходе тоже не двигается.\n\nА потом делает шаг вперёд.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-3",
    },
    {
      id: "chapter1-wait-3",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Теперь ты видишь её чуть лучше.\n\nНебольшой силуэт смотрит на тебя несколько секунд.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-4",
    },
    {
      id: "chapter1-wait-4",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Потом тень наклоняется и оставляет что-то на полу.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-5",
    },
    {
      id: "chapter1-wait-5",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "И прежде чем ты успеваешь сделать шаг, она исчезает в проходе.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-6",
    },
    {
      id: "chapter1-wait-6",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты подходишь ближе.\n\nНа полу лежит обрывок пряжи тёплого коричневого цвета.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-7",
    },
    {
      id: "chapter1-wait-7",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты поднимаешь нитку и осторожно сжимаешь её в пальцах.\n\nОна мягкая и почему-то кажется знакомой. Ты убираешь её в карман.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-wait-8",
    },
    {
      id: "chapter1-wait-8",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Впереди снова видны небольшие следы.",
      },
      audio: audio.music.shadow,
      nextScene: "chapter1-ending",
    },
    // ============================================================
    // THE ENDING
    // ============================================================
    {
      id: "chapter1-ending",
      background: images.corridor,
      content: {
        type: "text",
        text: "И вдруг свет в коридоре гаснет.\n\nСтены начинают дрожать.",
      },
      audio: audio.music.destruction,
      specialEffects: ["shake"],
      autoTransitionToNextScene: true,
      nextScene: "chapter1-ending-2",
    },

    {
      id: "chapter1-ending-2",
      background: images.corridor,
      content: {
        type: "text",
        text: "Земля уходит из-под ног.\n\nБудто сам мир начинает разваливаться на части...",
      },
      audio: audio.music.destruction,
      specialEffects: ["shake"],
      effectDelay: 2000,
      autoTransitionDelay: 5000,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-ending-3",
    },

    {
      id: "chapter1-ending-3",
      background: images.corridor,
      content: {
        type: "text",
        text: "Внезапная вспышка яркого света ослепляет тебя.",
      },
      audio: audio.music.destruction,
      // specialEffects: ["flash"],
      // effectDelay: 1000,
      // autoTransitionToNextScene: true,

      specialEffects: ["signal"],
      effectDelay: 0,
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1500,
      nextScene: "chapter2-eyes-opening",
    },
  ],
};
