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
        text: "Тихий лес.\n\nВетер шелестит в кронах деревьев.",
      },
      nextScene: "chapter1-forest-2",
    },

    {
      id: "chapter1-forest-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то вдали кричит птица.\n\nВпереди виднеется узкая тропа.",
      },
      nextScene: "chapter1-footprints",
    },

    // ============================================================
    // THE FOOTPRINTS
    // ============================================================

    {
      id: "chapter1-footprints",
      background: images.forest,
      content: {
        type: "text",
        text: "Тропа почти полностью скрыта под опавшими листьями.\n\nЧто-то привлекает твоё внимание.",
      },
      nextScene: "chapter1-footprints-2",
    },

    {
      id: "chapter1-footprints-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Странный след.\n\nНебольшой. Свежий. Определённо не человеческий.",
      },
      nextScene: "chapter1-footprints-3",
    },

    {
      id: "chapter1-footprints-3",
      background: images.forest,
      content: {
        type: "text",
        text: "В нескольких метрах впереди — ещё один.\n\n🐾",
      },
      nextScene: "chapter1-footprints-4",
    },

    {
      id: "chapter1-footprints-4",
      background: images.forest,
      content: {
        type: "text",
        text: "И ещё один.\n\n🐾",
      },
      nextScene: "chapter1-stone",
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
      nextScene: "chapter1-stone-2",
    },

    {
      id: "chapter1-stone-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Сначала в ней не видно ничего необычного.\n\nНо затем ты замечаешь символы.",
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
      nextScene: "chapter1-stone-4",
    },

    {
      id: "chapter1-stone-4",
      background: images.forest,
      content: {
        type: "text",
        text: "QUEN · IGNI · AARD · AXII · YRDEN",
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
        text: "Знак едва заметно светится.\n\nТы касаешься другого.",
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
        text: "И вдруг — 🐾",
      },
      nextScene: "chapter1-sound-8",
    },

    {
      id: "chapter1-sound-8",
      background: images.forest,
      content: {
        type: "text",
        text: "На полу появляется маленький след.",
      },
      nextScene: "chapter2-workshop",
    },
  ],
};
