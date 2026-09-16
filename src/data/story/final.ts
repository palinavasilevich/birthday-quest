import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";

export const finalChapter: ChapterData = {
  id: "final",
  title: "THE LAST STAND",

  scenes: [
    // ─────────────────────────────
    // SCENE 01 — RETURN
    // ─────────────────────────────

    {
      id: "final-start",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты снова в лесу.\n\nНо лес изменился.",
      },
      nextScene: "final-start-2",
    },

    {
      id: "final-start-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Воздух наполнен дымом.\n\nНа земле лежит пепел.",
      },
      nextScene: "final-start-3",
    },

    {
      id: "final-start-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то впереди раздаётся грохот.\n\nЗатем ещё один.",
      },
      nextScene: "final-start-4",
    },

    {
      id: "final-start-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты слышишь рёв.\n\nЭто не зверь.",
      },
      nextScene: "final-start-5",
    },

    {
      id: "final-start-5",
      background: images.forest,
      content: {
        type: "text",
        text: "ЭТО ДРАКОН?!!",
      },
      nextScene: "final-battlefield",
    },

    // ─────────────────────────────
    // SCENE 02 — BATTLEFIELD
    // ─────────────────────────────

    {
      id: "final-battlefield",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты идёшь на звук.\n\nДеревья редеют. Впереди открывается поле боя.",
      },
      nextScene: "final-battlefield-2",
    },

    {
      id: "final-battlefield-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Земля изрыта следами огня.\n\nПовсюду лежат обломки.",
      },
      nextScene: "final-battlefield-3",
    },

    {
      id: "final-battlefield-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Над поляной кружит огромная тень.\n\nОн замечает тебя. Раздаётся рёв.",
      },
      nextScene: "final-battlefield-4",
    },

    {
      id: "final-battlefield-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Но ты замечаешь ещё кое-что.\n\nВ стороне, среди обломков, что-то движется.",
      },
      nextScene: "final-battlefield-5",
    },

    {
      id: "final-battlefield-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Маленькая фигура.\n\nТы узнаёшь её.",
      },
      nextScene: "final-battlefield-6",
    },

    {
      id: "final-battlefield-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч.\n\nВот кто вёл тебя всё это время.",
      },
      nextScene: "final-battle",
    },

    // ─────────────────────────────
    // SCENE 03 — MI-01
    // ─────────────────────────────

    {
      id: "final-battle",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон обрушивает огонь на обломки.\n\nМежду вами встаёт стена дыма.",
      },
      nextScene: "final-battle-2",
    },

    {
      id: "final-battle-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Секунду назад ты видел, где он. Теперь — нет.\n\nНужен ориентир.",
      },
      nextScene: "final-battle-3",
    },

    {
      id: "final-battle-3",
      background: images.forest,
      content: {
        type: "text",
        text: "И ты вспоминаешь строку из книги:",
      },
      nextScene: "final-battle-4",
    },

    {
      id: "final-battle-4",
      background: images.forest,
      content: {
        type: "text",
        text: "«Каждое великое приключение начинается с мира, который существует лишь в чьём-то воображении.»",
      },
      nextScene: "final-battle-5",
    },

    {
      id: "final-battle-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Всё, что нужно, у тебя уже есть.",
      },
      nextScene: "final-battle-6",
    },

    {
      id: "final-battle-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Коробка.\n\nТы достаёшь её и высыпаешь детали прямо на колени.",
      },
      nextScene: "final-battle-7",
    },

    {
      id: "final-battle-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Латунные пластины. Шестерни. Винты.\n\nИнструкция на дне — будто кто-то знал, что собирать придётся в спешке.",
      },
      nextScene: "final-battle-8",
    },

    {
      id: "final-battle-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты собираешь его здесь же, на коленях, под грохот.",
      },
      nextScene: "final-battle-9",
    },

    {
      id: "final-battle-9",
      background: images.forest,
      content: {
        type: "text",
        text: "MI-01 стоит у тебя на ладони.\n\nНадкрылья раскрываются. Он оживает.",
      },
      nextScene: "final-battle-10",
    },

    {
      id: "final-battle-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты подбрасываешь его — и он улетает в дым.\n\nОгню до металла нет дела.",
      },
      nextScene: "final-battle-11",
    },

    {
      id: "final-battle-11",
      background: images.forest,
      content: {
        type: "text",
        text: "Несколько секунд — ничего.",
      },
      nextScene: "final-battle-12",
    },

    {
      id: "final-battle-12",
      background: images.forest,
      content: {
        type: "text",
        text: "Потом далеко впереди, сквозь дым, загорается ровный огонёк.",
      },
      nextScene: "final-battle-13",
    },

    {
      id: "final-battle-13",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч там.",
      },
      nextScene: "final-battle-14",
    },

    {
      id: "final-battle-14",
      background: images.forest,
      content: {
        type: "text",
        text: "Только помни: сначала нужно добраться до Медвесыча.\n\nА затем остановить дракона.",
      },
      nextScene: "final-puzzle",
    },

    // ─────────────────────────────
    // SCENE 04 — THE LAST STAND
    // ─────────────────────────────

    {
      id: "final-puzzle",
      background: images.forest,
      content: {
        type: "text",
        text: "",
      },
      puzzle: {
        id: "final-battle-puzzle",
        type: "final",
        nextScene: "final-victory",
      },
    },

    // ─────────────────────────────
    // SCENE 05 — VICTORY
    // ─────────────────────────────

    {
      id: "final-victory",
      background: images.forest,
      content: {
        type: "text",
        text: "Дракон падает.\n\nНаступает тишина.",
      },
      nextScene: "final-victory-2",
    },

    {
      id: "final-victory-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Пепел медленно оседает на землю.",
      },
      nextScene: "final-victory-3",
    },

    {
      id: "final-victory-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч рядом.\n\nОн не отходит ни на шаг с той секунды, как ты до него добрался.",
      },
      nextScene: "final-victory-4",
    },

    {
      id: "final-victory-4",
      background: images.forest,
      content: {
        type: "text",
        text: "MI-01 возвращается сам.\n\nСадится тебе на плечо и складывает надкрылья.",
      },
      nextScene: "final-companion",
    },

    // ─────────────────────────────
    // SCENE 06 — COMPANION
    // ─────────────────────────────

    {
      id: "final-companion",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты протягиваешь руку.",
      },
      nextScene: "final-companion-2",
    },

    {
      id: "final-companion-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч делает шаг. Ещё один.\n\nИ садится рядом.",
      },
      nextScene: "final-companion-3",
    },

    {
      id: "final-companion-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то вдали звучит та мелодия, что ты слышал у каменной стены.",
      },
      nextScene: "final-companion-4",
    },

    {
      id: "final-companion-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч поднимает голову.\n\nОн узнаёт её раньше, чем ты.",
      },
      nextScene: "final-companion-acquired",
    },

    {
      id: "final-companion-acquired",
      background: images.forest,
      content: {
        type: "text",
        text: "COMPANION ACQUIRED",
      },
      nextScene: "final-companion-card",
    },

    {
      id: "final-companion-card",
      background: images.forest,
      content: {
        type: "text",
        text: `━━━━━━━━━━━━━━━━━━━━

COMPANION

МЕДВЕСЫЧ

Origin:
Baldur's Gate

Material:
Handmade

Ability:
Never leaves the party

Status:
PARTY MEMBER

━━━━━━━━━━━━━━━━━━━━`,
      },
      nextScene: "final-reveal",
    },

    // ─────────────────────────────
    // SCENE 07 — FINAL REVEAL
    // ─────────────────────────────

    {
      id: "final-reveal",
      background: images.forest,
      content: {
        type: "text",
        text: "Поле боя стихло.\n\nТёмные облака начинают расходиться.",
      },
      nextScene: "final-reveal-2",
    },

    {
      id: "final-reveal-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты вспоминаешь всё, что нашёл по дороге.",
      },
      nextScene: "final-reveal-3",
    },

    {
      id: "final-reveal-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Книгу на пьедестале.\n\nКоробку с жуком в мастерской.",
      },
      nextScene: "final-reveal-4",
    },

    {
      id: "final-reveal-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Десятки чертежей, почти все перечёркнуты.\n\nСхему вязания — тем же карандашом.",
      },
      nextScene: "final-reveal-5",
    },

    {
      id: "final-reveal-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Ничего из этого не лежало там случайно.",
      },
      nextScene: "final-reveal-6",
    },

    {
      id: "final-reveal-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Каждая вещь ждала ровно там, куда ты дойдёшь.\n\nКто-то оставил их для тебя.",
      },
      nextScene: "final-thread",
    },

    // ─────────────────────────────
    // SCENE 08 — THE THREAD
    // ─────────────────────────────

    {
      id: "final-thread",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч возится с чем-то рядом.",
      },
      nextScene: "final-thread-2",
    },

    {
      id: "final-thread-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты видишь клубок ниток.\n\nТёплый рыжеватый цвет. Тот же, что и его шерсть.",
      },
      nextScene: "final-thread-3",
    },

    {
      id: "final-thread-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Ты вынимаешь свою нитку — ту самую, из тёмной комнаты в лесу.",
      },
      nextScene: "final-thread-4",
    },

    {
      id: "final-thread-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Прикладываешь.\n\nТа же пряжа. Тот же клубок, что лежал на столе в мастерской.",
      },
      nextScene: "final-thread-5",
    },

    {
      id: "final-thread-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Медвесыч опускает клубок на землю.",
      },
      nextScene: "final-thread-6",
    },

    {
      id: "final-thread-6",
      background: images.forest,
      content: {
        type: "text",
        text: "И толкает его лапой.",
      },
      nextScene: "final-thread-7",
    },

    {
      id: "final-thread-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Клубок катится.\n\nМимо обломков. \n\nЗа деревья. Снова в лес",
      },

      actions: [
        {
          id: "go-after",
          label: "Пойти следом",
          nextScene: "final-thread-8",
        },
      ],
    },

    {
      id: "final-thread-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Клубок скрывается за деревьями.\n\nА нитка остаётся.",
      },
      nextScene: "final-thread-10",
    },

    {
      id: "final-thread-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Один её конец здесь, на выжженной земле.\n\nВторой — уже не в этой игре.",
      },
      nextScene: "final-thread-11",
    },

    {
      id: "final-thread-11",
      background: images.forest,
      content: {
        type: "text",
        text: "Подними глаза.\n\nОн где-то совсем рядом с тобой.",
      },
      nextScene: "final-thread-12",
    },

    {
      id: "final-thread-12",
      background: images.forest,
      content: {
        type: "text",
        text: "Книга. Жук. Медвесыч. \n\nВсё сделала одна пара рук — и ты их очень хорошо знаешь.",
      },
    },

    // ─────────────────────────────
    // SCENE 09 — THE END
    // ─────────────────────────────

    {
      id: "final-the-end",
      background: images.forest,
      content: {
        type: "text",
        text: "THE END",
      },
      nextScene: "final-birthday",
    },
  ],
};
