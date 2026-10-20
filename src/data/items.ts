import type { ItemDefinition } from "@/types/game";

export const ITEMS: Record<string, ItemDefinition> = {
  "ancient-book": {
    id: "ancient-book",
    name: "Древняя книга",
    description:
      "Книга, связывающая воображение с реальностью. Её истинная природа пока неизвестна.",
    type: "story",
  },

  "brown-yarn": {
    id: "brown-yarn",
    name: "Коричневая нить",
    description:
      "Тонкая нить, которая словно ведёт куда-то. Её значение раскроется позже.",
    type: "story",
    situationalBonuses: {
      chase: 2,
      navigation: 2,
    },
  },

  "mechanical-beetle": {
    id: "mechanical-beetle",
    name: "Механический жук MI-01",
    description:
      "Набор деталей для сборки механического жука. В коробке лежит инструкция.",
    type: "story",
    situationalBonuses: {
      repair: 2,
      assembly: 2,
    },
  },
};
