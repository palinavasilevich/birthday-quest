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
      // background: images.city,
      content: {
        type: "text",
        text: "",
      },
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1500,
      nextScene: "chapter2-night-city",
    },
    {
      id: "chapter2-night-city",
      background: images.city,
      content: {
        type: "text",
        text: "Ты открываешь глаза.\n\nПеред тобой — город.",
      },
      specialEffects: ["warp-in"],
      effectDelay: 1000,
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-night-city-2",
    },
    {
      id: "chapter2-night-city-2",
      background: images.city,
      content: {
        type: "text",
        text: "Неон отражается в мокром асфальте.\n\nВысотные здания уходят куда-то вверх.",
      },
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-night-city-3",
    },
    {
      id: "chapter2-night-city-3",
      background: images.city,
      content: {
        type: "text",
        text: "Рекламные вывески мигают сквозь дождь.\n\nГде-то далеко гудят двигатели.",
      },
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-night-city-4",
    },
    {
      id: "chapter2-night-city-4",
      background: images.nightCity,
      content: {
        type: "text",
        text: "",
      },
      audio: audio.music.cyberpunk,
      showBackgroundOnly: true,
      autoTransitionToNextScene: true,
      autoTransitionDelay: 1700,
      nextScene: "chapter2-night-city-5",
    },
    {
      id: "chapter2-night-city-5",
      background: images.nightCity,
      content: {
        type: "text",
        text: "Ты пытаешься понять, где тот, кто привёл тебя сюда.\n\nНо среди тысяч людей, машин и огней его уже не найти.",
      },
      actions: [
        {
          id: "look-around",
          label: "Оглядеться",
          nextScene: "chapter2-night-city-6",
        },
      ],
      audio: audio.music.cyberpunk,
    },
    {
      id: "chapter2-night-city-6",
      background: images.street,
      content: {
        type: "text",
        text: "Дождь, неон, чужие лица.\n\nМокрый асфальт покрыт десятками следов.\n\nНо знакомого среди них нет.",
      },
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-shadow-check",
    },
    {
      id: "chapter2-shadow-check",
      background: images.street,
      content: {
        type: "diceCheck",
        title: "Восприятие",
        description:
          "Вдруг ты замечаешь движение в толпе. Чья-то тень быстро исчезает в узком переулке.",
        skill: "Восприятие",
        difficulty: 12,
        tag: "navigation",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Ты слишком поздно замечаешь движение. Когда добираешься до переулка, тень уже исчезла.",
            nextScene: "chapter2-night-city-8",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Ты успеваешь заметить лишь силуэт, мелькнувший между людьми. Кто это был, остаётся загадкой, но тень свернула в узкий переулок, и других зацепок у тебя нет.",
            nextScene: "chapter2-night-city-8",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "Перед тем как скрыться в переулке, тень на мгновение оглядывается. Кажется, незнакомец проверяет, следуешь ли ты за ним.",
            nextScene: "chapter2-night-city-8",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Ты замечаешь, что тень не просто движется сквозь толпу. Она заранее выбирает путь, избегая освещённых участков и людных мест. Будто незнакомец точно знает, куда направляется, и рассчитывает, что ты пойдёшь следом.",
            nextScene: "chapter2-night-city-8",
          },
        ],
      },
      audio: audio.music.cyberpunk,
    },
    {
      id: "chapter2-night-city-8",
      background: images.greenLightStreet,
      content: {
        type: "text",
        text: "Ты заходишь в переулок.\n\nВ глубине мерцает странный зелёный свет.",
      },
      audio: audio.music.cyberpunk,
      actions: [
        {
          id: "approach-light",
          label: "Подойти к свету",
          nextScene: "chapter2-night-city-9",
        },
      ],
    },
    {
      id: "chapter2-night-city-9",
      background: images.signboard,
      content: {
        type: "text",
        text: "Ты подходишь ближе.\n\nСвет идёт от небольшой панели в стене.",
      },
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-night-city-10",
    },
    {
      id: "chapter2-night-city-10",
      background: images.signboard,
      content: {
        type: "text",
        text: "На ней ты видишь надпись:\n\nPRIVATE WORKSHOP.",
      },
      audio: audio.music.cyberpunk,
      actions: [
        {
          id: "touch-screen",
          label: "Осмотреть панель",
          nextScene: "chapter2-night-city-11",
        },
      ],
    },
    {
      id: "chapter2-night-city-11",
      background: images.terminal,
      content: {
        type: "text",
        text: "Ты касаешься панели.\n\nВнутри стены что-то щёлкает.\n\nСтарый терминал оживает, и экран вспыхивает зелёным светом.\n\nНесколько секунд — только помехи. А затем...",
      },
      audio: audio.music.cyberpunk,
      specialEffects: ["static"],
      effectDelay: 1500,

      autoTransitionToNextScene: true,
      autoTransitionDelay: 1200,
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
      audio: audio.music.cyberpunk,
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
            text: "> UNSIGNED ............... FAILED",
            type: "error",
          },
          {
            text: "> FLOAT .................. FAILED",
            type: "error",
          },
          {
            text: "> POLYMORPH .............. FAILED",
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
      audio: audio.music.cyberpunk,
      nextScene: "chapter2-code-puzzle",
    },
    {
      id: "chapter2-code-puzzle",
      content: {
        type: "text",
        text: "",
      },
      audio: audio.music.cyberpunk,
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
      audio: audio.music.workshop,
      sfx: audio.sfx.doorOpening,
      nextScene: "chapter2-workshop-2",
    },
    {
      id: "chapter2-workshop-2",
      background: images.workshopDoor,
      content: {
        type: "text",
        text: "Затем включается свет.\n\nПеред тобой открывается дверь в небольшую мастерскую.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-workshop-3",
    },
    {
      id: "chapter2-workshop-3",
      background: images.workshopDesk,
      content: {
        type: "text",
        text: "Инструменты, детали, разобранные механизмы.\n\nВсё покрыто пылью.\n\nПохоже, здесь давно никто не работал.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-workshop-4",
    },
    {
      id: "chapter2-workshop-4",
      background: images.workshopDesk,
      content: {
        type: "text",
        text: "Перед тобой длинный рабочий стол.\n\nА в углу до сих пор горит одинокий монитор.",
      },
      audio: audio.music.workshop,
      actions: [
        {
          id: "check-table",
          label: "Осмотреть стол",
          nextScene: "chapter2-table",
        },
        {
          id: "check-log",
          label: "Посмотреть на экран",
          nextScene: "chapter2-log",
        },
      ],
    },

    // ── Ветка: экран ──
    // Тот, кто пойдёт к столу сразу, лога не увидит.
    {
      id: "chapter2-log",
      // background: images.workshopScreen,
      content: {
        type: "text",
        text: "На экране открыт лог.\n\nОн всё ещё пишется.",
      },
      specialComponent: "workshop-log",
      autoTransitionToNextScene: true,
      autoTransitionDelay: 8700,
      audio: audio.music.workshop,
      nextScene: "chapter2-log-2",
    },
    {
      id: "chapter2-log-2",
      background: images.workshopScreen,
      content: {
        type: "text",
        text: "За тобой следят с самой первой минуты.\n\nИ всё это время тебя вели именно сюда.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-table",
    },

    // ── Стол ──
    {
      id: "chapter2-table",
      background: images.drawing,
      content: {
        type: "text",
        text: "Стол завален чертежами и заметками.\n\nСреди них снова и снова встречается один и тот же силуэт.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-table-2",
    },
    {
      id: "chapter2-table-2",
      background: images.drawing,
      content: {
        type: "text",
        text: "Небольшое механическое существо.\n\nДве широкие пластины на спине, прозрачные крылья и шесть тонких лап.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-table-3",
    },
    {
      id: "chapter2-table-3",
      background: images.drawing,
      content: {
        type: "text",
        text: "Ты рассматриваешь устройство его корпуса.\n\nШестерни, шарниры и десятки крошечных деталей соединены в сложный механизм.",
      },
      audio: audio.music.workshop,
      nextScene: "chapter2-table-4",
    },

    {
      id: "chapter2-table-4",
      background: images.knittingPatternYarn,
      content: {
        type: "text",
        text: "Под стопкой чертежей ты находишь ещё одну схему.\n\nЭто не чертёж механизма. Здесь нет шестерён, только простые линии: маленькая фигура с круглыми ушами и короткими лапами.",
      },
      audio: audio.music.table,
      nextScene: "chapter2-table-5",
    },
    {
      id: "chapter2-table-5",
      background: images.knittingPatternYarn,
      content: {
        type: "text",
        text: "Рядом со схемой лежит клубок ниток.\n\nТёплого коричневого цвета.",
      },
      audio: audio.music.table,
      nextScene: "chapter2-pattern-check",
    },
    // {
    //   id: "chapter2-pattern-check",
    //   background: images.knittingPatternYarn,
    //   content: {
    //     type: "diceCheck",
    //     title: "Анализ",
    //     description:
    //       "Ты всматриваешься в схему и в клубок рядом с ней. Что-то в них кажется тебе знакомым.",
    //     skill: "Анализ",
    //     difficulty: 12,
    //     achievement: "medkit",
    //     outcomes: [
    //       {
    //         min: 1,
    //         max: 1,
    //         title: "Критический провал",
    //         text: "Ты долго всматриваешься в рисунок, пытаясь найти скрытый смысл. Но чем дольше смотришь, тем меньше понимаешь. В конце концов ты решаешь, что это всего лишь схема для вязания и клубок.",
    //         nextScene: "chapter2-table-7",
    //       },
    //       {
    //         min: 2,
    //         max: 11,
    //         title: "Неудача",
    //         text: "Ты замечаешь, что линии образуют силуэт небольшого существа. Однако понять, почему кто-то оставил эту схему среди чертежей механизмов, не удаётся.",
    //         nextScene: "chapter2-table-7",
    //       },
    //       {
    //         min: 12,
    //         max: 19,
    //         title: "Успех",
    //         text: "Круглые уши и короткие лапы. Фигура напоминает маленькое существо, чьи следы ты видел в лесу.",
    //         nextScene: "chapter2-table-7",
    //       },
    //       {
    //         min: 20,
    //         max: 20,
    //         title: "Критический успех",
    //         text: "Теперь ты видишь сходство совершенно ясно: это тот, кто оставил следы в лесу и у пьедестала. А цвет клубка в точности совпадает с ниткой у тебя в кармане. Кто бы ни нарисовал эту схему, он хорошо знал, кого рисует.",
    //         nextScene: "chapter2-table-7",
    //       },
    //     ],
    //   },
    //   audio: audio.music.table,
    // },

    {
      id: "chapter2-pattern-check",
      background: images.knittingPatternYarn,
      content: {
        type: "diceCheck",
        title: "Анализ",
        description:
          "Ты всматриваешься в схему и в клубок рядом с ней. Что-то в них кажется тебе знакомым.",
        skill: "Анализ",
        difficulty: 12,
        achievement: "medkit",
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Ты пытаешься найти закономерность в линиях, сравниваешь отдельные элементы и снова возвращаешься к началу. Но рисунок не складывается в цельный образ. В конце концов ты решаешь, что перед тобой обычная схема для вязания, и откладываешь её.",
            nextScene: "chapter2-table-7",
          },
          {
            min: 2,
            max: 11,
            title: "Неудача",
            text: "Постепенно ты различаешь в узоре очертания небольшого существа: круглые уши, короткие лапы, компактное туловище. Но понять, почему схема для вязания оказалась среди чертежей механизмов, тебе не удаётся.",
            nextScene: "chapter2-table-7",
          },
          {
            min: 12,
            max: 19,
            title: "Успех",
            text: "Теперь очертания становятся яснее. Круглые уши, короткие лапы, небольшое туловище... Ты уже видел нечто похожее. В памяти всплывает образ существа, которое ты видел в коридоре.",
            nextScene: "chapter2-table-7",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Теперь сомнений почти не остаётся. На схеме изображено то самое существо, чьи следы ты видел в лесу и у пьедестала. Именно его ты мельком заметил в коридоре. Ты переводишь взгляд на клубок рядом — его цвет в точности совпадает с ниткой, которую ты подобрал раньше. Слишком много совпадений, чтобы считать их случайностью. Кто оставил эту схему в мастерской? И откуда ему известно об этом существе?",
            nextScene: "chapter2-table-7",
          },
        ],
      },
      audio: audio.music.table,
    },
    {
      id: "chapter2-table-7",
      background: images.box,
      content: {
        type: "text",
        text: "Ты продолжаешь осматривать стол и в самом углу замечаешь небольшую коробку.\n\nНа ней надпись:\n\nMI-01.",
      },
      audio: audio.music.table,
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
      background: images.contentOfBox,
      content: {
        type: "text",
        text: "Внутри — детали.\n\nЛатунные пластины, шестерни и винты.\n\nНа внутренней стороне крышки — инструкция по сборке.",
      },
      audio: audio.music.table,
      nextScene: "chapter2-open-2",
    },
    {
      id: "chapter2-open-2",
      background: images.workshopTracesTable,
      content: {
        type: "text",
        text: "Ты уже собираешься закрыть коробку, но замечаешь два крошечных отпечатка в пыли у самого края стола.",
      },
      // Был потерян при правках: оба пути дальше уносят коробку с собой.
      itemsToCollect: ["mechanical-beetle"],
      audio: audio.music.table,
      nextScene: "chapter2-open-3",
    },
    {
      id: "chapter2-open-3",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Ты наклоняешься и заглядываешь под стол. На полу виднеются ещё несколько отпечатков. Они уходят вглубь мастерской.",
      },
      audio: audio.music.table,
      nextScene: "chapter2-trace-check",
    },
    {
      id: "chapter2-trace-check",
      background: images.workshopTraces,
      content: {
        type: "diceCheck",
        title: "Восприятие",
        description:
          "Ты внимательно изучаешь следы на столе и полу. Возможно, они подскажут, куда направлялся тот, кто здесь был.",
        skill: "Восприятие",
        difficulty: 11,
        outcomes: [
          {
            min: 1,
            max: 1,
            title: "Критический провал",
            text: "Ты наклоняешься слишком низко, и твоё дыхание поднимает облачко пыли. Отпечатки становятся ещё менее различимыми. Куда они вели, теперь не узнать.",
            nextScene: "chapter2-open-3-fail",
          },
          {
            min: 2,
            max: 10,
            title: "Неудача",
            text: "Ты различаешь следы на столе и полу, но не можешь восстановить путь их обладателя. Похоже, кто-то забирался на стол и спускался обратно, однако понять, куда он ушёл потом, не получается.",
            nextScene: "chapter2-open-3-fail",
          },
          {
            min: 11,
            max: 19,
            title: "Успех",
            text: "Ты различаешь следы на столе и полу. Два следа у края столешницы словно оставлены передними лапами, а на полу видна цепочка отпечатков четырёх лап. Следы ведут в сторону монитора. Похоже, кто-то подходил к нему совсем недавно.",
            nextScene: "chapter2-open-3-hint",
          },
          {
            min: 20,
            max: 20,
            title: "Критический успех",
            text: "Ты внимательно изучаешь каждый оставленный след. Два следа у края стола показывают, что существо приподнялось на задних лапах и потянулось к столешнице. На полу отпечатки четырёх лап ведут прямо к монитору.",
            nextScene: "chapter2-open-3-hint",
          },
        ],
      },
      audio: audio.music.table,
    },

    {
      id: "chapter2-open-3-fail",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Ты ещё раз смотришь на следы, а затем переводишь взгляд на коробку в своих руках.\n\nТеперь ты знаешь, что в мастерской недавно кто-то побывал. Но куда он направился дальше, пока остаётся загадкой.",
      },
      audio: audio.music.table,
      actions: [
        {
          id: "leave-now",
          label: "Забрать коробку и уйти",
          nextScene: "chapter2-transition-back",
        },
        {
          id: "wait-here",
          label: "Подождать",
          nextScene: "chapter2-wait",
        },
      ],
    },
    {
      id: "chapter2-open-3-hint",
      background: images.workshopTraces,
      content: {
        type: "text",
        text: "Ты выпрямляешься и невольно смотришь на монитор в углу.\n\nЭкран всё ещё светится. Тот, кто подходил к нему, вскоре может вернуться.",
      },
      audio: audio.music.table,
      actions: [
        {
          id: "leave-now",
          label: "Забрать коробку и уйти",
          nextScene: "chapter2-transition-back",
        },
        {
          id: "wait-here",
          label: "Подождать",
          nextScene: "chapter2-wait-hint",
        },
      ],
    },

    // ── Ветка: подождать ──
    {
      id: "chapter2-wait",
      background: images.wait,
      content: {
        type: "text",
        text: "Ты садишься на пол и ждёшь.\n\nМинуту. Две.",
      },
      audio: audio.music.wait,
      nextScene: "chapter2-wait-2",
    },
    {
      id: "chapter2-wait-hint",
      background: images.wait,
      content: {
        type: "text",
        text: "Ты садишься на пол так, чтобы видеть монитор, и ждёшь.\n\nМинуту. Две.\n\nТы почти уверен, что скоро что-то произойдёт.",
      },
      audio: audio.music.wait,
      nextScene: "chapter2-wait-2",
    },
    {
      id: "chapter2-wait-2",
      background: images.wait,
      content: {
        type: "text",
        text: "Никто не приходит.\n\nВ тишине раздаётся короткий щелчок.\n\nНа экране монитора одна за другой появляются строки.",
      },
      audio: audio.music.wait,
      actions: [
        {
          id: "check-log",
          label: "Посмотреть на экран",
          nextScene: "chapter2-wait-3",
        },
      ],
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
      audio: audio.music.wait,
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
      audio: audio.music.wait,
      nextScene: "chapter2-transition-back-2",
    },
    {
      id: "chapter2-transition-back-2",
      background: images.workshopOutside,
      content: {
        type: "text",
        text: "Шум города становится всё тише.\n\nНеон исчезает.",
      },
      autoTransitionDelay: 1300,
      autoTransitionToNextScene: true,
      audio: audio.music.wait,
      nextScene: "chapter2-transition-back-3",
    },
    {
      id: "chapter2-transition-back-3",
      background: images.workshopOutside,
      content: {
        type: "text",
        text: "",
      },
      showBackgroundOnly: true,
      audio: audio.music.wait,
      specialEffects: ["warp"],
      effectDelay: 0,
      autoTransitionToNextScene: true,
      nextScene: "final-start",
    },
  ],
};
