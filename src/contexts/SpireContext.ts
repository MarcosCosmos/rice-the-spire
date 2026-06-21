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
}
export const acts: Act[] = ["overgrowth", "underdocks", "hive", "glory"];
export const characters: Character[] = [
  "ironclad",
  "silent",
  "defect",
  "regent",
  "necrobinder",
];

export const defaultSpireConfig: SpireConfig = {
  act: "overgrowth",
  character: "ironclad",
};

export const useRandomSpireConfig = () => {
  const [spireConfig, setSpireConfig] =
    useState<SpireConfig>(defaultSpireConfig);
  useEffect(() => {
    const randomConfig: SpireConfig = {
      act: acts[Math.floor(Math.random() * acts.length)],
      character: characters[Math.floor(Math.random() * characters.length)],
    };
    setSpireConfig(randomConfig);
  }, []);
  return spireConfig;
};

export const SpireContext = createContext<SpireConfig>(defaultSpireConfig);
export default SpireContext;
