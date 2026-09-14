import type { ChapterData } from "@/types/game";
import { images } from "@/data/images/chapter1";

export const secondChapter: ChapterData = {
  id: "chapter2",
  title: "NIGHT CITY",

  scenes: [
    // ─────────────────────────────
    // SCENE 01 — ARRIVAL
    // ─────────────────────────────

    {
      id: "chapter2-transition",
      background: images.forest,
      content: {
        type: "text",
        text: "Следы внезапно обрываются.",
      },
      nextScene: "chapter2-transition-2",
    },

    {
      id: "chapter2-transition-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы оглядываетесь.",
      },
      nextScene: "chapter2-transition-3",
    },

    {
      id: "chapter2-transition-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Лес вокруг вас кажется совершенно неподвижным.",
      },
      nextScene: "chapter2-transition-4",
    },

    {
      id: "chapter2-transition-4",
      background: images.forest,
      content: {
        type: "text",
        text: "И вдруг мир перед вами начинает дрожать.",
      },
      nextScene: "chapter2-transition-5",
    },

    {
      id: "chapter2-transition-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Свет вспыхивает прямо перед глазами.",
      },
      nextScene: "chapter2-transition-6",
    },

    {
      id: "chapter2-transition-6",
      background: images.forest,
      content: {
        type: "text",
        text: "На мгновение всё исчезает.",
      },
      nextScene: "chapter2-night-city",
    },

    // ─────────────────────────────
    // SCENE 02 — NIGHT CITY
    // ─────────────────────────────

    {
      id: "chapter2-night-city",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы открываете глаза.",
      },
      nextScene: "chapter2-night-city-2",
    },

    {
      id: "chapter2-night-city-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Перед вами — город.",
      },
      nextScene: "chapter2-night-city-3",
    },

    {
      id: "chapter2-night-city-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Неон отражается в мокром асфальте.",
      },
      nextScene: "chapter2-night-city-4",
    },

    {
      id: "chapter2-night-city-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Высотные здания уходят куда-то вверх.",
      },
      nextScene: "chapter2-night-city-5",
    },

    {
      id: "chapter2-night-city-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Рекламные вывески мигают сквозь дождь.",
      },
      nextScene: "chapter2-night-city-6",
    },

    {
      id: "chapter2-night-city-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то далеко слышен гул двигателей.",
      },
      nextScene: "chapter2-night-city-7",
    },

    {
      id: "chapter2-night-city-7",
      background: images.forest,
      content: {
        type: "text",
        text: "NIGHT CITY",
      },
      nextScene: "chapter2-night-city-8",
    },

    {
      id: "chapter2-night-city-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы пытаетесь понять, куда исчез тот странный след.",
      },
      nextScene: "chapter2-night-city-9",
    },

    {
      id: "chapter2-night-city-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Но среди тысяч людей, машин и огней его уже невозможно найти.",
      },
      nextScene: "chapter2-night-city-10",
    },

    {
      id: "chapter2-night-city-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы уже собираетесь идти дальше.",
      },
      nextScene: "chapter2-night-city-11",
    },

    {
      id: "chapter2-night-city-11",
      background: images.forest,
      content: {
        type: "text",
        text: "Но замечаете странный зелёный свет.",
      },
      nextScene: "chapter2-night-city-12",
    },

    {
      id: "chapter2-night-city-12",
      background: images.forest,
      content: {
        type: "text",
        text: "Он мерцает в глубине переулка.",
      },
      nextScene: "chapter2-night-city-13",
    },

    {
      id: "chapter2-night-city-13",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы подходите ближе.",
      },
      nextScene: "chapter2-night-city-14",
    },

    {
      id: "chapter2-night-city-14",
      background: images.forest,
      content: {
        type: "text",
        text: "Свет идёт от небольшой панели в стене.",
      },
      nextScene: "chapter2-night-city-15",
    },

    {
      id: "chapter2-night-city-15",
      background: images.forest,
      content: {
        type: "text",
        text: "На ней едва различима надпись:",
      },
      nextScene: "chapter2-night-city-16",
    },

    {
      id: "chapter2-night-city-16",
      background: images.forest,
      content: {
        type: "text",
        text: "PRIVATE WORKSHOP",
      },
      nextScene: "chapter2-terminal",
    },

    // ─────────────────────────────
    // SCENE 03 — TERMINAL
    // ─────────────────────────────

    {
      id: "chapter2-terminal",
      background: images.forest,
      content: {
        type: "text",
        text: "Под панелью находится старый терминал.",
      },
      nextScene: "chapter2-terminal-2",
    },

    {
      id: "chapter2-terminal-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Экран всё ещё работает.",
      },
      nextScene: "chapter2-terminal-3",
    },

    {
      id: "chapter2-terminal-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы касаетесь экрана.",
      },
      nextScene: "chapter2-terminal-4",
    },

    {
      id: "chapter2-terminal-4",
      background: images.forest,
      content: {
        type: "text",
        text: `> WORKSHOP CONTROL SYSTEM

> ACCESS DENIED`,
      },
      nextScene: "chapter2-terminal-5",
    },

    {
      id: "chapter2-terminal-5",
      background: images.forest,
      content: {
        type: "text",
        text: `> AUTHORIZATION REQUIRED`,
      },
      nextScene: "chapter2-terminal-6",
    },

    {
      id: "chapter2-terminal-6",
      background: images.forest,
      content: {
        type: "text",
        text: "На экране появляется исходный код.",
      },
      nextScene: "chapter2-terminal-7",
    },

    {
      id: "chapter2-terminal-7",
      background: images.forest,
      content: {
        type: "text",
        text: "Кто-то оставил здесь незаконченный фрагмент программы.",
      },
      nextScene: "chapter2-code",
    },

    // ─────────────────────────────
    // SCENE 04 — CODE
    // ─────────────────────────────

    {
      id: "chapter2-code",
      background: images.forest,
      content: {
        type: "text",
        text: `int access = 0;
int system = 1;

if (system == 1)
{
    // your code
}

if (access == 1)
{
    unlock();
}`,
      },
      nextScene: "chapter2-code-2",
    },

    {
      id: "chapter2-code-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы внимательно изучаете код.",
      },
      nextScene: "chapter2-code-3",
    },

    {
      id: "chapter2-code-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Программа проверяет состояние переменной access.",
      },
      nextScene: "chapter2-code-4",
    },

    {
      id: "chapter2-code-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Если access равен единице, система открывает доступ.",
      },
      nextScene: "chapter2-code-5",
    },

    {
      id: "chapter2-code-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Осталось понять, где изменить её значение.",
      },
      nextScene: "chapter2-code-puzzle",
    },

    {
      id: "chapter2-code-puzzle",
      background: images.forest,
      content: {
        type: "text",
        text: `> CODE EDITOR

> ACCESS VARIABLE: access

Измените код, чтобы открыть доступ.`,
      },
      puzzle: {
        id: "chapter2-cpp",
        type: "cyberpunk",
        nextScene: "chapter2-code-solved",
      },
    },

    // ─────────────────────────────
    // SCENE 05 — ACCESS GRANTED
    // ─────────────────────────────

    {
      id: "chapter2-code-solved",
      background: images.forest,
      content: {
        type: "text",
        text: `> CODE ACCEPTED`,
      },
      nextScene: "chapter2-code-solved-2",
    },

    {
      id: "chapter2-code-solved-2",
      background: images.forest,
      content: {
        type: "text",
        text: `> ACCESS GRANTED`,
      },
      nextScene: "chapter2-code-solved-3",
    },

    {
      id: "chapter2-code-solved-3",
      background: images.forest,
      content: {
        type: "text",
        text: `> WORKSHOP SYSTEM ONLINE`,
      },
      nextScene: "chapter2-workshop",
    },

    // ─────────────────────────────
    // SCENE 06 — WORKSHOP
    // ─────────────────────────────

    {
      id: "chapter2-workshop",
      background: images.forest,
      content: {
        type: "text",
        text: "Где-то за стеной раздаётся механический звук.",
      },
      nextScene: "chapter2-workshop-2",
    },

    {
      id: "chapter2-workshop-2",
      background: images.forest,
      content: {
        type: "text",
        text: "Щёлк.",
      },
      nextScene: "chapter2-workshop-3",
    },

    {
      id: "chapter2-workshop-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Пауза.",
      },
      nextScene: "chapter2-workshop-4",
    },

    {
      id: "chapter2-workshop-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Щёлк.",
      },
      nextScene: "chapter2-workshop-5",
    },

    {
      id: "chapter2-workshop-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Затем включается свет.",
      },
      nextScene: "chapter2-workshop-6",
    },

    {
      id: "chapter2-workshop-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Перед вами открывается небольшая мастерская.",
      },
      nextScene: "chapter2-workshop-7",
    },

    {
      id: "chapter2-workshop-7",
      background: images.forest,
      content: {
        type: "text",
        text: "На столах лежат инструменты, детали и разобранные механизмы.",
      },
      nextScene: "chapter2-workshop-8",
    },

    {
      id: "chapter2-workshop-8",
      background: images.forest,
      content: {
        type: "text",
        text: "Похоже, здесь давно никто не работал.",
      },
      nextScene: "chapter2-workshop-9",
    },

    {
      id: "chapter2-workshop-9",
      background: images.forest,
      content: {
        type: "text",
        text: "Но один предмет лежит отдельно.",
      },
      nextScene: "chapter2-workshop-10",
    },

    {
      id: "chapter2-workshop-10",
      background: images.forest,
      content: {
        type: "text",
        text: "Будто его оставили специально для вас.",
      },
      nextScene: "chapter2-workshop-11",
    },

    // ─────────────────────────────
    // SCENE 07 — THE GIFT
    // ─────────────────────────────

    {
      id: "chapter2-workshop-11",
      background: images.forest,
      content: {
        type: "text",
        text: "На столе стоит небольшая коробка.",
      },
      nextScene: "chapter2-workshop-12",
    },

    {
      id: "chapter2-workshop-12",
      background: images.forest,
      content: {
        type: "text",
        text: "На ней всего одна надпись.",
      },
      nextScene: "chapter2-workshop-13",
    },

    {
      id: "chapter2-workshop-13",
      background: images.forest,
      content: {
        type: "text",
        text: "MI-01",
      },
      nextScene: "chapter2-workshop-14",
    },
    {
      id: "chapter2-workshop-16",
      background: images.forest,
      content: {
        type: "text",
        text: "Похоже, кто-то действительно оставил его здесь для вас.",
      },
      nextScene: "chapter2-workshop-17",
    },

    {
      id: "chapter2-workshop-17",
      background: images.forest,
      content: {
        type: "text",
        text: `На экране терминала появляется сообщение:

> OBJECT ACQUIRED`,
      },
      nextScene: "chapter2-workshop-18",
    },

    {
      id: "chapter2-workshop-18",
      background: images.forest,
      content: {
        type: "text",
        text: `> WELL DONE`,
      },
      nextScene: "chapter2-transition-back",
    },

    // ─────────────────────────────
    // SCENE 08 — RETURN
    // ─────────────────────────────

    {
      id: "chapter2-transition-back",
      background: images.forest,
      content: {
        type: "text",
        text: "Свет мастерской гаснет.",
      },
      nextScene: "chapter2-transition-back-2",
    },

    {
      id: "chapter2-transition-back-2",
      background: images.forest,
      content: {
        type: "text",
        text: "За спиной остаётся шум города.",
      },
      nextScene: "chapter2-transition-back-3",
    },

    {
      id: "chapter2-transition-back-3",
      background: images.forest,
      content: {
        type: "text",
        text: "Неон исчезает.",
      },
      nextScene: "chapter2-transition-back-4",
    },

    {
      id: "chapter2-transition-back-4",
      background: images.forest,
      content: {
        type: "text",
        text: "Асфальт снова сменяется землёй.",
      },
      nextScene: "chapter2-transition-back-5",
    },

    {
      id: "chapter2-transition-back-5",
      background: images.forest,
      content: {
        type: "text",
        text: "Впереди снова лес.",
      },
      nextScene: "chapter2-transition-back-6",
    },

    {
      id: "chapter2-transition-back-6",
      background: images.forest,
      content: {
        type: "text",
        text: "Вы делаете несколько шагов вперёд.",
      },
      nextScene: "chapter2-transition-back-7",
    },

    {
      id: "chapter2-transition-back-7",
      background: images.forest,
      content: {
        type: "text",
        text: "И вдруг слышите хруст ветки.",
      },
      nextScene: "chapter2-complete",
    },

    // ─────────────────────────────
    // CHAPTER II COMPLETE
    // ─────────────────────────────

    {
      id: "chapter2-complete",
      background: images.forest,
      content: {
        type: "text",
        text: "Совсем рядом.",
      },
      nextScene: "final-start",
    },
  ],
};
