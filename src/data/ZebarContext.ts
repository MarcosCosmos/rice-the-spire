import { createContext } from "react";
import { type ProviderConfigMap, type ProviderMap } from "zebar";

// expect to use the default names for simplicity.
export default createContext<
  | Partial<{
      [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
    }>
  | undefined
>(undefined);
