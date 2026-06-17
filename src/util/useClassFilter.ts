const useClassFilter = (classes: Record<string, boolean>) =>
  Object.entries(classes)
    .filter(([, active]) => active)
    .map(([key]) => key)
    .join("");
export default useClassFilter;
