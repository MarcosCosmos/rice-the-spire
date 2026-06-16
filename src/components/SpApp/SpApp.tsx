import { useEffect, useState, type ReactNode } from "react";
import {
  createProviderGroup,
  type ProviderConfigMap,
  type ProviderGroup,
  type ProviderGroupConfig,
  type ProviderMap,
} from "zebar";
import ZebarContext from "../../contexts/ZebarContext";
import "./SpApp.css";

export interface SpAppProps {
  zebar: Partial<ProviderConfigMap>;
  children: ReactNode;
}
const SpApp = ({ zebar, children }: SpAppProps) => {
  const [output, setOutput] = useState<
    | Partial<{
        [TName in keyof ProviderConfigMap]: ProviderMap[ProviderConfigMap[TName]["type"]]["output"];
      }>
    | undefined
  >();

  useEffect(() => {
    const providers: ProviderGroup<ProviderGroupConfig> = createProviderGroup(
      zebar as unknown as ProviderGroupConfig,
    );
    providers.onOutput(() => setOutput(providers.outputMap));
  }, []);

  return <ZebarContext value={output}>{children}</ZebarContext>;
};

export default SpApp;
