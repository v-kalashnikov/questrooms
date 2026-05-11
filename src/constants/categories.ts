import { Category } from "@/types/Category";

export const categories: Category[] = [
  { type: "all", label: "allQuests", icon: "/icons/AllQuestsIcon.svg" },
  {
    type: "adventures",
    label: "adventureQuests",
    icon: "/icons/AdventuresIcon.svg",
  },
  { type: "horror", label: "horrorQuests", icon: "/icons/HorrorIcon.png" },
  { type: "mystic", label: "mysticQuests", icon: "/icons/MysticIcon.png" },
  {
    type: "detective",
    label: "detectiveQuests",
    icon: "/icons/DetectiveIcon.png",
  },
  { type: "sci-fi", label: "scifiQuests", icon: "/icons/ScifiIcon.svg" },
];
