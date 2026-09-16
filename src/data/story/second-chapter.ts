import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";

export const secondChapter: ChapterData = {
  id: "chapter2",
  title: "NIGHT CITY",

  scenes: [
    // ─────────────────────────────
    // SCENE 01 — TRANSITION
    // ─────────────────────────────

    {
      id: "chapter2-transition",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты идёшь по следам.\n\nОни уводят всё дальше от тропы — а потом внезапно обрываются.",
      },
      nextScene: "chapter2-transition-2",
    },

    {
      id: "chapter2-transition-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты оглядываешься.\n\nЛес вокруг кажется совершенно неподвижным.",
      },
      nextScene: "chapter2-transition-3",
    },

    {
      id: "chapter2-transition-3",
      background: images.forest,
      content: {
        type: "text",
        text: "И вдруг мир перед тобой начинает дрожать.\n\nСвет вспыхивает прямо перед глазами.",
      },
      nextScene: "chapter2-night-city",
    },

    // ─────────────────────────────
    // SCENE 02 — NIGHT CITY
    // ─────────────────────────────

    {
      id: "chapter2-night-city",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ты открываешь глаза.\n\nПеред тобой — город.",
      },
      nextScene: "chapter2-night-city-2",
    },

    {
      id: "chapter2-night-city-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Неон отражается в мокром асфальте.\n\nВысотные здания уходят куда-то вверх.",
      },
      nextScene: "chapter2-night-city-3",
    },

    {
      id: "chapter2-night-city-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Рекламные вывески мигают сквозь дождь.\n\nГде-то далеко гудят двигатели.",
      },
      nextScene: "chapter2-night-city-4",
    },

    {
      id: "chapter2-night-city-4",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "NIGHT CITY",
      },
      nextScene: "chapter2-night-city-5",
    },

    {
      id: "chapter2-night-city-5",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ты пытаешься понять, куда исчез след.\n\nНо среди тысяч людей, машин и огней его уже не найти.",
      },
      nextScene: "chapter2-night-city-6",
    },

    {
      id: "chapter2-night-city-6",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "И тут ты замечаешь странный зелёный свет.\n\nОн мерцает в глубине переулка.",
      },
      actions: [
        {
          id: "approach-light",
          label: "Подойти к свету",
          nextScene: "chapter2-night-city-8",
        },
        {
          id: "look-around",
          label: "Сначала осмотреться",
          nextScene: "chapter2-night-city-7",
        },
      ],
    },

    {
      id: "chapter2-night-city-7",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Дождь, реклама, чужие лица.\n\nИ ни одного следа на мокром асфальте — кроме твоих собственных.",
      },
      actions: [
        {
          id: "approach-light-after",
          label: "Подойти к свету",
          nextScene: "chapter2-night-city-8",
        },
      ],
    },

    {
      id: "chapter2-night-city-8",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ты подходишь ближе.\n\nСвет идёт от небольшой панели в стене.",
      },
      nextScene: "chapter2-night-city-9",
    },

    {
      id: "chapter2-night-city-9",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "На ней едва различима надпись:\n\nPRIVATE WORKSHOP",
      },
      nextScene: "chapter2-terminal",
    },

    // ─────────────────────────────
    // SCENE 03 — TERMINAL
    // ─────────────────────────────

    {
      id: "chapter2-terminal",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Под панелью — старый терминал.\n\nЭкран всё ещё работает.",
      },
      actions: [
        {
          id: "touch-screen",
          label: "Коснуться экрана",
          nextScene: "chapter2-terminal-2",
        },
      ],
    },
    {
      id: "chapter2-terminal-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Экран вспыхивает зелёным светом.\n\nНесколько секунд — только помехи.\n\nЗатем появляется сообщение: «PRIVATE WORKSHOP // ACCESS DENIED».",
      },
      actions: [
        {
          id: "inspect-terminal",
          label: "Осмотреть терминал",
          nextScene: "chapter2-terminal-3",
        },
      ],
    },
    {
      id: "chapter2-terminal-3",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Ниже появляется ещё одна строка: «RECOVERY PROTOCOL AVAILABLE».\n\nПохоже, система повреждена.\n\nЕсли удастся восстановить её, возможно, откроется вход в мастерскую.",
      },
      actions: [
        {
          id: "start-recovery",
          label: "Запустить восстановление",
          nextScene: "chapter2-system-repair",
        },
      ],
    },
    {
      id: "chapter2-system-repair",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Экран меняется.\n\nВместо привычного интерфейса появляются строки кода.\n\nRECOVERY MODE",
      },
      puzzle: {
        id: "workshop-system-repair",
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
      nextScene: "chapter2-workshop-2",
    },

    {
      id: "chapter2-workshop-2",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Затем включается свет.\n\nПеред тобой открывается небольшая мастерская.",
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
        text: "Тот же почерк, что и на чертежах.",
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

    {
      id: "chapter2-open-4",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "РЕЛИКВИЯ II — ПОЛУЧЕНА\n\nMI-01 — CYBERPUNK BEETLE",
      },
      nextScene: "chapter2-open-5",
    },

    {
      id: "chapter2-open-5",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "Тип: Механизм. В разобранном виде.\n\nРедкость: ★★★★★",
      },
      nextScene: "chapter2-open-6",
    },

    {
      id: "chapter2-open-6",
      background: images.cyberpunk,
      content: {
        type: "text",
        text: "А рядом с коробкой, в пыли на столе, — маленький след.\n\nПять пальцев.",
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
