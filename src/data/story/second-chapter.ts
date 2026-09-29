import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter2";
import { audio } from "@/data/audio/chapter2";

export const secondChapter: ChapterData = {
  id: "chapter2",
  title: "NIGHT CITY",

  scenes: [
    // ─────────────────────────────
    // SCENE 01 — NIGHT CITY
    // ─────────────────────────────

    {
      id: "chapter2-eyes-opening",
      background: images.city,
      content: {
        type: "text",
        text: "",
      },
      specialEffects: ["signal"],
      effectDelay: 0,
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 3400,
      nextScene: "chapter2-night-city",
    },

    {
      id: "chapter2-night-city",
      background: images.city,
      content: {
        type: "text",
        text: "Ты открываешь глаза.\n\nПеред тобой — город.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-night-city-2",
    },

    {
      id: "chapter2-night-city-2",
      background: images.city,
      content: {
        type: "text",
        text: "Неон отражается в мокром асфальте.\n\nВысотные здания уходят куда-то вверх.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-night-city-3",
    },

    {
      id: "chapter2-night-city-3",
      background: images.city,
      content: {
        type: "text",
        text: "Рекламные вывески мигают сквозь дождь.\n\nГде-то далеко гудят двигатели.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-night-city-4",
    },

    {
      id: "chapter2-night-city-4",
      background: images.nightCity,
      content: {
        type: "text",
        text: "",
      },
      audio: audio.cyberpunk,

      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 2000,
      nextScene: "chapter2-night-city-5",
    },

    {
      id: "chapter2-night-city-5",
      background: images.nightCity,
      content: {
        type: "text",
        text: "Ты пытаешься понять, где тот, кто привёл тебя сюда.\n\nНо среди тысяч людей, машин и огней его уже не найти.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-night-city-6",
    },

    {
      id: "chapter2-night-city-6",
      background: images.greenLightStreet,
      content: {
        type: "text",
        text: "И тут ты замечаешь странный зелёный свет.\n\nОн мерцает в глубине переулка.",
      },
      audio: audio.cyberpunk,
      actions: [
        {
          id: "approach-light",
          label: "Approach the light",
          nextScene: "chapter2-night-city-8",
        },
        {
          id: "look-around",
          label: "Look around first",
          nextScene: "chapter2-night-city-7",
        },
      ],
    },

    {
      id: "chapter2-night-city-7",
      background: images.street,
      content: {
        type: "text",
        text: "Дождь, неон, чужие лица.\n\nМокрый асфальт покрыт десятками следов.\n\nНо знакомого среди них нет.",
      },
      audio: audio.cyberpunk,
      actions: [
        {
          id: "approach-light-after",
          label: "Approach the light",
          nextScene: "chapter2-night-city-8",
        },
      ],
    },

    {
      id: "chapter2-night-city-8",
      background: images.signboard,
      content: {
        type: "text",
        text: "Ты подходишь ближе.\n\nСвет идёт от небольшой панели в стене.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-night-city-9",
    },

    {
      id: "chapter2-night-city-9",
      background: images.signboard,
      content: {
        type: "text",
        text: "На ней ты видишь надпись:\n\nPRIVATE WORKSHOP.",
      },
      audio: audio.cyberpunk,

      actions: [
        {
          id: "touch-screen",
          label: "Inspect the panel",
          nextScene: "chapter2-night-city-10",
        },
      ],
    },

    {
      id: "chapter2-night-city-10",
      background: images.terminal,
      content: {
        type: "text",
        text: "Ты касаешься панели.\n\nВнутри стены что-то щёлкает.\n\nСтарый терминал оживает, и экран вспыхивает зелёным светом.\n\nНесколько секунд — только помехи. А затем...",
      },
      audio: audio.cyberpunk,
      specialEffects: ["static"],
      effectDelay: 1800,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 8000,
      nextScene: "chapter2-terminal",
    },

    // ─────────────────────────────
    // SCENE 03 — TERMINAL
    // ─────────────────────────────

    {
      id: "chapter2-terminal",
      content: {
        type: "terminal",

        title: "LOCAL TERMINAL",
        status: "ONLINE",
        date: "21/11/2026",

        lines: [
          {
            text: "> SYSTEM BOOT...",
            type: "system",
          },
          {
            text: "> MEMORY CHECK ............ OK",
            type: "success",
          },
          {
            text: "> DISPLAY .................. OK",
            type: "success",
          },
          {
            text: "> NETWORK ................. OFFLINE",
            type: "warning",
          },
          {
            text: "> SECURITY ................ ACTIVE",
            type: "success",
          },
          {
            text: "",
          },
          {
            text: "> UNKNOWN USER DETECTED",
            type: "warning",
          },
          {
            text: "> ACCESS DENIED",
            type: "error",
          },
          {
            text: "> RECOVERY PROTOCOL AVAILABLE",
            type: "system",
          },
        ],

        actionLabel: "INSPECT TERMINAL",
      },

      audio: audio.cyberpunk,

      nextScene: "chapter2-terminal-2",
    },

    {
      id: "chapter2-terminal-2",
      content: {
        type: "terminal",

        title: "PRIVATE WORKSHOP",
        status: "ACCESS DENIED",
        date: "21/11/2026",

        lines: [
          {
            text: "> PRIVATE WORKSHOP",
            type: "system",
          },
          {
            text: "> ACCESS DENIED",
            type: "error",
          },
          {
            text: "> SYSTEM STATUS: CRITICAL",
            type: "warning",
          },
          {
            text: "> CORE MODULES: 03",
          },
          {
            text: "> MEMORY ................. FAILED",
            type: "error",
          },
          {
            text: "> LOGIC .................. FAILED",
            type: "error",
          },
          {
            text: "> OUTPUT ................. FAILED",
            type: "error",
          },
          {
            text: "",
          },
          {
            text: "> RECOVERY PROTOCOL AVAILABLE",
            type: "system",
          },
        ],

        actionLabel: "START RECOVERY",
      },

      audio: audio.cyberpunk,

      nextScene: "chapter2-code-puzzle",
    },

    {
      id: "chapter2-code-puzzle",

      content: {
        type: "text",
        text: "",
      },

      audio: audio.cyberpunk,
      puzzle: {
        id: "chapter2-system-repair",
        type: "cyberpunk",
        nextScene: "chapter2-workshop",
      },
    },

    // ─────────────────────────────
    // SCENE 05 — WORKSHOP
    // ─────────────────────────────

    {
      id: "chapter2-workshop",
      background: images.terminal,
      content: {
        type: "text",
        text: "Где-то за стеной раздаётся механический звук.\n\nЩёлк.\n\nПауза.\n\nЩёлк.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-workshop-2",
    },

    {
      id: "chapter2-workshop-2",
      background: images.workshopDoor,
      content: {
        type: "text",
        text: "Затем включается свет.\n\nПеред тобой открывается дверь в небольшую мастерскую.",
      },

      audio: audio.cyberpunk,
      nextScene: "chapter2-workshop-3",
    },

    {
      id: "chapter2-workshop-3",
      background: images.workshopDesk,
      content: {
        type: "text",
        text: "Инструменты, детали, разобранные механизмы.\n\nВсё покрыто пылью.\n\nПохоже, здесь давно никто не работал.",
      },

      audio: audio.cyberpunk,
      nextScene: "chapter2-workshop-4",
    },

    {
      id: "chapter2-workshop-4",
      background: images.workshopDesk,
      content: {
        type: "text",
        text: "Перед тобой длинный рабочий стол.\n\nА в углу до сих пор горит одинокий монитор.",
      },

      audio: audio.cyberpunk,

      actions: [
        {
          id: "check-table",
          label: "Осмотреть стол",
          nextScene: "chapter2-table",
        },
        {
          id: "check-log",
          label: "Посмотреть, что на экране",
          nextScene: "chapter2-log",
        },
      ],
    },

    // ── Ветка: экран ──
    // Тот, кто пойдёт к столу сразу, лога не увидит.

    {
      id: "chapter2-log",
      background: images.workshopScreen,
      content: {
        type: "text",
        text: "На экране открыт лог.\n\nОн всё ещё пишется.",
      },
      specialComponent: "workshop-log",

      autoTransitionToNextScene: true,
      autoTransitionDelay: 6500,

      audio: audio.cyberpunk,
      nextScene: "chapter2-log-2",
    },

    {
      id: "chapter2-log-2",
      background: images.workshopScreen,
      content: {
        type: "text",
        text: "За тобой следят с самой первой минуты.\n\nИ всё это время тебя вели именно сюда.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table",
    },

    // ── Стол ──
    {
      id: "chapter2-table",
      background: images.drawing,
      content: {
        type: "text",
        text: "Стол завален чертежами.\n\nСреди них снова и снова встречается один и тот же силуэт.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-2",
    },

    {
      id: "chapter2-table-2",
      background: images.drawing,
      content: {
        type: "text",
        text: "Небольшое механическое существо.\n\nДве широкие пластины на спине, прозрачные крылья и шесть тонких лап.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-3",
    },

    {
      id: "chapter2-table-3",
      background: images.drawing,
      content: {
        type: "text",
        text: "Внутри корпуса — шестерни, шарниры и десятки мелких деталей.\n\nКаждый механизм прорисован до последнего винта.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-4",
    },

    // {
    //   id: "chapter2-table-4",
    //   background: images.drawing,
    //   content: {
    //     type: "text",
    //     text: "Десятки вариантов перечёркнуты.\n\nНо последний чертёж выглядит иначе.\n\nНи одной поправки.",
    //   },
    //   audio: audio.cyberpunk,
    //   nextScene: "chapter2-table-5",
    // },
    {
      id: "chapter2-table-4",
      background: images.knittingPattern,
      content: {
        type: "text",
        text: "Ты переворачиваешь последний лист.\n\nПод ним обнаруживается ещё одна схема.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-5",
    },

    {
      id: "chapter2-table-5",
      background: images.knittingPattern,
      content: {
        type: "text",
        text: "Но эта схема совсем другая.\n\nЗдесь нет шестерён и механизмов — только простые линии.\n\nМаленькая фигура с круглыми ушами и четырьмя лапами.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-6",
    },

    {
      id: "chapter2-table-6",
      background: images.knittingPatternYarn,
      content: {
        type: "text",
        text: "А рядом со схемой лежит клубок.\n\nТого же тёплого рыжеватого цвета, что и нитка у тебя в кармане.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-table-7",
    },

    {
      id: "chapter2-table-7",
      background: images.box,
      content: {
        type: "text",
        text: "В самом углу стола, отдельно от всего, стоит небольшая коробка.\n\nНа ней надпись:\n\nMI-01",
      },
      audio: audio.cyberpunk,
      actions: [
        {
          id: "open-box",
          label: "Open the box",
          nextScene: "chapter2-open",
        },
      ],
    },

    // ─────────────────────────────
    // SCENE 06 — THE GIFT
    // ─────────────────────────────

    {
      id: "chapter2-open",
      background: images.contentOfBox,
      content: {
        type: "text",
        text: "Внутри — детали.\n\nЛатунные пластины, шестерни и винты.\n\nНа внутренней стороне крышки — инструкция по сборке.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-open-2",
    },

    // {
    //   id: "chapter2-open-4",
    //   background: images.cyberpunk,
    //   content: {
    //     type: "text",
    //     text: "РЕЛИКВИЯ II — ПОЛУЧЕНА\n\nMI-01 — CYBERPUNK BEETLE",
    //   },
    //   nextScene: "chapter2-open-5",
    // },

    // {
    //   id: "chapter2-open-5",
    //   background: images.cyberpunk,
    //   content: {
    //     type: "text",
    //     text: "Тип: Механизм. В разобранном виде.\n\nРедкость: ★★★★★",
    //   },
    //   nextScene: "chapter2-open-6",
    // },

    {
      id: "chapter2-open-2",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Ты уже собираешься закрыть коробку.\n\nНо рядом, в пыли на столе, замечаешь маленький след.",
      },
      audio: audio.cyberpunk,
      actions: [
        {
          id: "leave-now",
          label: "Pick up box and leave",
          nextScene: "chapter2-transition-back",
        },
        {
          id: "wait-here",
          label: "Wait",
          nextScene: "chapter2-wait",
        },
      ],
    },

    // ── Ветка: подождать ──

    {
      id: "chapter2-wait",
      background: images.wait,
      content: {
        type: "text",
        text: "Ты садишься прямо на пол и ждёшь.\n\nМинуту. Две.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-wait-2",
    },

    {
      id: "chapter2-wait-2",
      background: images.wait,
      content: {
        type: "text",
        text: "Никто не приходит.\n\nПотом в углу коротко щёлкает монитор.\n\nТы оборачиваешься.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-wait-3",
    },

    {
      id: "chapter2-wait-3",
      content: {
        type: "terminal",

        title: "LOCAL TERMINAL",
        status: "ONLINE",
        date: "21/11/2026",

        lines: [
          {
            text: "> HE IS ALREADY OUTSIDE",
            type: "warning",
          },
        ],

        actionLabel: "Go outside",
      },

      audio: audio.cyberpunk,
      nextScene: "chapter2-transition-back",
    },

    // ─────────────────────────────
    // SCENE 07 — RETURN
    // ─────────────────────────────

    {
      id: "chapter2-transition-back",
      background: images.workshopOutside,
      content: {
        type: "text",
        text: "Ты выходишь обратно в переулок.\n\nСвет мастерской гаснет за спиной.",
      },
      nextScene: "chapter2-transition-back-2",
    },

    {
      id: "chapter2-transition-back-2",
      background: images.workshopOutside,
      content: {
        type: "text",
        text: "Шум города становится всё тише.\n\nНеон исчезает.",
      },

      autoTransitionDelay: 3500,
      autoTransitionToNextScene: true,

      nextScene: "chapter2-transition-back-3",
    },

    {
      id: "chapter2-transition-back-3",
      background: images.workshopOutside,
      content: {
        type: "text",
        text: "",
      },

      specialEffects: ["warp"],
      effectDelay: 1600,
      autoTransitionToNextScene: true,
      nextScene: "final-start",
    },
  ],
};
