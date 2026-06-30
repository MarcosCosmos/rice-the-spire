import { createContext, useEffect, useState } from "react";
export type Act = "overgrowth" | "underdocks" | "hive" | "glory";
export type Character =
  | "ironclad"
  | "silent"
  | "defect"
  | "regent"
  | "necrobinder";
export interface SpireConfig {
  act: Act;
  character: Character;
  bannerColors: BannerColor[]; // pool of rarities allowed for random selection by e.g. the media player
}
export const acts: Act[] = ["overgrowth", "underdocks", "hive", "glory"];
export const characters: Character[] = [
  "ironclad",
  "silent",
  "defect",
  "regent",
  "necrobinder",
];

export type BannerColor =
  | "common"
  | "uncommon"
  | "rare"
  | "ancient"
  | "curse"
  | "status"
  | "event"
  | "quest";
// | "token"; // there's no prebaked image for token on spire codex, but there were too many similar colors anyway
export const bannerColor: BannerColor[] = [
  "common",
  "uncommon",
  "rare",
  "ancient",
  "curse",
  "status",
  "event",
  "quest",
  // "token",
];

export const defaultSpireConfig: SpireConfig = {
  act: "overgrowth",
  character: "ironclad",
  bannerColors: bannerColor,
};

export const useRandomSpireConfig = (): SpireConfig => {
  const [spireConfig, setSpireConfig] =
    useState<SpireConfig>(defaultSpireConfig);
  useEffect(() => {
    const randomConfig: SpireConfig = {
      act: acts[Math.floor(Math.random() * acts.length)],
      character: characters[Math.floor(Math.random() * characters.length)],
      bannerColors: bannerColor,
    };
    setSpireConfig(randomConfig);
  }, []);
  return spireConfig;
};

export const SpireContext = createContext<SpireConfig>(defaultSpireConfig);
export default SpireContext;
