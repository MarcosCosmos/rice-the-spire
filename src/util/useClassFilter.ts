const useClassFilter = (classes: string[]) => Object.entries(classes)
  .filter(([_, active]) => active)
  .map(([key]) => key);
export default useClassFilter;