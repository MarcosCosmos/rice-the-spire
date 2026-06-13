import { createContext } from "react";
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

const SpireContext = createContext<SpireConfig>(defaultSpireConfig);
export default SpireContext;
