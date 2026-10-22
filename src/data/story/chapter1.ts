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
        text: "Лес тих и спокоен.\n\nВетер шелестит в кронах деревьев. Где-то вдали кричит птица.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-forest-2",
    },
    {
      id: "chapter1-forest-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди виднеется узкая тропа.\n\nТы бывал здесь много раз, но этой тропы точно раньше не было.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "follow-trail",
          label: "Follow the trail",
          nextScene: "chapter1-footprints",
        },
      ],
    }, // ============================================================
    // THE FOOTPRINTS
    // ============================================================
    {
      id: "chapter1-footprints",
      background: images.forest,
      content: {
        type: "text",
        text: "Тропа уходит под сень деревьев.\n\nТы уже собираешься идти дальше, но замечаешь что-то на земле.",
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
        text: "На земле видны маленькие, глубокие следы.\n\nОни совсем не похожи на следы знакомых тебе лесных зверей.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-footprints-2-part-2",
    },
    {
      id: "chapter1-footprints-2-part-2",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Следы выглядят свежими. Земля ещё не успела осыпаться по краям.\n\nНо вокруг — ни звука, ни движения. Кто бы их ни оставил, он уже скрылся из виду.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-footprints-3",
    },
    {
      id: "chapter1-footprints-3",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Ты поднимаешь взгляд.\n\nСледы тянутся дальше и постепенно исчезают среди деревьев. Похоже, если хочешь узнать, кто их оставил, придётся идти за ними.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "follow-footprints",
          label: "Follow the footprints",
          nextScene: "chapter1-stone",
        },
      ],
    }, // ============================================================
    // THE STONE
    // ============================================================
    {
      id: "chapter1-stone",
      background: images.wall,
      content: {
        type: "text",
        text: "Следы приводят тебя к древней каменной стене.",
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
        text: "Сначала стена кажется обычной частью древних руин.\n\nНо, присмотревшись, ты замечаешь странные символы под слоем мха.",
      },
      audio: audio.music.forest,
      nextScene: "chapter1-stone-3",
    },
    {
      id: "chapter1-stone-3",
      background: images.wallWithSymbols,
      content: {
        type: "text",
        text: "Пять древних знаков высечены прямо в камне.\n\nТы узнаёшь их:\n\nAXII · QUEN · AARD · YRDEN · IGNI.",
      },
      audio: audio.music.forest,
      specialEffects: ["zoom-in"],
      nextScene: "chapter1-stone-4",
    },
    {
      id: "chapter1-stone-4",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "У самого основания стены ты замечаешь знакомые маленькие следы.\n\nСледы обрываются у самой стены.",
      },
      audio: audio.music.forest,
      actions: [
        {
          id: "clear-moss",
          label: "Examine the base of the wall",
          nextScene: "chapter1-perception-check",
        },
      ],
    },
    {
      id: "chapter1-perception-check",
      background: images.wallWithTraces,
      content: {
        type: "diceCheck",
        title: "Восприятие",
        description:
          "Ты внимательно изучаешь основание стены. Царапины, следы и трещины могут рассказать больше, чем кажется на первый взгляд.",
        skill: "Восприятие",
        difficulty: 12,
        achievement: "keenEye",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Ты слишком увлекаешься поисками и случайно сдвигаешь камешек. Он падает тебе на ногу. От неожиданности ты отступаешь, так и не разобравшись, что там может быть.",
            runeHintLevel: "none",
            nextScene: "chapter1-signs-fail",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Ты осматриваешь стену, но ничего необычного обнаружить не удаётся.",
            runeHintLevel: "none",
            nextScene: "chapter1-signs-fail",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "У самого основания стены ты замечаешь свежие царапины. Под слоем мха проступает знак QUEN. Кто-то оставил его здесь совсем недавно.",
            runeHintLevel: "first-rune",
            nextScene: "chapter1-signs-success-2",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Ты замечаешь QUEN у самого основания стены. Царапины свежие и расположены необычно низко. Похоже, тот, кто оставил их, хотел подсказать, с какого знака начать.",
            runeHintLevel: "sound",
            nextScene: "chapter1-signs-success",
          },
        ],
      },
      audio: audio.music.forest,
    },
    {
      id: "chapter1-signs-success",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Ты подходишь ближе и осторожно касаешься знака QUEN.",
      },
      audio: audio.music.forest,
      autoTransitionDelay: 1000,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-rune-puzzle",
    },

    {
      id: "chapter1-signs-success-2",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Ты подходишь ближе к стене.",
      },
      audio: audio.music.forest,
      autoTransitionDelay: 1000,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-rune-puzzle",
    },
    {
      id: "chapter1-signs-fail",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "Ты не находишь подсказки и решаешь действовать наугад.\n\nОстаётся только выбрать один из знаков и посмотреть, что произойдёт.",
      },
      audio: audio.music.forest,
      autoTransitionDelay: 1000,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-rune-puzzle",
    },
    // ============================================================
    // THE SIGNS
    // ============================================================
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
        text: "Последняя нота затихает.\n\nНа несколько секунд лес погружается в полную тишину.",
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
        text: "Раздаётся глубокий гул.\n\nКамень приходит в движение. Огромные плиты медленно расходятся, открывая древний проход.",
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
    }, // ============================================================
    // THE CHAMBER
    // ============================================================
    {
      id: "chapter1-chamber",
      background: images.room,
      content: {
        type: "text",
        text: "За дверью открывается небольшая каменная комната.\n\nВоздух здесь неподвижен, а на полу лежит толстый слой пыли. В центре комнаты возвышается каменный пьедестал.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-chamber-2",
    },
    {
      id: "chapter1-chamber-2",
      background: images.book,
      content: {
        type: "text",
        text: "На пьедестале лежит книга.\n\nСудя по камню и покрывающей его пыли, это место не посещали сотни лет. И всё же книга выглядит удивительно хорошо сохранившейся.",
      },
      audio: audio.music.room,
      nextScene: "chapter1-chamber-3",
    },
    {
      id: "chapter1-chamber-3",
      background: images.roomTraces,
      content: {
        type: "text",
        text: "В пыли у пьедестала ты замечаешь маленький след.\n\nТот самый, который привёл тебя через лес к древней стене. Значит, загадочное существо было здесь.",
      },
      audio: audio.music.room,
      actions: [
        {
          id: "examine-pedestal-traces",
          label: "Examine the traces",
          nextScene: "chapter1-chamber-3-check",
        },
      ],
    },
    {
      id: "chapter1-chamber-3-check",
      background: images.roomTraces,
      content: {
        type: "diceCheck",
        title: "Анализ",
        description:
          "Ты приседаешь рядом с пьедесталом и внимательно изучаешь след. Пыль, царапины и потёртости могут подсказать, что здесь происходило.",
        skill: "Анализ",
        difficulty: 12,
        achievement: "owlbearClues",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Ты наклоняешься слишком близко и случайно задеваешь пыль рукой. След становится ещё менее различимым. Ты выпрямляешься, так и не выяснив ничего нового.",
            nextScene: "chapter1-chamber-4",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "След действительно маленький и похож на тот, что ты видел в лесу. Но пыль и неровности камня не позволяют понять, кто его оставил и что здесь происходило.",
            nextScene: "chapter1-chamber-4",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "След почти такой же, как в лесу. Рядом с ним видна короткая царапина на камне. Кто-то маленький стоял совсем близко к пьедесталу и, похоже, задержался здесь ненадолго.",
            nextScene: "chapter1-chamber-4",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Теперь ты видишь больше. По размеру и форме след почти не отличается от тех, что ты видел в лесу. Он ведёт к пьедесталу и обрывается у самого основания. Возможно, маленькое существо подходило к книге, но по одному следу нельзя сказать наверняка, зачем оно здесь было.",
            nextScene: "chapter1-chamber-4",
          },
        ],
      },
      audio: audio.music.room,
    },
    {
      id: "chapter1-chamber-4",
      background: images.doorClosed,
      content: {
        type: "text",
        text: "Вдруг за спиной раздаётся глубокий гул.\n\nТы оборачиваешься и видишь, как каменная дверь исчезает в стене, оставляя после себя сплошную кладку.",
      },
      audio: audio.music.room,
      sfx: audio.sfx.doorRoomOpen,
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
    }, // ── Ветка: не трогать чужое ──
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
    }, // ============================================================
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
      autoTransitionDelay: 1000,
      autoTransitionToNextScene: true,
      nextScene: "chapter1-sound",
    }, // ============================================================
    // THE SOUND
    // ============================================================
    {
      id: "chapter1-sound",
      background: images.bookInHandsWithoutLight,
      content: {
        type: "text",
        text: "Книга внезапно захлопывается. Золотое свечение гаснет, и комната погружается в полумрак.",
      },
      itemsToCollect: ["ancient-book"],
      audio: audio.music.door,
      nextScene: "chapter1-sound-part-2",
    },
    {
      id: "chapter1-sound-part-2",
      background: images.bookInHandsWithoutLight,
      content: {
        type: "text",
        text: "Несколько секунд ничего не происходит.\n\nЗатем из глубины комнаты доносится странный шум.",
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
      audio: audio.music.door, // sfx: audio.sfx.doorRoomOpen,
      sfx: audio.sfx.door,
      specialEffects: ["rumble"],
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
    }, // ============================================================
    // CHASE
    // ============================================================
    // ============================================================

    {
      id: "chapter1-chase",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "Ты бросаешься к проходу.\n\nНо тень уже исчезла.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-3",
    },
    {
      id: "chapter1-chase-3",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Ты бежишь вперёд, едва различая дорогу.\n\nПлечом задеваешь стену и острый камень царапает кожу.",
      },
      audio: audio.music.persecution,
      nextScene: "chapter1-chase-4",
    },
    {
      id: "chapter1-chase-4",
      background: images.corridorTracesFinal,
      content: {
        type: "text", // text: "Следы продолжаются всё глубже.\n\nНо тени впереди больше нет.",
        text: "Следы уходят всё глубже.\n\nНо тени впереди больше нет, и ты начинаешь сомневаться, удастся ли тебе её найти.",
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
        text: "Нитка тёплого коричневого цвета зацепилась за острый край камня.",
      },
      audio: audio.music.persecution,
      actions: [
        {
          id: "take-thread-torn",
          label: "Inspect the thread",
          nextScene: "chapter1-yarn-chase-analysis",
        },
      ],
    },
    {
      id: "chapter1-yarn-chase-analysis",
      background: images.yarnWall,
      content: {
        type: "diceCheck",
        title: "Анализ",
        description: "Ты поднимаешь нить и внимательно рассматриваешь её.",
        skill: "Анализ",
        difficulty: 12,
        achievement: "threadFinder",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Это просто коричневая нитка. Ничего примечательного.",
            nextScene: "chapter1-chase-7",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Нить кажется обычной. Её назначение и связь с незнакомцем остаются загадкой.",
            nextScene: "chapter1-chase-7",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "При внимательном осмотре ты замечаешь, что это пряжа из нескольких переплетённых волокон. Похоже, её использовали для вязания.",
            nextScene: "chapter1-chase-7",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "ы внимательно изучаешь пряжу и замечаешь, насколько равномерно скручены её мягкие волокна. Это качественная пряжа, предназначенная для вязания. Её тёплый коричневый оттенок кажется тебе знакомым, хотя ты не можешь вспомнить почему.",
            nextScene: "chapter1-chase-7",
          },
        ],
      },
      audio: audio.music.persecution,
    },
    {
      id: "chapter1-chase-7",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Ты убираешь нитку в карман и идёшь дальше по коридору.",
      },
      itemsToCollect: ["brown-yarn"],
      audio: audio.music.persecution,
      nextScene: "chapter1-ending",
    }, // ============================================================
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
        text: "Ты подходишь ближе.\n\nНа полу лежит нитка тёплого коричневого цвета.",
      },
      audio: audio.music.shadow,
      actions: [
        {
          id: "take-thread-torn",
          label: "Inspect the thread",
          nextScene: "chapter1-yarn-wait-analysis",
        },
      ],
    },
    {
      id: "chapter1-yarn-wait-analysis",
      background: images.yarn,
      content: {
        type: "diceCheck",
        title: "Анализ",
        description: "Ты поднимаешь нить и внимательно рассматриваешь её.",
        skill: "Анализ",
        difficulty: 12,
        achievement: "threadFinder",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Это просто коричневая нитка. Ничего примечательного.",
            nextScene: "chapter1-wait-7",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Нить кажется обычной. Её назначение и связь с незнакомцем остаются загадкой.",
            nextScene: "chapter1-wait-7",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "При внимательном осмотре ты замечаешь, что это пряжа из нескольких переплетённых волокон. Похоже, её использовали для вязания.",
            nextScene: "chapter1-wait-7",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Ты внимательно изучаешь пряжу и замечаешь, насколько равномерно скручены её мягкие волокна. Это качественная пряжа, предназначенная для вязания. Её тёплый коричневый оттенок кажется тебе знакомым, хотя ты не можешь вспомнить почему.",
            nextScene: "chapter1-wait-7",
          },
        ],
      },
      audio: audio.music.shadow,
    },
    {
      id: "chapter1-wait-7",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты убираешь нитку в карман и идёшь дальше по коридору.",
      },
      itemsToCollect: ["brown-yarn"],
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
      autoTransitionDelay: 2000,
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
      specialEffects: ["signal"],
      effectDelay: 0,
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1500,
      nextScene: "chapter2-eyes-opening",
    },
  ],
};
