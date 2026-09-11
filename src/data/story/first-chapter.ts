import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";

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
      nextScene: "chapter1-forest-2",
    },

    {
      id: "chapter1-forest-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди виднеется узкая тропа.",
      },
      actions: [
        {
          id: "follow-trail",
          label: "Следовать по тропе",
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
        text: "Тропа почти полностью скрыта под опавшими листьями.",
      },
      nextScene: "chapter1-footprints-2",
    },

    {
      id: "chapter1-footprints-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Вдруг что-то привлекает твоё внимание.",
      },
      actions: [
        {
          id: "look-closer",
          label: "Посмотреть внимательнее",
          nextScene: "chapter1-footprints-3",
        },
      ],
    },

    {
      id: "chapter1-footprints-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Это след какого-то существа. Определённо не человека.\n\nОн небольшой. Кажется, что существо прошло совсем недавно.",
      },
      nextScene: "chapter1-footprints-4",
    },

    {
      id: "chapter1-footprints-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты поднимаешь взгляд.\n\nВ нескольких метрах впереди — ещё один след.\n\n🐾",
      },
      nextScene: "chapter1-footprints-5",
    },

    {
      id: "chapter1-footprints-5",
      background: images.forest,
      content: {
        type: "text",
        text: "И ещё один.\n\n🐾",
      },
      actions: [
        {
          id: "follow-footprints",
          label: "Следовать за следами",
          nextScene: "chapter1-stone",
        },
      ],
    },

    // ============================================================
    // THE STONE
    // ============================================================

    {
      id: "chapter1-stone",
      background: images.forest,
      content: {
        type: "text",
        text: "Следы приводят тебя к древней каменной стене, покрытой мхом и корнями.",
      },
      actions: [
        {
          id: "examine-wall",
          label: "Исследовать стену",
          nextScene: "chapter1-stone-2",
        },
      ],
    },

    {
      id: "chapter1-stone-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Сначала в ней не видно ничего необычного.\n\nНо затем ты замечаешь какие-то странные символы.",
      },
      nextScene: "chapter1-stone-3",
    },

    {
      id: "chapter1-stone-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Пять древних знаков высечены прямо в камне.",
      },
      actions: [
        {
          id: "examine-runes",
          label: "Изучить символы",
          nextScene: "chapter1-stone-4",
        },
      ],
    },

    {
      id: "chapter1-stone-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты разбираешь надпись:\n\nQUEN · IGNI · AARD · AXII · YRDEN",
      },
      nextScene: "chapter1-stone-5",
    },

    {
      id: "chapter1-stone-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты замечаешь тот же след, что привёл тебя сюда, возле одной из рун.",
      },
      actions: [
        {
          id: "touch-rune",
          label: "Дотронуться до руны",
          nextScene: "chapter1-signs",
        },
      ],
    },

    {
      id: "chapter1-stone-6",
      background: images.forest,
      content: {
        type: "text",
        text: "КОНЕЦ ИГРЫ!!! НЕЛЬЗЯ НАЖИМАТЬ НА НЕЗНАКОМЫЕ РУНЫ",
      },
      nextScene: "chapter1-stone-7",
    },

    {
      id: "chapter1-stone-7",
      background: images.forest,
      content: {
        type: "text",
        text: "ШУТКА. МОЖЕШЬ ПРОДОЛЖИТЬ :)",
      },
      nextScene: "chapter1-signs",
    },

    // ============================================================
    // THE SIGNS
    // ============================================================

    {
      id: "chapter1-signs",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты подходишь ближе и касаешься первого знака.",
      },
      nextScene: "chapter1-signs-2",
    },

    {
      id: "chapter1-signs-2",
      background: images.forest,
      content: {
        type: "text",
        text: "♪\n\nОдна загадочная нота эхом разносится по каменному залу.",
      },
      nextScene: "chapter1-signs-3",
    },

    {
      id: "chapter1-signs-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Руна едва заметно светится.\n\nТы касаешься другой.",
      },
      nextScene: "chapter1-signs-4",
    },

    {
      id: "chapter1-signs-4",
      background: images.forest,
      content: {
        type: "text",
        text: "♪\n\nДругая нота.",
      },
      nextScene: "chapter1-signs-5",
    },

    {
      id: "chapter1-signs-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты пробуешь ещё один.",
      },
      nextScene: "chapter1-signs-6",
    },

    {
      id: "chapter1-signs-6",
      background: images.forest,
      content: {
        type: "text",
        text: "♪\n\nПять знаков. Пять разных звуков.",
      },
      nextScene: "chapter1-signs-7",
    },

    {
      id: "chapter1-signs-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Кажется, каждый из них — часть одной мелодии.",
      },
      nextScene: "chapter1-melody",
    },

    // ============================================================
    // THE MELODY — PUZZLE
    // ============================================================

    {
      id: "chapter1-melody",
      background: images.forest,
      content: {
        type: "text",
        text: "Перед тобой пять рун.",
      },
      puzzle: {
        type: "runes",
        nextScene: "chapter1-door",
      },
    },

    // ============================================================
    // THE DOOR
    // ============================================================

    {
      id: "chapter1-door",
      background: images.forest,
      content: {
        type: "text",
        text: "Последняя нота затихает.\n\nНесколько секунд — полная тишина.",
      },
      nextScene: "chapter1-door-2",
    },

    {
      id: "chapter1-door-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Затем руны вспыхивают одновременно.\n\nПо стене пробегает золотистая линия света.",
      },
      nextScene: "chapter1-door-3",
    },

    {
      id: "chapter1-door-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Раздаётся глубокий гул.\n\nКамень начинает двигаться.",
      },
      nextScene: "chapter1-door-4",
    },

    {
      id: "chapter1-door-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Древняя дверь медленно открывается.",
      },
      nextScene: "chapter1-chamber",
    },

    // ============================================================
    // THE CHAMBER
    // ============================================================

    {
      id: "chapter1-chamber",
      background: images.forest,
      content: {
        type: "text",
        text: "За дверью находится небольшая тёмная комната.\n\nВ центре стоит каменный пьедестал.",
      },
      nextScene: "chapter1-chamber-2",
    },

    {
      id: "chapter1-chamber-2",
      background: images.forest,
      content: {
        type: "text",
        text: "На нём лежит книга.",
      },
      nextScene: "chapter1-book",
    },

    // ============================================================
    // THE BOOK
    // ============================================================

    {
      id: "chapter1-book",
      background: images.forest,
      content: {
        type: "image",
        src: "/images/items/art-of-john-harris.webp",
        alt: "The Art of John Harris: Beyond the Horizon",
      },
      nextScene: "chapter1-relic",
    },

    {
      id: "chapter1-relic",
      background: images.forest,
      content: {
        type: "text",
        text: "The Art of John Harris: Beyond the Horizon.\n\nТы берёшь книгу с пьедестала.",
      },
      nextScene: "chapter1-relic-2",
    },

    {
      id: "chapter1-relic-2",
      background: images.forest,
      content: {
        type: "text",
        text: "На мгновение в комнате становится совершенно тихо.\n\nНа первой странице появляется надпись.",
      },
      nextScene: "chapter1-relic-3",
    },

    {
      id: "chapter1-relic-3",
      background: images.forest,
      content: {
        type: "text",
        text: "«Каждое великое приключение начинается с мира, который существует лишь в чьём-то воображении.»",
      },
      nextScene: "chapter1-relic-4",
    },

    {
      id: "chapter1-relic-4",
      background: images.forest,
      content: {
        type: "text",
        text: "РЕЛИКВИЯ I — ПОЛУЧЕНА\n\nTHE ART OF JOHN HARRIS — Beyond the Horizon.",
      },
      nextScene: "chapter1-relic-5",
    },

    {
      id: "chapter1-relic-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Тип: Вдохновение.\n\nРедкость: ★★★★☆",
      },
      nextScene: "chapter1-sound",
    },

    // ============================================================
    // THE SOUND
    // ============================================================

    {
      id: "chapter1-sound",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты собираешься выйти из комнаты.",
      },
      nextScene: "chapter1-sound-2",
    },

    {
      id: "chapter1-sound-2",
      background: images.forest,
      content: {
        type: "text",
        text: "И вдруг — шорох.\n\nТы замираешь.",
      },
      nextScene: "chapter1-sound-3",
    },

    {
      id: "chapter1-sound-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Тишина.\n\nЗатем ещё один звук.",
      },
      nextScene: "chapter1-sound-4",
    },

    {
      id: "chapter1-sound-4",
      background: images.forest,
      content: {
        type: "text",
        text: "На этот раз — прямо позади тебя.",
      },
      nextScene: "chapter1-sound-5",
    },

    {
      id: "chapter1-sound-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты медленно оборачиваешься.\n\nНичего.",
      },
      nextScene: "chapter1-sound-6",
    },

    {
      id: "chapter1-sound-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Только тёмный дверной проём.",
      },
      nextScene: "chapter1-sound-7",
    },

    {
      id: "chapter1-sound-7",
      background: images.forest,
      content: {
        type: "text",
        text: "И вдруг — ты видишь тень.",
      },
      nextScene: "chapter1-sound-8",
    },

    {
      id: "chapter1-sound-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты бросаешься следом.",
      },
      nextScene: "chapter2-workshop",
    },
    {
      id: "chapter1-ending",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы выходите наружу.\n\nУ входа, прямо в пыли, вы замечаете небольшой след.",
      },
      nextScene: "chapter1-ending-2",
    },

    {
      id: "chapter1-ending-2",
      background: images.forest,
      content: {
        type: "text",
        text: "В лесу снова тихо.\n\nСлишком тихо.",
      },
      nextScene: "chapter1-ending-3",
    },

    {
      id: "chapter1-ending-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Вдруг между деревьями что-то движется.",
      },
      nextScene: "chapter1-ending-4",
    },

    {
      id: "chapter1-ending-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы мельком видите маленький пушистый силуэт.\n\nЧто-то наблюдает за вами.",
      },
      nextScene: "chapter1-ending-5",
    },

    {
      id: "chapter1-ending-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Он исчезает прежде, чем вы успеваете понять, что это было.",
      },
      nextScene: "chapter1-ending-6",
    },

    {
      id: "chapter1-ending-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Пауза.",
      },
      nextScene: "chapter1-ending-7",
    },

    {
      id: "chapter1-ending-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы подходите ближе к тому месту, где он исчез.\n\nВидны ещё следы.",
      },
      nextScene: "chapter1-ending-8",
    },

    {
      id: "chapter1-ending-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Они ведут вглубь леса.",
      },
      nextScene: "chapter2-workshop",
    },
  ],
};
