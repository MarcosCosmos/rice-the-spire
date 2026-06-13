import { createContext } from "react";
import { type ProviderConfigMap, type ProviderMap } from "zebar";

// expect to use the default names for simplicity.
const ZebarContext = createContext<
  | Partial<{
      [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
    }>
  | undefined
>(undefined);
export default ZebarContext;
