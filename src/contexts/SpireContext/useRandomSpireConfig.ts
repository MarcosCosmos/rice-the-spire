import { useState, useEffect } from "react";
import {
  type SpireConfig,
  defaultSpireConfig,
  acts,
  characters,
} from "./SpireContext";

const useRandomSpireConfig = () => {
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
export default useRandomSpireConfig;
