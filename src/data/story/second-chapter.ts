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
        text: "Ты пытаешься понять, где след, который привёл тебя сюда.\n\nНо среди тысяч людей, машин и огней его уже не найти.",
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
        text: "Дождь, реклама, чужие лица.\n\nИ ни одного следа на мокром асфальте кроме твоих собственных.",
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
          nextScene: "chapter2-terminal",
        },
      ],
    },

    // ─────────────────────────────
    // SCENE 03 — TERMINAL
    // ─────────────────────────────

    // {
    //   id: "chapter2-terminal",
    //   background: images.terminal,
    //   content: {
    //     type: "text",
    //     text: "Под панелью ты видишь старый терминал.\n\nЭкран всё ещё работает.",
    //   },
    //   actions: [
    //     {
    //       id: "touch-screen",
    //       label: "Touch screen",
    //       nextScene: "chapter2-terminal-2",
    //     },
    //   ],
    // },
    // {
    //   id: "chapter2-terminal-2",
    //   background: images.terminal,
    //   content: {
    //     type: "text",
    //     text: "Экран вспыхивает зелёным светом.\n\nНесколько секунд — только помехи.\n\nЗатем появляется сообщение:\n\n«PRIVATE WORKSHOP // ACCESS DENIED».",
    //   },
    //   actions: [
    //     {
    //       id: "inspect-terminal",
    //       label: "Inspect terminal",
    //       nextScene: "chapter2-terminal-3",
    //     },
    //   ],
    // },
    // {
    //   id: "chapter2-terminal-3",
    //   background: images.terminal,
    //   content: {
    //     type: "text",
    //     text: "Ниже появляется ещё одна строка: «RECOVERY PROTOCOL AVAILABLE».\n\nПохоже, система повреждена.\n\nЕсли удастся восстановить её, возможно, откроется вход в мастерскую.",
    //   },
    //   actions: [
    //     {
    //       id: "start-recovery",
    //       label: "Start recovery",
    //       nextScene: "chapter2-system-repair-1",
    //     },
    //   ],
    // },
    // {
    //   id: "chapter2-system-repair-1",
    //   background: images.terminal,
    //   content: {
    //     type: "text",
    //     text: "Экран меняется.\n\nВместо привычного интерфейса появляются строки кода.",
    //   },
    //   nextScene: "chapter2-system-repair-2",
    // },

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

        actionLabel: "TOUCH SCREEN",
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

    // {
    //   id: "chapter2-terminal-3",
    //   content: {
    //     type: "terminal",

    //     title: "WORKSHOP CONTROL SYSTEM",
    //     status: "RECOVERY MODE",
    //     date: "21/11/2026",

    //     lines: [
    //       {
    //         text: "> WORKSHOP CONTROL SYSTEM",
    //         type: "system",
    //       },
    //       {
    //         text: "> RECOVERY MODE INITIALIZED",
    //         type: "system",
    //       },
    //       {
    //         text: "",
    //       },
    //       {
    //         text: "> MEMORY MODULE .......... OFFLINE",
    //         type: "error",
    //       },
    //       {
    //         text: "> LOGIC MODULE ........... OFFLINE",
    //         type: "error",
    //       },
    //       {
    //         text: "> OUTPUT MODULE .......... OFFLINE",
    //         type: "error",
    //       },
    //       {
    //         text: "",
    //       },
    //       {
    //         text: "> MANUAL RECOVERY REQUIRED",
    //         type: "warning",
    //       },
    //       {
    //         text: "",
    //       },
    //       {
    //         text: "> THREE MODULES REQUIRED",
    //         type: "system",
    //       },
    //       {
    //         text: "> AWAITING INPUT...",
    //         type: "system",
    //       },
    //     ],

    //     actionLabel: "BEGIN RECOVERY",
    //   },

    //   nextScene: "chapter2-code-puzzle",
    // },

    {
      id: "chapter2-code-puzzle",
      // background: images.terminal,
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
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Где-то за стеной раздаётся механический звук.\n\nЩёлк.\n\nПауза.\n\nЩёлк.",
      },
      audio: audio.cyberpunk,
      nextScene: "chapter2-workshop-2",
    },

    {
      id: "chapter2-workshop-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Затем включается свет.\n\nПеред тобой открывается дверь в небольшую мастерскую.",
      },
      nextScene: "chapter2-workshop-3",
    },

    {
      id: "chapter2-workshop-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Инструменты, детали, разобранные механизмы.\n\nВсё покрыто пылью.\n\nПохоже, здесь давно никто не работал.",
      },
      nextScene: "chapter2-workshop-4",
    },

    {
      id: "chapter2-workshop-4",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "В центре комнаты — длинный рабочий стол.\n\nА в углу до сих пор горит одинокий монитор.",
      },
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
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "На экране открыт лог.\n\nОн всё ещё пишется.",
      },
      nextScene: "chapter2-log-2",
    },

    {
      id: "chapter2-log-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: `08:19  subject entered the forest
08:31  subject found the trail
09:04  subject touched the rune
09:12  subject opened the door`,
      },
      nextScene: "chapter2-log-3",
    },

    {
      id: "chapter2-log-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: `Курсор мигает в последней строке.

09:48  subject entered the workshop`,
      },
      nextScene: "chapter2-log-4",
    },

    {
      id: "chapter2-log-4",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "За тобой следят с самой первой минуты.\n\nИ всё это время тебя вели именно сюда.",
      },
      nextScene: "chapter2-table",
    },

    // ── Стол ──

    {
      id: "chapter2-table",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Стол завален чертежами.",
      },
      nextScene: "chapter2-table-2",
    },

    {
      id: "chapter2-table-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Один и тот же рисунок — снова и снова.\n\nЖёсткие надкрылья, шесть ног, ни одного лишнего винта.",
      },
      nextScene: "chapter2-table-3",
    },

    {
      id: "chapter2-table-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Десятки листов, и почти все перечёркнуты.\n\nНа верхнем — ни одной поправки.",
      },
      nextScene: "chapter2-table-4",
    },

    {
      id: "chapter2-table-4",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "А под чертежами лежит ещё один лист.\n\nЭто не чертёж.",
      },
      nextScene: "chapter2-table-5",
    },

    {
      id: "chapter2-table-5",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Схема вязания.\n\nМаленькая фигура. Круглые уши. Пять пальцев.",
      },
      nextScene: "chapter2-table-6",
    },

    {
      id: "chapter2-table-6",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Почерк тот же.",
      },
      nextScene: "chapter2-table-7",
    },

    {
      id: "chapter2-table-7",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "А рядом со схемой лежит клубок.\n\nТого же тёплого рыжеватого цвета, что и нитка у тебя в кармане.",
      },
      nextScene: "chapter2-table-8",
    },

    {
      id: "chapter2-table-8",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "В самом углу стола, отдельно от всего, стоит небольшая коробка.\n\nНа ней одна надпись:\n\nMI-01",
      },
      actions: [
        {
          id: "open-box",
          label: "Открыть коробку",
          nextScene: "chapter2-open",
        },
      ],
    },

    // ─────────────────────────────
    // SCENE 06 — THE GIFT
    // ─────────────────────────────

    {
      id: "chapter2-open",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Коробка не запечатана.\n\nТы снимаешь крышку.",
      },
      nextScene: "chapter2-open-2",
    },

    // Здесь можно показать картинку настоящего подарка —
    // так же, как сделано с книгой в первой главе:
    // content: { type: "image", src: "/images/items/mi-01.webp", alt: "MI-01" }
    {
      id: "chapter2-open-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Внутри — детали.\n\nЛатунные пластины, шестерни, винты в отдельном пакетике.",
      },
      nextScene: "chapter2-open-3",
    },

    {
      id: "chapter2-open-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "На дне коробки ты видишь инструкцию.",
      },
      nextScene: "chapter2-open-4",
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
      id: "chapter2-open-6",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ты уже собираешься закрыть коробку.\n\n Но рядом, в пыли на столе, замечаешь маленький след.",
      },
      actions: [
        {
          id: "leave-now",
          label: "Забрать и уходить",
          nextScene: "chapter2-transition-back",
        },
        {
          id: "wait-here",
          label: "Подождать",
          nextScene: "chapter2-wait",
        },
      ],
    },

    // ── Ветка: подождать ──

    {
      id: "chapter2-wait",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ты садишься прямо на пол и ждёшь.\n\nМинуту. Две.",
      },
      nextScene: "chapter2-wait-2",
    },

    {
      id: "chapter2-wait-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Никто не приходит.\n\nПотом в углу коротко щёлкает монитор.\n\nТы оборачиваешься.",
      },
      nextScene: "chapter2-wait-3",
    },

    {
      id: "chapter2-wait-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: `> HE IS ALREADY OUTSIDE`,
      },

      actions: [
        {
          id: "leave",
          label: "Выйти на улицу",
          nextScene: "chapter2-transition-back",
        },
      ],
    },

    // ─────────────────────────────
    // SCENE 07 — RETURN
    // ─────────────────────────────

    {
      id: "chapter2-transition-back",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты выходишь обратно в переулок.\n\nСвет мастерской гаснет за спиной.",
      },
      nextScene: "chapter2-transition-back-2",
    },

    {
      id: "chapter2-transition-back-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Шум города становится всё тише.\n\nНеон исчезает.",
      },
      nextScene: "chapter2-transition-back-3",
    },

    {
      id: "chapter2-transition-back-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Асфальт снова сменяется землёй.\n\nВпереди снова лес.",
      },
      nextScene: "chapter2-transition-back-4",
    },

    {
      id: "chapter2-transition-back-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты делаешь несколько шагов вперёд.\n\nИ вдруг слышишь хруст ветки.\n\nСовсем рядом.",
      },
      actions: [
        {
          id: "go-on",
          label: "Идти дальше",
          nextScene: "final-start",
        },
      ],
    },
  ],
};
