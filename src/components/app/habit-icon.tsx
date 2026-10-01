import {
  Apple,
  BedDouble,
  BookOpen,
  Brain,
  Coffee,
  Dumbbell,
  Droplets,
  Footprints,
  Heart,
  Home,
  Leaf,
  Moon,
  PenLine,
  PersonStanding,
  Smile,
  Sun,
  Timer,
  Users,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { HabitIconId } from "@/lib/habits/types";
import { HABIT_ICON_IDS } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const MAP: Record<HabitIconId, LucideIcon> = {
  droplets: Droplets,
  footprints: Footprints,
  book: BookOpen,
  moon: Moon,
  heart: Heart,
  dumbbell: Dumbbell,
  leaf: Leaf,
  sun: Sun,
  home: Home,
  brain: Brain,
  coffee: Coffee,
  pen: PenLine,
  person: PersonStanding,
  apple: Apple,
  waves: Waves,
  users: Users,
  bed: BedDouble,
  wind: Wind,
  timer: Timer,
  smile: Smile,
};

export function HabitGlyph({
  id,
  className,
}: {
  id: HabitIconId;
  className?: string;
}) {
  const Icon = MAP[id] ?? Leaf;
  return <Icon className={cn("size-5", className)} strokeWidth={1.75} />;
}

export { HABIT_ICON_IDS };
