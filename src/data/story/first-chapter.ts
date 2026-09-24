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
      audio: audio.forest,
      nextScene: "chapter1-forest-2",
    },

    {
      id: "chapter1-forest-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди виднеется узкая тропа.\n\nТы бывал здесь много раз.\n\nНо этой тропы раньше не было.",
      },
      audio: audio.forest,
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
        text: "Тропа почти полностью скрыта под опавшими листьями.\n\nВдруг что-то привлекает твоё внимание.",
      },
      audio: audio.forest,
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
        text: "Это следы.\n\nНебольшие, глубокие, с пятью пальцами.\n\nОпределённо не человеческие.",
      },
      audio: audio.forest,
      nextScene: "chapter1-footprints-3",
    },

    {
      id: "chapter1-footprints-3",
      background: images.forestTraces,
      content: {
        type: "text",
        text: "Ты поднимаешь взгляд.\n\nВ нескольких метрах впереди — ещё один.\n\nИ ещё один, чуть дальше.\n\nКто-то прошёл здесь совсем недавно.\n\n🐾",
      },
      audio: audio.forest,
      actions: [
        {
          id: "follow-footprints",
          label: "Follow the tracks",
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
      audio: audio.forest,
      actions: [
        {
          id: "examine-wall",
          label: "Explore the wall",
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
      audio: audio.forest,
      nextScene: "chapter1-stone-3",
    },

    {
      id: "chapter1-stone-3",
      background: images.wallWithSymbols,
      content: {
        type: "text",
        text: "Пять древних знаков высечены прямо в камне.\n\nТы узнаешь их:\n\nAXII · QUEN · AARD · YRDEN · IGNI",
      },
      audio: audio.forest,
      nextScene: "chapter1-stone-4",
    },

    {
      id: "chapter1-stone-4",
      background: images.wallWithTraces,
      content: {
        type: "text",
        text: "А у подножия стены ты видишь теже следы.\n\nЗдесь они обрывается.",
      },
      audio: audio.forest,
      actions: [
        {
          id: "touch-rune",
          label: "Touch the rune",
          nextScene: "chapter1-signs",
        },
        {
          id: "clear-moss",
          label: "Clear away the moss at the foot",
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
        text: "Ты счищаешь мох у самого низа стены.",
      },
      audio: audio.forest,
      nextScene: "chapter1-moss-2",
    },

    {
      id: "chapter1-moss-2",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Под мхом проступает знакомый символ.",
      },
      audio: audio.forest,
      nextScene: "chapter1-moss-3",
    },

    {
      id: "chapter1-moss-3",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Царапины свежие и совсем низко над землёй.\n\nТот, кто их оставил, был невысокого роста.",
      },
      audio: audio.forest,
      nextScene: "chapter1-moss-4",
    },

    {
      id: "chapter1-moss-4",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "QUEN.\n\nТеперь ты знаешь, с чего начинать.",
      },
      audio: audio.forest,
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
      audio: audio.forest,
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
      audio: audio.room,
      nextScene: "chapter1-door-2",
    },

    {
      id: "chapter1-door-2",
      background: images.wallWithSymbolsFinal,
      content: {
        type: "text",
        text: "Затем руны вспыхивают одновременно.\n\nПо стене пробегает золотистая линия света.",
      },

      audio: audio.room,
      nextScene: "chapter1-door-3",
    },

    {
      id: "chapter1-door-3",

      background: images.room,
      content: {
        type: "text",
        text: "Раздаётся глубокий гул.\n\nКамень начинает двигаться.\n\nДревняя дверь медленно открывается.",
      },
      audio: audio.room,
      actions: [
        {
          id: "enter-chamber",
          label: "Go inside",
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
        text: "За дверью — небольшая комната.\n\nВ центре стоит каменный пьедестал.",
      },
      audio: audio.room,
      nextScene: "chapter1-chamber-2",
    },

    {
      id: "chapter1-chamber-2",
      background: images.book,
      content: {
        type: "text",
        text: "На нём лежит книга.\n\nКажется, что этому месту сотни лет — а книга новая. Без единой пылинки.",
      },
      audio: audio.room,
      nextScene: "chapter1-chamber-3",
    },

    {
      id: "chapter1-chamber-3",
      background: images.roomTraces,
      content: {
        type: "text",
        text: "В пыли у пьедестала ты видишь тот же маленький след.",
      },
      audio: audio.room,
      actions: [
        {
          id: "take-book",
          label: "Take a book",
          nextScene: "chapter1-relic",
        },
        {
          id: "leave-book",
          label: "Do not touch",
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
        text: "Ты не трогаешь её.\n\nЧужие вещи в чужих комнатах лучше оставлять на месте.",
      },
      audio: audio.room,
      nextScene: "chapter1-leave-2",
    },

    {
      id: "chapter1-leave-2",
      background: images.book,
      content: {
        type: "text",
        text: "Ты делаешь шаг к двери.\n\nВдруг за спиной раздаётся шорох и глухой стук о камень.\n\nТы медленно оборачиваешься.",
      },
      audio: audio.room,
      nextScene: "chapter1-leave-3",
    },

    {
      id: "chapter1-leave-3",
      background: images.bookNearThePedestal,
      content: {
        type: "text",
        text: "Книга лежит на полу.\n\nЕё столкнули с пьедестала. Прямо тебе под ноги.",
      },
      audio: audio.room,
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

    // Если появится картинка книги — вставить сцену перед chapter1-relic:
    // {
    //   id: "chapter1-book",
    //   background: images.forest,
    //   content: {
    //     type: "image",
    //     src: "/images/items/art-of-john-harris.webp",
    //     alt: "The Art of John Harris: Beyond the Horizon",
    //   },
    //   nextScene: "chapter1-relic",
    // },

    {
      id: "chapter1-relic",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Как только ты прикасаешься к книге, внезапный порыв воздуха проносится по комнате.\n\nДверь за твоей спиной с глухим хлопком захлопывается.",
      },
      audio: audio.room,
      nextScene: "chapter1-relic-2",
    },

    {
      id: "chapter1-relic-2",
      background: images.bookOpen,
      content: {
        type: "text",
        text: "Книга в твоих руках начинает сама перелистывать страницы.",
      },
      audio: audio.room,
      nextScene: "chapter1-relic-3",
    },

    {
      id: "chapter1-relic-3",
      background: images.bookOpen,
      content: {
        type: "text",
        text: "Страницы одна за другой переворачиваются на ветру.\n\nПока книга не останавливается на одной из них.",
      },
      audio: audio.room,
      nextScene: "chapter1-relic-4",
    },

    {
      id: "chapter1-relic-4",
      background: images.bookText,
      content: {
        type: "text",
        text: "Книга начинает светиться и на странице проступает надпись.",
      },
      audio: audio.room,
      nextScene: "chapter1-relic-5",
    },

    {
      id: "chapter1-relic-5",
      background: images.bookText,
      content: {
        type: "text",
        text: "«Каждое великое приключение начинается с мира, который существует лишь в чьём-то воображении.»",
      },
      audio: audio.room,
      nextScene: "chapter1-sound",
    },

    // {
    //   id: "chapter1-relic-4",
    //   background: images.forest,
    //   content: {
    //     type: "text",
    //     text: "РЕЛИКВИЯ I — ПОЛУЧЕНА\n\nTHE ART OF JOHN HARRIS — Beyond the Horizon",
    //   },
    //   audio: audio.forest,
    //   nextScene: "chapter1-relic-5",
    // },

    // {
    //   id: "chapter1-relic-5",
    //   background: images.forest,
    //   content: {
    //     type: "text",
    //     text: "Тип: Вдохновение.\n\nРедкость: ★★★★☆",
    //   },
    //   nextScene: "chapter1-sound",
    // },

    // ============================================================
    // THE SOUND
    // ============================================================

    {
      id: "chapter1-sound",
      background: images.bookInHands,
      content: {
        type: "text",
        text: "Как только ты закрываешь книгу, в комнате снова становится тихо.\n\nА затем в дальней стене что-то приходит в движение.",
      },
      audio: audio.room,
      nextScene: "chapter1-sound-2",
    },

    {
      id: "chapter1-sound-2",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "Камни медленно расходятся, открывая узкий проход.",
      },
      audio: audio.room,
      nextScene: "chapter1-sound-3",
    },

    {
      id: "chapter1-sound-3",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "В глубине прохода — небольшая тень.",
      },
      audio: audio.room,
      actions: [
        {
          id: "chase",
          label: "Follow the shadow",
          nextScene: "chapter1-chase",
        },
        {
          id: "wait",
          label: "Freeze and wait",
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
      audio: audio.room,
      nextScene: "chapter1-chase-2",
    },

    {
      id: "chapter1-chase-2",
      background: images.corridorTraces,
      content: {
        type: "text",
        text: "Ты видишь следы, уходящие вглубь тёмного коридора.",
      },
      audio: audio.room,
      nextScene: "chapter1-chase-3",
    },

    {
      id: "chapter1-chase-3",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Ты бежишь напролом, ничего не видя перед собой.\n\nПлечом задеваешь стену — острый камень царапает кожу.",
      },
      audio: audio.room,
      nextScene: "chapter1-chase-4",
    },

    {
      id: "chapter1-chase-4",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Следы продолжаются всё глубже.\n\nНо тени впереди больше нет.",
      },
      audio: audio.room,
      nextScene: "chapter1-chase-5",
    },

    {
      id: "chapter1-chase-5",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Ты останавливаешься, чтобы отдышаться.\n\nИ тут замечаешь что-то на выступе стены рядом.",
      },
      audio: audio.room,
      nextScene: "chapter1-chase-6",
    },

    {
      id: "chapter1-chase-6",
      background: images.yarnWall,
      content: {
        type: "text",
        text: "Клочок пряжи тёплого рыжеватого цвета зацепился за острый край камня.\n\nТот, кто бежал здесь, задел его второпях.",
      },
      audio: audio.room,
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
        text: "Ты снимаешь нитку с камня и продолжаешь путь.",
      },
      audio: audio.room,
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
      audio: audio.room,
      nextScene: "chapter1-wait-2",
    },

    {
      id: "chapter1-wait-2",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Тень в проходе тоже не двигается.\n\nА потом делает шаг вперёд.",
      },
      audio: audio.room,
      nextScene: "chapter1-wait-3",
    },

    {
      id: "chapter1-wait-3",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Теперь ты видишь её чуть лучше.\n\nНебольшой силуэт смотрит на тебя несколько секунд.",
      },
      audio: audio.room,
      nextScene: "chapter1-wait-4",
    },

    {
      id: "chapter1-wait-4",
      background: images.roomDoorShadow,
      content: {
        type: "text",
        text: "Потом тень наклоняется и оставляет что-то на полу.",
      },
      audio: audio.room,
      nextScene: "chapter1-wait-5",
    },

    {
      id: "chapter1-wait-5",
      background: images.roomDoor,
      content: {
        type: "text",
        text: "И прежде чем ты успеваешь сделать шаг, она исчезает в проходе.",
      },
      audio: audio.room,
      nextScene: "chapter1-wait-6",
    },

    {
      id: "chapter1-wait-6",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты подходишь ближе.\n\nНа полу лежит обрывок пряжи тёплого коричневого цвета.",
      },
      audio: audio.room,
      nextScene: "chapter1-wait-7",
    },

    {
      id: "chapter1-wait-7",
      background: images.yarn,
      content: {
        type: "text",
        text: "Ты поднимаешь пряжу и идёшь дальше по коридору.",
      },
      audio: audio.room,
      actions: [
        {
          id: "take-thread-torn",
          label: "Take the thread",
          nextScene: "chapter1-wait-8",
        },
      ],
    },

    {
      id: "chapter1-wait-8",
      background: images.corridorTracesFinal,
      content: {
        type: "text",
        text: "Впереди снова видны небольшие следы.",
      },
      audio: audio.room,
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
      audio: audio.destruction,
      specialEffects: ["shake"],
      autoTransitionToNexScene: true,
      nextScene: "chapter1-ending-2",
    },

    {
      id: "chapter1-ending-2",
      background: images.corridor,
      content: {
        type: "text",
        text: "Земля уходит из-под ног.\n\nБудто сам мир начинает разваливаться на части...",
      },
      audio: audio.destruction,
      specialEffects: ["shake"],
      autoTransitionToNexScene: true,
      nextScene: "chapter2-transition",
    },
  ],
};
