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
        text: "Впереди виднеется узкая тропа.",
      },
      audio: audio.forest,
      nextScene: "chapter1-forest-3",
    },

    {
      id: "chapter1-forest-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты бывал здесь много раз.\n\nНо этой тропы раньше не было.",
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
      background: images.track,
      content: {
        type: "text",
        text: "Это след.\n\nНебольшой, глубокий, с пятью пальцами.\n\nОпределённо не человеческий.",
      },
      audio: audio.forest,
      nextScene: "chapter1-footprints-3",
    },

    {
      id: "chapter1-footprints-3",
      background: images.track,
      content: {
        type: "text",
        text: "Ты поднимаешь взгляд.\n\nВ нескольких метрах впереди — ещё один.\n\n🐾",
      },
      audio: audio.forest,
      nextScene: "chapter1-footprints-4",
    },

    {
      id: "chapter1-footprints-4",
      background: images.track,
      content: {
        type: "text",
        text: "И ещё один.\n\nКто-то прошёл здесь совсем недавно.\n\n🐾",
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
        text: "Пять древних знаков высечены прямо в камне.\n\nТы разбираешь надпись:\n\nQUEN · IGNI · AARD · YRDEN · AXII",
      },
      audio: audio.forest,
      nextScene: "chapter1-stone-4",
    },

    {
      id: "chapter1-stone-4",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "А у подножия стены, в сырой земле, — тот самый след.\n\nЗдесь он обрывается. Прямо у камня.",
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
        text: "QUEN.",
      },
      audio: audio.forest,
      nextScene: "chapter1-moss-4",
    },

    {
      id: "chapter1-moss-4",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "Царапины свежие и совсем низко над землёй.\n\nТот, кто их оставил, был невысокого роста.",
      },
      audio: audio.forest,
      nextScene: "chapter1-moss-5",
    },

    {
      id: "chapter1-moss-5",
      background: images.wallWithSymbolsHint,
      content: {
        type: "text",
        text: "QUEN.\n\nТеперь ты знаешь, с чего всё начинается.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs",
    },

    // ============================================================
    // THE SIGNS
    // ============================================================

    {
      id: "chapter1-signs",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Ты подходишь ближе и касаешься первого знака.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-2",
    },

    //TODO Добавить шутку :)

    {
      id: "chapter1-signs-2",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Руна едва заметно светится.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-3",
    },

    {
      id: "chapter1-signs-3",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "♪\n\nТы слышишь одну ноту.\n\nОна разносится эхом по лесу.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-4",
    },

    {
      id: "chapter1-signs-4",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Ты касаешься другой руны.\n\nДругой звук.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-5",
    },

    {
      id: "chapter1-signs-5",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Пять знаков.\n\nПять разных звуков.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-6",
    },

    {
      id: "chapter1-signs-6",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Ты убираешь руку.\n\nИ в тишине звучит короткая мелодия.",
      },
      audio: audio.forest,
      nextScene: "chapter1-signs-7",
    },

    {
      id: "chapter1-signs-7",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "♪  ♪  ♪  ♪  ♪\n\nМелодия обрывается на середине.\n\nБудто ждёт продолжения.",
      },
      audio: audio.forest,
      nextScene: "chapter1-melody",
    },

    {
      id: "chapter1-signs-8",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Руны гаснут.\n\nТеперь твоя очередь.",
      },
      audio: audio.forest,
      nextScene: "chapter1-melody",
    },

    // ============================================================
    // THE MELODY — PUZZLE
    // ============================================================

    {
      id: "chapter1-melody",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "",
      },
      puzzle: {
        id: "chapter1-runes",
        type: "runes",
        nextScene: "chapter1-door",
      },
    },

    // ============================================================
    // THE DOOR
    // ============================================================

    {
      id: "chapter1-door",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Последняя нота затихает.\n\nНесколько секунд — полная тишина.",
      },
      nextScene: "chapter1-door-2",
    },

    {
      id: "chapter1-door-2",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Затем руны вспыхивают одновременно.\n\nПо стене пробегает золотистая линия света.",
      },
      nextScene: "chapter1-door-3",
    },

    {
      id: "chapter1-door-3",
      background: images.wallWithTrack,
      content: {
        type: "text",
        text: "Раздаётся глубокий гул.\n\nКамень начинает двигаться.\n\nДревняя дверь медленно открывается.",
      },
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
      background: images.forest,
      content: {
        type: "text",
        text: "За дверью — небольшая тёмная комната.\n\nВ центре стоит каменный пьедестал.",
      },
      nextScene: "chapter1-chamber-2",
    },

    {
      id: "chapter1-chamber-2",
      background: images.forest,
      content: {
        type: "text",
        text: "На нём лежит книга.\n\nКажется, что этому месту сотни лет — а книга новая. Без единой пылинки.",
      },
      nextScene: "chapter1-chamber-3",
    },

    {
      id: "chapter1-chamber-3",
      background: images.forest,
      content: {
        type: "text",
        text: "В пыли у пьедестала ты видишь тот же маленький след.",
      },
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
      background: images.forest,
      content: {
        type: "text",
        text: "Ты не трогаешь её.\n\nЧужие вещи в чужих комнатах лучше оставлять на месте.",
      },
      nextScene: "chapter1-leave-2",
    },

    {
      id: "chapter1-leave-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты делаешь шаг к двери.\n\nИ слышишь за спиной короткий шорох.",
      },
      nextScene: "chapter1-leave-3",
    },

    {
      id: "chapter1-leave-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Книга лежит на полу.\n\nЕё столкнули с пьедестала. Прямо тебе под ноги.",
      },
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
      background: images.forest,
      content: {
        type: "text",
        text: "Книга у тебя в руках.\n\nНа мгновение в комнате становится совершенно тихо.",
      },
      nextScene: "chapter1-relic-2",
    },

    {
      id: "chapter1-relic-2",
      background: images.forest,
      content: {
        type: "text",
        text: "На первой странице проступает надпись.",
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
        text: "РЕЛИКВИЯ I — ПОЛУЧЕНА\n\nTHE ART OF JOHN HARRIS — Beyond the Horizon",
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
        text: "Ты собираешься выйти из комнаты.\n\nИ вдруг — шорох за спиной.",
      },
      nextScene: "chapter1-sound-2",
    },

    {
      id: "chapter1-sound-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты медленно оборачиваешься.\n\nВ тёмном дверном проёме — тень. Маленькая.",
      },
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

    // ── Ветка: погоня ──
    // Нитку он тоже получит, но вырванную, а не оставленную.

    {
      id: "chapter1-chase",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты бросаешься вперёд.\n\nТень исчезает мгновенно.",
      },
      nextScene: "chapter1-chase-2",
    },

    {
      id: "chapter1-chase-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты выбегаешь наружу. Никого.\n\nТолько небольшой след в пыли у входа.",
      },
      nextScene: "chapter1-chase-3",
    },

    {
      id: "chapter1-chase-3",
      background: images.forest,
      content: {
        type: "text",
        text: "А на дверном косяке, на щепке, что-то зацепилось.",
      },
      nextScene: "chapter1-chase-4",
    },

    {
      id: "chapter1-chase-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Обрывок пряжи.\n\nТёплого рыжеватого цвета.",
      },
      actions: [
        {
          id: "take-thread-torn",
          label: "Take the thread",
          nextScene: "chapter1-ending",
        },
      ],
    },

    // ── Ветка: терпение ──
    // Здесь нитку кладут специально.

    {
      id: "chapter1-wait",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты не двигаешься.\n\nПроходит секунда. Другая.",
      },
      nextScene: "chapter1-wait-2",
    },

    {
      id: "chapter1-wait-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Тень в проёме тоже не двигается.\n\nА потом делает шаг вперёд.",
      },
      nextScene: "chapter1-wait-3",
    },

    {
      id: "chapter1-wait-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Маленький пушистый силуэт.\n\nОн смотрит на тебя несколько секунд — спокойно, без страха.",
      },
      nextScene: "chapter1-wait-4",
    },

    {
      id: "chapter1-wait-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Потом наклоняется и кладёт что-то на пол.",
      },
      nextScene: "chapter1-wait-5",
    },

    {
      id: "chapter1-wait-5",
      background: images.forest,
      content: {
        type: "text",
        text: "А потом разворачивается и убегает.",
      },
      nextScene: "chapter1-wait-6",
    },

    {
      id: "chapter1-wait-6",
      background: images.forest,
      content: {
        type: "text",
        text: "На полу лежит обрывок пряжи.\n\nТёплого рыжеватого цвета.",
      },
      actions: [
        {
          id: "take-thread-given",
          label: "Take the thread",
          nextScene: "chapter1-ending",
        },
      ],
    },

    // ============================================================
    // THE ENDING
    // ============================================================

    {
      id: "chapter1-ending",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты выходишь наружу.\n\nВ лесу снова тихо. Слишком тихо.",
      },
      nextScene: "chapter1-ending-2",
    },

    {
      id: "chapter1-ending-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты видишь следы.\n\n🐾",
      },
      nextScene: "chapter1-ending-3",
    },

    {
      id: "chapter1-ending-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Они ведут вглубь леса.",
      },
      actions: [
        {
          id: "follow-deeper",
          label: "Follow in the footsteps",
          nextScene: "chapter2-transition",
        },
      ],
    },
  ],
};
