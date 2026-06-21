export interface DataSizeMeasure {
  bytes: number;
  siValue: number;
  siUnit: string;
  iecValue: number;
  iecUnit: string;
}

export const useDataSize = (size: DataSizeMeasure, places?: number) => {
  places ??= 2;
  const result = size.siValue.toFixed(places).replace(/\.0+$/, "");
  return `${result}${size.siUnit}`;
};
export default useDataSize;
