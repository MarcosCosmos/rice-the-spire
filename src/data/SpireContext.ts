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
export const defaultConfig: SpireConfig = {
  act: "overgrowth",
  character: "ironclad",
};
export default createContext<SpireConfig>(defaultConfig);
