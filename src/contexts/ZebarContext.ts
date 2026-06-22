import { createContext, useEffect, useState } from "react";
import {
  type ProviderConfigMap,
  type ProviderGroup,
  type ProviderGroupConfig,
  type ProviderMap,
} from "zebar";

export const useProvideZebar = (
  zebarProviders: ProviderGroup<ProviderGroupConfig>,
) => {
  const [output, setOutput] = useState<
    | Partial<{
        [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
      }>
    | undefined
  >();

  useEffect(() => {
    zebarProviders.onOutput(() => {
      setOutput(zebarProviders.outputMap);
    });
  }, [zebarProviders]);

  return output;
};
// expect to use the default names for simplicity.
export const ZebarContext = createContext<
  | Partial<{
      [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
    }>
  | undefined
>(undefined);
export default ZebarContext;
